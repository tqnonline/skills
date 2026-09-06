# Opencode adapter

# OpenCode adapter

- **Agents:** `agents/*.md` — SDLC fleet (workers, verifiers, specialists)
- **Commands:** `commands/*.md` — slash commands including SDLC and legacy caveman shims
- **Workflows:** `../../tools/opencode-workflows/` — headless runner + templates

Install: `../../scripts/install-adapters.sh --tool opencode`

## OpenAI subscription backup

Keep GitHub Copilot as the normal provider. If a GPT model is unavailable there, use the OpenAI provider with ChatGPT Pro/Plus sign-in. This is subscription access, not OpenAI API-key billing or OpenCode Zen credit billing. OpenCode has no native cross-provider retry chain; the backup below is an explicit session switch.

On the machine that runs OpenCode, install the repository's adapters first. Then run:

```bash
opencode auth login
```

Select **OpenAI**, then **ChatGPT Pro/Plus (browser)** or **ChatGPT Pro/Plus (headless)**. Complete the interactive sign-in yourself. Do not choose API-key authentication for this backup. Never put credentials in this repository.

Check the connected catalog before using the backup:

```bash
opencode models openai
```

Confirm the exact models and reasoning levels your agents need are available to your account. Public catalog listings do not establish subscription entitlement. Upgrade OpenCode if its built-in subscription integration does not expose the required models; do not invent model IDs or change billing methods to bypass an access failure.

From the skills checkout, preview or start the backup session:

```bash
node scripts/opencode-openai.mjs --dry-run
node scripts/opencode-openai.mjs
```

The launcher derives its model and effort overrides from the shipped GPT agent bindings. It changes only their provider from `github-copilot` to `openai`, requires a stored OAuth credential, and removes `OPENAI_API_KEY` from the child process environment. It preserves other inline configuration, including permissions, and does not write configuration or credentials. Without a UI flag, Fable and other Claude bindings stay on Copilot. Run ordinary `opencode` to return to normal routing.

Pass OpenCode arguments after the script name, for example `node scripts/opencode-openai.mjs --agent sdlc`. Invoke the script by its absolute path when working in another repository; it preserves the working directory. A dry run prints only the generated overlay and does not inspect account access.

Use this after a provider availability, access, or quota failure, not after a failed test or a model refusal. Inspect the session and working tree before continuing partially completed work. The launcher does not replay failed turns, downgrade models, or remove subscription limits. Custom provider endpoints and authentication plugins are outside this launcher's guarantees.

This launcher covers OpenCode sessions, not the separate `tools/opencode-workflows/runner.mjs`, which supplies its own inline configuration to child processes. Do not assume the backup applies to that runner or to an already-running server.

References: [OpenCode providers](https://opencode.ai/docs/providers/), [built-in ChatGPT authentication](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/plugin/openai/codex.ts), and [OpenCode model configuration](https://opencode.ai/docs/models/).

## Fable availability backup

Fable 5.1 remains the preferred frontend and UI/UX model. Use Copilot first, then Fable through OpenCode Zen, then GPT-6 Astra through the OpenAI subscription if neither Fable route is available. Reinstall the current UI adapter so its backup verification instructions are present.

For Zen, connect **OpenCode Zen** through `opencode auth login` or `/connect` in OpenCode, using your Zen key. The launcher accepts a stored Zen API credential or `OPENCODE_API_KEY`; never commit either. Zen has separate billing and is not covered by ChatGPT Pro. This session also requires the OpenAI subscription login for GPT agents and independent verification. Confirm `opencode/claude-fable-5-1` in `opencode models opencode` before use.

```bash
node scripts/opencode-openai.mjs --ui-zen --dry-run
node scripts/opencode-openai.mjs --ui-zen --agent ui
```

Place `--ui-zen` first and do not combine it with `--ui-backup`. Zen keeps the UI agent on Fable at high effort, with `verify-gpt` using the OpenAI subscription. Other Claude agents remain on Copilot. Confirm Zen access, credit availability, and applicable data-retention terms before sending project data.

If both Fable routes are unavailable, confirm `openai/gpt-6-astra` appears in your connected catalog and use:

```bash
node scripts/opencode-openai.mjs --ui-backup --dry-run
node scripts/opencode-openai.mjs --ui-backup --agent ui
```

Place `--ui-backup` first. This adds the registry's UI backup binding to the GPT-provider overrides for that session. It leaves the UI agent's design, implementation, and evidence requirements intact. After Astra implements, the UI agent must invoke the Claude-backed `verify` agent instead of the GPT verifier. If a Copilot outage also makes that verifier unavailable, work must stop at verification rather than claim completion.

The same limits apply: this is an explicit switch, not automatic failure detection or replay, and it does not apply to the separate headless workflow runner. Neither a failed test nor a refusal is an availability failure. If Astra is unavailable too, stop and report the missing capability; do not add an unapproved fallback or paid API endpoint.
