import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { root, walk, read, frontmatter, frontmatterModel } from '../helpers.mjs';

const script = join(root, 'scripts/opencode-openai.mjs');

test('OpenAI backup derives every GPT binding and effort without changing Fable', () => {
  const result = spawnSync(process.execPath, [script, '--dry-run'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const actual = JSON.parse(result.stdout).agent;
  const expected = {};
  for (const file of walk('adapters/opencode/agents', p => p.endsWith('.md'))) {
    const model = frontmatterModel(read(file));
    if (!model?.startsWith('github-copilot/gpt-')) continue;
    const name = file.split('/').pop().replace(/\.md$/, '');
    const variant = frontmatter(read(file)).match(/^variant: (\S+)$/m)?.[1];
    expected[name] = { model: model.replace('github-copilot/', 'openai/'), ...(variant ? { variant } : {}) };
  }
  assert.ok(Object.keys(expected).length > 0);
  assert.deepEqual(actual, expected);
  assert.equal(actual.ui, undefined);
  assert.equal(actual['work-sonnet'], undefined);
});

test('UI backup is opt-in and uses the registry binding without replacing Claude verification', () => {
  const result = spawnSync(process.execPath, [script, '--ui-backup', '--dry-run'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const actual = JSON.parse(result.stdout).agent;
  const registry = JSON.parse(read('skills/developer/model-routing/models.md').match(/```json\n([\s\S]*?)\n```/)[1]);
  const { model, variant, verifier } = registry.fallbacks.ui;
  assert.deepEqual(actual.ui, { model, variant });
  assert.equal(model, 'openai/gpt-6-astra');
  assert.equal(variant, 'high');
  assert.equal(actual[verifier], undefined);
  assert.match(frontmatterModel(read(`adapters/opencode/agents/${verifier}.md`)), /^github-copilot\/claude-/);
  const ui = read('adapters/opencode/agents/ui.md');
  assert.match(frontmatter(ui), /^    verify: allow$/m);
  assert.match(ui, /OpenAI backup implements, invoke `verify` instead/);
});

test('Zen backup keeps Fable and uses subscription GPT verification', () => {
  const result = spawnSync(process.execPath, [script, '--ui-zen', '--dry-run'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const actual = JSON.parse(result.stdout).agent;
  const registry = JSON.parse(read('skills/developer/model-routing/models.md').match(/```json\n([\s\S]*?)\n```/)[1]);
  const { model, variant, verifier } = registry.fallbacks.ui_zen;
  assert.deepEqual(actual.ui, { model, variant });
  assert.equal(model, 'opencode/claude-fable-5-1');
  assert.equal(variant, 'high');
  assert.equal(verifier, 'verify-gpt');
  assert.match(actual[verifier].model, /^openai\/gpt-/);
  assert.equal(actual.verify, undefined);
});

test('OpenAI backup requires OAuth, preserves config and arguments, and propagates failure', () => {
  const dir = mkdtempSync(join(tmpdir(), 'opencode-openai-'));
  try {
    mkdirSync(join(dir, 'opencode'));
    mkdirSync(join(dir, 'bin'));
    writeFileSync(join(dir, 'bin/opencode'), `#!${process.execPath}
console.log(JSON.stringify({config: JSON.parse(process.env.OPENCODE_CONFIG_CONTENT), args: process.argv.slice(2), apiKey: process.env.OPENAI_API_KEY ?? null}));
process.exit(17);
`, { mode: 0o755 });
    const env = { ...process.env, XDG_DATA_HOME: dir, PATH: `${join(dir, 'bin')}:${process.env.PATH}`, OPENAI_API_KEY: 'test-api-key',
      OPENCODE_CONFIG_CONTENT: JSON.stringify({ agent: { sdlc: { permission: { edit: 'deny' } }, ui: { model: 'github-copilot/claude-fable-5.1' } }, theme: 'test' }) };
    delete env.OPENCODE_API_KEY;
    const run = () => spawnSync(process.execPath, [script, 'run', '--agent', 'sdlc', 'a prompt with spaces'], { env, encoding: 'utf8' });
    assert.equal(run().status, 1, 'missing auth must fail before launch');
    writeFileSync(join(dir, 'opencode/auth.json'), JSON.stringify({ openai: { type: 'api', key: 'secret-test-key' } }));
    const api = run();
    assert.equal(api.status, 1);
    assert.match(api.stderr, /must use ChatGPT Pro\/Plus OAuth/);
    assert.ok(!api.stderr.includes('secret-test-key'));
    writeFileSync(join(dir, 'opencode/auth.json'), JSON.stringify({ openai: { type: 'oauth', access: 'test-token' } }));
    const result = run();
    assert.equal(result.status, 17, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.config.agent.sdlc.model, 'openai/gpt-5.6-sol');
    assert.deepEqual(output.config.agent.sdlc.permission, { edit: 'deny' });
    assert.equal(output.config.agent.ui.model, 'github-copilot/claude-fable-5.1');
    assert.equal(output.config.theme, 'test');
    assert.deepEqual(output.args, ['run', '--agent', 'sdlc', 'a prompt with spaces']);
    assert.equal(output.apiKey, null);
    const backup = spawnSync(process.execPath, [script, '--ui-backup', '--agent', 'ui'], { env, encoding: 'utf8' });
    assert.equal(backup.status, 17);
    const backupOutput = JSON.parse(backup.stdout);
    assert.equal(backupOutput.config.agent.ui.model, 'openai/gpt-6-astra');
    assert.deepEqual(backupOutput.args, ['--agent', 'ui']);
    assert.match(backup.stderr, /GPT agents and UI/);
    const zen = () => spawnSync(process.execPath, [script, '--ui-zen', '--agent', 'ui'], { env, encoding: 'utf8' });
    assert.equal(zen().status, 1, 'Zen launch must require separate credentials');
    env.OPENCODE_API_KEY = 'test-zen-key';
    const zenResult = zen();
    assert.equal(zenResult.status, 17);
    assert.equal(JSON.parse(zenResult.stdout).config.agent.ui.model, 'opencode/claude-fable-5-1');
    assert.match(zenResult.stderr, /separate Zen billing/);
    assert.ok(!zenResult.stderr.includes('test-zen-key'));
    delete env.OPENCODE_API_KEY;
    writeFileSync(join(dir, 'opencode/auth.json'), JSON.stringify({ openai: { type: 'oauth' }, opencode: { type: 'api', key: 'test-zen-key' } }));
    assert.equal(zen().status, 17, 'stored Zen credentials also permit launch');
    env.OPENCODE_CONFIG_CONTENT = 'invalid-json';
    assert.equal(run().status, 1);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
