---
layout: skill
name: atlas
title: "Atlas: Evidence-Grounded Cloud Architecture Packs"
description: "Atlas documents an explicitly selected Azure, AWS, or GCP architecture with evidence labels, official-icon diagrams, reference prose, and an HTML and PDF review pack."
group: developer
invocation: user-invoked
scenario: "Documenting QuenServe's proposed cloud architecture without presenting service choices or recovery targets as deployed facts"
lens:
  novice:
    who: 'You need to explain a cloud design whose service names, arrows, and source evidence do not yet tell one consistent story.'
    value: 'Atlas separates observed facts from proposals and unknowns, then carries the same numbered flows through the model, diagrams, and prose.'
  practitioner:
    who: 'You need an architecture pack with accurate identity, network, ownership, and service-placement boundaries for your selected cloud.'
    value: 'Provider-specific guides preserve native semantics, while local checks catch model and diagram drift before review.'
  leader:
    who: 'You need engineers and stakeholders to challenge alternatives, responsibility, cost drivers, and unresolved decisions.'
    value: 'Evidence labels and separate verification receipts keep a review-ready proposal distinct from production approval.'
  csuite:
    who: 'You are reviewing a cloud investment whose operating model, isolation boundaries, and uncertainty must remain visible.'
    value: 'The pack ties recommendations to evidence and names unknowns without implying provider endorsement or verified savings.'
---

## What it does

Atlas is one user-invoked skill for architecture documentation. It reads a repository or scoped plan and produces a source model, `architecture.json`, reference prose, official-icon SVG diagrams, and an HTML and PDF review pack. Each material claim is `observed` when supplied evidence supports it, `proposed` when it is a recommendation, or `unknown` when the source cannot settle it.

Every run asks exactly: “Which cloud platform should this architecture target: Azure, AWS, or GCP?” It waits for the answer before loading a provider guide. It never infers the target from the repository, service names, or other context, even if the user named a cloud earlier.

<div class="step-flow">
  <div class="step"><span class="step-num">1</span><span class="step-label">Confirm the platform</span><span class="step-text">Ask the required question and wait for an explicit answer.</span></div>
  <div class="step"><span class="step-num">2</span><span class="step-label">Read evidence</span><span class="step-text">Load only the selected provider guide, inspect supplied sources, and classify claims.</span></div>
  <div class="step"><span class="step-num">3</span><span class="step-label">Model and draw</span><span class="step-text">Record native ownership, identity, network boundaries, and numbered flows in platform and workload views.</span></div>
  <div class="step"><span class="step-num">4</span><span class="step-label">Render the pack</span><span class="step-text">Use the required Press renderer for prose, then assemble diagrams and canonical tables into HTML and PDF.</span></div>
  <div class="step"><span class="step-num">5</span><span class="step-label">Check and review</span><span class="step-text">Run provider checks, inspect actual exports, and record review findings separately from structural validation.</span></div>
</div>

<ul class="benefits">
  <li>One entry point avoids installing three skills for the same documentation task.</li>
  <li>Provider-specific methods preserve Azure, AWS, and Google Cloud distinctions rather than translating service names mechanically.</li>
  <li>One numbered-flow model keeps diagrams, narrative, and generated tables consistent.</li>
  <li>Evidence labels keep a plausible design from becoming a false deployment claim.</li>
  <li>Checks detect omissions and drift; they do not prove runtime security, recovery, performance, or cost.</li>
</ul>

Read the provider documentation for [Azure]({{ '/atlas/azure/' | relative_url }}), [AWS]({{ '/atlas/aws/' | relative_url }}), or [GCP]({{ '/atlas/gcp/' | relative_url }}). These are guides within Atlas, not separately installable skills. The [entry-point source](https://github.com/tqnonline/skills/blob/main/skills/developer/atlas/SKILL.md) selects `providers/<cloud>/GUIDE.md` only after confirmation.

## When to reach for it

Use Atlas when a repository or clear plan needs a durable architecture review pack, not just a diagram. Supply the source path, intended readers, constraints, requested views, and an established design or selected theme. Atlas does not provision resources, deploy software, inspect a live cloud account, or approve an architecture.

| The problem | The skill |
|---|---|
| Document a selected cloud with an evidence-labeled model, diagrams, prose, HTML, and PDF | `atlas` |
| Render approved prose without architecture modeling or diagram assembly | [`press`]({{ '/press/' | relative_url }}) |
| Decide cross-cutting software structure and record design decisions | [`architect`]({{ '/architect/' | relative_url }}) |
| Explain a topic through interactive controls instead of a printable pack | [`exhibit`]({{ '/exhibit/' | relative_url }}) |

Install once for the tools below:

```bash
npx skills@latest add tqnonline/skills
```

Atlas requires `press`. Themes and `branding-system` are optional when selected by the user. The workflow needs Node 20, Python 3.9 or newer, and Chromium for PDF output. Missing PDF capability must be reported, not represented as a completed export. See the <a href="{{ '/tools/' | relative_url }}">Tools page</a> for installation and invocation details.

<div class="tool-group">
<div class="tool-group-head"><span class="tool-badge">Claude Code</span><span class="tool-group-mechanism">Slash command</span></div>
<div class="tool-group-body">
<p>Type <code>/atlas</code> with the source path. Answer the required platform question before provider work begins.</p>
<div class="prompt-card">/atlas Document QuenServe from this repository as a proposed Azure architecture. Preserve observed, proposed, and unknown labels. Use our established design and produce platform and workload views with HTML and PDF. Ask the platform question and wait even though this request names Azure.<button type="button" class="prompt-card-copy" aria-label="Copy this prompt">Copy</button></div>
</div>
</div>

<div class="tool-group">
<div class="tool-group-head"><span class="tool-badge">OpenCode</span><span class="tool-group-mechanism">Shared skill, plain ask</span></div>
<div class="tool-group-body">
<p>Name <code>atlas</code> and the source. The same confirmation gate and provider-local checks apply.</p>
<div class="prompt-card">Use atlas on plans/quenserve.md for an AWS proposal. After platform confirmation, document account ownership, workforce versus customer identity, private endpoints and DNS, and numbered offline-sync flows. Produce A4 and A3 detail views and one requested A1 overview. Do not claim a deployment.<button type="button" class="prompt-card-copy" aria-label="Copy this prompt">Copy</button></div>
</div>
</div>

<div class="tool-group">
<div class="tool-group-head"><span class="tool-badge">Cursor</span><span class="tool-badge">Codex</span><span class="tool-badge">GitHub Copilot</span><span class="tool-group-mechanism">Catalog readers &mdash; shared catalog, plain ask</span></div>
<div class="tool-group-body">
<p>These tools read the same installed contract. Ask for source citations and actual export inspection, not just a successful assembler command.</p>
<div class="prompt-card">Read skills/developer/atlas/SKILL.md and document QuenServe as a GCP proposal. Ask the mandatory platform question and wait. After confirmation, distinguish project ownership, Shared VPC attachment, global networks, regional subnets, and workload identity. Report checks and review separately.<button type="button" class="prompt-card-copy" aria-label="Copy this prompt">Copy</button></div>
</div>
</div>

In Amp, name `atlas` and provide the repository or plan. Amp loads the same skill and uses native evidence-reading tools with the selected provider's local scripts. Cloud credentials are not required.

**Migration:** Replace `/atlas-azure`, `/atlas-aws`, and `/atlas-gcp` with `/atlas`, or name `atlas` in a plain request. These retired invocations are not CLI aliases. Reinstall the catalog with required `press`, then inspect every project, personal, and workspace installation your tools load. Preserve local edits before removing obsolete provider-specific copies or links, including tool-prefixed names. Reinstallation may leave stale entries. Refresh or restart the tool and confirm it lists one `atlas` and no retired Atlas skills. Old documentation URLs redirect to the provider guides; those redirects do not restore old commands.

## A working example

The [QuenServe scenario]({{ '/example/' | relative_url }}) describes offline inspections, attachments, later synchronization, conflicts, and visible status. It does not establish a deployed cloud inventory. After the required question and answer, Atlas could document one of these alternatives:

| Selected provider | Illustrative proposal | Boundary that must remain explicit |
|---|---|---|
| [Azure]({{ '/atlas/azure/' | relative_url }}) | An Azure-hosted sync API hands accepted batches to asynchronous processing. | Microsoft Entra tenant, subscriptions, workload identity, and private endpoints are distinct concerns. |
| [AWS]({{ '/atlas/aws/' | relative_url }}) | Dedicated customer workload accounts sit under AWS Organizations. | IAM Identity Center workforce access differs from customer application federation; a VPC endpoint does not put the managed service in a subnet. |
| [GCP]({{ '/atlas/gcp/' | relative_url }}) | Customer service projects attach to a governed Shared VPC. | Project ownership differs from network attachment; global VPCs contain regional subnets. |

These are worked examples, not live results or default recommendations. Region, recovery objectives, traffic, attachment volume, and existing identity configuration remain unknown unless supplied evidence establishes them. A proposed service stays proposed until a source supports a deployed fact.

For example, flow 3 could represent conflict evaluation after durable acceptance. Once source analysis fixes that sequence, its endpoints and meaning must agree in `architecture.json`, every relevant diagram, and the generated flow table. This page claims no model artifact, PDF, page count, score, hash, runtime test, or live six-phase benchmark result.

## What good looks like

Atlas's shared [quality contract](https://github.com/tqnonline/skills/blob/main/skills/developer/atlas/QUALITY.md) requires evidence for the selected service combination, a recovery trace without failed-region dependencies, durable authorization and replay, stable cumulative references, and readable final exports. Every one of the twelve audience scores must reach 4/5. Unmet requirements, major or critical findings, and any regression prevent a pass. Complete ID coverage and disclosed limitations do not repair a defective design.

For example, a proposed regional recovery that first queries the failed database cannot establish a bounded recovery time. A restored API also does not restore field-service completion if its required photo scanner remains unavailable. Atlas must resolve these dependencies or retain the affected requirement as partial or unmet. A revised skill is evaluated separately; a skill-patch pass does not upgrade earlier architecture judgments.

<div class="compare-grid">
<div class="compare-card">
<div class="compare-card-head">A traceable proposal</div>
<pre><code>Flow 3: sync API -&gt; conflict evaluation
status: proposed
source: supplied offline-sync requirements
ownership, identity, failure, state: explicit
model, diagram, table: same endpoints and meaning</code></pre>
<div class="compare-card-note">Provider-specific placement and supporting evidence remain visible. Structural checks and visual review answer different questions.</div>
</div>
<div class="compare-card compare-card--warn">
<div class="compare-card-head">A diagram mistaken for proof</div>
<pre><code>All services run inside a private subnet.
Recovery: multi-region, verified
source: none
test evidence: none</code></pre>
<div class="compare-card-note">Private access does not automatically place a managed service in a subnet. A recovery target is not a tested result. Correct the placement and label unsupported claims.</div>
</div>
</div>

## Common questions

<details class="qa"><summary>Why ask the platform question when the request already names a cloud?</summary><div class="qa-body">

The explicit answer is the routing gate. Atlas asks the exact question on every run and waits rather than silently choosing a provider from context. A provider page or an earlier cloud name does not bypass it.

</div></details>

<details class="qa"><summary>Why is Press required?</summary><div class="qa-body">

Press renders the approved reference prose into self-contained HTML. The selected provider's assembler validates and adds diagrams and canonical tables. Chromium creates the PDF. This separates prose rendering from architecture-specific assembly; a theme is optional, but Press is not.

</div></details>

<details class="qa"><summary>Does verification establish deployment readiness?</summary><div class="qa-body">

No. Local checks establish structural consistency, not effective permissions, isolation, recovery, capacity, compliance, or cost. Independent review records only judgments actually performed. One reviewer applying four audience perspectives is not four independent experts. Accountable owners still decide whether a proposal is suitable.

</div></details>

## It's working if

- The run asks the exact platform question, waits, and then loads only the selected provider guide.
- Material claims carry evidence labels and citations or an explicit lack of evidence.
- Platform and workload views retain native identity, ownership, location, and network boundaries.
- Numbered flows agree across the model, diagrams, narrative, and generated tables.
- Official icons retain provider-required provenance and geometry.
- The report distinguishes automated checks, actual visual inspection, and independent review, including missing work.
- No documentation result is presented as a deployment, a runtime test, or a live benchmark.

## Where it fits

Atlas is one of the developer group's 23 promoted skills, within a catalog of 60. Its internal Azure, AWS, and GCP guides preserve provider methods, output contracts, diagrams, and scripts without creating separate public invocations. The narrow group-independence exception makes branding `press` a required dependency. A user-selected theme or `branding-system` remains optional.

Atlas owns architecture-pack authoring and review, not provisioning, deployment, or approval. Human owners remain responsible for consequential architecture, security, compliance, cost, and release decisions. Provider icons and styling do not imply Microsoft, AWS, or Google endorsement.
