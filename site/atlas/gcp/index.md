---
layout: page
permalink: /atlas/gcp/
title: "Atlas Provider Guide: GCP"
description: "Atlas GCP turns a repository or scoped plan into an evidence-labeled Google Cloud model, official-icon diagrams, and an HTML and PDF review pack."
group: developer
invocation: user-invoked
scenario: "Documenting a proposed Google Cloud architecture for QuenServe without presenting unverified services, isolation, or recovery behavior as deployed facts"
lens:
  novice:
    who: 'You need to explain a Google Cloud design, but its projects, network boundaries, arrows, and source evidence do not yet form one consistent story.'
    value: 'One process separates observed facts from proposals and unknowns, then keeps the same numbered journeys consistent across the model, diagrams, prose, and tables.'
  practitioner:
    who: 'You maintain a Google Cloud design and need implementation detail without letting project ownership, location, network attachment, identity, or flow claims drift.'
    value: 'A machine-readable model records placement and flow contracts, while local checks catch structural, provenance, page-size, and diagram mismatches before review.'
  leader:
    who: 'You need engineers and reviewers to understand alternatives, ownership, cost drivers, recovery limits, and unresolved decisions without mistaking a proposal for production state.'
    value: 'The pack presents an executive path and an implementation path, with evidence status and review findings kept beside consequential claims.'
  csuite:
    who: 'You are reviewing a Google Cloud investment whose project model, customer isolation, operating capacity, and material uncertainty must remain visible.'
    value: 'The pack ties recommendations to evidence, names unknowns and alternatives, and uses a consistent review style without implying Google endorsement.'
---

[Atlas overview and invocation]({{ '/atlas/' | relative_url }}) · [Azure]({{ '/atlas/azure/' | relative_url }}) · [AWS]({{ '/atlas/aws/' | relative_url }})

This is the GCP guide within the single `atlas` skill, not a separately installed skill. Invoke `/atlas` or name `atlas` in a plain request. The source entry for this provider is [`providers/gcp/GUIDE.md`](https://github.com/tqnonline/skills/blob/main/skills/developer/atlas/providers/gcp/GUIDE.md). Atlas requires `press` and does not deploy cloud resources.

## What it does

Atlas GCP reads a repository or scoped implementation plan and authors a Google Cloud reference-architecture pack. It models organizations, folders, projects, locations, global virtual private clouds (VPCs), regional subnets, identity boundaries, components, and stable numbered flows when the source supports them. Every material claim is `observed`, `proposed`, or `unknown`.

The canonical `architecture.json` drives platform and workload SVGs, generated flow tables, and the architecture narrative. The skill obtains only the official Google Cloud icons it uses, preserves their bytes and provenance, and renders every icon at exactly 96 × 96 sheet units. A requested integrated platform-and-workload diagram uses a declared `CUSTOM` sheet large enough to retain that geometry. It does not replace the detailed views.

<div class="step-flow">
  <div class="step"><span class="step-num">1</span><span class="step-label">Read evidence</span><span class="step-text">Inspect source files without executing an unfamiliar repository, record the revision, and research consequential Google Cloud facts in current primary sources.</span></div>
  <div class="step"><span class="step-num">2</span><span class="step-label">Bound uncertainty</span><span class="step-text">Separate current and target state, classify claims, and ask no more than three decision-changing questions together.</span></div>
  <div class="step"><span class="step-num">3</span><span class="step-label">Model Google Cloud</span><span class="step-text">Define hierarchy, project, location, network, identity, placement, responsibility, failure, recovery, operations, and numbered-flow contracts.</span></div>
  <div class="step"><span class="step-num">4</span><span class="step-label">Draw and assemble</span><span class="step-text">Create official-icon platform and workload views, use Press for narrative HTML, and assemble the diagrams, HTML, and real PDF.</span></div>
  <div class="step"><span class="step-num">5</span><span class="step-label">Check and judge</span><span class="step-text">Run structural checks, inspect every rendered page at its physical size, and obtain an independent four-persona quality judgment.</span></div>
</div>

<ul class="benefits">
  <li>One canonical model keeps component placement and numbered journeys consistent across diagrams, prose, and tables.</li>
  <li>Platform and workload views separate inherited foundations from application responsibilities.</li>
  <li>Observed, proposed, and unknown labels prevent a plausible service choice from becoming a false deployment claim.</li>
  <li>A requested integrated CUSTOM view preserves the detailed diagrams and exact official-icon geometry.</li>
  <li>An independent review challenges the pack from four audience perspectives, but does not replace accountable owner approval.</li>
</ul>

The local Python assembler checks model shape, flow coverage, selected Google Cloud placement rules, inert SVG content, official-asset hashes, and exact page and icon sizes. It cannot prove architectural semantics, effective permissions, customer isolation, security, recovery, performance, cost, or deployment state.

- [`METHOD.md`](https://github.com/tqnonline/skills/blob/main/skills/developer/atlas/providers/gcp/METHOD.md) defines the evidence and reasoning gates.
- [`GCP-FOUNDATIONS.md`](https://github.com/tqnonline/skills/blob/main/skills/developer/atlas/providers/gcp/GCP-FOUNDATIONS.md) defines the eight required foundation areas.
- [`GCP-SEMANTICS.md`](https://github.com/tqnonline/skills/blob/main/skills/developer/atlas/providers/gcp/GCP-SEMANTICS.md) covers native placement and service distinctions.
- [`DIAGRAMS.md`](https://github.com/tqnonline/skills/blob/main/skills/developer/atlas/providers/gcp/DIAGRAMS.md) defines boundaries, sheets, official icons, and exact 96 × 96 icon geometry.
- [`OUTPUT.md`](https://github.com/tqnonline/skills/blob/main/skills/developer/atlas/providers/gcp/OUTPUT.md) defines the canonical model and deliverables.
- [`REVIEW.md`](https://github.com/tqnonline/skills/blob/main/skills/developer/atlas/providers/gcp/REVIEW.md) defines the independent judgment.

The review applies four perspectives: junior developer, chief technology officer, enterprise architect, and security architect. One independent reviewer applies all four perspectives. This is not four independent experts or proof of model diversity. The skill records only judgments actually performed and never fabricates scores or results.

## When to reach for it

Use Atlas GCP when a repository or clear plan needs a durable Google Cloud review pack rather than a diagram alone. It is user-invoked. It does not provision resources, execute deployments, test a live system, approve security or compliance, calculate a verified bill, or imply Google authorship or endorsement.

Every run first asks, “Which cloud platform should this architecture target: Azure, AWS, or GCP?” It waits for the answer and never infers GCP from the skill name, repository, service names, or earlier artifacts. Even if the user named GCP earlier, the run still asks for explicit confirmation before continuing.

| The problem | The skill |
|---|---|
| Render approved prose without an architecture model or embedded diagrams | [`press`]({{ '/press/' | relative_url }}) |
| Establish the visual and verbal system first | [`branding-system`]({{ '/branding-system/' | relative_url }}) |
| Build an interactive explanation rather than a printable review pack | [`exhibit`]({{ '/exhibit/' | relative_url }}) |
| Build an evidence-labeled Google Cloud model, official-icon views, prose, HTML, PDF, and independent review receipt | `atlas`, then confirm GCP |

Install once, and every tool below reaches the same skill:

```bash
npx skills@latest add tqnonline/skills
```

The workflow needs Node 20 and Python 3.9 or newer. PDF output needs Chromium. See the <a href="{{ '/tools/' | relative_url }}">Tools page</a> for shared installation and invocation guidance.

<div class="tool-group">
<div class="tool-group-head"><span class="tool-badge">Claude Code</span><span class="tool-group-mechanism">Slash command</span></div>
<div class="tool-group-body">
<p>Type <code>/atlas</code> and name the repository or plan, intended readers, requested views, and brand. Answer the mandatory platform question. The skill keeps structural checks distinct from human review.</p>
<div class="prompt-card">/atlas Document QuenServe from this repository as a proposed Google Cloud architecture. Ask the platform question and wait for confirmation. Preserve observed, proposed, and unknown labels. Produce platform and workload detail views plus one integrated CUSTOM overview. Do not claim that QuenServe or any cloud resource was run.<button type="button" class="prompt-card-copy" aria-label="Copy this prompt">Copy</button></div>
</div>
</div>

<div class="tool-group">
<div class="tool-group-head"><span class="tool-badge">OpenCode</span><span class="tool-group-mechanism">Shared skill, plain ask</span></div>
<div class="tool-group-body">
<p>Name <code>atlas</code> and the source path, then confirm GCP when asked. Ask for the model, detailed views, HTML, PDF, verification receipt, and independent judgment rather than treating a successful assembler command as approval.</p>
<div class="prompt-card">Use atlas on plans/quenserve.md. After platform confirmation, model Google Cloud organization, folders, projects, VPCs, regional subnets, identity, customer boundaries, recovery, and numbered flows. Preserve official icon bytes and exact 96 by 96 geometry.<button type="button" class="prompt-card-copy" aria-label="Copy this prompt">Copy</button></div>
</div>
</div>

<div class="tool-group">
<div class="tool-group-head"><span class="tool-badge">Cursor</span><span class="tool-badge">Codex</span><span class="tool-badge">GitHub Copilot</span><span class="tool-group-mechanism">Catalog readers &mdash; shared catalog, plain ask</span></div>
<div class="tool-group-body">
<p>These tools read the same installed contract. Ask them to cite current Google Cloud primary sources, state which claims are proposals, inspect actual exports, and arrange a separate review context.</p>
<div class="prompt-card">Read skills/developer/atlas/SKILL.md and create the QuenServe architecture pack from the supplied source. Ask the platform question and wait. After GCP confirmation, keep customer sign-in, workforce access, and workload identity separate. Show managed services outside subnets unless the selected resource resides there.<button type="button" class="prompt-card-copy" aria-label="Copy this prompt">Copy</button></div>
</div>
</div>

In Amp, name `atlas` and provide the repository or plan, then confirm GCP when asked. Amp uses its native source-reading and web tools, then runs the same local scripts. Cloud credentials are not required because the skill documents supplied evidence. It does not inspect or provision an account.

## A working example

For [QuenServe]({{ '/example/' | relative_url }}), a shared scenario prompt could read:

<pre><code>Document QuenServe from this repository as a Google Cloud reference-architecture proposal. Separate provider workforce access, customer federation, and workload identity. Model project ownership, Shared VPC attachment, private connectivity and DNS, offline inspection sync, conflict handling, durable approvals, recovery fencing, and operating capacity. Use numbered flows, official icons at exactly 96 × 96 units, platform and workload detail views, and one integrated CUSTOM overview. Produce HTML, a real PDF, verification.md, and an independent four-persona quality-review.json.</code></pre>

This is a worked scenario, not evidence of an Atlas GCP or QuenServe run. The QuenServe example establishes offline inspections, attachments, later synchronization, conflicts, and visible status. It does not establish Google Cloud projects, locations, services, identity configuration, private DNS behavior, recovery results, traffic, or cost.

| Status | Example statement | Treatment |
|---|---|---|
| Observed | Inspectors need offline work and later synchronization without silent loss. | Cite the supplied product scenario. |
| Proposed | Give each customer workload a dedicated service project attached to a governed Shared VPC. | Show ownership and network attachment separately, with alternatives and a verification plan. |
| Unknown | Location, recovery objectives, customer volume, photo volume, and existing federation are not supplied. | Record the consequence and ask only when the answer materially changes the design. |

The skill would distinguish customer SAML or OpenID Connect sign-in from provider workforce and workload identity federation. It would model global VPC ownership and regional subnets without placing a managed API inside a subnet merely because access is private. Any named service remains proposed until source evidence supports a deployed fact.

No model file, diagram, PDF, score, page count, hash, test result, or live benchmark result is claimed here. User-approved promotion means the skill may enter the catalog. It does not establish architecture or deployment correctness.

## What good looks like

<div class="compare-grid">
<div class="compare-card">
<div class="compare-card-head">A traceable Google Cloud contract</div>
<pre><code><span class="tok-ok">Flow 4</span>
from/to: sync API -&gt; durable acceptance
placement: service project, named region
network: attachment and endpoint shown separately
auth/failure/state: explicit
status/source: proposed, cited</code></pre>
<div class="compare-card-note">The same number, endpoints, action, evidence state, and failure meaning appear in the model, relevant SVGs, prose, and generated table.</div>
</div>
<div class="compare-card compare-card--warn">
<div class="compare-card-head">The wrong turn implies proof</div>
<pre><code><span class="tok-warn">The managed API runs in the customer subnet.</span>
source: none
private access method: omitted
recovery: "multi-region"
test evidence: none</code></pre>
<div class="compare-card-note">Private access does not automatically place a managed service in a subnet. A recovery target is not a tested result. Correct the placement and classify unsupported claims.</div>
</div>
</div>

## Common questions

<details class="qa"><summary>Does Atlas GCP deploy or inspect Google Cloud resources?</summary><div class="qa-body">

No. It authors and checks a reference-architecture pack from supplied evidence. A review-ready pack requests owner review. It does not approve deployment, security, compliance, recovery, or cost.

</div></details>

<details class="qa"><summary>Why preserve exact official icon bytes and 96 × 96 geometry?</summary><div class="qa-body">

Byte-preserving assets make provenance auditable. Fixed sheet geometry keeps icons at a consistent physical scale instead of shrinking them to fit crowded views. Labels remain necessary because an icon alone does not communicate a component's role.

</div></details>

<details class="qa"><summary>What does the independent review establish?</summary><div class="qa-body">

It records a separate judgment across junior-developer, CTO, enterprise-architect, and security-architect perspectives. It can identify unclear or incomplete contracts. One reviewer applying four perspectives does not equal four experts and cannot establish runtime truth or statistical reliability.

</div></details>

<details class="qa"><summary>Can it produce one large overview?</summary><div class="qa-body">

Yes, when requested. The integrated overview is one coherent platform-and-workload view on a declared CUSTOM sheet, not a contact sheet. It keeps official icons at exactly 96 × 96 units and does not replace the detail views.

</div></details>

## It's working if

- Every material claim is observed, proposed, or unknown and has evidence or an explicit lack of evidence.
- Organizations, folders, projects, global VPCs, regional subnets, identity systems, locations, and responsibility boundaries are represented truthfully.
- Every numbered flow agrees across the canonical model, diagrams, prose, and generated tables.
- Official Google Cloud assets retain recorded provenance and exact 96 × 96 geometry on every sheet.
- Automated checks and physical-size visual inspection are reported separately.
- A fresh context records the required four-persona judgment without invented scores, identities, results, or live benchmark claims.

## Where it fits

GCP is an internal provider guide within the user-invoked developer-group `atlas` skill. Atlas owns architecture-pack authoring and verification, not cloud provisioning, deployment, or approval. The narrow group-independence exception permits its required branding-group `press` renderer. A theme and `branding-system` are optional when selected by the user. The local assembler adds diagrams and canonical tables, and Chromium creates the PDF. Human owners remain responsible for consequential architecture, security, compliance, cost, and deployment decisions. See the [Atlas migration instructions]({{ '/atlas/' | relative_url }}#when-to-reach-for-it) to remove retired installations; old commands are not aliases.
