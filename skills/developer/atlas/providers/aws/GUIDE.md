# AWS provider guide

Turn code or a scoped plan into an explainable AWS architecture pack.

## When to load

- The user requests an AWS architecture pack from a repository or scoped plan.
- An existing AWS design needs evidence, numbered diagrams, or an independently reviewed PDF.

## Procedure

Load only after Atlas has obtained explicit AWS confirmation. Resolve all paths in this guide and sibling references relative to this provider directory. References to the installed directory mean this directory, not the Atlas root. This guide is not a separately invoked skill.

This workflow only authors and reviews architecture documentation. Do not deploy or provision resources on Azure, AWS, or GCP. Describe proposed runtime tests without executing them or claiming they passed.

1. Read `METHOD.md` and `LANDING-ZONES.md`. Record the input path and revision, current versus target state, audience, output directory, and brand. Never execute an unfamiliar repository merely to document it.
2. Gather evidence with host search and source-reading tools. Assess all eight platform areas and trace workload, denied/degraded, recovery, deployment, and telemetry paths. Research current AWS facts from primary sources. Unknown infrastructure remains unknown.
3. Ask no more than three decision-changing questions together. Record reversible assumptions. Do not invent a Region, quota, deployment, residency result, recovery result, or monthly cost.
4. Select the brand with the user. Use the requested theme skill and `branding-system`, or the AWS review style in `DIAGRAMS.md`: official orange and navy accents on neutral white. State that the design is not AWS-authored or endorsed.
5. Write schema 1 `architecture.json` and `reference-architecture.md` under `OUTPUT.md`. Model AWS Organizations, organizational units (OUs), accounts, Regions, virtual private clouds (VPCs), subnets, endpoints, and shared-versus-workload responsibility accurately. A service control policy (SCP) limits permissions; it does not grant them.
6. Distinguish IAM Identity Center workforce access from tenant application single sign-on through SAML or OpenID Connect. Separate a shared control plane from dedicated account data, agents, search, and applications when evidence supports that pattern. Do not turn logical tenancy into implied physical isolation.
7. For agentic and field workloads, cover AgentCore feature-level Region, partition, processing-geography, and lifecycle evidence; durable approvals; idempotency; reconciliation; offline conflict handling; device isolation; failover fencing; and operator capacity. State which claims are designs and which have runtime evidence.
8. Read `SOURCES.md`. Obtain only the official AWS icons used. Preserve exact bytes and record package/member hashes and rights provenance. Do not vendor a full icon library or weaken SVG safety for an asset with duplicate IDs.
9. Read `DIAGRAMS.md`. Produce mandatory platform and workload SVGs with globally stable numbered flows. Use exact 96 × 96 coordinate-unit official icons on every sheet. A user-requested integrated overview may use A1 landscape at the same physical icon scale; it is one solution-and-platform visual, not a contact sheet.
10. Render the approved narrative with `press --html-only`, then run the local assembler:

   ```bash
   python3 scripts/assemble.py --model /work/architecture.json --check
   python3 scripts/assemble.py --model /work/architecture.json --html /work/narrative.html \
     --out /work/reference-architecture.html --browser /path/to/chromium
   ```

   The AWS-local assembler is a maintained copy of the vendor-neutral Atlas Azure engine so this skill installs independently. It validates model records, official bytes, inert SVG, exact page/icon sizes, and clearly illegal managed-service subnet placement. It does not prove architectural semantics or geometry.
11. Inspect every SVG, HTML link, and actual PDF page at final size. Check node containment, line endpoints, arrows, labels, clipping, contrast, page dimensions, searchability, official-art fidelity, and numbered-table agreement. Record automated checks separately from human geometry checks.
12. Read `REVIEW.md`. On every pack generation or revision, and every skill change, use an independent context to apply all four personas and save `quality-review.json`. A blocked independent review makes a pack incomplete. A self-review cannot substitute.
13. Deliver editable sources, platform and workload SVGs, HTML, real PDF, provenance, `verification.md`, judgment, and detached hashes. Preserve unresolved findings and ask accountable owners to approve consequential decisions.

## Stop conditions

- Missing or vague input: request a scoped repository or plan.
- Missing mandatory view, icon, PDF, inspection, or independent judgment: mark `incomplete`.
- Consequential unresolved choice or `revise` judgment: mark `needs-decision`.
- Model, SVG safety, size, provenance, placement, or numbering failure: repair the source, not the check.
- Unsupported service or feature fact: cite the investigated scope and keep the claim unknown.

## Output

`OUTPUT.md` defines files, model fields, narrative sections, status, and receipts. Paths resolve from this installed skill. `review-ready` requests human review; it does not approve deployment, security, compliance, recovery, cost, or AWS endorsement.
