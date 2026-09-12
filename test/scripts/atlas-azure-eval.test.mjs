import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { root } from '../helpers.mjs';

const runner = join(root, 'test/eval/atlas-azure/run.mjs');
const personas = ['junior-developer', 'cto', 'enterprise-architect', 'security-architect'];

function artifactFixture(dir) {
  mkdirSync(dir);
  const areas = ['billing-tenant', 'identity-access', 'resource-organization', 'network-connectivity', 'security', 'management', 'governance', 'platform-automation'];
  const model = { schema: 1, title: 'Synthetic controller test', status: 'needs-decision', basis: 'input.md', brand: 'neutral',
    nodes: ['app', 'store'].map(id => ({ id, name: id, role: 'Synthetic fixture, not Azure evidence', state: 'proposed', evidence: ['input.md'] })),
    flows: [{ number: 1, from: 'app', to: 'store', kind: 'runtime', action: 'Store test', data: 'Test value', protocol: 'HTTPS', auth: 'Test identity', failure: 'Test failure', state: 'proposed', evidence: ['input.md'] }],
    views: ['platform', 'workload'].map(scope => ({ id: scope, scope, title: scope, paper: 'A4', svg: `${scope}.svg`, nodes: ['app', 'store'], flows: [1] })),
    coverage: areas.map(area => ({ area, state: 'proposed', finding: 'Synthetic fixture', decision: 'Test controller only', owner: 'Test', verification: 'No architecture claim', evidence: ['input.md'] })) };
  writeFileSync(join(dir, 'architecture.json'), JSON.stringify(model));
  for (const view of model.views) writeFileSync(join(dir, view.svg), '<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="210mm" viewBox="0 0 1122 794"><title>Test</title><desc>Controller fixture</desc><defs><marker id="arrow"><path d="M0 0L8 4L0 8Z"/></marker></defs><g data-node="app"><text x="100" y="100">Test application</text></g><g data-node="store"><text x="400" y="100">Test store</text></g><path data-flow="1" data-from="app" data-to="store" d="M200 110H390" marker-end="url(#arrow)"/><text data-flow-label="1" x="270" y="90">1</text></svg>');
  for (const file of ['reference-architecture.md', 'verification.md']) writeFileSync(join(dir, file), 'Synthetic fixture. No visual review or Azure deployment claimed.');
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
    personas: personas.map(id => ({ id, scores: { clarity: 4, complexity: 4, understandability: 4 }, evidence: [{ path: 'workload.svg', location: 'app', observation: 'Synthetic evidence for controller tests, not an actual judgment.' }], strengths: [], findings: [] })),
    requirementChecks: Array.from({ length: stage }, (_, i) => ({ id: `S${i + 1}-A1`, status: 'met', evidence: 'Synthetic requirement evidence.' })), regressionFindings: [], verdict: 'pass' };
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
  return spawnSync(process.execPath, [runner, command, '--run', join(dir, 'run'), ...args], { cwd: root, encoding: 'utf8' });
}

function setup() {
  const dir = mkdtempSync(join(tmpdir(), 'atlas-eval-'));
  const f = fixture(dir);
  const result = run(dir, 'init', ['--cases', f.casesFile, '--rubric', f.rubricFile]);
  assert.equal(result.status, 0, result.stderr);
  return { dir, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

test('init pins inputs and reveal does not expose a future stage', () => {
  const x = setup();
  try {
    const manifest = JSON.parse(readFileSync(join(x.dir, 'run/run.json')));
    assert.ok(manifest.atlas.sourceHashes['SKILL.md']);
    for (const provider of ['azure', 'aws', 'gcp']) {
      assert.ok(manifest.atlas.sourceHashes[`providers/${provider}/GUIDE.md`]);
      assert.ok(manifest.atlas.sourceHashes[`providers/${provider}/scripts/assemble.py`]);
    }
    assert.equal(run(x.dir, 'reveal').status, 0);
    const prompt = readFileSync(join(x.dir, 'run/stages/01/author-prompt.md'), 'utf8');
    assert.match(prompt, /Invoke Atlas \(atlas\)/);
    assert.match(prompt, /Which cloud platform should this architecture target: Azure, AWS, or GCP\?/);
    assert.match(prompt, /wait for explicit Azure confirmation before loading/);
    const input = readFileSync(join(x.dir, 'run/stages/01/input.md'), 'utf8');
    assert.match(input, /Requirement 1/);
    assert.doesNotMatch(input, /Requirement 2/);
    const blocked = run(x.dir, 'reveal');
    assert.equal(blocked.status, 2);
    assert.match(blocked.stderr, /freeze.*judgment/i);
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
      personas: personas.map(id => ({ id, scores: { clarity: 4, complexity: 4, understandability: 4 }, evidence: [{ path: 'view.svg', location: 'node A', observation: 'The labeled node identifies its role.' }], strengths: ['Labels are explicit.'], findings: [] })),
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

    judgment.personas[0].scores.clarity = 6;
    writeFileSync(file, JSON.stringify(judgment));
    assert.equal(run(x.dir, 'record-judgment', ['--judgment', file]).status, 2);

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
    assert.doesNotMatch(input, /100,000 devices|200 dedicated customer subscriptions/);
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
    assert.equal(run(x.dir, 'report').status, 0);
    const report = JSON.parse(readFileSync(join(x.dir, 'run/report.json')));
    assert.deepEqual(report.stages.map(s => s.result), ['pass', 'revise', 'revise', 'pass', 'pass']);
    assert.ok(report.stages.every(s => s.status === 'complete'));
  } finally { x.cleanup(); }
});

for (const [name, mutate, eligible, result] of [
  ['all twelve scores are 4', () => {}, true, 'pass'],
  ['one score is 3 among eleven 4s', j => { j.personas[3].scores.understandability = 3; }, false, 'revise'],
  ['minor regression', j => { j.regressionFindings.push('Minor: a previously defined acronym lost its expansion.'); }, false, 'revise'],
  ['valid revise with low score and regression', j => { j.verdict = 'revise'; j.personas[0].scores.clarity = 3; j.regressionFindings.push('Minor: lost label.'); }, false, 'revise'],
  ['eligible revise stays revise', j => { j.verdict = 'revise'; }, true, 'revise'],
]) {
  test(`strict4 stage gate: ${name}`, () => {
    const x = setup();
    try {
      const artifacts = join(x.dir, 'artifacts'); artifactFixture(artifacts);
      assert.equal(run(x.dir, 'reveal').status, 0);
      const freeze = run(x.dir, 'freeze', ['--artifacts', artifacts]);
      assert.equal(freeze.status, 0, freeze.stderr);
      const judgment = judgmentFixture(1);
      for (const persona of judgment.personas) persona.scores = { clarity: 4, complexity: 4, understandability: 4 };
      mutate(judgment);
      const file = join(x.dir, 'judgment.json'); writeFileSync(file, JSON.stringify(judgment));
      const record = run(x.dir, 'record-judgment', ['--judgment', file]);
      assert.equal(record.status, 0, record.stderr);
      assert.equal(run(x.dir, 'report').status, 0);
      const stage = JSON.parse(readFileSync(join(x.dir, 'run/report.json'))).stages[0];
      assert.equal(stage.passEligible, eligible);
      assert.equal(stage.result, result);
      assert.deepEqual(stage.regressionFindings, judgment.regressionFindings);
      assert.equal(run(x.dir, 'reveal').status, 0, 'valid negative receipts permit progression');
    } finally { x.cleanup(); }
  });
}

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
