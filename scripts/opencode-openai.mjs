#!/usr/bin/env node
// Session-only backup for the repository's OpenAI agents. No automatic retries.
import { readFileSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const uiBackup = args[0] === '--ui-backup';
const uiZen = args[0] === '--ui-zen';
if (uiBackup || uiZen) args.shift();
const agent = {};
for (const file of readdirSync(join(root, 'adapters/opencode/agents')).sort()) {
  if (!file.endsWith('.md')) continue;
  const body = readFileSync(join(root, 'adapters/opencode/agents', file), 'utf8');
  const fm = body.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const model = fm.match(/^model: github-copilot\/(gpt-[^\s]+)$/m)?.[1];
  if (!model) continue;
  const variant = fm.match(/^variant: (\S+)$/m)?.[1];
  agent[basename(file, '.md')] = { model: `openai/${model}`, ...(variant ? { variant } : {}) };
}

if (uiBackup || uiZen) {
  const registry = readFileSync(join(root, 'skills/developer/model-routing/models.md'), 'utf8');
  const fallbacks = JSON.parse(registry.match(/```json\n([\s\S]*?)\n```/)[1]).fallbacks;
  const { model, variant } = uiZen ? fallbacks.ui_zen : fallbacks.ui;
  agent.ui = { model, variant };
}

function fail(message) {
  console.error(`opencode-openai: ${message}`);
  process.exit(1);
}

if (args[0] === '--dry-run') {
  // Print only the generated overlay, never existing configuration or credentials.
  console.log(JSON.stringify({ agent }, null, 2));
  process.exit(0);
}
if (args[0] === '--help') {
  console.log('Usage: node scripts/opencode-openai.mjs [--ui-backup | --ui-zen] [--dry-run | OpenCode arguments...]');
  console.log('Connect OpenAI with ChatGPT Pro/Plus using opencode auth login first.');
  console.log('--ui-zen also requires OpenCode Zen authentication and uses separate Zen billing for UI.');
  process.exit(0);
}

let auth;
try {
  auth = JSON.parse(readFileSync(join(process.env.XDG_DATA_HOME || join(homedir(), '.local/share'), 'opencode/auth.json'), 'utf8'));
} catch {
  fail('Cannot read OpenCode authentication. Run opencode auth login and select OpenAI → ChatGPT Pro/Plus.');
}
if (auth.openai?.type !== 'oauth') {
  fail('OpenAI must use ChatGPT Pro/Plus OAuth, not an API key. Run opencode auth login.');
}
if (uiZen && !process.env.OPENCODE_API_KEY && !(auth.opencode?.type === 'api' && auth.opencode.key)) {
  fail('Zen UI backup requires OpenCode Zen authentication. Connect Zen in OpenCode; Zen uses separate billing.');
}

let config;
try {
  config = JSON.parse(process.env.OPENCODE_CONFIG_CONTENT || '{}');
  if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error();
} catch {
  fail('OPENCODE_CONFIG_CONTENT must be a JSON object; it was not changed.');
}
config.agent ??= {};
for (const [name, binding] of Object.entries(agent)) {
  config.agent[name] = { ...config.agent[name], ...binding };
}

const env = { ...process.env, OPENCODE_CONFIG_CONTENT: JSON.stringify(config) };
delete env.OPENAI_API_KEY;
console.error(`OpenAI subscription backup enabled for ${uiBackup ? 'GPT agents and UI' : 'GPT agents only'}. No automatic retry or saved configuration change.`);
if (uiZen) console.error('UI uses Fable through OpenCode Zen with separate Zen billing; GPT verification uses the OpenAI subscription.');
const result = spawnSync('opencode', args, { env, stdio: 'inherit' });
if (result.error) fail('Could not launch opencode. Install OpenCode and ensure it is on PATH.');
process.exit(result.status ?? 1);
