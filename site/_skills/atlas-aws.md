---
layout: skill
name: atlas-aws
title: "Atlas AWS: Evidence-Grounded Reference Architectures"
description: "Atlas AWS turns a repository or scoped plan into an evidence-labeled AWS architecture model, official-icon diagrams, reference prose, and a branded HTML and PDF review pack."
group: branding
invocation: user-invoked
scenario: "Documenting a proposed AWS architecture for QuenServe without presenting unverified services, isolation, or recovery behavior as deployed facts"
lens:
  novice:
    who: 'You need to explain an AWS design, but the service names, account boundaries, arrows, and source evidence do not yet form one consistent story.'
    value: 'One process separates observed facts from proposals and unknowns, then keeps the same numbered journeys consistent across the model, diagrams, prose, and tables.'
  practitioner:
    who: 'You maintain an AWS design and need implementation detail without letting account, Region, network, identity, service placement, or flow claims drift.'
    value: 'A machine-readable model records placement and flow contracts, while local checks catch structural, provenance, page-size, and diagram mismatches before review.'
  leader:
    who: 'You need engineers and reviewers to understand alternatives, ownership, cost drivers, recovery limits, and unresolved decisions without mistaking a proposal for production state.'
    value: 'The pack presents an executive path and an implementation path, with evidence status and review findings kept beside consequential claims.'
  csuite:
    who: 'You are reviewing an AWS investment whose account model, tenant isolation, operating capacity, and material uncertainty must remain visible.'
    value: 'The pack ties recommendations to evidence, names unknowns and alternatives, and uses a consistent review style without implying AWS endorsement.'
---

## What it does

Atlas AWS reads a repository or scoped implementation plan and authors an AWS reference-architecture pack. It models AWS Organizations, organizational units, accounts, Regions, virtual private clouds (VPCs), subnets, endpoints, identity boundaries, components, and globally stable numbered flows when the source supports them. Every material claim is `observed`, `proposed`, or `unknown`.

The canonical `architecture.json` drives platform and workload SVGs, generated flow tables, and the architecture narrative. The skill obtains only the official AWS icons it uses, preserves their bytes and provenance, and renders every icon at exactly 96 × 96 sheet units on A4, A3, and optional A1 sheets. A1 is reserved for a requested integrated solution-and-platform overview; it does not replace detailed views.

<div class="step-flow">
  <div class="step"><span class="step-num">1</span><span class="step-label">Read evidence</span><span class="step-text">Inspect source files without executing an unfamiliar repository, record the revision, and research consequential AWS facts in current primary sources.</span></div>
  <div class="step"><span class="step-num">2</span><span class="step-label">Bound uncertainty</span><span class="step-text">Separate current and target state, classify claims, and ask no more than three decision-changing questions together.</span></div>
  <div class="step"><span class="step-num">3</span><span class="step-label">Model AWS</span><span class="step-text">Define account, Region, network, identity, placement, responsibility, failure, recovery, deployment, telemetry, and numbered-flow contracts.</span></div>
  <div class="step"><span class="step-num">4</span><span class="step-label">Draw and assemble</span><span class="step-text">Create official-icon detail views, approved prose, self-contained HTML, and a real PDF; add an A1 integrated overview only when requested.</span></div>
  <div class="step"><span class="step-num">5</span><span class="step-label">Check and judge</span><span class="step-text">Run structural checks, inspect every rendered page at its physical size, and obtain an independent four-persona quality judgment.</span></div>
</div>

<ul class="benefits">
  <li>One canonical model keeps component placement and numbered journeys consistent across diagrams, prose, and tables.</li>
  <li>Local checks require placement records and reject explicit managed-service subnet placement, invalid page and icon sizes, and provenance mismatches.</li>
  <li>Observed, proposed, and unknown labels prevent a plausible AWS service choice from becoming a false deployment claim.</li>
  <li>Detailed A4 and A3 views remain available when a requested A1 overview summarizes the whole system.</li>
  <li>An independent review challenges the pack from four audience perspectives, but does not replace accountable owner approval.</li>
</ul>

The AWS-local Python assembler checks model shape, flow coverage, known-illegal managed-service subnet placement, inert SVG content, official-asset hashes, and exact page and icon sizes. It cannot prove architectural semantics, effective permissions, tenant isolation, security, recovery, performance, cost, or deployment state.

- [`METHOD.md`](https://github.com/tqnonline/skills/blob/main/skills/branding/atlas-aws/METHOD.md) defines the evidence and AWS reasoning gates.
- [`LANDING-ZONES.md`](https://github.com/tqnonline/skills/blob/main/skills/branding/atlas-aws/LANDING-ZONES.md) covers the eight required platform areas.
- [`DIAGRAMS.md`](https://github.com/tqnonline/skills/blob/main/skills/branding/atlas-aws/DIAGRAMS.md) defines boundaries, sheets, official icons, and exact 96 × 96 icon geometry.
- [`SOURCES.md`](https://github.com/tqnonline/skills/blob/main/skills/branding/atlas-aws/SOURCES.md) defines primary-source citation and asset provenance.
- [`OUTPUT.md`](https://github.com/tqnonline/skills/blob/main/skills/branding/atlas-aws/OUTPUT.md) defines the model and deliverables.
- [`REVIEW.md`](https://github.com/tqnonline/skills/blob/main/skills/branding/atlas-aws/REVIEW.md) is the evaluator source for the independent judgment.

The review applies four perspectives: junior developer, chief technology officer, enterprise architect, and security architect. One independent reviewer applies all four perspectives; this is not four independent experts or proof of model diversity. The skill records only judgments actually performed and never fabricates scores or results.

## When to reach for it

Use Atlas AWS when a repository or clear plan needs a durable AWS review pack rather than a diagram alone. It is user-invoked and does not provision AWS resources, execute deployments, test a live system, approve security or compliance, calculate a verified bill, or imply AWS authorship or endorsement.

| The problem | The skill |
|---|---|
| Render approved prose without an architecture model or embedded diagrams | [`press`]({{ '/press/' | relative_url }}) |
| Establish the visual and verbal system first | [`branding-system`]({{ '/branding-system/' | relative_url }}) |
| Build an interactive explanation rather than a printable review pack | [`exhibit`]({{ '/exhibit/' | relative_url }}) |
| Build an evidence-labeled AWS model, official-icon views, prose, HTML, PDF, and independent review receipt | `atlas-aws` |

Install once, and every tool below reaches the same skill:

```bash
npx skills@latest add tqnonline/skills
```

The workflow needs Node 20 and Python 3.9 or newer. PDF output needs Chromium. See the <a href="{{ '/tools/' | relative_url }}">Tools page</a> for shared installation and invocation guidance.

<div class="tool-group">
<div class="tool-group-head"><span class="tool-badge">Claude Code</span><span class="tool-group-mechanism">Slash command</span></div>
<div class="tool-group-body">
<p>Type <code>/atlas-aws</code> and name the repository or plan, intended readers, requested sheets, and brand. The skill limits questions to consequential unknowns and keeps checks distinct from human review.</p>
<div class="prompt-card">/atlas-aws Document QuenServe from this repository as a proposed AWS architecture. Use our established design, preserve observed/proposed/unknown labels, produce A4 and A3 detail views, and add one A1 integrated overview. Do not claim that QuenServe or any AWS resource was run.<button type="button" class="prompt-card-copy" aria-label="Copy this prompt">Copy</button></div>
</div>
</div>

<div class="tool-group">
<div class="tool-group-head"><span class="tool-badge">OpenCode</span><span class="tool-group-mechanism">Shared skill, plain ask</span></div>
<div class="tool-group-body">
<p>Name <code>atlas-aws</code> and the source path. Ask for the model, detailed views, HTML, PDF, verification receipt, and independent judgment rather than treating a successful assembler command as approval.</p>
<div class="prompt-card">Use atlas-aws on plans/quenserve.md. Model account, Region, VPC, private DNS, identity, tenant, failure, recovery, and numbered flows. Preserve official icon bytes and exact 96 by 96 geometry on every requested sheet.<button type="button" class="prompt-card-copy" aria-label="Copy this prompt">Copy</button></div>
</div>
</div>

<div class="tool-group">
<div class="tool-group-head"><span class="tool-badge">Cursor</span><span class="tool-badge">Codex</span><span class="tool-badge">GitHub Copilot</span><span class="tool-group-mechanism">Catalog readers &mdash; shared catalog, plain ask</span></div>
<div class="tool-group-body">
<p>These tools read the same installed contract. Ask them to cite current AWS primary sources, state which claims are proposals, run the local assembler, inspect actual exports, and arrange a separate review context.</p>
<div class="prompt-card">Read skills/branding/atlas-aws/SKILL.md and create the QuenServe architecture pack from the supplied source. Keep workforce and tenant identity separate, show managed services outside subnets even when reached through VPC endpoints, and report unknowns without inventing AWS runtime evidence.<button type="button" class="prompt-card-copy" aria-label="Copy this prompt">Copy</button></div>
</div>
</div>

In Amp, name `atlas-aws` and provide the repository or plan. Amp uses its native source-reading and web tools, then runs the same local scripts. Cloud credentials are not required because the skill documents evidence; it does not inspect or provision an account unless that evidence is explicitly supplied through an approved mechanism.

## A working example

For [QuenServe]({{ '/example/' | relative_url }}), a shared scenario prompt could read:

<pre><code>Document QuenServe from this repository as an AWS reference-architecture proposal. Separate provider workforce access from customer federation. Model dedicated customer AWS accounts under AWS Organizations, private connectivity and Route 53 private DNS, offline inspection sync, conflict handling, durable agent approvals, recovery fencing, and operating capacity. Use numbered flows, official icons at exactly 96 × 96 units, A4 and A3 detail views, and one integrated A1 overview. Produce HTML, a real PDF, verification.md, and an independent four-persona quality-review.json.</code></pre>

This is a worked scenario, not evidence of an Atlas AWS or QuenServe run. The QuenServe example establishes offline inspections, attachments, later synchronization, conflicts, and visible status. It does not establish AWS accounts, Regions, services, identity configuration, private Domain Name System (DNS) behavior, recovery results, traffic, or cost.

| Status | Example statement | Treatment |
|---|---|---|
| Observed | Inspectors need offline work and later synchronization without silent loss. | Cite the supplied product scenario. |
| Proposed | Place each customer workload in a dedicated AWS account governed through AWS Organizations. | Show the account boundary, alternatives, responsibility, and verification plan. |
| Unknown | Region, recovery objectives, tenant volume, photo volume, and existing federation are not supplied. | Record the consequence and ask only when the answer materially changes the design. |

The skill would distinguish IAM Identity Center for provider workforce access from customer application federation through SAML or OpenID Connect. It would model VPC endpoints and Route 53 private DNS without drawing a regional AWS managed service inside a subnet. Any named service remains proposed until source evidence supports a deployed fact.

No model file, diagram, PDF, score, page count, hash, or test result is claimed here. The linked evaluator defines how a real frozen pack is judged; it does not supply results for this scenario.

## What good looks like

<div class="compare-grid">
<div class="compare-card">
<div class="compare-card-head">A traceable AWS contract</div>
<pre><code><span class="tok-ok">Flow 4</span>
from/to: sync API -&gt; durable acceptance
placement: workload account, named Region
network: endpoint and private DNS shown separately
auth/failure/state: explicit
status/source: proposed, cited</code></pre>
<div class="compare-card-note">The same number, endpoints, action, evidence state, and failure meaning appear in the model, relevant SVGs, prose, and generated table.</div>
</div>
<div class="compare-card compare-card--warn">
<div class="compare-card-head">The wrong turn implies proof</div>
<pre><code><span class="tok-warn">Amazon Bedrock is deployed in the customer subnet.</span>
source: none
endpoint: omitted
recovery: "multi-Region"
test evidence: none</code></pre>
<div class="compare-card-note">A private endpoint does not place an AWS managed service in a subnet, and a target is not a tested recovery result. Correct the placement and classify unsupported claims.</div>
</div>
</div>

## Common questions

<details class="qa"><summary>Does Atlas AWS deploy or inspect AWS resources?</summary><div class="qa-body">

No. It authors and checks a reference-architecture pack from supplied evidence. A review-ready pack requests owner review; it does not approve deployment, security, compliance, recovery, or cost.

</div></details>

<details class="qa"><summary>Why preserve exact official icon bytes and 96 × 96 geometry?</summary><div class="qa-body">

Byte-preserving assets make provenance auditable. Fixed sheet geometry keeps icons at a consistent physical scale across A4, A3, and A1 rather than shrinking them to fit crowded views. Labels remain necessary because an icon alone does not communicate a component's role.

</div></details>

<details class="qa"><summary>What does the independent review establish?</summary><div class="qa-body">

It records a separate judgment across junior-developer, CTO, enterprise-architect, and security-architect perspectives. It can identify unclear or incomplete contracts. One reviewer applying four perspectives does not equal four experts and cannot establish runtime truth or statistical reliability.

</div></details>

<details class="qa"><summary>Can it produce one large overview?</summary><div class="qa-body">

Yes, when requested. The integrated overview is an actual single-page A1 solution-and-platform view with coverage bound to the canonical model. It keeps every official icon at exactly 96 × 96 sheet units and does not replace the A4 or A3 detail views.

</div></details>

## It's working if

- Every material claim is observed, proposed, or unknown and has evidence or an explicit lack of evidence.
- Accounts, Regions, VPCs, subnets, endpoints, identity systems, and shared-versus-dedicated responsibility are represented truthfully.
- Every numbered flow agrees across the canonical model, diagrams, prose, and generated tables.
- Official AWS assets retain recorded provenance and exact 96 × 96 geometry on A4, A3, and A1.
- Automated checks and physical-size visual inspection are reported separately.
- A fresh context records the required four-persona judgment without invented scores, identities, or results.

## Where it fits

Atlas AWS is a user-invoked branding-group skill. It owns architecture-pack authoring and verification, not cloud deployment or approval. `branding-system` supplies a requested theme or the skill uses a neutral AWS orange-and-navy-on-white review style. `press` renders approved prose to HTML. The AWS-local assembler validates and adds diagrams and canonical tables, and Chromium creates the PDF. Human owners remain responsible for consequential architecture, security, compliance, cost, and deployment decisions.
