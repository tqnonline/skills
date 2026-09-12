# Architecture quality and cumulative change

Load this document after explicit cloud confirmation, before selecting services or revising an architecture. Apply it with the selected provider guide. These checks address failures observed in staged architecture reviews; they do not establish that a future design will pass.

## Q1. Verify the selected service combination

Create a compatibility table for every critical service choice. Record the exact region, tier, version, credential mode, replication mode, private connectivity, quota assumption, official source URL, retrieval date, and supported or unresolved status. Verify the combination, not each feature in isolation. Distinguish permission to create a new resource from support for an existing allocation. Recheck consequential claims when a revision changes any of these settings; an inherited source snapshot is not a current availability check.

For Azure, check new Search creation and model capacity in each selected region. For AWS, check database replica support with the selected managed-credential mode and name the migration required to change it. For GCP, check regional service variants and actual invocation/IAM bindings. These are investigation prompts, not permanent regional exclusions or guaranteed compatibility lists. If sources contradict the design, select and justify a supported alternative or mark the affected requirement partial or unmet. An open-decision label does not repair an unsupported choice.

Give every migration, audit exporter, backup/copy job, purge worker and health publisher an executable deployment contract: hosting, launch identity, trigger, credentials, private route, task limits, overlap control, checkpoint, privileges, serialization and readiness gate. An API deployment role is not a SQL execution path. Runtime identity is not necessarily the image-import identity; specify deployer, service-agent and repository bindings separately. Per-execution parallelism does not cap overlapping scheduled jobs. Show the aggregate admission mechanism. Check effective object permissions for conditional replacement; a compare-and-swap precondition does not remove the provider's required write/delete privileges.

## Q2. Trace recovery without the failed dependency

RTO is the maximum restoration time; RPO is the maximum acceptable loss of acknowledged business data. For each required business journey, build a recovery dependency table: surviving authority, durable state, images and secrets, DNS and identity, replication or backup, writer exclusion, promotion steps, and time/data-loss bound. Include photo scanning, evidence copies, search rebuilds, approvals, and security changes when the journey depends on them. A running API is not restored service if required completion remains unavailable.

Remove the failed region and its control plane from the recovery trace. Identify any step that still queries, stops, drains, or obtains a receipt from it. Fencing means preventing an old writer from committing after a new writer takes over. Show the enforcing mechanism, including transactions admitted before failure, paused workers, delayed calls, and failback. A lease expiry, epoch value, or DNS switch alone does not prove that old writers cannot commit. Bound business loss independently of replication lag; include acknowledged but not replicated work and in-flight transactions.

Keep telemetry recovery separate from manual case recovery when that independence is required. Do not make a new subsystem's drain or receipt a prerequisite for the old subsystem's operation. Trace both-region security receipts, image repositories, keys, and audit destinations during regional loss. Name cold capacity and post-failure evidence-copy destinations. If any necessary step has an unbounded wait, do not claim a bounded RTO. Preserve the requirement as partial or unmet with an actionable alternative; do not quietly weaken the service target.

## Q3. Define durable authorization and replay contracts

For every external action, record exact target, payload or recoverable payload reference, material version, idempotency/correlation key, actor entitlement, approval scope and expiry, and durable outcome state. Recovery must retain enough information to reconcile a timeout after a remote commit. Recheck authorization and material versions after intervening journal I/O and immediately before irreversible dispatch. Distinguish short portal approvals from long workflow approvals.

Select the actual workforce/support issuer, audience, callback or broker, assertion signer, key owner and immutable subject-to-customer grant binding. A time-bound grant cannot make an otherwise rejected issuer authenticate. On identity-system restoration, specify verified old-to-new principal mapping; recreating a directory and forcing sign-in does not restore identity continuity. Separate local cache freshness from upstream membership freshness; successful stale reads can refresh a revoked membership indefinitely. Do not infer an end-to-end revocation bound from polling frequency alone.

Specify how manual and edited drafts become immutable versions before approval. Select partner method/path, request/response schema, OAuth audience/scope, callback authentication, conditional-write semantics, idempotency lifetime and authoritative outcome lookup. Safe write-disable can preserve safety while leaving the requested integration incomplete.

For hostile document/image parsing, identify the enforced boundary between untrusted decoding and privileged publication. Name metadata-token access, credentials, filesystem/process isolation, allowed data routes, bounded handoff and the authority that marks content clean. A restricted container or denied public egress does not remove its own workload identity. Choose a default-deny input-format policy when isolation is unresolved; required photo evidence remains an unmet journey if its safe decoder is undesigned.

Define one authoritative admission budget and its enforcement store. Reconcile all quota, connection, concurrency, token and cost numbers across prose, diagrams and configuration. Model outages must not consume the manual-service budget. Unknown remote outcomes and unresolved streams may hold capacity indefinitely; disclose that consequence in the executive summary as well as the detailed contract.

Replay inputs need a trusted origin and explicit schema. Do not assume an error-action envelope contains the authenticated certificate context, receipt timestamp, or enriched fields from the normal path. Specify where those values are authenticated and durably captured. If they cannot be reconstructed safely, quarantine or archive the record and state the resulting loss/replay limitation. Never fabricate trusted fields from device-supplied claims. Model advisory locks according to actual database semantics; do not invent a TTL for a session lock.

## Q4. Preserve meaning across cumulative revisions

Maintain a change table covering requirements, node IDs, flow IDs and endpoints, decision IDs, source IDs, settings, permissions, recovery dependencies, and prior findings. Keep IDs stable. When retiring or renumbering an ID, provide a mapping and update every embedded reference, diagram label, table, source citation and test. Compare semantic contracts, not only object counts or hashes. An unchanged node ID can still carry a regressed permission or recovery dependency.

Record each prior finding as open or closed, with evidence for closure and the changed version. A later judge's silence is not closure. Include `regressionFindings` in the review receipt as an array of nonempty descriptions; use an empty array only after comparison finds none. Any reported regression, including a minor one, prevents a pass. Distinguish inherited source defects from new export defects without dropping either from the quality decision.

## Q5. Make the rendered pack usable

Provide an executive decision summary, a plain-language end-to-end journey, a glossary, and progressively detailed views. Generate page numbers and a printed page map or contents with page references after pagination settles; verify bookmark and link targets against the final PDF. Check joined words/numbers, stale display names, sparse continuation pages, and captions that disagree with the canonical model. Do not add pages merely to increase apparent completeness.

Preserve causal teaching order, including authorized retrieval before model generation. Distinguish diagram containment from association: a directory object is not a subscription resource, and a customer environment must visibly belong to its customer boundary. Surface all implementation blockers as owned decisions in the executive summary, including inherited ones. Quantify sensitivity to image-derivative size, overlapping workers, cold capacity and staffing rather than presenting unmeasured sizing as funded capacity.

Inspect actual PDF pages and SVGs at readable scale after the last export. Check headings against card borders, text against routes, directed endpoints, label spacing and footer placement. Keep original artwork in exact 96 × 96 boxes after transforms and print scaling. Do not shrink icons or silently rescale the PDF to fit. Document any export wrapper, preserve the original output as evidence, and verify final physical dimensions and reproducibility. A tool's bounds check does not replace visual inspection.

The integrated overview must let a new reader trace a normal, denied and recovery journey without reconstructing the graph from a separate table. Complete ID coverage and a list of named endpoint references are not sufficient. Use readable action labels, truthful aggregation, and explicit mapping to detailed views. Disclose the native sheet dimensions and zoom/print limits. If a single sheet becomes impractical to read, record a readability failure and propose a revised aggregation; do not declare success merely because every ID fits. Keep unresolved source defects visible in the overview.

## Q6. Judge the exact version, not the author's intent

Pass requires all 12 audience/dimension scores to be at least 4, every applicable requirement met, no major or critical finding, no regression, complete required inspection, intact reviewed hashes, and an independent pass verdict. High clarity scores cannot compensate for an impossible recovery path or unsupported service combination. A disclosed gap is still a gap. Proposed cloud tests are not executed evidence; no deployment is authorized by this workflow.

Use the provider review schema and preserve the raw receipt. If a receipt needs a format correction, retain the original and have the independent reviewer correct it without changing substantive scores or findings. Keep extended inspection ledgers separately when a controller accepts only the main artifacts. Export fixes and design repairs need a new version and review; never alter frozen benchmark history.

## Feedback-to-rule map

| Observed failure family | Required response |
|---|---|
| Unsupported region or service/credential combination; stale sources; missing jobs, private migrations or image-import grants | Q1 compatibility evidence and executable bootstrap |
| Failed-region drain, both-region receipts, cold scanners, missing images/copies, coupled recovery | Q2 surviving-dependency and business-journey trace |
| Missing support issuer or restored identity mapping, false revocation bounds, unsafe parsers, missing draft/partner contracts, replay context or admission authority | Q3 durable state and enforcement contracts |
| Reused decisions, stale journal/flow/source numbers, dropped prior guarantees | Q4 semantic change and finding ledger |
| Dense routes, headings/captions crossing cards, missing page navigation, print rescaling | Q5 final artifact inspection and reader trace |
| Scores accepted at 3, minor regressions ignored, disclosure treated as repair | Q6 strict acceptance without upgrading history |

Use this map to turn a new finding into a reusable rule and a regression case. It is not a claim that all observed failures have been repaired in existing architecture packs.
