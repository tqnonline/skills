---
name: model-routing
description: Model-invoked lookup of tier and role assignments from the canonical registry. Serves every group in this repository, developer and pm alike. Use when selecting a worker, verifier, or orchestrator model for a task node. Where the tool exposes effort modes rather than model identifiers, bind the tier to a mode and pin no identifier.
---

# Model routing (model-invoked)

Resolve which model tier applies to a task node without embedding IDs in other skills — shared infrastructure for every group in this repository, not developer-exclusive.

## Contract

```yaml
contract:
  invocation: model
  thesis: scaffold
  verbs: [read]
  scope: guest
  trace: none
```

## When to invoke

- Orchestrator assigns a node (implement, verify, architect, security)
- Adapter stub says "resolve via model-routing"

## Procedure

1. Open `models.md`
2. Match **role** + **task shape** to a tier row. All frontend design, implementation, and UI/UX work uses the `ui` tier before generic worker selection, including small fixes. Split mixed frontend/backend assignments.
3. Map tier to host-specific ID in the active adapter (OpenCode, Copilot, Cursor)
4. Return: tier, rationale, adapter key — not raw secrets

## Stop conditions

- Preferred `ui` model unavailable → report the reason and request the registry's explicit UI backup, with its independent verifier. If either is unavailable, stop for a handoff; do not silently substitute a generic worker or automatic model selection
- Role unknown → default to `worker-fast` with explicit assumption logged
- Regulated overlay active → no downgrade past verifier separation

## Output contract

```yaml
tier: worker-deep
role: implement
adapter_ref: adapters/opencode/agents/work-sonnet.md
rationale: multi-file API change
```

## Sibling skills

- `update-models` — human curation PRs to `models.md`
- `conduct` — consumes routing for each graph node
- `pm/arrange` — the pm group's own execution-shape router, resolving grill-loop, parallel-fan, and hybrid steps through this same registry
