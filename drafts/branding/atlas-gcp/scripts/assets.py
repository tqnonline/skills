#!/usr/bin/env python3
"""Validate inert SVGs and extract selected icon bytes without rewriting them."""

import argparse
import base64
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import stat
import sys
import xml.etree.ElementTree as ET
import zipfile

SVG_NS = 'http://www.w3.org/2000/svg'
TAGS = set('svg g defs title desc path rect circle ellipse line polyline polygon text tspan '
           'image linearGradient radialGradient stop clipPath mask marker use'.split())
MAX_SVG = 8 * 1024 * 1024


def require(condition, message):
    if not condition:
        raise ValueError(message)


def safe_css(source):
    """Accept only class selectors and literal fill/stroke declarations."""
    require(not re.search(r'[\\@/<>\x00-\x08\x0b\x0c\x0e-\x1f]', source), 'unsafe SVG CSS')
    rule = re.compile(r'\s*(\.[A-Za-z_][\w-]*(?:\s*,\s*\.[A-Za-z_][\w-]*)*)\s*\{([^{}]+)\}')
    offset = 0
    for match in rule.finditer(source):
        require(not source[offset:match.start()].strip(), 'unsafe SVG CSS selector')
        declarations = match[2].strip().rstrip(';').split(';')
        for declaration in declarations:
            require(re.fullmatch(r'\s*(?:fill|stroke)\s*:\s*(?:#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6}|none|white|black|currentColor)\s*',
                                 declaration), 'unsafe SVG CSS declaration')
        offset = match.end()
    require(offset and not source[offset:].strip(), 'unsafe SVG CSS rule')


def safe_svg(raw, embedded=False):
    require(len(raw) <= MAX_SVG, 'SVG exceeds 8 MiB')
    source = raw.decode('utf-8-sig')
    require(not re.search(r'<!DOCTYPE|<!ENTITY', source, re.I), 'SVG DTD/entity is forbidden')
    require(not re.search(r'<\?(?!xml\s)', source, re.I), 'SVG processing instruction is forbidden')
    tree = ET.fromstring(source)
    require(tree.tag == '{' + SVG_NS + '}svg', 'root must be SVG')
    ids, refs = set(), []
    for element in tree.iter():
        tag = element.tag.removeprefix('{' + SVG_NS + '}')
        require(tag in TAGS or (embedded and tag == 'style'), 'unsafe SVG element: ' + tag)
        if tag == 'style':
            require(not list(element), 'unsafe SVG CSS children')
            safe_css(element.text or '')
        if 'id' in element.attrib:
            require(element.attrib['id'] not in ids, 'duplicate SVG id')
            ids.add(element.attrib['id'])
        for key, value in element.attrib.items():
            local = key.split('}')[-1]
            require(not key.startswith('{') or key in {
                '{http://www.w3.org/1999/xlink}href', '{http://www.w3.org/XML/1998/namespace}space'},
                'unsafe SVG attribute namespace')
            require(not local.lower().startswith('on') and local not in {'base', 'style'},
                    'unsafe SVG attribute: ' + local)
            require('\\' not in value and '@import' not in value.lower(), 'unsafe SVG reference')
            if local == 'class':
                require(embedded and re.fullmatch(r'[A-Za-z_][\w-]*(?:\s+[A-Za-z_][\w-]*)*', value),
                        'unsafe SVG class')
            if local == 'href':
                if tag == 'image':
                    require(not embedded and value.startswith('data:image/svg+xml;base64,'),
                            'image must embed SVG; external reference forbidden')
                    safe_svg(base64.b64decode(value.split(',', 1)[1], validate=True), embedded=True)
                else:
                    require(value.startswith('#'), 'external SVG reference')
                    refs.append(value[1:])
            if 'url(' in value.lower():
                matches = re.findall(r'url\(#[A-Za-z0-9_.:-]+\)', value)
                require(len(matches) == value.lower().count('url('), 'external SVG reference')
                refs.extend(match[5:-1] for match in matches)
    require(all(ref in ids for ref in refs), 'unresolved SVG fragment reference')
    return tree


def extract_selected_zip(archive, members, destination, *, max_archive_bytes=128 * 1024 * 1024,
                         max_members=10000, max_member_bytes=MAX_SVG,
                         max_total_bytes=64 * 1024 * 1024):
    """Extract named SVG members to a new directory; return original-byte hashes.

    Validate every archive path, but decompress only selected files. The caller
    records the official download URL, retrieval date, and license separately.
    """
    archive, destination = Path(archive), Path(destination)
    require(archive.stat().st_size <= max_archive_bytes, 'ZIP exceeds archive size limit')
    require(isinstance(members, list) and members and all(isinstance(m, str) for m in members),
            'selected members must be a nonempty list')
    require(len(members) == len(set(members)), 'duplicate selected ZIP member')
    require(not destination.exists() and not destination.is_symlink(), 'destination already exists')
    # Refuse symlink parents rather than following them to an unexpected root.
    require(not any(p.is_symlink() for p in [destination, *destination.parents]), 'destination symlink')
    payloads, receipt = {}, []
    with zipfile.ZipFile(archive) as bundle:
        infos = bundle.infolist()
        require(len(infos) <= max_members, 'ZIP exceeds member count limit')
        known = {}
        for info in infos:
            name = info.filename
            path = PurePosixPath(name)
            require(name and not path.is_absolute() and '\\' not in name and ':' not in name
                    and '\x00' not in name and all(p not in {'', '.', '..'} for p in name.rstrip('/').split('/')),
                    'unsafe ZIP member path')
            require(name not in known, 'duplicate ZIP member')
            mode = info.external_attr >> 16
            require(not stat.S_ISLNK(mode) and stat.S_IFMT(mode) in {0, stat.S_IFREG, stat.S_IFDIR},
                    'ZIP symlink or special member')
            require(not info.flag_bits & 1, 'encrypted ZIP member')
            known[name] = info
        total = 0
        for name in members:
            require(name in known, 'selected ZIP member missing')
            info = known[name]
            require(not info.is_dir() and name.lower().endswith('.svg'), 'selected member must be SVG')
            require(info.file_size <= max_member_bytes, 'ZIP member exceeds size limit')
            total += info.file_size
            require(total <= max_total_bytes, 'ZIP selected total exceeds size limit')
            with bundle.open(info) as stream:
                raw = stream.read(max_member_bytes + 1)
            require(len(raw) == info.file_size and len(raw) <= max_member_bytes, 'ZIP member size mismatch')
            safe_svg(raw, embedded=True)
            payloads[name] = raw
    archive_hash = hashlib.sha256(archive.read_bytes()).hexdigest()
    destination.mkdir(parents=True)
    for name, raw in payloads.items():
        target = destination.joinpath(*PurePosixPath(name).parts)
        target.parent.mkdir(parents=True, exist_ok=True)
        with target.open('xb') as stream:
            stream.write(raw)
        receipt.append({'member': name, 'path': str(target), 'bytes': len(raw),
                        'sha256': hashlib.sha256(raw).hexdigest(), 'packageSha256': archive_hash})
    return receipt


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--zip', required=True)
    parser.add_argument('--member', action='append', required=True)
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    try:
        print(json.dumps(extract_selected_zip(args.zip, args.member, args.out), indent=2))
        return 0
    except (OSError, ValueError, ET.ParseError, zipfile.BadZipFile, RuntimeError) as error:
        print('assets: ' + str(error), file=sys.stderr)
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
