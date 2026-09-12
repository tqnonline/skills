import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readlinkSync, rmSync, existsSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { root, read, walk } from '../helpers.mjs';

test('Atlas is one public skill with explicit cloud confirmation before provider loading', () => {
  assert.deepEqual(walk('skills', p => p.endsWith('/SKILL.md') && p.includes('/atlas')), ['skills/developer/atlas/SKILL.md']);
  const body = read('skills/developer/atlas/SKILL.md');
  assert.match(body, /^name: atlas$/m);
  assert.match(body, /^requires: press$/m);
  assert.match(body, /Which cloud platform should this architecture target: Azure, AWS, or GCP\?/);
  assert.match(body, /Wait for the user's explicit answer, even if a platform was named earlier/);
  assert.match(body, /Never infer it from the skill name, repository, service names, or prior artifacts/);
  assert.match(body, /Do not deploy or provision resources on Azure, AWS, or GCP/);
  for (const provider of ['azure', 'aws', 'gcp']) {
    assert.ok(body.includes(`providers/${provider}/GUIDE.md`));
    assert.ok(!existsSync(join(root, `skills/developer/atlas-${provider}`)));
    const guide = read(`skills/developer/atlas/providers/${provider}/GUIDE.md`);
    assert.doesNotMatch(guide, /^name:|hand off to the matching Atlas provider skill/m);
    assert.match(guide, /relative to this provider directory/);
  }
});

test('Atlas and developer installations include all providers and Press, not legacy skills', () => {
  for (const args of [['--skill', 'atlas'], ['--group', 'developer']]) {
    const target = mkdtempSync(join(tmpdir(), 'atlas-install-'));
    try {
      const result = spawnSync('bash', [join(root, 'scripts/link-skills.sh'), ...args, '--target', target], { encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      assert.equal(readlinkSync(join(target, 'rahulnakmol-press')), join(root, 'skills/branding/press'));
      assert.equal(readlinkSync(join(target, 'rahulnakmol-atlas')), join(root, 'skills/developer/atlas'));
      assert.ok(!readdirSync(target).some(name => /atlas-|branding-system|branding$|exhibit/.test(name)));
      // Copy out of the repository to catch imports that rely on adjacent skills.
      const installed = join(target, 'isolated-atlas');
      cpSync(join(root, 'skills/developer/atlas'), installed, { recursive: true });
      for (const provider of ['azure', 'aws', 'gcp']) {
        const help = spawnSync('python3', ['-B', join(installed, 'providers', provider, 'scripts/assemble.py'), '--help'], { cwd: target, encoding: 'utf8' });
        assert.equal(help.status, 0, help.stderr);
        assert.match(help.stdout, /--model/);
      }
    } finally { rmSync(target, { recursive: true, force: true }); }
  }
});
