# Independent four-persona quality judgment

Run this review in a fresh independent context after author checks on every architecture generation or revision and every Atlas AWS skill change. It is a design judgment, not deployment certification. If independence or required inspection is unavailable, record `blocked`; do not substitute author self-review.

Use `architecture-pack` for a generated pack and `skill-patch` for changed instructions/tooling. Skill-patch mode requires the request, exact diff, changed files, focused tests and representative artifacts for changed rendering behavior. It cannot approve an architecture pack. Record every requested or changed behavior as applicable; exclusions need an independent reason.

Inspect all supplied inputs and hashes. For packs, open every SVG and PDF page at final physical size, including A1. Trace one normal, one denied/degraded and one recovery journey. Compare model, placement/configuration tables, narrative, diagrams and flows. Check AWS account/Region/VPC/subnet meaning, effective permissions, SCP semantics, workforce versus tenant identity, feature geography, tenancy, durable side effects, failover fencing, field behavior, cost and operating capacity where applicable.

Apply exactly these personas: `junior-developer`, `cto`, `enterprise-architect`, and `security-architect`. For each, score integer `clarity`, `complexity`, and `understandability` from 1 to 5. One means materially misleading; three means usable with explicit follow-up; five means complete for supplied scope. Record strengths and evidence locations.

| Persona | Review task |
|---|---|
| `junior-developer` | Follow a numbered journey and explain each component in plain language. Determine whether an engineer can implement the interfaces without inventing missing contracts. Flag undefined terms, conflicting instructions and untraceable routes. |
| `cto` | Explain the business outcome, major choices, alternatives, cost drivers, delivery implications and decisions requested. Identify whether the executive summary exposes the material risks and trade-offs. |
| `enterprise-architect` | Challenge integration contracts, tenancy, account and network placement, dependencies, operability, recovery and cumulative consistency. Distinguish an explicit unknown from a contradictory implementation instruction. |
| `security-architect` | Trace threat boundaries, identity continuity, effective permissions, data access and deletion, agent/tool authority, audit and security-state recovery. Identify missing enforcing components and residual risks. |

Clarity measures organization, precise labels and consistent explanations. Complexity means management of necessary complexity, not service count: assess decomposition, traceable boundaries and flows, and whether abstraction hides a critical contract. Understandability measures whether that persona can explain, implement or challenge the design without reconstructing unstated assumptions. For each dimension, 2 means material reconstruction is needed and 4 means a clear, coherent account with only bounded follow-up. A large diagram with complete IDs but untraceable routes does not pass readability.

Save `quality-review.json` with `mode`, `scope` and applicability table, `independent`, reviewer identity/method, `inputRevision`, reviewed `artifactHashes`, inspected paths/pages/regions, exactly four persona records, findings, requirement checks, verdict and limitations. Findings require stable ID, severity (`critical`, `major`, `minor`), location, issue, consequence, recommendation, origin and affected personas. Preserve prior unresolved findings.

Requirement checks cover every user requirement plus placement, directed flows, truthful abstraction, icon size/readability, official-byte provenance, SVG safety, large-format integration and cumulative consistency. A check is `met`, `partial`, `unmet`, or—only in skill-patch mode—justifiably `not-applicable`.

Return `pass` only when every persona score is at least 3, every applicable requirement is met, and no critical or major finding remains. Return `revise` for an assessable failure and `blocked` when required evidence or inspection is unavailable. A passing review does not prove deployment state, cloud runtime behavior, security, compliance, recovery performance, cost, AWS endorsement, or independent expert diversity; one reviewer applies four perspectives.
