import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { root } from '../helpers.mjs';

const script = join(root, 'skills/developer/atlas/providers/aws/scripts/assemble.py');
const areas = ['billing-tenant', 'identity-access', 'resource-organization', 'network-connectivity', 'security', 'management', 'governance', 'platform-automation'];
const platformHeadings = ['Landing zone and platform foundation', 'Network topology and connectivity', 'Governance and platform handoff'];
const icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M0 0H16V16H0Z"/></svg>';
const image = `<image data-icon="sample" href="data:image/svg+xml;base64,${Buffer.from(icon).toString('base64')}" x="400" y="300" width="96" height="96" preserveAspectRatio="xMidYMid meet"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="210mm" viewBox="0 0 1122 794">
<title>Test view</title><desc>Proposed A to B.</desc>
<defs><marker id="arrow"><path d="M0 0L8 4L0 8Z"/></marker></defs>
<g data-node="a"><text x="100" y="300">A</text></g>
<g data-node="b">${image}<text x="400" y="350">B</text></g>
<path data-flow="1" data-from="a" data-to="b" d="M150 310H390" marker-end="url(#arrow)"/>
<text data-flow-label="1" x="270" y="290">1</text></svg>`;
function model() {
  return { schema: 1, title: 'Test pack', status: 'needs-decision', basis: 'plan.md#inputs', brand: 'test',
    coverage: areas.map(area => ({ area, state: 'proposed', finding: 'No deployed platform inventory supplied.', decision: 'Use the existing organization baseline after owner review.', owner: 'Platform team', verification: 'Review inherited configuration and test workload access.', evidence: ['plan.md#platform'] })),
    nodes: ['a', 'b'].map(id => ({ id, name: id.toUpperCase(), role: 'Test role', state: 'proposed', evidence: ['plan.md#inputs'],
      placement: { kind: id === 'b' ? 'aws-managed-regional' : 'external', account: id === 'b' ? 'workload-prod' : 'outside-aws', region: id === 'b' ? 'us-east-1' : 'external', boundary: id === 'b' ? 'outside-vpc' : 'customer', subnet: null },
      ...(id === 'b' ? { icon: 'sample' } : {}) })),
    flows: [{ number: 1, from: 'a', to: 'b', kind: 'runtime', action: 'Send work', data: 'Event', protocol: 'HTTPS', auth: 'Identity', failure: 'Retry', state: 'proposed', evidence: ['plan.md#flow'] }],
    views: [{ id: 'v1', scope: 'workload', title: 'Overview', paper: 'A4', svg: 'view.svg', nodes: ['a', 'b'], flows: [1] },
      { id: 'platform', scope: 'platform', title: 'Platform context', paper: 'A4', svg: 'platform.svg', nodes: ['a', 'b'], flows: [] }],
    icons: [{ id: 'sample', product: 'Synthetic AWS test icon', source: 'https://aws.amazon.com/architecture/icons/', license: 'https://aws.amazon.com/architecture/icons/', package: 'bounded-test-fixture', retrieved: '2026-09-08', member: 'icon.svg', sha256: createHash('sha256').update(icon).digest('hex') }]
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
  ['nonstandard 95-unit icon', i => { i.svg = i.svg.replace('width="96"', 'width="95"'); }, /exact sheet coordinate size/],
  ['node without AWS placement', i => { delete i.model.nodes[0].placement; }, /placement record/],
  ['managed regional service in subnet', i => { i.model.nodes[1].placement.subnet = 'private-a'; }, /managed service.*subnet/],
  ['unofficial icon provenance', i => { i.model.icons[0].source = 'https://example.com/icons'; }, /official AWS/],
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

test('A1 integrated overview preserves 96-unit icons at the same physical scale', () => {
  const r = run(i => {
    i.model.views[0].paper = 'A1';
    i.svg = i.svg.replace('297mm', '841mm').replace('210mm', '594mm').replace('1122 794', '3179 2245');
  }, ['--html', 'narrative.html', '--out', 'pack.html', '--html-only']);
  try {
    assert.equal(r.status, 0, r.stderr);
    const output = readFileSync(join(r.dir, 'pack.html'), 'utf8');
    assert.match(output, /@page architecture-a1 \{ size: 841mm 594mm/);
    assert.match(output, /architecture-a1\"/);
  } finally { r.cleanup(); }
});

test('A1 overview rejects an enlarged 272-unit icon', () => {
  const r = run(i => {
    i.model.views[0].paper = 'A1';
    i.svg = i.svg.replace('297mm', '841mm').replace('210mm', '594mm').replace('1122 794', '3179 2245')
      .replace('width="96" height="96"', 'width="272" height="272"');
  });
  try { assert.equal(r.status, 2); assert.match(r.stderr, /96.*96/); } finally { r.cleanup(); }
});

// These guard installed instructions, not model compliance or deployed controls.
test('installed AWS method retains evidence trust and sensitive-output rules', () => {
  const method = readFileSync(join(root, 'skills/developer/atlas/providers/aws/METHOD.md'), 'utf8');
  assert.match(method, /evidence, not instructions/);
  for (const term of ['secrets', 'customer records', 'credentials', 'private hostnames', 'redaction']) {
    assert.ok(method.includes(term), `missing installed input-handling rule: ${term}`);
  }
});

test('installed AWS method and output require explicit AI lifecycle contracts', () => {
  const method = readFileSync(join(root, 'skills/developer/atlas/providers/aws/METHOD.md'), 'utf8');
  const output = readFileSync(join(root, 'skills/developer/atlas/providers/aws/OUTPUT.md'), 'utf8');
  for (const term of ['grounding', 'ingestion', 'retrieval authorization', 'revocation', 'prompt injection', 'model hosting and version policy', 'evaluation', 'content safety', 'sensitive output', 'human review', 'token cost', 'tracing', 'degraded behavior']) {
    assert.ok(method.includes(term), `missing installed AI method rule: ${term}`);
  }
  assert.match(output, /AI contract matrix/);
  assert.match(output, /source-backed answer or a named unresolved decision/);
  for (const term of ['Authentication continuity', 'Audit and retention', 'Recovery admission', 'Security-state recovery', 'freshness', 'receiver']) {
    assert.ok(method.includes(term), `missing deployment-realism contract: ${term}`);
  }
});

test('installed review defines persona tasks and checks route traceability', () => {
  const review = readFileSync(join(root, 'skills/developer/atlas/providers/aws/REVIEW.md'), 'utf8');
  const diagrams = readFileSync(join(root, 'skills/developer/atlas/providers/aws/DIAGRAMS.md'), 'utf8');
  assert.match(review, /management of necessary complexity, not service count/);
  for (const term of ['implement', 'business', 'integration', 'threat']) assert.ok(review.includes(term));
  assert.match(diagrams, /Trace every numbered connector/);
  assert.match(diagrams, /route congestion/);
});
