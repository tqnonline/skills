import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const validator = resolve('skills/developer/atlas/providers/gcp/scripts/validate-review.py');
const generic = ['placement', 'directed-flows', 'truthful-abstraction', 'icon-readability', 'cumulative-consistency'];
const personaIds = ['junior-developer', 'cto', 'enterprise-architect', 'security-architect'];

function pdf(pages = 1) {
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>'];
  const kids = [];
  for (let i = 0; i < pages; i++) kids.push(`${3 + i} 0 R`);
  objects.push(`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages} >>`);
  for (let i = 0; i < pages; i++) objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>');
  let body = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, i) => {
    offsets.push(Buffer.byteLength(body));
    body += `${i + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(body);
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  body += offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  return body + `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
}

function hash(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function fixture(pages = 2) {
  const root = mkdtempSync(join(tmpdir(), 'atlas-gcp-review-'));
  const files = {
    'architecture.json': JSON.stringify({ requirements: [{ id: 'S1-A1' }], views: [{ svg: 'platform.svg' }] }),
    'reference-architecture.md': '# Architecture',
    'narrative.html': '<html>Narrative</html>',
    'reference-architecture.html': '<html>Architecture</html>',
    'reference-architecture.pdf': pdf(pages),
    'platform.svg': '<svg xmlns="http://www.w3.org/2000/svg"><text>Platform</text></svg>',
  };
  for (const [name, content] of Object.entries(files)) writeFileSync(join(root, name), content);
  const artifactHashes = Object.fromEntries(Object.keys(files).map(name => [name, hash(join(root, name))]));
  const inspected = Object.keys(files).map(path => ({ path }));
  inspected.find(item => item.path.endsWith('.pdf')).pages = Array.from({ length: pages }, (_, i) => i + 1);
  inspected.find(item => item.path.endsWith('.svg')).regions = ['whole view'];
  const receipt = {
    mode: 'architecture-pack', scope: 'ordinary pack', independent: true,
    reviewer: 'independent-review-context', inputRevision: 'abc123', artifactHashes, inspected,
    personas: personaIds.map(id => ({ id, scores: { clarity: 4, complexity: 4, understandability: 4 }, evidence: ['artifact evidence'], strengths: ['traceable flow'] })),
    findings: [],
    regressionFindings: [],
    requirementChecks: ['S1-A1', ...generic].map(id => ({ id, status: 'met', evidence: 'checked in artifacts' })),
    verdict: 'pass', limitations: [],
  };
  writeFileSync(join(root, 'quality-review.json'), JSON.stringify(receipt));
  return { root, receipt };
}

function run(root, review = join(root, 'quality-review.json')) {
  return spawnSync('python3', [validator, '--root', root, '--review', review], { encoding: 'utf8' });
}

function update(root, receipt) {
  writeFileSync(join(root, 'quality-review.json'), JSON.stringify(receipt));
}

function rejects(mutator, pattern) {
  const { root, receipt } = fixture();
  try {
    mutator(receipt, root);
    update(root, receipt);
    const result = run(root);
    assert.equal(result.status, 2, result.stdout + result.stderr);
    assert.match(result.stderr, pattern);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('accepts a complete hash-bound receipt for a real multi-page PDF', () => {
  const { root } = fixture();
  try {
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.deepEqual(output.derived.passEligible, true);
    assert.equal(output.derived.finalStatus, 'review-ready');
    assert.equal(output.derived.provisional, true);
    assert.match(output.derived.notice, /Author semantic and visual checks are still required/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('maps valid revise and blocked receipts to final statuses', () => {
  for (const [verdict, status] of [['revise', 'needs-decision'], ['blocked', 'incomplete']]) {
    const { root, receipt } = fixture();
    try {
      receipt.verdict = verdict;
      update(root, receipt);
      const result = run(root);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(JSON.parse(result.stdout).derived.finalStatus, status);
      assert.equal(JSON.parse(result.stdout).derived.passEligible, false);
    } finally { rmSync(root, { recursive: true, force: true }); }
  }
});

test('rejects mutation after receipt hashing', () => rejects((receipt, root) => {
  writeFileSync(join(root, 'reference-architecture.md'), '# Mutated');
}, /hash mismatch/));

test('rejects incomplete and duplicate PDF page inspection', () => rejects(receipt => {
  receipt.inspected.find(item => item.path.endsWith('.pdf')).pages = [1, 1];
}, /every page once in order/));

test('rejects duplicate model requirement IDs', () => rejects((receipt, root) => {
  const model = JSON.parse(readFileSync(join(root, 'architecture.json')));
  model.requirements.push({ id: 'S1-A1' });
  writeFileSync(join(root, 'architecture.json'), JSON.stringify(model));
  receipt.artifactHashes['architecture.json'] = hash(join(root, 'architecture.json'));
}, /requirement IDs must be unique/));

test('rejects duplicate persona IDs', () => rejects(receipt => {
  receipt.personas[1].id = receipt.personas[0].id;
}, /four required unique perspectives/));

test('rejects an unknown verdict', () => rejects(receipt => { receipt.verdict = 'approved'; }, /verdict must be/));

test('rejects traversal, symlink, and self-hash paths', () => {
  rejects(receipt => { receipt.artifactHashes['../outside'] = '0'.repeat(64); }, /must not traverse/);
  rejects((receipt, root) => {
    writeFileSync(join(root, 'target.txt'), 'target');
    symlinkSync('target.txt', join(root, 'linked.txt'));
    receipt.artifactHashes['linked.txt'] = hash(join(root, 'linked.txt'));
  }, /must not contain a symlink/);
  rejects((receipt, root) => {
    receipt.artifactHashes['quality-review.json'] = '0'.repeat(64);
  }, /must not hash the review receipt itself/);
});

test('rejects unsupported pass conditions and skill-patch mode', () => {
  rejects(receipt => { receipt.personas[0].scores.clarity = 2; }, /pass is unsupported/);
  rejects(receipt => { receipt.mode = 'skill-patch'; }, /skill-patch cannot produce architecture review-ready/);
});

test('strict4 rejects one score of 3 among eleven 4s', () => rejects(receipt => {
  receipt.personas[3].scores.understandability = 3;
}, /pass is unsupported.*below 4/));

test('strict4 rejects even a minor regression with all scores at 4', () => rejects(receipt => {
  receipt.regressionFindings.push('Minor: a previously defined acronym lost its expansion.');
}, /pass is unsupported.*regression/));

for (const [name, mutate] of [
  ['missing', receipt => { delete receipt.regressionFindings; }],
  ['non-array', receipt => { receipt.regressionFindings = 'none'; }],
  ['non-string entry', receipt => { receipt.regressionFindings = [3]; }],
  ['empty entry', receipt => { receipt.regressionFindings = [' ']; }],
]) test(`requires regressionFindings string array: ${name}`, () => rejects(receipt => {
  receipt.verdict = 'revise';
  mutate(receipt);
}, /regressionFindings/));

test('strict4 preserves a valid revise receipt with low scores and a minor regression', () => {
  const { root, receipt } = fixture();
  try {
    receipt.verdict = 'revise';
    receipt.personas[0].scores.clarity = 3;
    receipt.regressionFindings.push('Minor: lost label.');
    update(root, receipt);
    const before = readFileSync(join(root, 'quality-review.json'), 'utf8');
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    const { derived, ...preserved } = JSON.parse(result.stdout);
    assert.equal(derived.passEligible, false);
    assert.equal(derived.finalStatus, 'needs-decision');
    assert.deepEqual(preserved, receipt);
    assert.equal(readFileSync(join(root, 'quality-review.json'), 'utf8'), before);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
