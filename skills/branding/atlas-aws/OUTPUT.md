# Atlas AWS pack contract

Deliver `architecture.json`, `reference-architecture.md`, mandatory platform and workload SVGs, selected palette, assembled offline `reference-architecture.html`, an actual `reference-architecture.pdf`, `verification.md`, `quality-review.json`, and detached `SHA256SUMS`. The assembler refuses existing HTML/PDF outputs.

## Canonical schema 1 model

The top level requires `schema: 1`, `title`, `status`, `basis`, `brand`, `nodes`, `flows`, `views`, `coverage`, and `icons` when official services appear. Status is `review-ready`, `needs-decision`, or `incomplete`. IDs are stable lowercase tokens. Flow numbers are unique positive integers and need not remain contiguous.

Every node requires `id`, `name`, `role`, `state`, nonempty `evidence`, and this placement record:

```json
"placement": {
  "kind": "aws-managed-regional",
  "account": "workload-prod",
  "region": "us-east-1",
  "boundary": "outside-vpc; reached through endpoint vpce-search",
  "subnet": null
}
```

`kind` is exactly `aws-managed-regional`, `vpc-resource`, `vpc-endpoint`, `global`, `external`, or `logical`. `account`, `region`, and `boundary` are required text. Use `unknown` when evidence does not establish a value. `subnet` is optional text or null. It is illegal on `aws-managed-regional`; represent the endpoint as its own `vpc-endpoint` node. This narrow machine rule does not certify other placements.

Every flow requires `number`, `from`, `to`, `kind`, `action`, `data`, `protocol`, `auth`, `failure`, `state`, and evidence. Kinds are `runtime`, `control`, or `telemetry`. Each view requires `id`, `scope`, `title`, `paper`, `svg`, nodes and flows. Scope is `platform` or `workload`, and both must occur. Paper is `A4`, `A3`, or the optional integrated `A1`. Every node and flow appears in a view; every shown flow includes both endpoints.

Each icon requires `id`, `product`, official AWS `source`, rights/usage `license`, `package`, `retrieved`, `member`, and SHA-256 of the original bytes. Every referenced icon appears exactly once inside its node per view. The assembler accepts official landing/download hosts and preserves embedded bytes; provenance does not prove rights beyond published guidance.

Coverage contains exactly the existing parity IDs: `billing-tenant`, `identity-access`, `resource-organization`, `network-connectivity`, `security`, `management`, `governance`, and `platform-automation`. Each record requires `area`, `state`, `finding`, `decision`, `owner`, `verification`, and evidence. `LANDING-ZONES.md` defines their AWS meanings.

## Narrative and assembly

Require executive summary; requirements and assumptions; architecture views; landing zone and platform foundation; network topology and connectivity; governance and platform handoff; component responsibilities; security and data; reliability and recovery; operations and performance; cost and alternatives; implementation and validation; open decisions; glossary and sources. Include placement and platform/workload responsibility tables. For AI and field systems, add the applicable governance, threat, offline, device and reconciliation sections.

For AI workloads, include an AI contract matrix covering model/version and geography policy, grounding and ingestion, retrieval authorization and revocation, prompt injection and tool permissions, content safety and sensitive outputs, human control, evaluations, token cost, tracing and degraded behavior. For each applicable AI and deployment-realism contract in `METHOD.md`, provide a source-backed answer or a named unresolved decision with owner and validation action. Name the enforcing components and canonical flows. Separate tests proposed from results observed; a generic governance paragraph is not a substitute for these contracts.

Run press with `--html-only`, then `assemble.py`. The assembler adds an index, full-size named pages, canonical flow tables and coverage register, and uses Chromium to create a real PDF. A requested PDF that fails is not replaced by HTML or a renamed file. A1 remains a page in this same integrated PDF path.

`verification.md` separately records structural/export checks, semantic review, and human rendered geometry inspection. Include inputs, tool versions, commands/results, page dimensions, pages and dense regions inspected, effective printed icon sizes, flow agreement, source/package hashes and limitations. The checker cannot prove line attachment, containment, overlap, semantic AWS correctness, runtime isolation, recovery or cost.

Run `REVIEW.md` independently on every generation/revision and every skill change. Finalize frozen exports, obtain hash-bound judgment, write verification, then hash all artifacts except the manifest. `review-ready` requires all files, technical/visual checks, no hidden consequential unknowns, and an architecture-pack `pass`. It requests owner review, not deployment approval.
