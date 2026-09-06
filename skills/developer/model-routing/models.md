# Model registry (canonical)

**Policy:** Published defaults use **Anthropic, OpenAI, and Google** providers only. Local overrides may add other providers; do not commit non-allowlist IDs as shipped defaults.

Last reviewed: 2026-08-22

## Tier matrix

| Tier | Role shape | Default provider family | Notes |
|------|------------|-------------------------|-------|
| orchestrator | Loop/graph routing, consequential decisions | OpenAI | Escalate effort on challenge paths |
| worker-fast | Bounded implementation, small diffs | Anthropic | Single writer per work item |
| worker-deep | Multi-file features, refactors | Anthropic | Pair with verifier |
| ui | All frontend design, implementation, and UI/UX work | Anthropic | Takes precedence over generic worker tiers |
| verifier | Read-only cross-check | Anthropic | Different family from implementer when possible |
| architect | Cross-cutting design, ADRs | Anthropic | Critical review tier optional |
| security | Threat modeling, hardening | OpenAI | Critical review tier optional |
| quality-operate | Release readiness, SLO work | OpenAI | Cost-balanced |
| research | Docs, recon synthesis | OpenAI | Not for authoritative registry edits |
| long-context-worker | Broad-repository, million-token workloads | OpenAI | See `long-context-worker` note below |
| small | Titles, summaries | Anthropic | Haiku-class |

## Role → default mapping (published)

| Role | Model ID | Effort |
|------|----------|--------|
| Global (non-UI) | `claude-sonnet-5` | standard |
| Frontend design, implementation, UI and UX | `claude-fable-5.1` | high |
| SDLC orchestrator | `gpt-5.6-sol` | high |
| SDLC orchestrator challenge | `gpt-5.6-sol` | xhigh |
| SDLC workers — sonnet, long-context, model-diverse roles | `claude-sonnet-5` | high |
| SDLC worker (luna, cost-efficient) | `gpt-5.6-luna` | medium |
| SDLC verifier | `claude-opus-4.8` | xhigh |
| Architect | `claude-opus-4.8` | xhigh |
| Security assessor | `gpt-5.6-sol` | xhigh |
| Quality / operate | `gpt-5.6-terra` | high |
| Research / review | `gpt-5.6-terra` | standard |

> Adapter files map host-specific IDs (Copilot display names, Cursor `auto`, etc.) to these tiers. Amp binds a tier to one of its modes (`low`, `medium`, `high`, `ultra`) and chooses the model behind the mode itself; no model ID is pinned there.

## Frontend and UI/UX routing

User-selected policy, reviewed September 5, 2026: use Claude Fable 5.1 at high effort for all frontend design, frontend implementation, user interface (UI), and user experience (UX) work. This includes layouts, components, interaction design, accessibility, responsive states, visual systems, and frontend fixes. Select the `ui` tier before considering generic worker tiers. Split mixed frontend/backend work into separate assignments; keep unrelated backend work on its existing tier.

The OpenCode binding is `github-copilot/claude-fable-5.1`; the direct Anthropic API ID is `claude-fable-5-1`. These spellings are host-specific, not interchangeable. Use the `ui` primary agent in OpenCode and `verify-gpt` for independent verification when Fable implements.

The preferred availability order is Fable 5.1 through Copilot, then the same model through OpenCode Zen, then Astra through the OpenAI subscription. Zen's exact binding is `opencode/claude-fable-5-1` at `high`. Activate it with `node scripts/opencode-openai.mjs --ui-zen --agent ui`; this retains Fable for UI work and routes GPT agents, including `verify-gpt`, through the OpenAI subscription. Zen requires separate authentication and billing; ChatGPT Pro does not pay for Zen requests.

If neither Fable route is available, the approved model backup is `openai/gpt-6-astra` at `high` through ChatGPT Pro/Plus OAuth. Activate it explicitly with `node scripts/opencode-openai.mjs --ui-backup --agent ui`. Keep the UI agent's design and implementation contract, but use the Claude-backed `verify` agent for independent verification after Astra implements. Report the switch and its availability reason. If Astra or the independent verifier is unavailable, stop and request a handoff; do not select another model silently. A Copilot-wide outage may also block the Claude verifier, so this backup does not guarantee end-to-end completion during that outage.

GitHub documents different data-retention terms for Fable. Confirm organization enablement and applicable retention policy before sending project data. Public catalog availability does not establish account access. This targeted policy update does not advance the full-registry review date above; evidence and limitations are recorded in `../update-models/RESEARCH.md`.

## OpenAI provider backup

GitHub Copilot remains the normal OpenCode provider. When an OpenAI model is unavailable there, use the same model and supported effort through OpenAI with ChatGPT Pro/Plus OAuth sign-in, not API-key billing. The session launcher `scripts/opencode-openai.mjs` derives these overrides from the GPT adapter bindings; setup and limits are in `adapters/opencode/README.md`.

This is an explicit backup session, not automatic retry. Confirm the model is available to the subscription before use. Do not switch providers to evade a refusal or repeat partially completed work without checking its state. Without a UI flag, the launcher changes no Claude assignment. `--ui-zen` changes the UI provider to Zen; `--ui-backup` changes the UI model to Astra. Other Claude roles remain unchanged. Published primary model IDs and role assignments remain unchanged.

## `long-context-worker` note

`work-k3` and `work-glm` are long-standing role names for the broad-repository / model-diverse worker character. Their shipped default is now `claude-sonnet-5`, same as every other bounded worker — the distinctive long-context or open-model behavior they used to carry by default is available only as a documented user override (below), never as a shipped default. This is a deliberate re-tiering, not a placeholder: the role stays available for parallel-pod work; only the binding changed.

## User override examples (not shipped defaults)

| Role | Example override | When |
|------|------------------|------|
| `work-k3` | Kimi K3 via OpenCode Go (`opencode-go/kimi-k3`) | User-enabled long-context economy runs |
| `work-glm` | GLM 5.2 via OpenCode Go (`opencode-go/glm-5.2`) | User-enabled cost/model-diversity experiments |

## Machine registry

```json
{
  "policy": { "allowed_providers": ["anthropic", "openai", "google"] },
  "published_ids": ["claude-sonnet-5", "claude-fable-5.1", "claude-opus-4.8", "gpt-5.6-sol", "gpt-5.6-terra", "gpt-5.6-luna"],
  "roles": {
    "orchestrator": "gpt-5.6-sol",
    "worker-fast": "claude-sonnet-5",
    "worker-deep": "claude-sonnet-5",
    "verifier": "claude-opus-4.8",
    "architect": "claude-opus-4.8",
    "security": "gpt-5.6-sol",
    "quality-operate": "gpt-5.6-terra",
    "research": "gpt-5.6-terra",
    "ui": "claude-fable-5.1",
    "long-context-worker": "gpt-5.6-luna"
  },
  "fallbacks": {
    "ui_zen": { "model": "opencode/claude-fable-5-1", "variant": "high", "verifier": "verify-gpt" },
    "ui": { "model": "openai/gpt-6-astra", "variant": "high", "verifier": "verify" }
  }
}
```

Gemini remains allowlisted but currently unbound in the published defaults; a Gemini candidate enters via `update-models` with catalog evidence, never by hand-editing this block.

## Sources

- Provider model list APIs (Anthropic, OpenAI, Google)
- `update-models/RESEARCH.md` after each curation run

## Review triggers

- Deprecation or material price/capability change
- Regression in role-fit benchmarks or production evidence
- New flagship model with better task fit (not merely newer version number)
