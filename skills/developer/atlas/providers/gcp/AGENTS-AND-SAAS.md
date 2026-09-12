# Agentic enterprise SaaS

Load when agents or commercial SaaS appear. A commercial customer boundary includes lifecycle, operations and contractual isolation; an internal business-unit example is not sufficient evidence.

## Dedicated customer lifecycle

Define dedicated at the resource level: application runtime, transaction store, retrieval/index, agent runtime, credentials, queues, objects and logs as applicable. Distinguish per-customer project isolation from dedicated physical hardware. Keep shared management outside customer content paths. Name allowed metadata fields, support-grant enforcement, expiry and customer approval. Bootstrap, upgrade, quota, key rotation, export, legal hold and decommissioning need owners and evidence.

Carry trusted customer context through tools, retrieval, caches, memory, logs and background jobs. Never derive authorization from model output or a caller-supplied customer ID alone. Include cross-customer denied tests and compromised management identity blast-radius limits. Customer SSO establishes identity, not unrestricted access to all customer records.

## Agents and durable effects

Separate model inference, agent execution, tool gateway, durable workflow state, sessions, memory, retrieval and business systems of record. Several local agents may share one process; draw a deployment boundary only when evidence supports it. Compare deterministic workflows with agent planning.

Models propose actions. Application code checks entitlement, tool allowlist and action schema. Durable approval binds customer, approver, exact parameters, resource version, expiry and one-time use. Recheck authorization at execution. A conversational confirmation is not durable approval. Check the selected ADK/session combination before claiming confirmation survives restart.

Use a durable command ledger and idempotency key for local business effects. Model timeout-after-commit, worker-crash and duplicate callback windows. Without external idempotency or queryable business keys, quarantine uncertain effects for reconciliation; do not retry blindly or promise exactly once. Separate core restore admission from external action reactivation.

## Knowledge and model governance

Ingestion preserves source ACLs, versions, deletion and legal holds. Retrieval filters by current trusted authorization, not just ingestion-time access. Define revocation/deletion lag, stale-index fallback and poison-content handling. Memory is untrusted data with identity scope, retention and deletion, never a grant of authority. Verify storage versus processing geography for every chosen retrieval/memory/model feature. Keep manual service available when models fail.

Specify model/version rollout, repeatable task and tool evaluations, grounding, denied actions, prompt injection, sensitive output, token budgets, tracing and cost. Evaluate behavior repeatedly; a single plausible response does not establish reliability. Do not commit a permanent model ID to the skill.

## Field service and equipment

Offline clients store the minimum assigned data encrypted. State authorization expiry and revocation limits while disconnected. Revalidate before sensitive server actions. Use version checks and explicit conflict rules; inventory and commitments must not use blind last-write-wins. Scan resumable evidence uploads in a segregated path before release.

Scheduling is constrained optimization, not a language-model claim. Keep ERP/inventory authority explicit, explain hybrid failure and overlapping private-address isolation. Google Maps is a separate service/terms/data boundary when selected. Device identity is not human SSO. Validate event schemas, timestamps, sequence numbers, replay and incident windows before bounded AI escalation; forbid physical actuation unless separately scoped and approved.

Primary discovery: [agent architecture components](https://docs.cloud.google.com/architecture/choose-agentic-ai-architecture-components), [ADK evaluation](https://adk.dev/evaluate/), [ADK confirmation](https://adk.dev/tools-custom/confirmation/), [multi-tenant agentic systems](https://docs.cloud.google.com/architecture/multi-tenant-agentic-ai-system), and [Route Optimization](https://developers.google.com/maps/documentation/route-optimization/overview). Verify exact products, locations and limitations; these links are not proof of Dynamics feature parity or deployed workload performance.
