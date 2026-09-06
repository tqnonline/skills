#!/usr/bin/env python3
"""Validate and assemble an architecture pack. Python 3, standard library only."""

import argparse
import base64
import hashlib
import html
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET

PAPERS = {'A4': ('297mm', '210mm', '0 0 1122 794'),
          'A3': ('420mm', '297mm', '0 0 1587 1122')}
SVG_NS = 'http://www.w3.org/2000/svg'
TAGS = set('svg g defs title desc path rect circle ellipse line polyline polygon text tspan '
           'image linearGradient radialGradient stop clipPath mask marker use'.split())
STATES = {'observed', 'proposed', 'unknown'}
PLATFORM_AREAS = {'billing-tenant', 'identity-access', 'resource-organization', 'network-connectivity',
                  'security', 'management', 'governance', 'platform-automation'}
ID = re.compile(r'^[a-z][a-z0-9-]*$')


def require(condition, message):
    if not condition:
        raise ValueError(message)


def text(value):
    return isinstance(value, str) and bool(value.strip())


def rows(value, label, allow_empty=False):
    require(isinstance(value, list) and (allow_empty or value), label + ' must be a list')
    require(all(isinstance(row, dict) for row in value), label + ' must contain objects')
    return value


def strings(row, keys):
    for key in keys.split():
        require(text(row.get(key)), 'missing text: ' + key)


def indexed(items, key):
    result = {}
    for row in items:
        value = row.get(key)
        if key == 'number':
            require(type(value) is int and value > 0, 'flow number must be a positive integer')
        else:
            require(isinstance(value, str) and ID.fullmatch(value), 'invalid ' + key)
        require(value not in result, 'duplicate ' + key + ': ' + str(value))
        result[value] = row
    return result


def claim(row):
    require(row.get('state') in STATES, 'invalid claim state')
    evidence = row.get('evidence')
    require(isinstance(evidence, list) and evidence and all(text(e) for e in evidence),
            'claim requires nonempty evidence')


def safe_svg(raw, embedded=False):
    require(len(raw) <= 8 * 1024 * 1024, 'SVG exceeds 8 MiB')
    source = raw.decode('utf-8-sig')
    require(not re.search(r'<!DOCTYPE|<!ENTITY', source, re.I), 'SVG DTD/entity is forbidden')
    require(not re.search(r'<\?(?!xml\s)', source, re.I), 'SVG processing instruction is forbidden')
    tree = ET.fromstring(source)
    require(tree.tag == '{' + SVG_NS + '}svg', 'root must be SVG')
    ids, refs = set(), []
    for element in tree.iter():
        tag = element.tag.removeprefix('{' + SVG_NS + '}')
        require(tag in TAGS, 'unsafe SVG element: ' + tag)
        if 'id' in element.attrib:
            require(element.attrib['id'] not in ids, 'duplicate SVG id')
            ids.add(element.attrib['id'])
        for key, value in element.attrib.items():
            local = key.split('}')[-1]
            require(not local.lower().startswith('on') and local not in {'base', 'style'},
                    'unsafe SVG attribute: ' + local)
            require('\\' not in value and '@import' not in value.lower(), 'unsafe SVG reference')
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


def validate(path):
    model = json.loads(path.read_text(encoding='utf-8'))
    require(isinstance(model, dict) and model.get('schema') == 1, 'model schema must be 1')
    strings(model, 'title basis brand')
    require(model.get('status') in {'review-ready', 'needs-decision', 'incomplete'}, 'invalid status')
    nodes = indexed(rows(model.get('nodes'), 'nodes'), 'id')
    flows = indexed(rows(model.get('flows'), 'flows'), 'number')
    views = indexed(rows(model.get('views'), 'views'), 'id')
    icons = indexed(rows(model.get('icons', []), 'icons', True), 'id')
    coverage = indexed(rows(model.get('coverage'), 'platform coverage'), 'area')
    require(set(coverage) == PLATFORM_AREAS, 'platform coverage must assess all eight design areas')
    for assessment in coverage.values():
        strings(assessment, 'finding decision owner verification')
        claim(assessment)
    require({v.get('scope') for v in views.values()} == {'platform', 'workload'},
            'views must include platform and workload scopes')
    for icon in icons.values():
        strings(icon, 'product source license package retrieved member sha256')
        require(re.fullmatch(r'[0-9a-f]{64}', icon['sha256']), 'invalid icon hash')
    for node in nodes.values():
        strings(node, 'name role')
        claim(node)
        require('icon' not in node or node['icon'] in icons, 'node references missing icon')
    for flow in flows.values():
        strings(flow, 'from to action data protocol auth failure')
        claim(flow)
        require(flow.get('kind') in {'runtime', 'control', 'telemetry'}, 'invalid flow kind')
        require(flow['from'] in nodes and flow['to'] in nodes, 'flow endpoint is absent')
    used_nodes, used_flows, assets = set(), set(), {}
    for view in views.values():
        strings(view, 'title paper svg')
        require(view['paper'] in PAPERS, 'paper must be A4 or A3')
        for key, known in [('nodes', nodes), ('flows', flows)]:
            values = view.get(key)
            require(isinstance(values, list) and (values or (key == 'flows' and view['scope'] == 'platform')),
                    'view ' + key + ' must be a nonempty list except for platform hierarchy flows')
            require(all((type(v) is int if key == 'flows' else isinstance(v, str)) for v in values),
                    'invalid view ' + key)
            require(len(values) == len(set(values)), 'duplicate view ' + key)
            require(all(v in known for v in values), 'unknown view ' + key)
        for number in view['flows']:
            require(all(flows[number][end] in view['nodes'] for end in ['from', 'to']),
                    'flow endpoint missing from view')
        relative = Path(view['svg'])
        asset = (path.parent / relative).resolve()
        require(not relative.is_absolute() and '..' not in relative.parts
                and asset.is_relative_to(path.parent), 'SVG path escapes model directory')
        raw = asset.read_bytes()
        tree = safe_svg(raw)
        expected = PAPERS[view['paper']]
        require(tuple(tree.get(k) for k in ['width', 'height', 'viewBox']) == expected,
                'SVG dimensions do not match ' + view['paper'])
        for tag in ['title', 'desc']:
            element = tree.find('{' + SVG_NS + '}' + tag)
            require(element is not None and text(''.join(element.itertext())), 'SVG needs ' + tag)
        annotated = {}
        for key, wanted in [('data-node', view['nodes']), ('data-flow', view['flows']),
                            ('data-flow-label', view['flows'])]:
            elements = [e for e in tree.iter() if key in e.attrib]
            values = [e.get(key) for e in elements]
            require(len(values) == len(set(values)) and set(values) == set(map(str, wanted)),
                    'SVG ' + key + ' does not match view')
            annotated[key] = dict(zip(values, elements))
        for number in view['flows']:
            edge = annotated['data-flow'][str(number)]
            flow = flows[number]
            require(edge.tag.split('}')[-1] in {'path', 'line', 'polyline'}, 'flow must be a connector')
            require(edge.get('data-from') == flow['from'] and edge.get('data-to') == flow['to'],
                    'SVG flow endpoint mismatch')
            marker = re.fullmatch(r'url\(#([A-Za-z0-9_.:-]+)\)', edge.get('marker-end', ''))
            require(marker and any(e.get('id') == marker[1] for e in tree.iter('{' + SVG_NS + '}marker')),
                    'flow requires destination arrow marker')
            label = annotated['data-flow-label'][str(number)]
            require(label.tag == '{' + SVG_NS + '}text' and ''.join(label.itertext()).strip() == str(number),
                    'flow label does not match number')
        for element in tree.iter('{' + SVG_NS + '}image'):
            icon = icons.get(element.get('data-icon'))
            require(icon is not None, 'image requires declared icon')
            href = element.get('href') or element.get('{http://www.w3.org/1999/xlink}href', '')
            require(href.startswith('data:image/svg+xml;base64,'), 'icon requires embedded SVG')
            data = base64.b64decode(href.split(',', 1)[1], validate=True)
            require(hashlib.sha256(data).hexdigest() == icon['sha256'], 'icon hash mismatch')
            require(element.get('preserveAspectRatio') == 'xMidYMid meet', 'icon proportions must be preserved')
        for node_id, group in annotated['data-node'].items():
            expected_icon = nodes[node_id].get('icon')
            if expected_icon:
                require(any(e.get('data-icon') == expected_icon for e in group.iter()), 'node icon missing')
        assets[view['id']] = raw
        used_nodes.update(view['nodes'])
        used_flows.update(view['flows'])
    require(used_nodes == set(nodes) and used_flows == set(flows), 'nodes or flows omitted from all views')
    return model, assets


CSS = '''
<style>
.architecture-index { margin: 1em 0; break-inside: avoid; }
.architecture-index h2 { font-size: 1em; }
.architecture-flows, .architecture-coverage { max-width: var(--press-max-width,180mm);
  margin: 24px auto; padding: 18mm; background: var(--press-surface,#fff); }
.architecture-assessment { break-inside: avoid; }
.architecture-plate { margin: 24px auto; background: #fff; }
.architecture-plate img { display: block; width: 100%; height: auto; }
.architecture-a4 { width: 297mm; } .architecture-a3 { width: 420mm; }
.architecture-flows table { width: 100%; table-layout: fixed; }
.architecture-flows td, .architecture-flows th { overflow-wrap: anywhere; vertical-align: top; }
.architecture-flows th:first-child { width: 10%; }
.architecture-flows th:nth-child(2) { width: 35%; }
.architecture-flows thead { display: table-header-group; }
@page { size: A4 portrait; }
@page architecture-a4 { size: 297mm 210mm; margin: 0; }
@page architecture-a3 { size: 420mm 297mm; margin: 0; }
@media screen { .architecture-plate { max-width: 100%; } }
@media print {
  :root { --press-page: #fff; --press-surface: #fff; --press-text: #20242c;
    --press-heading: #20242c; --press-muted: #4b5563; --press-quote-surface: #f3f4f6;
    --press-border: #aab2bd; }
  html, body, .press-document, .architecture-flows, .architecture-coverage { background: #fff !important;
    background-image: none !important; box-shadow: none !important; }
  body { line-height: 1.45; }
  p { orphans: 3; widows: 3; }
  tr { break-inside: avoid; }
  thead { display: table-header-group; }
  .press-table { overflow: visible; }
  .architecture-index { break-after: page; }
  .press-document { padding: 0; }
  .architecture-flows, .architecture-coverage { margin: 0; padding: 0; break-before: page; }
  .architecture-plate { margin: 0; padding: 0; break-before: page; break-after: page; }
  .architecture-a4 { page: architecture-a4; width: 297mm; height: 210mm; }
  .architecture-a3 { page: architecture-a3; width: 420mm; height: 297mm; }
  .architecture-plate img { width: 100%; height: 100%; }
  .architecture-flows tr { break-inside: avoid; }
}
</style>
'''


def assemble(narrative, model, assets):
    require(narrative.count('</head>') == 1 and narrative.count('</body>') == 1 and narrative.count('</main>') == 1,
            'expected complete press HTML with one head and body')
    require('class="architecture-index"' not in narrative, 'HTML is already assembled')
    headings = {html.unescape(re.sub(r'<[^>]+>', '', h)).strip().lower()
                for h in re.findall(r'<h2\b[^>]*>(.*?)</h2>', narrative, re.S | re.I)}
    for heading in ['landing zone and platform foundation', 'network topology and connectivity',
                    'governance and platform handoff']:
        require(heading in headings, 'missing platform narrative section: ' + heading)
    esc = lambda value: html.escape(str(value), quote=True)
    nodes = {n['id']: n for n in model['nodes']}
    flows = {f['number']: f for f in model['flows']}
    parts = ['<section class="architecture-index"><h2>Architecture diagram index</h2>',
             '<p>' + esc(model['title']) + ' · ' + esc(model['status']) + '</p>',
             '<p>Basis: ' + esc(model['basis']) + '<br>Brand: ' + esc(model['brand']) + '</p><ul>']
    for view in model['views']:
        parts.append('<li><a href="#architecture-' + view['id'] + '">' + esc(view['title']) +
                     '</a> · ' + view['paper'] + '</li>')
    parts.append('</ul></section>')
    index = '\n'.join(parts)
    if '</nav>' in narrative:
        narrative = narrative.replace('</nav>', '</nav>' + index, 1)
    else:
        narrative = narrative.replace('</main>', index + '</main>')
    parts = []
    for view in model['views']:
        encoded = base64.b64encode(assets[view['id']]).decode('ascii')
        parts.append('<section id="architecture-' + view['id'] + '" class="architecture-plate architecture-' +
                     view['paper'].lower() + '"><img alt="' + esc(view['title']) +
                     '" src="data:image/svg+xml;base64,' + encoded + '"></section>')
        if not view['flows']:
            continue
        parts.append('<section class="architecture-flows"><h2>' + esc(view['title']) + ' — flows</h2>'
                     '<table><thead><tr><th>No.</th><th>Interaction</th><th>Contract and failure behavior</th>'
                     '</tr></thead><tbody>')
        for number in view['flows']:
            flow = flows[number]
            cells = [str(number), '<strong>' + esc(flow['action']) + '</strong><br>' +
                     esc(nodes[flow['from']]['name']) + ' → ' + esc(nodes[flow['to']]['name']) +
                     '<br>' + esc(flow['kind']) + ' · ' + esc(flow['state']),
                     '<br>'.join('<strong>' + key.title() + ':</strong> ' + esc(flow[key])
                                 for key in ['data', 'protocol', 'auth', 'failure']) +
                     '<br><strong>Evidence:</strong> ' + esc('; '.join(flow['evidence']))]
            parts.append('<tr>' + ''.join('<td>' + c + '</td>' for c in cells) + '</tr>')
        parts.append('</tbody></table></section>')
    parts.append('<section class="architecture-coverage"><h2>Platform design coverage</h2>')
    for assessment in model['coverage']:
        parts.append('<section class="architecture-assessment"><h3>' + esc(assessment['area']) + '</h3>')
        for key in ['state', 'finding', 'decision', 'owner', 'verification']:
            parts.append('<p><strong>' + key.title() + ':</strong> ' + esc(assessment[key]) + '</p>')
        parts.append('<p><strong>Evidence:</strong> ' + esc('; '.join(assessment['evidence'])) + '</p></section>')
    parts.append('</section>')
    return narrative.replace('</head>', CSS + '</head>').replace('</body>', '\n'.join(parts) + '</body>')


def artifact(path):
    data = path.read_bytes()
    return {'path': str(path), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--model', required=True)
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--html', help='Narrative HTML generated by press, not arbitrary downloaded HTML')
    parser.add_argument('--out', help='New .html output path; PDF uses the same basename')
    parser.add_argument('--html-only', action='store_true')
    parser.add_argument('--browser', help='Chromium executable (or set CHROME_PATH)')
    args = parser.parse_args()
    try:
        model, assets = validate(Path(args.model).resolve())
        receipt = {'structural': 'pass', 'visual_review': 'required', 'status': model['status'], 'artifacts': []}
        if args.check:
            print(json.dumps(receipt, indent=2))
            return 0
        require(args.html and args.out, '--html and --out are required unless --check is set')
        out = Path(args.out).resolve()
        pdf = out.with_suffix('.pdf')
        require(out.suffix == '.html', '--out must end in .html')
        require(not out.exists() and not pdf.exists(), 'output already exists; choose a new path')
        result = assemble(Path(args.html).read_text(encoding='utf-8'), model, assets)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(result, encoding='utf-8')
        receipt['artifacts'].append(artifact(out))
        if args.html_only:
            receipt['pdf'] = 'not-requested'
        else:
            try:
                browser = args.browser or os.environ.get('CHROME_PATH')
                require(browser, 'no browser supplied; pass --browser or set CHROME_PATH')
                with tempfile.TemporaryDirectory(prefix='architecture-print-') as profile:
                    temporary_pdf = Path(profile) / 'pack.pdf'
                    run = subprocess.run([browser, '--headless', '--disable-gpu', '--no-first-run',
                                          '--no-default-browser-check', '--no-pdf-header-footer',
                                          '--print-to-pdf=' + str(temporary_pdf),
                                          out.as_uri()], capture_output=True, timeout=120)
                    require(run.returncode == 0 and temporary_pdf.exists(), 'Chromium did not produce a PDF')
                    data = temporary_pdf.read_bytes()
                    require(data.startswith(b'%PDF-') and len(data) > 100, 'invalid PDF output')
                    pdf.write_bytes(data)
                receipt['artifacts'].append(artifact(pdf))
                receipt['pdf'] = 'produced'
            except (OSError, ValueError, subprocess.TimeoutExpired) as error:
                receipt.update(pdf='not-produced', reason=str(error))
                print(json.dumps(receipt, indent=2))
                return 1
        print(json.dumps(receipt, indent=2))
        return 0
    except (OSError, ValueError, TypeError, KeyError, ET.ParseError) as error:
        print('architecture: ' + str(error), file=sys.stderr)
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
