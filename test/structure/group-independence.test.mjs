import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readlinkSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { root, read, walk } from '../helpers.mjs';

// ADR 0007: each group is independently installable. Any group may reference
// `core`; no group may reference any other group; `core` references no group.
// Skill directory basenames are unique repository-wide, because every tool this
// repository supports installs skills into one flat namespace.

const GROUPS = readdirSync(join(root, 'skills'))
  .filter((entry) => statSync(join(root, 'skills', entry)).isDirectory());

// Every promoted skill, as { rel, group, name }, discovered from the tree rather
// than from the manifest, so a skill added without a manifest entry is still checked.
const SKILLS = walk('skills', (p) => p.endsWith('SKILL.md')).map((p) => {
  const parts = p.split('/');
  return { rel: parts.slice(0, -1).join('/'), group: parts[1], name: parts[parts.length - 2] };
});

test('no two promoted skills share a directory basename', () => {
  const byName = new Map();
  for (const skill of SKILLS) {
    const seen = byName.get(skill.name);
    assert.ok(
      seen === undefined,
      `duplicate skill basename "${skill.name}": ${seen} and ${skill.rel}. ` +
        'Installation targets are one flat namespace in every supported tool, so the ' +
        'second skill silently overwrites the first. Rename one of them.',
    );
    byName.set(skill.name, skill.rel);
  }
  assert.equal(byName.size, SKILLS.length);
});

// A lone --skill selects no group, so the script's group list ends up empty.
// That is the one path where the deduped arrays are empty, and an empty array
// is exactly what bash 3.2 refuses to expand unguarded under `set -u` — the
// full-install case above never reaches it.
test('link-skills.sh links a single skill and no group doctrine', () => {
  const dir = mkdtempSync(join(tmpdir(), 'link-skills-one-'));
  try {
    const skill = SKILLS.find(({ rel }) => !/^requires:/m.test(read(`${rel}/SKILL.md`)));
    assert.ok(skill, 'the fixture needs one promoted skill without a declared dependency');
    const result = spawnSync('bash', [join(root, 'scripts/link-skills.sh'), '--skill', skill.name, '--target', dir],
      { encoding: 'utf8' });
    assert.equal(result.status, 0, `link-skills.sh --skill failed: ${result.stdout}${result.stderr}`);

    const entries = readdirSync(dir);
    assert.deepEqual(entries, [`rahulnakmol-${skill.name}`],
      'a lone --skill must link exactly the one skill it names');
    assert.ok(lstatSync(join(dir, entries[0])).isSymbolicLink());
    assert.match(result.stdout, /Linked 1 skill\(s\) and 0 group doctrine set\(s\)/,
      'an empty group selection must report zero, not one empty entry');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// The mirror of the case above: a charter group with no promoted skills yet,
// selected without core, leaves the skill list empty instead of the group list.
// Both empty-array paths have to survive bash 3.2's `set -u`.
test('link-skills.sh links a charter group with no skills as doctrine only', () => {
  // Built against a synthetic root rather than whichever live group happens to
  // be empty. The previous form found an empty group in the tree and returned
  // early when there was none, so the first promotion into the last charter
  // group would have retired this check in silence — the coverage would end on
  // the day the repository stopped having a spare empty group, not on the day
  // anyone decided the path no longer needed testing. link-skills.sh resolves
  // its root from its own location, so a copy in a temporary tree exercises the
  // real script without touching skills/.
  const fixture = mkdtempSync(join(tmpdir(), 'link-skills-charter-'));
  const dir = mkdtempSync(join(tmpdir(), 'link-skills-out-'));
  try {
    mkdirSync(join(fixture, 'scripts'), { recursive: true });
    mkdirSync(join(fixture, 'skills/charter'), { recursive: true });
    copyFileSync(join(root, 'scripts/link-skills.sh'), join(fixture, 'scripts/link-skills.sh'));
    writeFileSync(join(fixture, 'skills/charter/README.md'), '# Charter\n\nNo skills promoted yet.\n');

    const result = spawnSync(
      'bash',
      [join(fixture, 'scripts/link-skills.sh'), '--group', 'charter', '--no-core', '--target', dir],
      { encoding: 'utf8' },
    );
    assert.equal(result.status, 0, `link-skills.sh --group charter failed: ${result.stdout}${result.stderr}`);
    assert.deepEqual(readdirSync(dir), ['rahulnakmol-charter-doctrine'],
      'a group with no promoted skills must still get its doctrine link, and nothing else');
    assert.match(result.stdout, /Linked 0 skill\(s\) and 1 group doctrine set\(s\)/,
      'an empty skill selection must report zero, not one empty entry');
  } finally {
    rmSync(dir, { recursive: true, force: true });
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('link-skills.sh installs one symlink per promoted skill, overwriting none', () => {
  const dir = mkdtempSync(join(tmpdir(), 'link-skills-'));
  try {
    const result = spawnSync('bash', [join(root, 'scripts/link-skills.sh'), dir], { encoding: 'utf8' });
    assert.equal(result.status, 0, `link-skills.sh failed: ${result.stdout}${result.stderr}`);

    const entries = readdirSync(dir);
    const links = entries.filter((entry) => lstatSync(join(dir, entry)).isSymbolicLink());
    assert.equal(links.length, entries.length, 'the install bucket must contain only symlinks');

    // A full install carries every promoted skill plus one doctrine link per
    // group, which is what makes group-level documents such as GATES.md and
    // VERIFICATION.md resolvable after install rather than only in the repo.
    const skillLinks = links.filter((entry) => !entry.endsWith('-doctrine'));
    const doctrineLinks = links.filter((entry) => entry.endsWith('-doctrine'));
    assert.equal(
      skillLinks.length,
      SKILLS.length,
      `expected ${SKILLS.length} skill symlinks for ${SKILLS.length} promoted skills, found ${skillLinks.length}. ` +
        'A shortfall means two skills collided on one install name and one was overwritten.',
    );
    const groups = [...new Set(SKILLS.map((s) => s.group))];
    assert.equal(doctrineLinks.length, groups.length,
      `expected one doctrine link per group (${groups.length}), found ${doctrineLinks.length}`);

    // Each link resolves to the skill directory it is named after, not to some
    // other group's skill that happened to be linked later.
    for (const skill of SKILLS) {
      const link = join(dir, `rahulnakmol-${skill.name}`);
      assert.ok(existsSync(link), `missing install link for "${skill.name}"`);
      assert.equal(
        readlinkSync(link),
        join(root, skill.rel),
        `install link for "${skill.name}" points somewhere other than ${skill.rel}`,
      );
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// A reference is a path: either a backticked relative path such as
// `grit/LEDGER.md` or `core/VERIFICATION.md`, or a repository path such as
// skills/developer/raise/trackers/ado.md. The leading segment resolves to a
// group either directly (a group name) or through the skill it names. Segments
// that are neither — `scripts/`, `templates/`, `trackers/`, `specs/` — are not
// references to a group and are ignored.
const BACKTICKED_PATH = /`([a-z0-9][a-z0-9-]*)\/([A-Za-z0-9._/-]+\.(?:md|yml|mjs|json|sh))`/g;
const REPOSITORY_PATH = /(?:^|[^A-Za-z0-9/._-])skills\/([a-z][a-z-]*)\/(?:([a-z][a-z-]*)(?=\/|\s|$|[`)]))?/g;

function atlasBrandingException(source, target) {
  return source === 'skills/developer/atlas'
    && ['press', 'branding-system', 'ai-branding', 'catppuccin-branding', 'everforest-branding', 'gruvbox-branding', 'nord-branding', 'solarized-branding'].includes(target);
}

test('the Atlas branding exception excludes unrelated sources and targets', () => {
  for (const target of ['press', 'branding-system', 'ai-branding', 'catppuccin-branding', 'everforest-branding', 'gruvbox-branding', 'nord-branding', 'solarized-branding']) {
    assert.ok(atlasBrandingException('skills/developer/atlas', target));
  }
  for (const source of ['skills/developer/atlas-azure', 'skills/developer/atlas-aws', 'skills/developer/atlas-gcp', 'skills/developer/atlas-extra', 'skills/pm/atlas']) {
    assert.ok(!atlasBrandingException(source, 'press'));
  }
  assert.ok(!atlasBrandingException('skills/developer/architect', 'press'));
  assert.ok(!atlasBrandingException('skills/developer/atlas', 'exhibit'));
  assert.ok(!atlasBrandingException('skills/core/research', 'press'));
});

test('declared skill dependencies obey group boundaries and the narrow Atlas exception', () => {
  for (const skill of SKILLS) {
    const dependencies = read(`${skill.rel}/SKILL.md`).match(/^requires:\s*(.+)$/m)?.[1]?.split(',') ?? [];
    for (const raw of dependencies) {
      const dependency = raw.trim();
      const target = groupOfSkill(dependency);
      assert.ok(target, `${skill.rel}: unknown dependency ${dependency}`);
      assert.ok(target === skill.group || (target === 'core' && skill.group !== 'core')
        || atlasBrandingException(skill.rel, dependency), `${skill.rel}: prohibited dependency ${dependency}`);
    }
  }
});

function groupOfSkill(name) {
  return SKILLS.find((skill) => skill.name === name)?.group;
}

function referencedGroup(head) {
  if (GROUPS.includes(head)) return head;
  return groupOfSkill(head);
}

function crossGroupReferences(relPath) {
  const ownGroup = relPath.split('/')[1];
  const body = read(relPath);
  const found = [];
  for (const pattern of [BACKTICKED_PATH, REPOSITORY_PATH]) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(body)) !== null) {
      const target = referencedGroup(match[1]);
      if (!target) continue;
      if (target === ownGroup) continue;
      if (target === 'core' && ownGroup !== 'core') continue;
      const targetSkill = pattern === REPOSITORY_PATH ? match[2] : match[1];
      if (target === 'branding' && atlasBrandingException(relPath.split('/').slice(0, 3).join('/'), targetSkill)) continue;
      found.push({ text: match[0].trim(), target });
    }
  }
  return { ownGroup, found };
}

const GROUP_DOCS = walk('skills', (p) => p.endsWith('.md'));

test('no group references another group, and core references none', () => {
  assert.ok(GROUP_DOCS.length >= 100, `expected the scan to cover the skills tree, found ${GROUP_DOCS.length} files`);
  const violations = [];
  for (const relPath of GROUP_DOCS) {
    const { ownGroup, found } = crossGroupReferences(relPath);
    for (const ref of found)
      violations.push(`${relPath} (${ownGroup}) references the ${ref.target} group: ${ref.text}`);
  }
  assert.deepEqual(
    violations,
    [],
    'ADR 0007: any group may reference core, no group may reference another group, and core references none.\n' +
      violations.join('\n'),
  );
});

test('the shared doctrine core carries is reachable from every group that reads it', () => {
  for (const doc of ['VERIFICATION.md', 'COVERAGE.md', 'GRILL.md', 'VALUE.md'])
    assert.ok(existsSync(join(root, 'skills/core', doc)), `missing skills/core/${doc}`);
  // The pre-move locations are gone, so a reference to one fails loudly rather
  // than resolving against a file that was left behind.
  const stale = [
    'skills/developer/shakedown/VERIFICATION.md',
    'skills/developer/shakedown/COVERAGE.md',
    'skills/developer/impact/GRILL.md',
    'skills/developer/impact/VALUE.md',
    'skills/developer/grit',
  ];
  for (const path of stale)
    assert.ok(!existsSync(join(root, path)), `${path} should have moved into core`);
});
