# Architecture pack contract

## Required artifacts

The full profile delivers `architecture.json`, `reference-architecture.md`, `narrative.html`, `reference-architecture.html`, `reference-architecture.pdf`, one editable SVG per view, `press-palette.md`, `verification.md`, `quality-review.json`, and detached `SHA256SUMS`. Include source/requirement mapping and original icon provenance in the model or named companion files. HTML and SVG must load offline. Use a new output directory; assembly refuses to overwrite outputs.

The core profile may explicitly omit HTML/PDF only when the caller requests it. It is not full Azure feature parity. Missing requested tools/files/inspection yields `incomplete`.

## Canonical JSON, schema 1

Required top-level fields: `schema: 1`, `provider: "gcp"`, nonempty `title`, `basis`, `brand`, `status`, and arrays `nodes`, `flows`, `views`, `coverage`, `icons`. Status is `needs-decision`, `incomplete`, or `review-ready`; use `needs-decision` for an unreviewed proposed export. Optional `limitations` records qualified claims. IDs are stable lowercase tokens beginning with a letter; flow numbers are positive unique integers. Use `observed`, `proposed`, or `unknown` for all claim states.

| Record | Required fields |
|---|---|
| Node | `id`, `name`, `role`, `state`, nonempty `evidence` array; `icon` references provenance when an official icon applies. |
| Placement | Every cloud node with an icon has `placement: {project, scope}`. Scope is `global`, `regional`, `zonal`, `external`, or `logical`; regional/zonal placement names `region`, and zonal placement names `zone`. Add `network`, `subnet`, and host-project references when applicable. Ownership is distinct from attachment. |
| Flow | `number`, `from`, `to`, `kind` (`runtime`, `control`, `telemetry`), `action`, `data`, `protocol`, `auth`, `failure`, `state`, `evidence`. Use actual protocols, including database traffic. |
| View | `id`, `scope`, `title`, `paper`, `svg` relative to model directory, unique `nodes` and `flows` IDs. Both endpoints of each shown flow must appear. All nodes/flows appear in at least one view. |
| Coverage | Exactly the eight `area` IDs in `GCP-FOUNDATIONS.md`; each has `finding`, `decision`, `owner`, `verification`, `state`, `evidence`. |
| Icon | `id`, `product`, official `source` URL, `license` URL, `package`, `retrieved` date, original `member`, original-byte `sha256`. Preserve aliases and category mapping rationale separately. |

Declare `resourceType: "vpc"` or `"subnet"` where applicable so native scope checks can run. For Pub/Sub declare `subscriptionType` and `delivery` when making an exactly-once claim. These limited explicit checks do not constitute complete provider validation.

Ordinary packs need `platform` and `workload` scopes. Platform hierarchy flows may be empty. Extra network/recovery views use their owning scope. The final overview uses `scope: "integrated"`; integrated-only packs set `profile: "integrated"`. A custom view uses `paper: "CUSTOM"`, positive `widthMm`, `heightMm`, `widthUnits`, `heightUnits` at 96 pixels/inch. Use the standard dimensions in `DIAGRAMS.md` for A4/A3. Do not shrink an oversized viewBox onto ordinary paper.

Example node, not a complete model:

```json
{"id":"case-api","name":"Cloud Run","role":"Authorizes case reads and writes","state":"proposed","evidence":["input.md#S1-A2"],"icon":"cloud-run","placement":{"project":"customer-a-prod","scope":"regional","region":"us-central1"}}
```

Unknown evidence cites the investigated scope and names the gap. Requirements map to nodes, flows and narrative locations. Add source-backed capability compatibility and configuration tables; a nonempty evidence string alone is not proof of grounding.

## Narrative sections

Use these level-two headings: **Executive summary**, **Requirements and assumptions**, **Architecture views**, **Landing zone and platform foundation**, **Network topology and connectivity**, **Governance and platform handoff**, **Component responsibilities**, **Security and data**, **Reliability and recovery**, **Operations and performance**, **Cost and alternatives**, **Implementation and validation**, **Open decisions**, and **Glossary and sources**.

Include a first-reader customer journey, requirements coverage, current placement/configuration table, platform/workload responsibility table, ordered deployment and rollback checklist, denied/degraded/recovery journeys, source dates and explicit approval requests. Agent systems add evaluation, model lifecycle, prompt/data threats, memory/retrieval permissions and tool governance. Cumulative packs include migration and prior-requirement preservation. Do not duplicate numbered flow tables; the assembler derives them from the model.

## Finalization and status

1. Export with `needs-decision` or `incomplete` explicitly labeled **export-time status**. Structural assembly never approves a design.
2. Inspect all requested artifacts and freeze the model, narrative, views, HTML, PDF, palette and evidence. Obtain the independent hash-bound judgment in `REVIEW.md`.
3. Validate the judgment with `python3 scripts/validate-review.py --root /work/pack --review /work/pack/quality-review.json`. This verifies the receipt, not the truth of a model's inspection claims.
4. Write `verification.md` with authoritative final disposition, source revision, tool versions, actual commands/results, page dimensions/count, fonts/searchability, all pages/views inspected, minimum effective icon size, contrast/layout findings, semantic findings and limitations.
5. Generate `SHA256SUMS` covering delivered files including judgment and verification, excluding itself. Never place a file's hash inside itself. Changing frozen exports invalidates review; repairs receive a new directory/version and judgment.

`review-ready` requires complete author checks and a valid independent architecture-pack pass, and requests human review only. `needs-decision` covers consequential unresolved choices or a completed `revise` judgment. Missing required artifacts or blocked review means `incomplete`. A skill-patch judgment cannot upgrade an architecture pack. Preserve any difference between export-time and final status; do not rewrite frozen PDFs merely to change a label.
