# Model research log

Append-only notes from `update-models` runs. Canonical assignments live in `../model-routing/models.md`.

## Template entry

```markdown
### YYYY-MM-DD — <trigger>

- Sources consulted:
- Changes proposed:
- Rejected candidates (why):
```

## Seed (from dotfiles model-research.md)

Last reviewed: 2026-07-23 — historical Copilot/OpenCode assignments captured during dotfiles era; v0.1 registry re-baselines on Anthropic/OpenAI/Google published defaults.

See git history of `model-research.md` in dotfiles4macOS for full evidence table.

### 2026-09-05 — User-selected frontend and UI/UX policy

- Sources consulted: [Anthropic model documentation](https://platform.claude.com/docs/en/models/fable-5-1/overview), [GitHub supported models and retention terms](https://docs.github.com/en/copilot/reference/ai-models/supported-models), and the [models.dev catalog](https://models.dev/api.json), retrieved September 5, 2026.
- Before: the OpenCode `ui` agent used `github-copilot/claude-sonnet-5` at `high`; the registry combined Global and UI at `standard`.
- After: all frontend design, implementation, and UI/UX work routes to `ui`, using `github-copilot/claude-fable-5.1` at `high`. Non-UI defaults remain unchanged. Independent verification stays on `verify-gpt`.
- Evidence: models.dev lists `claude-fable-5.1` under `github-copilot`, with tool calls, image inputs, and `high` effort. Anthropic's direct API spelling is `claude-fable-5-1`. GitHub lists Fable 5.1 as generally available, subject to account and organization access.
- Rationale: explicit user preference, not a claim that repository benchmarks established superiority. Anthropic lists a one-million-token context and standard input/output prices of $10/$50 per million tokens. Copilot billing and availability are host-specific.
- Rejected alternatives: retaining Sonnet for frontend work or silently falling back to a generic worker would violate the requested policy. Other role upgrades remain outside this targeted change.
- Limitations: no authenticated OpenCode model inventory or live Fable smoke test was available in this orb. Public catalog evidence does not prove account access or installed-client compatibility. GitHub documents retention of Fable prompts and outputs by default; confirm applicable retention terms and organization enablement before use. Fable also changes forced tool use and thinking-history compatibility.
- Installation: reinstall the OpenCode adapters and restart OpenCode to pick up copied bindings. Hosts unable to select Fable must report that limitation and request a handoff. Existing headless workflows that cannot hand off to the primary `ui` agent must block frontend assignments instead of using a generic worker.
- Next review triggers: account availability, client compatibility, retention-policy changes, unsupported effort, or regressions in rendered frontend outcomes. The full-registry review date is unchanged because only UI policy was updated.

### 2026-09-05 — OpenAI subscription backup for Copilot availability failures

- Sources consulted: [OpenCode's built-in ChatGPT OAuth implementation](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/plugin/openai/codex.ts), [provider documentation](https://opencode.ai/docs/providers/), and [models.dev](https://models.dev/api.json).
- Changes proposed: retain Copilot defaults and add an explicit session launcher that changes GPT agent provider bindings to `openai`, preserving model IDs and efforts. Require ChatGPT Pro/Plus OAuth; do not configure API-key billing. Keep Fable and all other Claude bindings unchanged.
- Evidence: the public OpenAI catalog lists the currently bound Sol, Terra, and Luna IDs with the efforts used by these adapters. OpenCode's built-in subscription integration filters its model catalog and routes OAuth requests through the ChatGPT Codex endpoint. A public listing and a local OAuth credential do not prove live account entitlement.
- Rejected alternatives: automatic cross-provider replay, which OpenCode does not natively configure and which could repeat mutations; invented fallback schema fields; API-key or Zen-credit billing instead of the requested subscription.
- Limitations: subscription login and live execution require the user's OpenCode installation. The launcher is session-scoped and does not apply to the separate workflow runner or an existing server. Check account availability and installed model variants before use. No whole-registry model review is claimed.

### 2026-09-05 — Availability backup for Fable UI work

- Trigger: the user requested a backup when Fable 5.1 is unavailable. This supersedes the earlier requirement to stop without a UI model alternative; Fable remains the primary choice.
- Sources consulted: [OpenAI Astra documentation](https://developers.openai.com/api/docs/models/gpt-6-astra) and [models.dev](https://models.dev/api.json). Both list `gpt-6-astra` with `high` reasoning support; OpenAI documents coding, image input, and tool calling. Account availability still requires a live check.
- Changes proposed: add `openai/gpt-6-astra` at `high` as the explicit UI fallback in the machine registry. The existing subscription launcher reads it only when `--ui-backup` is supplied. Normal sessions retain Fable; no automatic replay occurs.
- Rationale: use a different provider path so a Fable availability failure need not block frontend implementation. Preserve the UI contract and switch independent verification to the existing Claude-backed `verify` agent when Astra implements. This is an availability policy, not a measured claim of equivalent design quality.
- Limitations: a Copilot-wide outage can still block the Claude verifier. Do not claim completion without independent verification. The backup requires subscription entitlement and compatible OpenCode support; no live authenticated execution was available in this orb. No API billing, additional fallback, or headless-runner support is introduced.

### 2026-09-05 — Fable through OpenCode Zen before Astra

- Trigger: the user authorized OpenCode Zen as another Fable route. Preferred order is now Copilot Fable, Zen Fable, then subscription Astra. This supersedes the earlier restriction against an additional paid UI provider; OpenAI API-key billing remains excluded.
- Sources consulted: the live [Zen model endpoint](https://opencode.ai/zen/v1/models) lists `claude-fable-5-1`; [models.dev](https://models.dev/api.json) lists that ID under `opencode`, with `high` effort and `OPENCODE_API_KEY` authentication support.
- Changes proposed: the registry records `opencode/claude-fable-5-1` at `high` with `verify-gpt`. The launcher's `--ui-zen` mode selects it explicitly while routing GPT agents through the OpenAI subscription. Normal sessions and the existing Astra option remain unchanged.
- Billing and verification: Zen requires its own credential and billing arrangement, separate from ChatGPT Pro. This mode requires both Zen authentication and OpenAI OAuth. Fable remains the implementer, so GPT remains the independent verifier. Other Claude specialists still depend on Copilot availability.
- Limitations: no credentials, credits, or billable requests were created. Public catalog presence does not prove account access, credit availability, retention terms, or installed-client support. Session switching remains explicit; no automatic replay or separate headless-runner support is added.
