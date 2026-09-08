import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { root } from '../helpers.mjs';

const runner = join(root, 'test/eval/atlas-aws/run.mjs');
const personas = ['junior-developer', 'cto', 'enterprise-architect', 'security-architect'];
const iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M0 0H16V16H0Z"/></svg>';
const iconData = Buffer.from(iconSvg).toString('base64');

function artifactFixture(dir) {
  mkdirSync(dir);
  const areas = ['billing-tenant', 'identity-access', 'resource-organization', 'network-connectivity', 'security', 'management', 'governance', 'platform-automation'];
  const model = { schema: 1, title: 'Synthetic controller test', status: 'needs-decision', basis: 'input.md', brand: 'neutral',
    nodes: ['app', 'store'].map(id => ({ id, name: id, role: 'Synthetic fixture, not AWS evidence', state: 'proposed', evidence: ['input.md'],
      placement: { kind: 'logical', account: 'synthetic-customer', region: 'us-east-1', boundary: 'synthetic controller fixture' }, ...(id === 'app' ? { icon: 'sample' } : {}) })),
    flows: [{ number: 1, from: 'app', to: 'store', kind: 'runtime', action: 'Store test', data: 'Test value', protocol: 'HTTPS', auth: 'Test identity', failure: 'Test failure', state: 'proposed', evidence: ['input.md'] }],
    views: ['platform', 'workload'].map(scope => ({ id: scope, scope, title: scope, paper: 'A4', svg: `${scope}.svg`, nodes: ['app', 'store'], flows: [1] })),
    coverage: areas.map(area => ({ area, state: 'proposed', finding: 'Synthetic fixture', decision: 'Test controller only', owner: 'Test', verification: 'No architecture claim', evidence: ['input.md'] })),
    icons: [{ id: 'sample', product: 'Synthetic AWS test icon', source: 'https://aws.amazon.com/architecture/icons/', license: 'https://aws.amazon.com/architecture/icons/', package: 'test', retrieved: '2026-09-08', member: 'icon.svg', sha256: createHash('sha256').update(iconSvg).digest('hex') }] };
  writeFileSync(join(dir, 'architecture.json'), JSON.stringify(model));
  for (const view of model.views) writeFileSync(join(dir, view.svg), `<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="210mm" viewBox="0 0 1122 794"><title>Test</title><desc>Controller fixture</desc><defs><marker id="arrow"><path d="M0 0L8 4L0 8Z"/></marker></defs><g data-node="app"><image data-icon="sample" href="data:image/svg+xml;base64,${iconData}" width="96" height="96" preserveAspectRatio="xMidYMid meet"/><text x="100" y="100">Test application</text></g><g data-node="store"><text x="400" y="100">Test store</text></g><path data-flow="1" data-from="app" data-to="store" d="M200 110H390" marker-end="url(#arrow)"/><text data-flow-label="1" x="270" y="90">1</text></svg>`);
  for (const file of ['reference-architecture.md', 'verification.md']) writeFileSync(join(dir, file), 'Synthetic fixture. No visual review or AWS deployment claimed.');
  writeFileSync(join(dir, 'reference-architecture.html'), '<!doctype html><title>Test</title><p>Synthetic fixture</p>');
  // Minimal valid, one-page PDF for controller tests; no model or browser invocation.
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << >> /Contents 4 0 R >>', '<< /Length 0 >>\nstream\n\nendstream'];
  let pdf = '%PDF-1.4\n'; const offsets = [0];
  objects.forEach((body, i) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${i + 1} 0 obj\n${body}\nendobj\n`; });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 5\n0000000000 65535 f \n${offsets.slice(1).map(n => `${String(n).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  writeFileSync(join(dir, 'reference-architecture.pdf'), pdf);
}

function judgmentFixture(stage) {
  return { stage, reviewer: { runtime: 'synthetic-test-reviewer' }, independent: true,
    inspected: [{ path: 'reference-architecture.pdf', pages: [1] }, { path: 'platform.svg' }, { path: 'workload.svg' }],
    personas: personas.map(id => ({ id, scores: { clarity: 3, complexity: 3, understandability: 3 }, evidence: [{ path: 'workload.svg', location: 'app', observation: 'Synthetic evidence for controller tests, not an actual judgment.' }], strengths: [], findings: [] })),
    requirementChecks: Array.from({ length: stage }, (_, i) => ({ id: `S${i + 1}-A1`, status: 'met', evidence: 'Synthetic requirement evidence.' })), regressionFindings: [], verdict: 'pass' };
}

function overviewArtifacts(dir, modelFile, iconSize = 96) {
  mkdirSync(dir);
  const hash = createHash('sha256').update(readFileSync(modelFile)).digest('hex');
  writeFileSync(join(dir, 'coverage.json'), JSON.stringify({ schema: 1, stage5ModelSha256: hash,
    nodes: ['app', 'store'], flows: [1], subsystems: ['platform', 'workload'] }));
  writeFileSync(join(dir, 'integrated-overview.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="841mm" height="594mm" viewBox="0 0 3179 2245"><title>Integrated test</title><desc>Synthetic only</desc><defs><marker id="arrow"><path d="M0 0L8 4L0 8Z"/></marker></defs><g data-node="app"><image data-icon="sample" href="data:image/svg+xml;base64,${iconData}" width="${iconSize}" height="${iconSize}" preserveAspectRatio="xMidYMid meet"/></g><g data-node="store"><text>Store</text></g><path data-flow="1" data-from="app" data-to="store" d="M0 0H10" marker-end="url(#arrow)"/><text data-flow-label="1">1</text></svg>`);
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 2384 1684] /Resources << >> /Contents 4 0 R >>', '<< /Length 0 >>\nstream\n\nendstream'];
  let pdf = '%PDF-1.4\n'; const offsets = [0];
  objects.forEach((body, i) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${i + 1} 0 obj\n${body}\nendobj\n`; });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 5\n0000000000 65535 f \n${offsets.slice(1).map(n => `${String(n).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  writeFileSync(join(dir, 'integrated-overview.pdf'), pdf);
}

function fixture(dir) {
  const cases = { schema: 1, baseline: 'Build from supplied evidence only.', stages: [1, 2, 3, 4, 5].map(id => ({ id, title: `Stage ${id}`, requirements: `Requirement ${id}`, acceptance: [`Acceptance ${id}`] })) };
  const rubric = { schema: 1, personas: personas.map(id => ({ id, perspective: `${id} perspective` })), dimensions: ['clarity', 'complexity', 'understandability'].map(id => ({ id, anchors: { 1: 'poor', 2: 'weak', 3: 'adequate', 4: 'good', 5: 'strong' } })) };
  const casesFile = join(dir, 'cases.json');
  const rubricFile = join(dir, 'rubric.json');
  writeFileSync(casesFile, JSON.stringify(cases));
  writeFileSync(rubricFile, JSON.stringify(rubric));
  return { casesFile, rubricFile };
}

function run(dir, command, args = []) {
  return spawnSync(process.execPath, [runner, command, '--run', join(dir, 'run'), ...args], { cwd: root, encoding: 'utf8', env: { ...process.env, PATH: `${join(dir, 'bin')}:${process.env.PATH}` } });
}

function setup() {
  const dir = mkdtempSync(join(tmpdir(), 'atlas-eval-'));
  mkdirSync(join(dir, 'bin'));
  writeFileSync(join(dir, 'bin/pdfinfo'), '#!/bin/sh\nprintf "Pages:          1\\nPage size:      2384 x 1684 pts (A1)\\n"\n');
  chmodSync(join(dir, 'bin/pdfinfo'), 0o755);
  const f = fixture(dir);
  const result = run(dir, 'init', ['--cases', f.casesFile, '--rubric', f.rubricFile]);
  assert.equal(result.status, 0, result.stderr);
  return { dir, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

test('init pins inputs and reveal does not expose a future stage', () => {
  const x = setup();
  try {
    assert.equal(run(x.dir, 'reveal').status, 0);
    const input = readFileSync(join(x.dir, 'run/stages/01/input.md'), 'utf8');
    assert.match(input, /Requirement 1/);
    assert.doesNotMatch(input, /Requirement 2/);
    const blocked = run(x.dir, 'reveal');
    assert.equal(blocked.status, 2);
    assert.match(blocked.stderr, /freeze.*judgment/i);
  } finally { x.cleanup(); }
});

test('integrated overview cannot be revealed before all five judged stages', () => {
  const x = setup();
  try {
    const result = run(x.dir, 'overview-reveal');
    assert.equal(result.status, 2);
    assert.match(result.stderr, /all five stages/);
  } finally { x.cleanup(); }
});

test('overview commands reject Atlas source-hash drift', () => {
  const x = setup();
  try {
    const manifestFile = join(x.dir, 'run/run.json');
    const manifest = JSON.parse(readFileSync(manifestFile));
    manifest.atlas.sourceHashes['SKILL.md'] = '0'.repeat(64);
    writeFileSync(manifestFile, JSON.stringify(manifest));
    const result = run(x.dir, 'overview-reveal');
    assert.equal(result.status, 2);
    assert.match(result.stderr, /source hashes changed/);
  } finally { x.cleanup(); }
});

test('freeze rejects incomplete output before recording it', () => {
  const x = setup();
  try {
    assert.equal(run(x.dir, 'reveal').status, 0);
    const artifacts = join(x.dir, 'artifacts');
    mkdirSync(artifacts);
    writeFileSync(join(artifacts, 'architecture.json'), '{}');
    const result = run(x.dir, 'freeze', ['--artifacts', artifacts]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /reference-architecture\.md/);
  } finally { x.cleanup(); }
});

test('changing the revealed input blocks later operations', () => {
  const x = setup();
  try {
    assert.equal(run(x.dir, 'reveal').status, 0);
    writeFileSync(join(x.dir, 'run/stages/01/input.md'), 'Changed after disclosure');
    const result = run(x.dir, 'report');
    assert.equal(result.status, 2, 'the reviewed requirements must match what was revealed');
    assert.match(result.stderr, /input.*hash/);
  } finally { x.cleanup(); }
});

test('a frozen artifact mutation blocks judgment prompt generation', () => {
  const x = setup();
  try {
    mkdirSync(join(x.dir, 'run/stages/01/frozen'), { recursive: true });
    writeFileSync(join(x.dir, 'run/stages/01/frozen/file.txt'), 'before');
    const manifest = JSON.parse(readFileSync(join(x.dir, 'run/run.json')));
    manifest.stages['1'] = { revealed: true, frozen: true, hashes: { 'file.txt': '6db7d803e74f938144d0e27a46b8883a72eadd47a0e142ff1a5c6f73f775e3b' } };
    writeFileSync(join(x.dir, 'run/run.json'), JSON.stringify(manifest));
    writeFileSync(join(x.dir, 'run/stages/01/frozen/file.txt'), 'after');
    const result = run(x.dir, 'judge-prompt');
    assert.equal(result.status, 2);
    assert.match(result.stderr, /hash|mutat/i);
  } finally { x.cleanup(); }
});

test('record-judgment validates exact coverage and derives pass eligibility', () => {
  const x = setup();
  try {
    const frozen = join(x.dir, 'run/stages/01/frozen');
    mkdirSync(frozen, { recursive: true });
    for (const name of ['reference-architecture.pdf', 'view.svg']) writeFileSync(join(frozen, name), name);
    const hashes = Object.fromEntries(['reference-architecture.pdf', 'view.svg'].map(name => [name, createHash('sha256').update(name).digest('hex')]));
    const manifest = JSON.parse(readFileSync(join(x.dir, 'run/run.json')));
    manifest.stages['1'] = { revealed: true, frozen: true, hashes, pdfPages: null, svgs: ['view.svg'] };
    writeFileSync(join(x.dir, 'run/run.json'), JSON.stringify(manifest));
    const judgment = {
      stage: 1, reviewer: { runtime: 'independent-thread-1' }, independent: true,
      inspected: [{ path: 'reference-architecture.pdf', pages: [1] }, { path: 'view.svg' }],
      personas: personas.map(id => ({ id, scores: { clarity: 3, complexity: 3, understandability: 3 }, evidence: [{ path: 'view.svg', location: 'node A', observation: 'The labeled node identifies its role.' }], strengths: ['Labels are explicit.'], findings: [] })),
      requirementChecks: [{ id: 'S1-A1', status: 'met', evidence: 'reference-architecture.pdf page 1 states the accepted behavior.' }],
      regressionFindings: [], verdict: 'blocked'
    };
    const file = join(x.dir, 'judgment.json');
    writeFileSync(file, JSON.stringify(judgment));
    const result = run(x.dir, 'record-judgment', ['--judgment', file]);
    assert.equal(result.status, 0, result.stderr);
    const receipt = JSON.parse(readFileSync(join(x.dir, 'run/stages/01/judgment.json')));
    assert.equal(receipt.derived.passEligible, true);
    assert.equal(receipt.derived.modelVerdictAgrees, false);

    assert.equal(run(x.dir, 'report').status, 0);
    const report = JSON.parse(readFileSync(join(x.dir, 'run/report.json')));
    assert.deepEqual(report.stages[0].scores['junior-developer'], judgment.personas[0].scores);
    assert.equal(report.stages[0].result, 'blocked', 'eligibility must not override the judge blocking the design');

    const rawBeforeRetry = readFileSync(join(x.dir, 'run/stages/01/raw-judgment.json'));
    judgment.personas[0].scores.clarity = 6;
    writeFileSync(file, JSON.stringify(judgment));
    assert.equal(run(x.dir, 'record-judgment', ['--judgment', file]).status, 2);
    assert.deepEqual(readFileSync(join(x.dir, 'run/stages/01/raw-judgment.json')), rawBeforeRetry, 'a duplicate stage receipt must not rewrite frozen raw history');

    writeFileSync(join(x.dir, 'run/stages/01/judgment.json'), '{}');
    const mutated = run(x.dir, 'reveal');
    assert.equal(mutated.status, 2, 'a changed judgment must block stage progression');
    assert.match(mutated.stderr, /judgment.*hash/i);
  } finally { x.cleanup(); }
});

test('freeze rejects a symlink at the artifact root', () => {
  const x = setup();
  try {
    assert.equal(run(x.dir, 'reveal').status, 0);
    mkdirSync(join(x.dir, 'real'));
    symlinkSync(join(x.dir, 'real'), join(x.dir, 'link'));
    const result = run(x.dir, 'freeze', ['--artifacts', join(x.dir, 'link')]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /symbolic links/);
  } finally { x.cleanup(); }
});

test('reveal verifies all preceding artifacts, not only the most recent stage', () => {
  const x = setup();
  try {
    const manifest = JSON.parse(readFileSync(join(x.dir, 'run/run.json')));
    for (const id of [1, 2]) {
      const dir = join(x.dir, 'run/stages', String(id).padStart(2, '0'));
      mkdirSync(join(dir, 'frozen'), { recursive: true });
      writeFileSync(join(dir, 'frozen/view.svg'), 'original');
      writeFileSync(join(dir, 'judgment.json'), '{}');
      manifest.stages[id] = { revealed: true, frozen: true, judgment: true,
        judgmentHash: createHash('sha256').update('{}').digest('hex'),
        hashes: { 'view.svg': createHash('sha256').update('original').digest('hex') } };
    }
    writeFileSync(join(x.dir, 'run/run.json'), JSON.stringify(manifest));
    writeFileSync(join(x.dir, 'run/stages/01/frozen/view.svg'), 'changed');
    const result = run(x.dir, 'reveal');
    assert.equal(result.status, 2, 'older frozen stages are part of the cumulative evidence');
    assert.match(result.stderr, /stage 1.*hash/);
  } finally { x.cleanup(); }
});

test('default benchmark fixtures initialize and expose deployment realism without future requirements', () => {
  const dir = mkdtempSync(join(tmpdir(), 'atlas-default-'));
  try {
    const result = run(dir, 'init');
    assert.equal(result.status, 0, result.stderr);
    assert.equal(run(dir, 'reveal').status, 0);
    const input = readFileSync(join(dir, 'run/stages/01/input.md'), 'utf8');
    assert.match(input, /deployment realism/);
    assert.match(input, /1,200/);
    assert.doesNotMatch(input, /100,000 devices|200 dedicated customer AWS accounts/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('five stages freeze valid artifacts and record failure without turning it into a pass', () => {
  const x = setup();
  try {
    const artifacts = join(x.dir, 'artifacts'); artifactFixture(artifacts);
    for (let stage = 1; stage <= 5; stage++) {
      assert.equal(run(x.dir, 'reveal').status, 0);
      const freeze = run(x.dir, 'freeze', ['--artifacts', artifacts]);
      assert.equal(freeze.status, 0, freeze.stderr);
      assert.equal(run(x.dir, 'judge-prompt').status, 0);
      const j = judgmentFixture(stage);
      if (stage === 2) j.personas[2].findings.push({ severity: 'major', path: 'workload.svg', location: 'app', issue: 'Synthetic deployment blocker', recommendation: 'Resolve the missing contract.' });
      if (stage === 3) j.regressionFindings.push('Synthetic lost requirement');
      const file = join(x.dir, 'judgment.json'); writeFileSync(file, JSON.stringify(j));
      const record = run(x.dir, 'record-judgment', ['--judgment', file]);
      assert.equal(record.status, 0, record.stderr);
    }
    assert.equal(run(x.dir, 'reveal').status, 2);
    assert.equal(run(x.dir, 'overview-reveal').status, 0);

    for (const [name, mutate, error] of [
      ['unsafe SVG', svg => svg.replace('</svg>', '<script>alert(1)</script></svg>'), /unsafe SVG element/],
      ['wrong flow endpoint', svg => svg.replace('data-to="store"', 'data-to="app"'), /endpoint mismatch/],
      ['missing official icon', svg => svg.replace(/<image\b[^>]*\/>/, ''), /node icon missing/],
    ]) {
      const invalid = join(x.dir, `overview-${name.replaceAll(' ', '-')}`);
      overviewArtifacts(invalid, join(x.dir, 'run/stages/05/frozen/architecture.json'));
      const svgFile = join(invalid, 'integrated-overview.svg');
      writeFileSync(svgFile, mutate(readFileSync(svgFile, 'utf8')));
      const rejected = run(x.dir, 'overview-freeze', ['--artifacts', invalid]);
      assert.equal(rejected.status, 2, `${name} must not freeze`);
      assert.match(rejected.stderr, error);
    }

    const overview = join(x.dir, 'overview-artifacts');
    overviewArtifacts(overview, join(x.dir, 'run/stages/05/frozen/architecture.json'));
    const overviewFreeze = run(x.dir, 'overview-freeze', ['--artifacts', overview]);
    assert.equal(overviewFreeze.status, 0, overviewFreeze.stderr);
    assert.equal(run(x.dir, 'overview-judge-prompt').status, 0);
    const overviewJudgment = judgmentFixture(1); overviewJudgment.stage = 'overview';
    overviewJudgment.inspected = [{ path: 'integrated-overview.pdf', pages: [1] }, { path: 'integrated-overview.svg' }];
    for (const persona of overviewJudgment.personas) persona.evidence[0].path = 'integrated-overview.svg';
    overviewJudgment.requirementChecks = ['O1-A1', 'O1-A2', 'O1-A3', 'O1-A4'].map(id => ({ id, status: 'unmet', evidence: 'Synthetic negative check.' }));
    overviewJudgment.verdict = 'pass';
    const overviewJudgmentFile = join(x.dir, 'overview-judgment.json'); writeFileSync(overviewJudgmentFile, JSON.stringify(overviewJudgment));
    const recorded = run(x.dir, 'overview-record-judgment', ['--judgment', overviewJudgmentFile]);
    assert.equal(recorded.status, 0, recorded.stderr);
    const receipt = JSON.parse(readFileSync(join(x.dir, 'run/overview/judgment.json')));
    const raw = JSON.parse(readFileSync(join(x.dir, 'run/overview/raw-judgment.json')));
    assert.equal(receipt.derived.passEligible, false, 'a fabricated pass cannot override failed checks');
    assert.equal(raw.derived, undefined, 'the raw submitted judgment remains unchanged');
    const overviewRawBeforeRetry = readFileSync(join(x.dir, 'run/overview/raw-judgment.json'));
    overviewJudgment.personas[0].scores.clarity = 5;
    writeFileSync(overviewJudgmentFile, JSON.stringify(overviewJudgment));
    assert.equal(run(x.dir, 'overview-record-judgment', ['--judgment', overviewJudgmentFile]).status, 2);
    assert.deepEqual(readFileSync(join(x.dir, 'run/overview/raw-judgment.json')), overviewRawBeforeRetry, 'a duplicate overview receipt must not rewrite frozen raw history');
    assert.equal(run(x.dir, 'report').status, 0);
    const report = JSON.parse(readFileSync(join(x.dir, 'run/report.json')));
    assert.deepEqual(report.stages.map(s => s.result), ['pass', 'revise', 'revise', 'pass', 'pass']);
    assert.ok(report.stages.every(s => s.status === 'complete'));
    assert.equal(report.overview.result, 'revise');
    assert.deepEqual(report.overview.scores['junior-developer'], raw.personas[0].scores);
    assert.equal(report.overview.requirementChecks.length, 4);
    const markdown = readFileSync(join(x.dir, 'run/report.md'), 'utf8');
    assert.match(markdown, /## Final integrated overview/);
    assert.match(markdown, /overview\/frozen\/integrated-overview.pdf/);
  } finally { x.cleanup(); }
});

for (const [name, mutate] of [
  ['missing persona', j => j.personas.pop()],
  ['missing diagram inspection', j => j.inspected.pop()],
  ['missing PDF page', j => { j.inspected[0].pages = []; }],
  ['out-of-range score', j => { j.personas[0].scores.clarity = 6; }],
  ['missing acceptance', j => { j.requirementChecks = []; }],
  ['evidence outside artifacts', j => { j.personas[0].evidence[0].path = '../secret'; }],
  ['invalid inspected type', j => { j.inspected = {}; }],
]) {
  test(`judgment rejects ${name}`, () => {
    const x = setup();
    try {
      const artifacts = join(x.dir, 'artifacts'); artifactFixture(artifacts);
      assert.equal(run(x.dir, 'reveal').status, 0);
      const frozen = run(x.dir, 'freeze', ['--artifacts', artifacts]);
      assert.equal(frozen.status, 0, frozen.stderr);
      const judgment = judgmentFixture(1); mutate(judgment);
      const file = join(x.dir, 'judgment.json'); writeFileSync(file, JSON.stringify(judgment));
      const result = run(x.dir, 'record-judgment', ['--judgment', file]);
      assert.equal(result.status, 2, result.stderr);
      assert.doesNotMatch(result.stderr, /TypeError/);
    } finally { x.cleanup(); }
  });
}
