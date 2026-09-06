# Pack contract

## Files

Deliver `architecture.json`, `reference-architecture.md`, one SVG per view, the selected palette, assembled `reference-architecture.html`, actual `reference-architecture.pdf`, and `verification.md`. Keep source evidence and icon provenance in the model. The assembled HTML embeds icons and diagrams; it must open without network access. Use a new output directory or explicit filenames to avoid overwriting unrelated work. The assembler refuses existing output files; remove only stale artifacts from your own run or choose a fresh directory.

## Canonical model

The JSON schema is version 1. Representative component and flow fields follow; this compact example is not a complete pack. Add the required `coverage` array and platform view described below. All fields shown are required except `icons`, `limitations`, and each node's `icon`; `icons` can be empty when no Microsoft product appears. IDs are stable lowercase tokens; flow numbers are positive integers unique across the pack, not necessarily contiguous after revisions.

```json
{
  "schema": 1,
  "title": "Event processing reference architecture",
  "status": "review-ready",
  "basis": "Proposed design from plans/events.md, revision 3, sections 2–4",
  "brand": "Approved project palette, light print variant",
  "nodes": [
    {"id": "producer", "name": "Event producer", "state": "proposed", "role": "Submits work", "evidence": ["plans/events.md#inputs"]},
    {"id": "queue", "name": "Azure Service Bus", "state": "proposed", "role": "Buffers work", "evidence": ["plans/events.md#processing"], "icon": "service-bus"}
  ],
  "flows": [
    {"number": 1, "from": "producer", "to": "queue", "kind": "runtime", "action": "Submit an event", "data": "Event identifier and object reference", "protocol": "AMQP over TLS", "auth": "Managed identity with sender role", "failure": "Bounded retries; producer retains an idempotency key", "state": "proposed", "evidence": ["plans/events.md#processing"]}
  ],
  "views": [
    {"id": "v1", "scope": "workload", "title": "Processing overview", "paper": "A4", "svg": "overview.svg", "nodes": ["producer", "queue"], "flows": [1]}
  ],
  "icons": [
    {"id": "service-bus", "product": "Azure Service Bus", "source": "https://learn.microsoft.com/en-us/azure/architecture/icons/", "license": "https://learn.microsoft.com/en-us/azure/architecture/icons/", "package": "Azure_Public_Service_Icons_V24.zip", "retrieved": "2026-09-06", "member": "Azure_Public_Service_Icons/Icons/integration/10836-icon-service-Azure-Service-Bus.svg", "sha256": "<64 lowercase hexadecimal characters from the original SVG>"}
  ],
  "limitations": ["Proposed throughput and retry policy require workload testing."]
}
```

The example hash is a placeholder, not a usable provenance record. Every referenced icon must have a real hash and appear inside its node as an annotated image. All nodes and flows must appear in at least one view. Each flow's endpoints must exist and be visible in every view that shows that flow. Node and flow states are `observed`, `proposed`, or `unknown`. Flow kinds are `runtime`, `control`, or `telemetry`. Evidence is a nonempty list of source locations; an unknown cites the investigated scope and names what was not found.

Keep SVG paths relative to the model directory with no traversal or symlinks escaping it. Do not place arbitrary downloaded HTML into the assembler: `--html` is the locally produced press narrative. The script escapes model strings but does not sanitize an unrelated HTML input.

## Mandatory platform coverage

Add `coverage`, an array with exactly one record for each area in `LANDING-ZONES.md`: `billing-tenant`, `identity-access`, `resource-organization`, `network-connectivity`, `security`, `management`, `governance`, and `platform-automation`. Each record requires `area`, `state`, `finding`, `decision`, `owner`, `verification`, and nonempty `evidence`. States are `observed`, `proposed`, or `unknown`. Unknowns describe the investigation and next decision; they are not blank sections. Example record:

```json
{"area":"network-connectivity","state":"proposed","finding":"The plan requires internal access but supplies no platform network contract.","decision":"Validate private endpoint and DNS support for the selected tiers before choosing a private-only design; retain public access as an explicitly reviewed alternative, not an assumed default.","owner":"Network platform owner, individual to be confirmed","verification":"Test DNS answers, effective routes, and denied public access from each client network.","evidence":["plans/events.md#connectivity"]}
```

The assembler rejects missing areas, owners, evidence, and verification plans. It appends these records to the PDF as an auditable coverage register. Their presence proves coverage, not technical adequacy: the narrative must explain the mechanisms, alternatives, inherited controls, and workload responsibilities. A generic paragraph repeated eight times is not acceptable evidence.

Every view requires `scope: platform` or `scope: workload`; both scopes must be represented. A platform hierarchy view can use `flows: []` because containment is not traffic. Platform nodes still need roles, evidence, and SVG annotations. Additional network, security, recovery, and deployment views use the scope whose responsibility they describe. Do not relabel the runtime diagram as a platform view to satisfy the validator.

## Required narrative sections

Use these level-two sections, adding subsections as needed:

1. Executive summary: purpose, value, scope, architecture state, and decisions requested.
2. Requirements and assumptions: input revision, targets, exclusions, uncertainties, and owner.
3. Architecture views: explain the view set and link conceptually to the appended diagram sheets; do not duplicate flow tables.
4. Component responsibilities: service choice, interface, ownership, source evidence, and current-to-target changes.
5. Security and data: identity, permissions, data classification, retention, networking, residency, threat paths, and safeguards.
6. Reliability and recovery: failure modes, retries, backups, objectives, restore and failover evidence or missing tests.
7. Operations and performance: deployment, configuration, telemetry, alerts, scaling, quotas, and runbooks.
8. Cost and alternatives: dated inputs, fixed and variable drivers, trade-offs, rejected options, and when not to use this design.
9. Implementation and validation: rollout order, dependencies, testable acceptance criteria, and migration/rollback proposals.
10. Open decisions: named questions, recommendation, consequence, owner, and status; explicitly say none when settled.
11. Glossary and sources: definitions, repository/plan citations, official service references, and icon rights.

Between architecture views and component responsibilities, require three further level-two sections: **Landing zone and platform foundation**, **Network topology and connectivity**, and **Governance and platform handoff**. Cover all eight platform areas with the detail in `LANDING-ZONES.md`. Include a placement table and a platform-versus-workload responsibility table. Mechanisms outside scope still need a reason and an owner for the resulting dependency. In the component catalog, specify behavior-changing settings, hosting/tier, permissions, durability, limits, and failure handling rather than only product definitions.

For AI systems, add an AI quality and governance subsection under operations and a model/data threat subsection under security. A junior engineer should follow the end-to-end journey; a CTO should find scope, alternatives, cost drivers, major risks, and approval needs without reading every interface detail.

## Assembly and receipt

First run press with `--html-only --palette <approved-palette.md>`. Then run `scripts/assemble.py --model <architecture.json> --html <narrative.html> --out <reference-architecture.html> --browser <chromium-executable>`. Use the absolute installed press script path; do not assume another skill is a sibling on disk. `--check` needs only the model and SVGs. `--html-only` explicitly skips PDF generation. The assembler returns 0 for the requested structural/export operations, 1 if PDF production failed after HTML, and 2 for invalid inputs. It never upgrades the model's status based on those operations.

The assembler adds a diagram index, full-size diagram plates, generated flow tables, and platform coverage. Screen presentation retains the selected palette. Print uses white paper and neutral dark ink instead of extending screen background panels across mixed page sizes; accents, type, diagrams, and restrained table fills carry the brand. This print adaptation is explicit, not full dark-theme fidelity. Its receipt includes file sizes and SHA-256 hashes. It prints `visual_review: required`: the author must perform and record that review separately. PDF bytes can differ across Chromium versions and runs; only the HTML assembly is deterministic for identical inputs.

In `verification.md`, record input revision, brand and any exceptions, icon package hash and source, tool versions, commands and decisive output, pages and views inspected, contrast/layout findings, numbered-flow agreement, screenshots, and limitations. Check PDF dimensions and searchability with a PDF inspection tool. List each required file and its hash. Do not claim PDF/UA, accessibility certification, or tested disaster recovery without appropriate evidence.

Final status:

- `review-ready`: requested files exist; technical, structural, and visual checks passed; no unmarked unknowns. This requests human review, not deployment approval.
- `needs-decision`: consequential questions remain. The pack names them and remains a draft.
- `incomplete`: a required file, official asset, or verification step is missing or failed.
