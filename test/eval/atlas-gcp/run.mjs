#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, renameSync,
  rmSync, statSync, writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../..');
const SKILL = join(ROOT, 'drafts/branding/atlas-gcp');
const ASSEMBLE = join(SKILL, 'scripts/assemble.py');
const PERSONAS = ['junior-developer', 'cto', 'enterprise-architect', 'security-architect'];
const DIMENSIONS = ['clarity', 'complexity', 'understandability'];
const REQUIRED = ['architecture.json', 'reference-architecture.md', 'reference-architecture.html', 'reference-architecture.pdf', 'verification.md'];
const OVERVIEW = 'final-overview';
const OVERVIEW_ACCEPTANCE = [
  ['OVERVIEW-A1', 'The single integrated view maps the complete solution and platform foundation, including the provider organization, billing, shared management, and dedicated customer projects.'],
  ['OVERVIEW-A2', 'The view distinguishes true ownership and placement for standard and premium customers and names supported US regions and service tiers without presenting unverified support as fact.'],
  ['OVERVIEW-A3', 'Stable numbered flows truthfully aggregate the five source designs and directly show durable state, authorization, regional write ownership, failure, and recovery boundaries.'],
  ['OVERVIEW-A4', 'One integrated CUSTOM view remains readable at its declared size and uses official Google Cloud icon boxes exactly 96 by 96 pixels at native scale.'],
  ['OVERVIEW-A5', 'The pack maps every cumulative source requirement, stays consistent with all five frozen packs, and records visual review of the actual PDF pages and integrated SVG.'],
];
let activeManifest;
let activeRubric;

function die(message) { console.error(`atlas-gcp-eval: ${message}`); process.exit(2); }
function json(file) { try { return JSON.parse(readFileSync(file, 'utf8')); } catch (e) { die(`cannot read valid JSON from ${file}: ${e.message}`); } }
function save(file, value) { writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); }
function sha(file) { return createHash('sha256').update(readFileSync(file)).digest('hex'); }
function nonempty(value) { return typeof value === 'string' && value.trim().length > 0; }
function stageDir(run, id) { return join(run, id === OVERVIEW ? OVERVIEW : 'stages', id === OVERVIEW ? '' : String(id).padStart(2, '0')); }
function manifest(run) {
  const file = join(run, 'run.json');
  if (!existsSync(file)) die(`${run} is not an initialized run`);
  return { file, value: json(file) };
}
function walk(dir, base = dir, out = []) {
  if (lstatSync(dir).isSymbolicLink()) die(`symbolic links are not allowed: ${dir}`);
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = join(dir, entry.name);
    const info = lstatSync(file);
    if (info.isSymbolicLink()) die(`symbolic links are not allowed: ${file}`);
    if (info.isDirectory()) walk(file, base, out);
    else if (info.isFile()) out.push(relative(base, file).split(sep).join('/'));
    else die(`unsupported artifact type: ${file}`);
  }
  return out;
}
function hashes(dir) { return Object.fromEntries(walk(dir).map(path => [path, sha(join(dir, path))])); }
function sameSet(a, b) { return a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]); }
function assertFrozen(run, state, id) {
  const frozen = join(stageDir(run, id), 'frozen');
  const actual = hashes(frozen);
  if (!state.hashes || !Object.keys(state.hashes).length || JSON.stringify(actual) !== JSON.stringify(state.hashes)) die(`stage ${id} frozen artifact hashes are missing or changed; restore the immutable files`);
  return frozen;
}
function assertHistory(run, m) {
  for (const [id, state] of Object.entries(m.stages)) {
    if (state.inputHash && sha(join(stageDir(run, Number(id)), 'input.md')) !== state.inputHash) die(`stage ${id} input hash changed`);
    if (state.frozen) assertFrozen(run, state, Number(id));
    if (state.judgment && sha(join(stageDir(run, Number(id)), 'judgment.json')) !== state.judgmentHash) die(`stage ${id} judgment hash changed`);
  }
  if (m.overview?.inputHash && sha(join(stageDir(run, OVERVIEW), 'input.md')) !== m.overview.inputHash) die('final overview input hash changed');
  if (m.overview?.frozen) assertFrozen(run, m.overview, OVERVIEW);
  if (m.overview?.judgment && sha(join(stageDir(run, OVERVIEW), 'judgment.json')) !== m.overview.judgmentHash) die('final overview judgment hash changed');
}
function validateFixtures(cases, rubric) {
  if (cases.schema !== 1 || !nonempty(cases.baseline) || !Array.isArray(cases.stages) || cases.stages.length !== 5) die('cases must use schema 1 with a baseline and five stages');
  cases.stages.forEach((s, i) => {
    if (s.id !== i + 1 || !nonempty(s.title) || !nonempty(s.requirements) || !Array.isArray(s.acceptance) || !s.acceptance.length || !s.acceptance.every(nonempty)) die(`cases stage ${i + 1} is invalid`);
  });
  if (rubric.schema !== 1 || !Array.isArray(rubric.personas) || !sameSet(rubric.personas.map(p => p.id), PERSONAS) || rubric.personas.some(p => !nonempty(p.perspective))) die('rubric must define the four required personas');
  if (!Array.isArray(rubric.dimensions) || !sameSet(rubric.dimensions.map(d => d.id), DIMENSIONS)) die('rubric must define clarity, complexity, and understandability');
  for (const d of rubric.dimensions) for (let n = 1; n <= 5; n++) if (!nonempty(d.anchors?.[n])) die(`rubric dimension ${d.id} needs anchors 1 through 5`);
}
function options(argv) {
  const command = argv.shift();
  if (!command || command === '--help' || command === '-h') usage(0);
  const out = { command };
  while (argv.length) {
    const key = argv.shift();
    if (!['--run', '--cases', '--rubric', '--artifacts', '--judgment'].includes(key)) die(`unknown option ${key}`);
    if (!argv.length) die(`${key} needs a value`);
    out[key.slice(2)] = resolve(argv.shift());
  }
  if (!out.run) die('--run is required');
  return out;
}
function usage(code) {
  console.log('usage: run.mjs <init|reveal|freeze|judge-prompt|record-judgment|overview-reveal|overview-freeze|overview-judge-prompt|overview-record-judgment|report> --run DIR [options]');
  process.exit(code);
}
function acceptanceIds(cases, stage) {
  return cases.stages.slice(0, stage).flatMap(s => s.acceptance.map((_, i) => `S${s.id}-A${i + 1}`));
}
function currentStage(m) { return Object.keys(m.stages).map(Number).filter(id => m.stages[id]?.revealed).sort((a, b) => b - a)[0] ?? null; }

function freezeArtifacts(id, state, integrated = false) {
  if (!state?.revealed || state.frozen) die(`${id} must be revealed and not already frozen`);
  if (!o.artifacts || !existsSync(o.artifacts) || !statSync(o.artifacts).isDirectory()) die('--artifacts must name an artifact directory');
  walk(o.artifacts);
  for (const name of REQUIRED) if (!existsSync(join(o.artifacts, name)) || !statSync(join(o.artifacts, name)).isFile()) die(`required artifact is missing: ${name}`);
  const model = json(join(o.artifacts, 'architecture.json'));
  const svgs = [...new Set((model.views ?? []).map(v => v.svg))];
  if (!svgs.length || (integrated && !(model.views ?? []).some(v => v.scope === 'integrated'))) die(integrated ? 'final overview requires an integrated SVG view' : 'architecture.json must reference at least one SVG view');
  if (integrated && (model.profile !== 'integrated' || model.views.length !== 1 || model.views[0].scope !== 'integrated' || model.views[0].paper !== 'CUSTOM')) die('final overview requires the integrated profile with one CUSTOM integrated view');
  for (const path of svgs) if (!nonempty(path) || isAbsolute(path) || path.split(/[\\/]/).includes('..') || !existsSync(join(o.artifacts, path))) die(`referenced SVG is missing or unsafe: ${path}`);
  const check = spawnSync('python3', [ASSEMBLE, '--model', join(o.artifacts, 'architecture.json'), '--check'], { cwd: o.artifacts, encoding: 'utf8' });
  if (check.status !== 0) die(`assemble.py --check failed:\n${check.stderr || check.stdout}`);
  const info = spawnSync('pdfinfo', [join(o.artifacts, 'reference-architecture.pdf')], { encoding: 'utf8' });
  if (info.error || info.status !== 0) die('pdfinfo is required and must parse reference-architecture.pdf');
  const pdfPages = Number(info.stdout.match(/^Pages:\s+(\d+)/m)?.[1]); if (!pdfPages) die('pdfinfo did not report a positive page count');
  const target = join(stageDir(o.run, id), 'frozen'); const temp = `${target}.tmp`;
  rmSync(temp, { recursive: true, force: true }); cpSync(o.artifacts, temp, { recursive: true, errorOnExist: true }); renameSync(temp, target);
  Object.assign(state, { frozen: true, frozenAt: new Date().toISOString(), hashes: hashes(target), svgs, pdfPages, structuralValidation: 'passed; semantic and visual correctness not assessed' }); save(join(o.run, 'run.json'), activeManifest);
}

function writeJudgePrompt(id, state, ids, input, priorPaths) {
  if (!state?.frozen) die(`${id} must be frozen before judgment`);
  const frozen = assertFrozen(o.run, state, id);
  const schema = readFileSync(join(HERE, 'README.md'), 'utf8').match(/```json\n([\s\S]*?)\n```/)?.[1] ?? die('README judgment schema is missing');
  const sources = priorPaths.length ? priorPaths.map(p => `- \`${p}\``).join('\n') : '- None';
  writeFileSync(join(stageDir(o.run, id), 'judge-prompt.md'), `# Independent Atlas GCP judgment: ${id}\n\nYou are an independent reviewer. Do not use or request the author's reasoning. Inspect the actual frozen files under \`${frozen}\`. Open every page of the actual PDF (pages 1 through ${state.pdfPages}) and every referenced SVG: ${state.svgs.map(p => `\`${join(frozen, p)}\``).join(', ')}. Cite hashed artifact paths and precise page, section, element, or node locations. Check exactly these requirement IDs: ${ids.join(', ')}. Critique unmet requirements and regressions against every source pack below. Unsupported or uninspected work cannot pass. Return only one JSON object matching the embedded schema. Include artifactHashes exactly as supplied below.\n\n## Prior frozen source packs\n${sources}\n\n## Frozen artifact hashes\n\n${JSON.stringify(state.hashes, null, 2)}\n\n## Judgment JSON schema\n\n\`\`\`json\n${schema}\n\`\`\`\n\n## Pinned rubric\n\n${JSON.stringify(activeRubric, null, 2)}\n\n## Revealed requirements\n\n${input}\n`);
}

function recordJudgment(id, state, ids) {
  if (!state?.frozen || !o.judgment) die(`${id} must be frozen and --judgment supplied`);
  assertFrozen(o.run, state, id); const j = json(o.judgment);
  if (!j || typeof j !== 'object' || ['inspected', 'personas', 'requirementChecks', 'regressionFindings'].some(key => !Array.isArray(j[key]))) die('judgment must contain inspected, personas, requirementChecks and regressionFindings arrays');
  if ([...j.inspected, ...j.personas, ...j.requirementChecks].some(x => !x || typeof x !== 'object')) die('judgment entries must be objects');
  for (const p of j.personas) if (!Array.isArray(p.evidence) || !Array.isArray(p.findings) || [...p.evidence, ...p.findings].some(x => !x || typeof x !== 'object')) die('persona evidence and findings must be arrays of objects');
  const errors = [];
  if (j.stage !== id) errors.push(`stage must be ${id}`);
  if (j.independent !== true) errors.push('independent must be true');
  if (!j.reviewer || typeof j.reviewer !== 'object' || !['identity', 'thread', 'runtime'].some(key => nonempty(j.reviewer[key]))) errors.push('reviewer must identify an identity, thread, or runtime');
  if (!j.artifactHashes || !sameSet(Object.keys(j.artifactHashes), Object.keys(state.hashes)) || Object.entries(state.hashes).some(([path, hash]) => j.artifactHashes[path] !== hash)) errors.push('artifactHashes must exactly match the frozen reviewed files');
  const artifactPaths = new Set(Object.keys(state.hashes));
  const inspected = new Map(j.inspected.map(x => [x.path, x]));
  if (inspected.size !== j.inspected.length) errors.push('inspected paths must be unique');
  for (const path of ['reference-architecture.pdf', ...state.svgs]) if (!inspected.has(path)) errors.push(`inspected must cover ${path}`);
  for (const x of j.inspected) if (!nonempty(x.path) || !artifactPaths.has(x.path)) errors.push(`inspected path is outside frozen artifacts: ${x.path}`);
  const pdf = inspected.get('reference-architecture.pdf');
  if (!pdf || !Array.isArray(pdf.pages) || !sameSet(pdf.pages, Array.from({ length: state.pdfPages }, (_, i) => i + 1))) errors.push(`PDF pages must cover 1 through ${state.pdfPages}`);
  if (!sameSet(j.personas.map(p => p.id), PERSONAS)) errors.push('personas must match the exact required set');
  for (const p of j.personas) {
    if (!p.scores || !sameSet(Object.keys(p.scores), DIMENSIONS) || DIMENSIONS.some(d => !Number.isInteger(p.scores[d]) || p.scores[d] < 1 || p.scores[d] > 5)) errors.push(`${p.id} needs exact integer scores from 1 to 5`);
    if (!p.evidence.length) errors.push(`${p.id} needs evidence`);
    for (const e of p.evidence) if (!artifactPaths.has(e.path) || !nonempty(e.location) || !nonempty(e.observation)) errors.push(`${p.id} has invalid evidence`);
    if (!Array.isArray(p.strengths) || !p.strengths.every(nonempty)) errors.push(`${p.id} strengths are invalid`);
    for (const f of p.findings) if (!['critical', 'major', 'minor'].includes(f.severity) || !artifactPaths.has(f.path) || ![f.location, f.issue, f.recommendation].every(nonempty)) errors.push(`${p.id} has an invalid finding`);
  }
  if (!sameSet(j.requirementChecks.map(x => x.id), ids)) errors.push(`requirementChecks must contain exactly ${ids.join(', ')}`);
  for (const c of j.requirementChecks) if (!['met', 'partial', 'unmet'].includes(c.status) || !nonempty(c.evidence)) errors.push(`requirement check ${c.id} is invalid`);
  if (!j.regressionFindings.every(nonempty)) errors.push('regressionFindings must be strings');
  if (!['pass', 'revise', 'blocked'].includes(j.verdict)) errors.push('verdict is invalid');
  if (errors.length) die(errors.join('; '));
  const findings = j.personas.flatMap(p => p.findings);
  const passEligible = j.personas.every(p => DIMENSIONS.every(d => p.scores[d] >= 3)) && !findings.some(f => ['critical', 'major'].includes(f.severity)) && j.requirementChecks.every(c => c.status === 'met') && (j.regressionFindings ?? []).length === 0;
  const destination = join(stageDir(o.run, id), 'judgment.json'); if (existsSync(destination)) die(`${id} already has a judgment`);
  writeFileSync(destination, readFileSync(o.judgment)); Object.assign(state, { judgment: true, judgmentHash: sha(destination), passEligible, modelVerdictAgrees: (j.verdict === 'pass') === passEligible, verdict: j.verdict }); save(join(o.run, 'run.json'), activeManifest);
}

const o = options(process.argv.slice(2));
if (o.command === 'init') {
  if (existsSync(o.run)) die(`run directory already exists: ${o.run}`);
  const casesFile = o.cases ?? join(HERE, 'cases.json');
  const rubricFile = o.rubric ?? join(HERE, 'rubric.json');
  const cases = json(casesFile); const rubric = json(rubricFile);
  validateFixtures(cases, rubric);
  mkdirSync(join(o.run, 'fixtures'), { recursive: true });
  mkdirSync(join(o.run, 'stages'));
  writeFileSync(join(o.run, 'fixtures/cases.json'), readFileSync(casesFile));
  writeFileSync(join(o.run, 'fixtures/rubric.json'), readFileSync(rubricFile));
  const revision = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' });
  const sourceHashes = hashes(SKILL);
  save(join(o.run, 'run.json'), { schema: 1, createdAt: new Date().toISOString(), fixtures: { cases: { path: 'fixtures/cases.json', sha256: sha(join(o.run, 'fixtures/cases.json')) }, rubric: { path: 'fixtures/rubric.json', sha256: sha(join(o.run, 'fixtures/rubric.json')) } }, atlas: { revision: revision.status === 0 ? revision.stdout.trim() : null, sourceHashes }, stages: {} });
  console.log(`atlas-gcp-eval: initialized ${o.run}`);
} else {
  const loaded = manifest(o.run); const m = loaded.value;
  const cases = json(join(o.run, m.fixtures.cases.path)); const rubric = json(join(o.run, m.fixtures.rubric.path));
  activeManifest = m; activeRubric = rubric;
  if (sha(join(o.run, m.fixtures.cases.path)) !== m.fixtures.cases.sha256 || sha(join(o.run, m.fixtures.rubric.path)) !== m.fixtures.rubric.sha256) die('pinned fixture hashes changed');
  validateFixtures(cases, rubric);
  assertHistory(o.run, m);
  if (['reveal', 'freeze', 'overview-reveal', 'overview-freeze'].includes(o.command) && JSON.stringify(hashes(SKILL)) !== JSON.stringify(m.atlas.sourceHashes)) die('Atlas skill source hashes changed; start a separate run for the new version');

  if (o.command === 'overview-reveal') {
    if (m.overview?.revealed) die('final overview is already revealed');
    for (let id = 1; id <= 5; id++) if (!m.stages[id]?.judgment) die('all five stage judgments are required before final overview reveal');
    const dir = stageDir(o.run, OVERVIEW); mkdirSync(dir, { recursive: true });
    const prior = cases.stages.map(s => `- ${join(stageDir(o.run, s.id), 'frozen')}`).join('\n');
    const acceptance = OVERVIEW_ACCEPTANCE.map(([id, text]) => `- ${id}: ${text}`).join('\n');
    const cumulative = cases.stages.flatMap(s => [`### Stage ${s.id}: ${s.title}`, s.requirements, ...s.acceptance.map((a, i) => `- S${s.id}-A${i + 1}: ${a}`), '']).join('\n');
    const input = `# Atlas GCP final overview\n\nCreate one integrated platform-and-solution visual after all five cumulative designs have been independently judged. The pack must use the integrated profile and one CUSTOM view with dimensions declared at 96 pixels per inch. Preserve per-customer provider-operated GCP projects and dedicated application, data, search, and agent resources, with shared management limited to approved metadata. Use stable component and flow IDs from the frozen designs.\n\n## Final acceptance\n${acceptance}\n\n## Complete cumulative source requirements\n${cases.baseline}\n\n${cumulative}\n## Frozen source packs\n${prior}\n`;
    writeFileSync(join(dir, 'input.md'), input);
    writeFileSync(join(dir, 'author-prompt.md'), 'Produce the Atlas GCP final overview pack from input.md and only the five named frozen source packs. Write a canonical model, Markdown, HTML, PDF, verification receipt, and integrated editable SVG to a separate output directory.\n');
    m.overview = { revealed: true, revealedAt: new Date().toISOString(), inputHash: sha(join(dir, 'input.md')) }; save(loaded.file, m);
    console.log(join(dir, 'author-prompt.md'));
  } else if (o.command === 'overview-freeze') {
    freezeArtifacts(OVERVIEW, m.overview, true);
  } else if (o.command === 'overview-judge-prompt') {
    writeJudgePrompt(OVERVIEW, m.overview, OVERVIEW_ACCEPTANCE.map(([id]) => id), readFileSync(join(stageDir(o.run, OVERVIEW), 'input.md'), 'utf8'), cases.stages.map(s => join(stageDir(o.run, s.id), 'frozen')));
  } else if (o.command === 'overview-record-judgment') {
    recordJudgment(OVERVIEW, m.overview, OVERVIEW_ACCEPTANCE.map(([id]) => id));

  } else if (o.command === 'reveal') {
    const prior = currentStage(m);
    if (prior !== null) {
      const state = m.stages[prior];
      if (!state.frozen || !state.judgment) die(`stage ${prior} must have a freeze and valid judgment before the next reveal`);
      assertFrozen(o.run, state, prior);
    }
    const id = prior === null ? 1 : prior + 1;
    if (id > 5) die('all five stages have already been revealed; use overview-reveal after their judgments');
    const dir = stageDir(o.run, id); mkdirSync(dir, { recursive: true });
    const cumulative = cases.stages.slice(0, id);
    const priorPaths = cumulative.slice(0, -1).map(s => `- ${join(stageDir(o.run, s.id), 'frozen')}`).join('\n') || '- None';
    const input = [`# Atlas GCP evaluation stage ${id}: ${cases.stages[id - 1].title}`, '', '## Baseline', cases.baseline, '', '## Cumulative requirements', ...cumulative.flatMap(s => [`### Stage ${s.id}: ${s.title}`, s.requirements, '', ...s.acceptance.map((a, i) => `- S${s.id}-A${i + 1}: ${a}`), '']), '## Available frozen preceding outputs', priorPaths, ''].join('\n');
    writeFileSync(join(dir, 'input.md'), input);
    writeFileSync(join(dir, 'author-prompt.md'), `Produce the Atlas GCP architecture pack for stage ${id}. Read only input.md and the frozen preceding outputs listed there. Do not inspect the run fixtures because they contain future stages. Write artifacts to a separate output directory for the orchestrator to freeze.\n`);
    m.stages[id] = { revealed: true, revealedAt: new Date().toISOString(), inputHash: sha(join(dir, 'input.md')) }; save(loaded.file, m);
    console.log(join(dir, 'author-prompt.md'));
  } else if (o.command === 'freeze') {
    const id = currentStage(m); if (id === null) die('reveal a stage before freezing');
    freezeArtifacts(id, m.stages[id]);
    console.log(`atlas-gcp-eval: froze stage ${id} (${Object.keys(m.stages[id].hashes).length} files)`);
  } else if (o.command === 'judge-prompt') {
    const id = currentStage(m); if (id === null || !m.stages[id].frozen) die('freeze the current stage before requesting judgment');
    writeJudgePrompt(id, m.stages[id], acceptanceIds(cases, id), readFileSync(join(stageDir(o.run, id), 'input.md'), 'utf8'), cases.stages.slice(0, id - 1).map(s => join(stageDir(o.run, s.id), 'frozen')));
    console.log(join(stageDir(o.run, id), 'judge-prompt.md'));
  } else if (o.command === 'record-judgment') {
    const id = currentStage(m); if (id === null || !m.stages[id].frozen) die('freeze the current stage before recording judgment');
    recordJudgment(id, m.stages[id], acceptanceIds(cases, id));
    console.log(`atlas-gcp-eval: recorded stage ${id}; passEligible=${m.stages[id].passEligible}`);
  } else if (o.command === 'report') {
    for (const [key, state] of Object.entries(m.stages)) if (state.frozen) assertFrozen(o.run, state, Number(key));
    const stages = cases.stages.map(s => {
      const state = m.stages[s.id];
      const status = state?.judgment ? 'complete' : state?.revealed ? 'in-progress' : (currentStage(m) && s.id < currentStage(m) ? 'skipped' : 'not-run');
      const judgment = state?.judgment ? json(join(stageDir(o.run, s.id), 'judgment.json')) : null;
      const result = judgment ? (judgment.verdict === 'blocked' ? 'blocked' : judgment.verdict === 'pass' && state.passEligible ? 'pass' : 'revise') : null;
      return { id: s.id, title: s.title, status, result, verdict: state?.verdict ?? null, passEligible: state?.passEligible ?? null,
        scores: judgment ? Object.fromEntries(judgment.personas.map(p => [p.id, p.scores])) : null,
        findings: judgment?.personas.flatMap(p => p.findings.map(f => ({ persona: p.id, ...f }))) ?? [],
        requirementChecks: judgment?.requirementChecks ?? [], regressionFindings: judgment?.regressionFindings ?? [] };
    });
    const overviewJudgment = m.overview?.judgment ? json(join(stageDir(o.run, OVERVIEW), 'judgment.json')) : null;
    const overview = { status: overviewJudgment ? 'complete' : m.overview?.revealed ? 'in-progress' : 'not-run', result: overviewJudgment ? (overviewJudgment.verdict === 'blocked' ? 'blocked' : overviewJudgment.verdict === 'pass' && m.overview.passEligible ? 'pass' : 'revise') : null, passEligible: m.overview?.passEligible ?? null,
      scores: overviewJudgment ? Object.fromEntries(overviewJudgment.personas.map(p => [p.id, p.scores])) : null,
      findings: overviewJudgment?.personas.flatMap(p => p.findings.map(f => ({ persona: p.id, ...f }))) ?? [],
      requirementChecks: overviewJudgment?.requirementChecks ?? [], regressionFindings: overviewJudgment?.regressionFindings ?? [] };
    const report = { schema: 1, run: o.run, generatedAt: new Date().toISOString(), stages, finalOverview: overview };
    save(join(o.run, 'report.json'), report);
    writeFileSync(join(o.run, 'report.md'), ['# Atlas GCP evaluation report', '', 'This is a single-run, LLM-assisted design review. It does not establish GCP deployment, model diversity, statistical reliability, or benefit over a no-skill control.', '', '| Stage | Execution | Result | Pass eligible |', '|---|---|---|---|', ...stages.map(s => `| ${s.id}. ${s.title} | ${s.status} | ${s.result ?? '—'} | ${s.passEligible ?? '—'} |`), '',
      ...stages.filter(s => s.scores).flatMap(s => [`## Stage ${s.id}: ${s.title}`, '', '| Persona | Clarity | Complexity management | Understandability |', '|---|---|---|---|', ...Object.entries(s.scores).map(([p, scores]) => `| ${p} | ${scores.clarity} | ${scores.complexity} | ${scores.understandability} |`), '', ...s.findings.map(f => `- **${f.severity} / ${f.persona}:** ${f.issue} Recommendation: ${f.recommendation} Evidence: ${f.path}, ${f.location}.`), ...s.regressionFindings.map(f => `- **Regression:** ${f}`), '', `[Full judgment](stages/${String(s.id).padStart(2, '0')}/judgment.json) · [PDF](stages/${String(s.id).padStart(2, '0')}/frozen/reference-architecture.pdf)`, '']), ''].join('\n'));
    const overviewLines = ['## Final integrated overview', '', `Execution: ${overview.status}. Result: ${overview.result ?? 'not judged'}.`, ''];
    if (overview.scores) overviewLines.push('| Persona | Clarity | Complexity management | Understandability |', '|---|---|---|---|', ...Object.entries(overview.scores).map(([p, scores]) => `| ${p} | ${scores.clarity} | ${scores.complexity} | ${scores.understandability} |`), '', ...overview.findings.map(f => `- **${f.severity} / ${f.persona}:** ${f.issue} Recommendation: ${f.recommendation} Evidence: ${f.path}, ${f.location}.`), ...overview.regressionFindings.map(f => `- **Regression:** ${f}`), '', '[Full judgment](final-overview/judgment.json) · [PDF](final-overview/frozen/reference-architecture.pdf)');
    writeFileSync(join(o.run, 'report.md'), readFileSync(join(o.run, 'report.md'), 'utf8') + overviewLines.join('\n') + '\n');
    console.log(join(o.run, 'report.json'));
  } else die(`unknown command ${o.command}`);
}
