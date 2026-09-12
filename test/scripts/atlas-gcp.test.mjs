import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { root } from '../helpers.mjs';

const script = join(root, 'skills/developer/atlas/providers/gcp/scripts/assemble.py');
const areas = ['organization-billing', 'identity-access', 'resource-organization', 'network-connectivity', 'security', 'management', 'governance', 'platform-automation'];
const platformHeadings = ['Landing zone and platform foundation', 'Network topology and connectivity', 'Governance and platform handoff'];
const icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><defs><style>.cls-1 { fill: #4285f4; stroke: none; }</style></defs><path class="cls-1" d="M0 0H16V16H0Z"/></svg>';
const image = `<image data-icon="sample" href="data:image/svg+xml;base64,${Buffer.from(icon).toString('base64')}" x="400" y="300" width="96" height="96" preserveAspectRatio="xMidYMid meet"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="210mm" viewBox="0 0 1122 794">
<title>Test view</title><desc>Proposed A to B.</desc>
<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker></defs>
<g data-node="a"><text x="100" y="300">A</text></g>
<g data-node="b">${image}<text x="400" y="425">B</text></g>
<path data-flow="1" data-from="a" data-to="b" d="M150 310H390" fill="none" stroke="#333" marker-end="url(#arrow)"/>
<text data-flow-label="1" x="270" y="290">1</text></svg>`;
function model() {
  return { schema: 1, provider: 'gcp', title: 'Test pack', status: 'needs-decision', basis: 'plan.md#inputs', brand: 'test',
    coverage: areas.map(area => ({ area, state: 'proposed', finding: 'No deployed platform inventory supplied.', decision: 'Use the existing organization baseline after owner review.', owner: 'Platform team', verification: 'Review inherited configuration and test workload access.', evidence: ['plan.md#platform'] })),
    nodes: ['a', 'b'].map(id => ({ id, name: id.toUpperCase(), role: 'Test role', state: 'proposed', evidence: ['plan.md#inputs'], ...(id === 'b' ? { icon: 'sample', placement: { project: 'service-project', scope: 'regional', region: 'us-central1' } } : {}) })),
    flows: [{ number: 1, from: 'a', to: 'b', kind: 'runtime', action: 'Send work', data: 'Event', protocol: 'HTTPS', auth: 'Identity', failure: 'Retry', state: 'proposed', evidence: ['plan.md#flow'] }],
    views: [{ id: 'v1', scope: 'workload', title: 'Overview', paper: 'A4', svg: 'view.svg', nodes: ['a', 'b'], flows: [1] },
      { id: 'platform', scope: 'platform', title: 'Platform context', paper: 'A4', svg: 'platform.svg', nodes: ['a', 'b'], flows: [] }],
    icons: [{ id: 'sample', product: 'Synthetic test icon', source: 'https://example.com/icons', license: 'https://example.com/terms', package: 'test', retrieved: '2026-09-06', member: 'icon.svg', sha256: createHash('sha256').update(icon).digest('hex') }]
  };
}
function run(change = () => {}, args = ['--check']) {
  const dir = mkdtempSync(join(tmpdir(), 'architecture-'));
  const input = { model: model(), svg, html: '<!doctype html><html><head><style>:root{--text:#222}</style></head><body><main><h1>Narrative</h1>' + platformHeadings.map(h => `<h2>${h}</h2><p>Fixture narrative.</p>`).join('') + '</main></body></html>' };
  change(input);
  writeFileSync(join(dir, 'architecture.json'), JSON.stringify(input.model));
  writeFileSync(join(dir, 'view.svg'), input.svg);
  writeFileSync(join(dir, 'platform.svg'), svg.replace(/<path data-flow=.*\n/, '').replace(/<text data-flow-label=.*<\/text>/, ''));
  writeFileSync(join(dir, 'narrative.html'), input.html);
  const result = spawnSync('python3', [script, '--model', join(dir, 'architecture.json'), ...args], { cwd: dir, encoding: 'utf8' });
  return { ...result, dir, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

test('architecture check rejects a flow whose endpoint is absent', () => {
  const r = run(i => { i.model.flows[0].to = 'missing'; });
  try { assert.equal(r.status, 2, 'a dangling endpoint must fail validation'); assert.match(r.stderr, /endpoint/); } finally { r.cleanup(); }
});

test('architecture check accepts a consistent, provenance-backed view', () => {
  const r = run();
  try { assert.equal(r.status, 0, r.stderr); assert.match(r.stdout, /structural.*pass/); assert.match(r.stdout, /visual_review.*required/); } finally { r.cleanup(); }
});

const failures = [
  ['wrong provider', i => { i.model.provider = 'azure'; }, /provider/],
  ['missing cloud placement', i => { delete i.model.nodes[1].placement; }, /placement/],
  ['empty project', i => { i.model.nodes[1].placement.project = ' '; }, /project/],
  ['missing regional region', i => { delete i.model.nodes[1].placement.region; }, /region/],
  ['regional VPC', i => { i.model.nodes[1].resourceType = 'vpc'; }, /VPC.*global/],
  ['global subnet', i => { i.model.nodes[1].resourceType = 'subnet'; i.model.nodes[1].placement.scope = 'global'; }, /subnet.*regional/],
  ['push exactly once node', i => { Object.assign(i.model.nodes[1], { delivery: 'exactly-once', subscriptionType: 'push' }); }, /exactly-once/],
  ['push exactly once flow', i => { Object.assign(i.model.flows[0], { delivery: 'exactly-once', subscriptionType: 'push' }); }, /exactly-once/],
  ['small icon', i => { i.svg = i.svg.replace('width="96"', 'width="48"'); }, /exactly 96/],
  ['large icon', i => { i.svg = i.svg.replace('height="96"', 'height="192"'); }, /exactly 96/],
  ['ancestor scaling', i => { i.svg = i.svg.replace('<g data-node="b"', '<g transform="scale(0.5)" data-node="b"'); }, /transforms/],
  ['root scaling', i => { i.svg = i.svg.replace('<svg ', '<svg transform="matrix(2 0 0 2 0 0)" '); }, /transforms/],
  ['image scaling', i => { i.svg = i.svg.replace('<image ', '<image transform="scale(2)" '); }, /transforms/],
  ['nested viewport', i => { i.svg = i.svg.replace(image, `<svg viewBox="0 0 200 200">${image}</svg>`); }, /viewport/],
  ['replicated icon', i => { i.svg = i.svg.replace('</svg>', '<use href="#arrow"/></svg>'); }, /replicate/],
  ['outer stylesheet', i => { i.svg = i.svg.replace('</svg>', '<style>.cls-1{fill:#fff}</style></svg>'); }, /element/],
  ['missing landing-zone coverage', i => { delete i.model.coverage; }, /coverage/],
  ['missing network assessment', i => { i.model.coverage = i.model.coverage.filter(c => c.area !== 'network-connectivity'); }, /coverage/],
  ['unsupported platform decision', i => { i.model.coverage[0].evidence = []; }, /evidence/],
  ['ownerless platform control', i => { delete i.model.coverage[0].owner; }, /owner/],
  ['application-only pack', i => { i.model.views.pop(); }, /platform/],
  ['duplicate numbers', i => i.model.flows.push(i.model.flows[0]), /duplicate/],
  ['unknown state', i => { i.model.nodes[0].state = 'deployed'; }, /state/],
  ['missing evidence', i => { i.model.nodes[0].evidence = []; }, /evidence/],
  ['omitted flow', i => { i.model.views[0].flows = []; }, /flow/],
  ['wrong badge', i => { i.svg = i.svg.replace('y="290">1', 'y="290">9'); }, /label/],
  ['reversed annotation', i => { i.svg = i.svg.replace('data-to="b"', 'data-to="a"'); }, /endpoint/],
  ['missing arrow', i => { i.svg = i.svg.replace('marker-end="url(#arrow)"', ''); }, /arrow/],
  ['disabled arrow', i => { i.svg = i.svg.replace('marker-end="url(#arrow)"', 'marker-end="none"'); }, /arrow/],
  ['wrong paper', i => { i.model.views[0].paper = 'A3'; }, /dimensions/],
  ['path escape', i => { i.model.views[0].svg = '../view.svg'; }, /path/],
  ['script', i => { i.svg = i.svg.replace('</svg>', '<script>alert(1)</script></svg>'); }, /element/],
  ['event attribute', i => { i.svg = i.svg.replace('<g data-node="a"', '<g onclick="alert(1)" data-node="a"'); }, /attribute/],
  ['external resource', i => { i.svg = i.svg.replace('url(#arrow)', 'url(https://example.com/a)'); }, /reference/],
  ['DTD', i => { i.svg = '<!DOCTYPE svg []>' + i.svg; }, /DTD/],
  ['altered icon', i => { i.model.icons[0].sha256 = '0'.repeat(64); }, /hash/],
  ['cropped icon', i => { i.svg = i.svg.replace('xMidYMid meet', 'xMidYMid slice'); }, /proportion/],
  ['missing icon', i => { i.svg = i.svg.replace(image, ''); }, /icon/],
  ['invalid JSON shape', i => { i.model.nodes = {}; }, /nodes/],
];
for (const [name, change, error] of failures) {
  test(`architecture check rejects ${name}`, () => {
    const r = run(change);
    try { assert.equal(r.status, 2, r.stdout + r.stderr); assert.match(r.stderr, error); } finally { r.cleanup(); }
  });
}

test('assembly embeds vectors, generates canonical flows and preserves draft status', () => {
  const r = run(i => { i.model.flows[0].action = '<script>work</script>'; }, ['--html', 'narrative.html', '--out', 'pack.html', '--html-only']);
  try {
    assert.equal(r.status, 0, r.stderr);
    const html = readFileSync(join(r.dir, 'pack.html'), 'utf8');
    assert.match(html, /@page architecture-a4/);
    assert.match(html, /data:image\/svg\+xml;base64/);
    assert.match(html, /&lt;script&gt;work&lt;\/script&gt;/);
    assert.match(html, /needs-decision/);
    assert.match(html, /href="#architecture-v1"/);
    assert.match(html, /Platform design coverage/);
    assert.match(html, /network-connectivity/);
    assert.match(html, /html, body, \.press-document, \.architecture-flows.*\{ background: #fff/s);
    assert.match(html, /background-image: none/);
    assert.match(r.stdout, /pdf.*not-requested/);
    const again = spawnSync('python3', [script, '--model', 'architecture.json', '--html', 'narrative.html', '--out', 'pack.html', '--html-only'], { cwd: r.dir, encoding: 'utf8' });
    assert.equal(again.status, 2);
    assert.match(again.stderr, /exists/);
  } finally { r.cleanup(); }
});

test('missing browser reports incomplete PDF without inventing a file', () => {
  const r = run(() => {}, ['--html', 'narrative.html', '--out', 'pack.html', '--browser', '/not/a/browser']);
  try { assert.equal(r.status, 1, r.stderr); assert.match(r.stdout, /pdf.*not-produced/); } finally { r.cleanup(); }
});

test('assembly refuses a coverage register without the platform narrative', () => {
  const r = run(i => { i.html = i.html.replace('<h2>Landing zone and platform foundation</h2>', ''); }, ['--html', 'narrative.html', '--out', 'pack.html', '--html-only']);
  try { assert.equal(r.status, 2); assert.match(r.stderr, /narrative.*landing zone/); } finally { r.cleanup(); }
});

test('A3 view preserves stable nonconsecutive flow numbers', () => {
  const r = run(i => {
    i.model.views[0].paper = 'A3';
    i.model.views[0].flows = [7];
    i.model.flows[0].number = 7;
    i.svg = i.svg.replace('297mm', '420mm').replace('210mm', '297mm').replace('1122 794', '1587 1122')
      .replace('data-flow="1"', 'data-flow="7"').replace('data-flow-label="1"', 'data-flow-label="7"').replace('y="290">1', 'y="290">7');
  });
  try { assert.equal(r.status, 0, r.stderr); } finally { r.cleanup(); }
});

function integrated(i) {
  i.model.profile = 'integrated';
  i.model.views = [{ ...i.model.views[0], scope: 'integrated', paper: 'CUSTOM',
    widthMm: 635, heightMm: 381, widthUnits: 2400, heightUnits: 1440 }];
  i.svg = i.svg.replace('297mm', '635mm').replace('210mm', '381mm').replace('1122 794', '2400 1440');
}

test('CUSTOM accepts full-precision fractional dimensions without changing their scale', () => {
  const r = run(i => {
    integrated(i);
    const width = 1200 * 96 / 25.4;
    Object.assign(i.model.views[0], { widthMm: 1200, widthUnits: width });
    i.svg = i.svg.replace('635mm', '1200.0mm').replace('2400 1440', `${width} 1440`);
  });
  try { assert.equal(r.status, 0, r.stderr); } finally { r.cleanup(); }
});

for (const [name, change, error] of [
  ['integrated profile absent', i => { integrated(i); delete i.model.profile; }, /profile/],
  ['integrated not final', i => { i.model.views[0].scope = 'integrated'; }, /final/],
  ['two integrated views', i => { i.model.views.forEach(v => { v.scope = 'integrated'; }); }, /single/],
  ['custom dimension absent', i => { integrated(i); delete i.model.views[0].widthUnits; }, /widthUnits/],
  ['custom negative dimension', i => { integrated(i); i.model.views[0].heightMm = -1; }, /positive/],
  ['custom boolean dimension', i => { integrated(i); i.model.views[0].widthMm = true; }, /positive/],
  ['custom print rescaling', i => { integrated(i); i.model.views[0].widthUnits *= 2; }, /96 dpi/],
]) {
  test(`GCP rejects ${name}`, () => {
    const r = run(change);
    try { assert.equal(r.status, 2, r.stdout + r.stderr); assert.match(r.stderr, error); } finally { r.cleanup(); }
  });
}

for (const [name, change] of [
  ['global VPC without subnet', i => { i.model.nodes[1].resourceType = 'vpc'; i.model.nodes[1].placement = { project: 'host-project', scope: 'global' }; }],
  ['regional subnet', i => { i.model.nodes[1].resourceType = 'subnet'; }],
  ['service project attaches to host network', i => { i.model.nodes[1].placement.network = 'projects/host-project/global/networks/shared'; }],
  ['global managed service without VPC', i => { i.model.nodes[1].placement = { project: 'workload-project', scope: 'global' }; }],
  ['pull exactly once', i => { Object.assign(i.model.nodes[1], { delivery: 'exactly-once', subscriptionType: 'pull' }); }],
  ['translated icon', i => { i.svg = i.svg.replace('<g data-node="b"', '<g transform="translate(10, 20) translate(-10 -20)" data-node="b"'); }],
  ['normal pack with final integrated view', i => { i.model.views.push({ ...i.model.views[0], id: 'integrated', scope: 'integrated' }); }],
]) {
  test(`GCP accepts ${name}`, () => {
    const r = run(change);
    try { assert.equal(r.status, 0, r.stderr); } finally { r.cleanup(); }
  });
}

test('integrated-only CUSTOM HTML ends with its single exact-byte vector plate', () => {
  const r = run(integrated, ['--html', 'narrative.html', '--out', 'pack.html', '--html-only']);
  try {
    assert.equal(r.status, 0, r.stderr);
    const result = readFileSync(join(r.dir, 'pack.html'), 'utf8');
    assert.match(result, /@page architecture-custom-v1 \{ size: 635mm 381mm; margin: 0; \}/);
    assert.match(result, /height: 381mm/);
    assert.equal((result.match(/<img /g) || []).length, 1);
    assert.ok(result.indexOf('id="architecture-v1"') > result.indexOf('Platform design coverage'));
    const payload = result.match(/src="data:image\/svg\+xml;base64,([^"]+)"/)[1];
    assert.equal(Buffer.from(payload, 'base64').toString(), readFileSync(join(r.dir, 'view.svg'), 'utf8'));
    assert.match(result, /<\/section>\s*<\/body>/);
  } finally { r.cleanup(); }
});

const browser = process.env.CHROME_PATH;
test('integrated CUSTOM PDF has the final large-format page at native print scale', { skip: !browser && 'set CHROME_PATH for real PDF integration' }, () => {
  const r = run(integrated, ['--html', 'narrative.html', '--out', 'pack.html', '--browser', browser]);
  try {
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.equal(JSON.parse(r.stdout).pdf, 'produced');
    const info = spawnSync('pdfinfo', ['-f', '1', '-l', '1000', join(r.dir, 'pack.pdf')], { encoding: 'utf8' });
    assert.equal(info.status, 0, info.stderr);
    const pages = [...info.stdout.matchAll(/Page\s+\d+ size:\s+([\d.]+) x ([\d.]+)/g)];
    assert.ok(pages.length > 1, info.stdout);
    assert.equal(pages.filter(p => Math.abs(Number(p[1]) - 1800) < 1).length, 1);
    assert.ok(Math.abs(Number(pages.at(-1)[1]) - 1800) < 1, info.stdout);
    assert.ok(Math.abs(Number(pages.at(-1)[2]) - 1080) < 1, info.stdout);
    if (process.env.ATLAS_GCP_KEEP_SAMPLE) console.log(`GCP rendered sample: ${r.dir}`);
  } finally { if (!process.env.ATLAS_GCP_KEEP_SAMPLE) r.cleanup(); }
});

function python(code) {
  return spawnSync('python3', ['-B', '-c', `import sys\nsys.path.insert(0, ${JSON.stringify(join(root, 'skills/developer/atlas/providers/gcp/scripts'))})\n${code}`], { encoding: 'utf8' });
}

test('inert embedded icon CSS passes without rewriting original bytes', () => {
  const r = python(`from assets import safe_svg\nraw = ${JSON.stringify(icon)}.encode()\nsafe_svg(raw, embedded=True)\nprint(raw.decode())`);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim(), icon);
});

for (const css of [
  '.x{fill:url(https://example.com/x)}', '@import "https://example.com/x";',
  '@font-face{font-family:x;src:url(x)}', '.x{font-family:x}', '.x{fill:var(--x)}',
  '.x{fill:expression(alert(1))}', '.x{fill:#fff!important}', '.x{transform:scale(0.5)}',
  '.x{f\\69ll:#fff}', '.x{fill:/*comment*/#fff}', 'svg{fill:#fff}',
  '.x{fill:#fff}junk', '.x{fill:#fff} @media print{.x{fill:#000}}',
]) {
  test(`embedded SVG rejects CSS ${css}`, () => {
    const r = python(`from assets import safe_css\nsafe_css(${JSON.stringify(css)})`);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /unsafe SVG CSS/);
  });
}

test('selected ZIP extraction preserves original bytes and hashes only selected files', () => {
  const r = python(`import tempfile, zipfile, hashlib\nfrom pathlib import Path\nfrom assets import extract_selected_zip
with tempfile.TemporaryDirectory() as d:
 p = Path(d)
 raw = ${JSON.stringify(icon)}.encode()
 with zipfile.ZipFile(p/'icons.zip', 'w') as z:
  z.writestr('official/icon.svg', raw)
  z.writestr('unselected.txt', b'not extracted')
 result = extract_selected_zip(p/'icons.zip', ['official/icon.svg'], p/'out')
 assert (p/'out/official/icon.svg').read_bytes() == raw
 assert not (p/'out/unselected.txt').exists()
 assert result[0]['sha256'] == hashlib.sha256(raw).hexdigest()
 assert result[0]['packageSha256'] == hashlib.sha256((p/'icons.zip').read_bytes()).hexdigest()
 print('original bytes and provenance verified')`);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /provenance verified/);
});

for (const [name, setup, options, error] of [
  ['traversal', "z.writestr('../escape.svg', raw)", '', /path/],
  ['absolute path', "z.writestr('/escape.svg', raw)", '', /path/],
  ['Windows path', "z.writestr('C:/escape.svg', raw)", '', /path/],
  ['duplicate', "z.writestr('icon.svg', raw)", '', /duplicate/],
  ['symlink', "i = zipfile.ZipInfo('link.svg'); i.create_system = 3; i.external_attr = (stat.S_IFLNK | 0o777) << 16; z.writestr(i, b'icon.svg')", '', /symlink/],
  ['member count', 'pass', ', max_members=0', /member count/],
  ['member size', 'pass', ', max_member_bytes=1', /size/],
  ['archive size', 'pass', ', max_archive_bytes=1', /size/],
  ['total size', 'pass', ', max_total_bytes=1', /total/],
]) {
  test(`ZIP extraction rejects ${name} before writing destination`, () => {
    const r = python(`import tempfile, zipfile, stat\nfrom pathlib import Path\nfrom assets import extract_selected_zip
with tempfile.TemporaryDirectory() as d:
 p = Path(d)
 raw = ${JSON.stringify(icon)}.encode()
 with zipfile.ZipFile(p/'icons.zip', 'w') as z:
  z.writestr('icon.svg', raw)
  ${setup}
 try:
  extract_selected_zip(p/'icons.zip', ['icon.svg'], p/'out'${options})
 except ValueError as e:
  assert not (p/'out').exists()
  print(e)
 else:
  raise AssertionError('unsafe ZIP accepted')`);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, error);
  });
}

test('standalone copied scripts run without other installed skills', () => {
  const r = python(`import tempfile, shutil, subprocess\nfrom pathlib import Path
with tempfile.TemporaryDirectory() as d:
 p = Path(d)
 for name in ['assemble.py', 'assets.py']:
  shutil.copyfile(Path(sys.path[0])/name, p/name)
 result = subprocess.run([sys.executable, str(p/'assemble.py'), '--help'], cwd=p, capture_output=True)
 assert result.returncode == 0, result.stderr
 print('standalone pass')`);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /standalone pass/);
});

for (const bad of [
  '<script>alert(1)</script>', '<foreignObject/>', '<path onclick="alert(1)"/>',
  '<image href="https://example.com/evil.svg"/>', '<use href="https://example.com/evil.svg#x"/>',
  '<path style="fill:red"/>', '<style>.x{fill:url(https://example.com/x)}</style>',
]) {
  test(`embedded icon rejects active content ${bad}`, () => {
    const input = `<svg xmlns="http://www.w3.org/2000/svg">${bad}</svg>`;
    const r = python(`from assets import safe_svg\nsafe_svg(${JSON.stringify(input)}.encode(), embedded=True)`);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /unsafe|external/);
  });
}

test('ZIP extraction rejects missing selections, active SVG, and destination symlinks', () => {
  const r = python(`import tempfile, zipfile\nfrom pathlib import Path\nfrom assets import extract_selected_zip
with tempfile.TemporaryDirectory() as d:
 p = Path(d)
 with zipfile.ZipFile(p/'icons.zip', 'w') as z:
  z.writestr('icon.svg', b'<svg xmlns="http://www.w3.org/2000/svg"><script/></svg>')
 for member in ['missing.svg', 'icon.svg']:
  try:
   extract_selected_zip(p/'icons.zip', [member], p/'out')
  except ValueError:
   assert not (p/'out').exists()
  else:
   raise AssertionError('invalid selection accepted')
 (p/'link').symlink_to(p, target_is_directory=True)
 try:
  extract_selected_zip(p/'icons.zip', ['icon.svg'], p/'link'/'out')
 except ValueError as e:
  assert 'symlink' in str(e)
 else:
  raise AssertionError('destination symlink accepted')
 print('selection and destination checks passed')`);
  assert.equal(r.status, 0, r.stderr);
});

test('structural check may inspect review-ready but export cannot self-approve it', () => {
  const change = i => { i.model.status = 'review-ready'; };
  const check = run(change);
  try { assert.equal(check.status, 0, check.stderr); } finally { check.cleanup(); }
  const exportResult = run(change, ['--html', 'narrative.html', '--out', 'pack.html', '--html-only']);
  try {
    assert.equal(exportResult.status, 2, exportResult.stderr);
    assert.match(exportResult.stderr, /independent detached judgment/);
  } finally { exportResult.cleanup(); }
});
