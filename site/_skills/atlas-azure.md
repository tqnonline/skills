---
layout: skill
name: atlas-azure
title: "Atlas Azure: Reference Architectures From Repositories and Plans"
description: "Atlas Azure turns a repository or clear plan into an evidence-labeled architecture model, official-icon diagrams, reference prose, and branded HTML and PDF artifacts."
group: branding
invocation: user-invoked
scenario: "Documenting the proposed Azure architecture for QuenServe epic E1 without presenting unverified services or flows as deployed facts"
lens:
  novice:
    who: 'You need to explain an Azure design, but the repository, cloud-service names, arrows, and document layout do not yet tell one consistent story.'
    value: 'One process separates what the source shows from what the design proposes, then carries the same numbered flows through the model, diagrams, prose, and final document.'
  practitioner:
    who: 'You maintain an Azure system and have to update architecture diagrams and reference prose without letting labels, service names, or arrows drift apart.'
    value: 'A machine-readable model becomes the common source for components, views, and numbered flows, while a local validator catches structural and diagram mismatches before review.'
  leader:
    who: 'You need an architecture pack that engineers can challenge and nontechnical stakeholders can follow without treating a proposal as a production inventory.'
    value: 'Every material claim is labeled observed, proposed, or unknown, and the same flow numbers appear in the diagrams and the canonical flow tables.'
  csuite:
    who: 'You are reviewing an Azure investment whose costly choices, operational boundaries, and unresolved assumptions need to remain visible.'
    value: 'The pack distinguishes evidence from recommendation, presents unresolved decisions plainly, and uses a consistent brand without implying Microsoft endorsement.'
---

## What it does

Atlas Azure takes a repository or a clear architecture plan and authors a reference-architecture pack. It can analyze code, infrastructure files, configuration, and existing architecture briefs without relying on a developer-group skill. It does not impose a software delivery life cycle or require an architecture gate.

The pack has one source model, `architecture.json`. That model lists components, numbered flows, and views. Each material item carries an evidence status: `observed` for facts supported by the supplied source, `proposed` for recommendations, and `unknown` for points the source cannot settle. The skill also writes `reference-architecture.md`, A4 and A3 SVG diagrams built with official Azure icons, and branded, self-contained HTML and PDF artifacts.

<div class="step-flow">
  <div class="step"><span class="step-num">1</span><span class="step-label">Read the source</span><span class="step-text">Inspect the repository, plan, or existing brief and record evidence before choosing Azure services.</span></div>
  <div class="step"><span class="step-num">2</span><span class="step-label">Classify claims</span><span class="step-text">Mark components and decisions observed, proposed, or unknown; ask no more than two or three focused questions when an unknown choice is costly.</span></div>
  <div class="step"><span class="step-num">3</span><span class="step-label">Build the model</span><span class="step-text">Author architecture.json with stable component identifiers, canonical numbered flows, and named views.</span></div>
  <div class="step"><span class="step-num">4</span><span class="step-label">Write and draw</span><span class="step-text">Write the Markdown reference architecture and draw official-icon SVG views sized for A4 and A3 pages.</span></div>
  <div class="step"><span class="step-num">5</span><span class="step-label">Assemble and inspect</span><span class="step-text">Validate the model and SVG files, add diagram plates and flow tables to the branded HTML, optionally print the PDF, then open both visual formats and inspect them.</span></div>
</div>

<ul class="benefits">
  <li>One numbered-flow list drives both diagrams and tables, so an arrow labeled 4 has one definition across every artifact.</li>
  <li>Evidence labels keep a planned Azure service from being presented as a deployed fact.</li>
  <li>Official Azure icons make services recognizable, while text labels preserve meaning for readers who do not know the symbols.</li>
  <li>The local Python 3 assembler checks consistency across the model and SVG files; it does not prove that the architecture is correct.</li>
  <li>The final document follows the user's theme or established project design. A neutral Microsoft-inspired layout remains a layout choice and does not imply Microsoft endorsement.</li>
</ul>

- [`METHOD.md`](https://github.com/tqnonline/skills/blob/main/skills/branding/atlas-azure/METHOD.md) explains source analysis, evidence labels, and the limited question rule.
- [`LANDING-ZONES.md`](https://github.com/tqnonline/skills/blob/main/skills/branding/atlas-azure/LANDING-ZONES.md) defines mandatory platform investigation: billing and tenant scope, identity, resource organization, networking, security, management, governance, and automation. Every area needs evidence, an owner, a decision, and a verification plan.
- [`DIAGRAMS.md`](https://github.com/tqnonline/skills/blob/main/skills/branding/atlas-azure/DIAGRAMS.md) defines official-icon use, view design, flow numbering, and A4 and A3 composition.
- [`SOURCES.md`](https://github.com/tqnonline/skills/blob/main/skills/branding/atlas-azure/SOURCES.md) records how to cite repositories, plans, briefs, and Microsoft source material.
- [`OUTPUT.md`](https://github.com/tqnonline/skills/blob/main/skills/branding/atlas-azure/OUTPUT.md) defines the files, validation checks, assembly order, and visual inspection record.

The skill reuses a named theme skill or an established project design through `branding-system`. It uses `press` for prose rendering because press already handles Markdown, branding, and self-contained output. Press cannot embed images, so `scripts/assemble.py` validates `architecture.json` and the SVG files, then adds diagram plates and canonical numbered flow tables to the press HTML. Node 20 runs press. Python 3 runs assembly. Chromium can print the assembled page to PDF.

The assembler rejects an application-only pack: both platform and workload views, eight platform coverage records, and landing-zone, connectivity, and governance narrative sections are required. It also generates a platform coverage register. These checks prevent omissions, but reviewers must still examine the reasoning and source evidence. PDF presentation adapts the screen palette to white paper and dark ink, with restrained table fills rather than large background panels.

## When to reach for it

Type `/atlas-azure` in Claude Code, or name the skill directly in a session. The skill is user-invoked. Nothing starts it automatically.

Use it when an Azure design needs a durable reference pack rather than a diagram alone. The input can be an existing repository, a clear proposed plan, or an architecture brief produced elsewhere. If no theme or established project design exists, the skill asks for one concise preference rather than inventing a house brand.

| The problem | The skill |
|---|---|
| You need a branded document from approved prose and no embedded diagrams | [`press`]({{ '/press/' | relative_url }}) |
| You need a coherent visual and verbal system before applying it to the architecture pack | [`branding-system`]({{ '/branding-system/' | relative_url }}) |
| You need an explorable interactive explanation rather than a printable reference architecture | [`exhibit`]({{ '/exhibit/' | relative_url }}) |
| You need an Azure reference pack with an evidence-labeled model, diagrams, flows, prose, HTML, and PDF | `atlas-azure` |

Install once, and every tool below reaches the same skill:

```bash
npx skills@latest add tqnonline/skills
```

The workflow needs Node 20 and Python 3.9 or newer. PDF output also needs Chromium. See the <a href="{{ '/tools/' | relative_url }}">Tools page</a> for the shared installation instructions and each tool's invocation mechanism.

<div class="tool-group">
<div class="tool-group-head"><span class="tool-badge">Claude Code</span><span class="tool-group-mechanism">Slash command</span></div>
<div class="tool-group-body">
<p>Type <code>/atlas-azure</code> and point it at the repository or plan. Name the theme when one exists. The skill inspects source evidence, limits questions to costly unknowns, authors the pack, runs the local checks, and opens the SVG and PDF for visual review.</p>
<div class="prompt-card">/atlas-azure Document QuenServe's E1 offline-sync architecture from this repository. Use our established project design. Mark every material point observed, proposed, or unknown. Keep the mobile conflict and status flows numbered across the model, diagrams, and tables. Ask only if an unresolved Azure choice would materially change cost or risk.<button type="button" class="prompt-card-copy" aria-label="Copy this prompt">Copy</button></div>
</div>
</div>

<div class="tool-group">
<div class="tool-group-head"><span class="tool-badge">OpenCode</span><span class="tool-group-mechanism">Shared skill, plain ask</span></div>
<div class="tool-group-body">
<p>Name the installed skill and the source path. OpenCode reads the same contract and runs press with Node 20, assembly with Python 3, and Chromium when PDF output is requested and available.</p>
<div class="prompt-card">Use atlas-azure on plans/quenserve-e1.md. Produce architecture.json, reference-architecture.md, official-icon A4 and A3 SVG views, and branded HTML and PDF. Label assumptions as proposed or unknown, and inspect the SVG and PDF before reporting completion.<button type="button" class="prompt-card-copy" aria-label="Copy this prompt">Copy</button></div>
</div>
</div>

<div class="tool-group">
<div class="tool-group-head"><span class="tool-badge">Cursor</span><span class="tool-badge">Codex</span><span class="tool-badge">GitHub Copilot</span><span class="tool-group-mechanism">Catalog readers &mdash; shared catalog, plain ask</span></div>
<div class="tool-group-body">
<p>All three read the same installed catalog and apply <code>skills/branding/atlas-azure/SKILL.md</code> as context. They need no developer-group workflow. Ask them to report which claims came from source evidence and which remain design proposals.</p>
<div class="prompt-card">Read skills/branding/atlas-azure/SKILL.md and document QuenServe E1 from the repository. Use the named theme, keep one canonical set of numbered flows, run scripts/assemble.py, print with Chromium if available, and report visual inspection separately from consistency checks.<button type="button" class="prompt-card-copy" aria-label="Copy this prompt">Copy</button></div>
</div>
</div>

In Amp, name `atlas-azure` in the request and supply the repository or plan. Amp loads the shared skill, uses its native search tools for evidence, and runs the same local validation and rendering scripts. No separate architecture agent or cloud credentials are required.

A good ask includes:

- The repository, plan, or architecture brief to treat as the source.
- The intended readers and whether the pack needs both A4 and A3 views.
- A theme skill or established project design. If neither exists, state a concise visual preference.
- Whether to print a PDF. HTML and SVG remain useful outputs when Chromium is unavailable.
- Any known constraints on Azure region, identity, networking, data residency, availability, or cost.

## A working example

For [QuenServe]({{ '/example/' | relative_url }}) and its E1 offline inspection sync, an ask could read:

<pre><code>Document QuenServe's E1 offline-sync architecture from this repository. Use our established project design. Mark every material point observed, proposed, or unknown. Keep the mobile conflict and status flows numbered across architecture.json, the diagrams, and the flow tables. Produce A4 and A3 SVG views, reference-architecture.md, and self-contained HTML and PDF. Ask only if an unresolved Azure choice would materially change cost or risk.</code></pre>

This is a worked scenario, not a record of a live run. The [QuenServe example]({{ '/example/' | relative_url }}) establishes that inspectors work offline, attach photos and measurements, sync without loss, surface conflicts, and need sync status. It does not establish a deployed Azure service inventory. The pack must therefore preserve a distinction like this:

| Status | Example statement | Why the label matters |
|---|---|---|
| Observed | QuenServe must accept inspections completed without connectivity and later synchronize them without silent loss. | The product scenario states this behavior. |
| Proposed | Use an Azure-hosted API and asynchronous processing path for accepted sync batches. | This is a design direction until repository or plan evidence supports named services. |
| Unknown | The required region, recovery targets, tenant boundary, and expected photo volume are not supplied. | These facts can change service choice, topology, and cost. |

The model would give each component a stable identifier and each interaction a number. For example, flow 1 can describe the device submitting a queued inspection, flow 2 can describe durable acceptance, and flow 3 can describe conflict evaluation. Those numbers are illustrative until the source analysis fixes the actual sequence. Once fixed, the same wording and endpoints must appear in `architecture.json`, every relevant SVG, and the HTML flow table.

The workflow then renders `reference-architecture.md` with press, runs `python3 skills/branding/atlas-azure/scripts/assemble.py` to validate and assemble the pack, and optionally prints it with Chromium. No checksum, page count, command output, or validation result is claimed here because this page does not have a checked QuenServe fixture or a recorded run.

## What good looks like

<div class="compare-grid">
<div class="compare-card">
<div class="compare-card-head">A good pack keeps one traceable story</div>
<pre><code><span class="tok-ok">Flow 3</span>
model:   mobile-sync-api -&gt; conflict-worker
diagram: arrow 3 uses the same endpoints
table:   3. Evaluate a concurrent edit
status:  proposed
source:  plans/quenserve-e1.md, conflict section</code></pre>
<div class="compare-card-note">The number, endpoints, wording, status, and source agree. The assembler can test that consistency, and the agent separately opens the SVG and PDF to check legibility, clipping, icon use, and page composition.</div>
</div>
<div class="compare-card compare-card--warn">
<div class="compare-card-head">The wrong turn hides uncertainty</div>
<pre><code><span class="tok-warn">Azure Service Bus is deployed in two regions.</span>
source: none
status: omitted
diagram: unlabeled arrow
table: flow 7 says "send message"</code></pre>
<div class="compare-card-note">A plausible Azure choice is not an observed fact. Mark it proposed or unknown, cite what supports it, and keep the flow number and wording aligned across artifacts.</div>
</div>
</div>

## Common questions

<details class="qa">
<summary>Does the validator prove that the Azure architecture is correct?</summary>
<div class="qa-body">

No. `assemble.py` tests model shape, references, SVG structure, and agreement among components, views, and numbered flows. Those checks find internal drift. They cannot establish capacity, security, cost, availability, or fitness for a workload that has not been measured.

</div>
</details>

<details class="qa">
<summary>Why not place the SVG diagrams directly in the Markdown passed to press?</summary>
<div class="qa-body">

Press does not embed images. It remains responsible for rendering the reference prose and brand. The Python assembler adds validated diagram plates and canonical flow tables to the resulting self-contained HTML, after press has completed its narrower job.

</div>
</details>

<details class="qa">
<summary>Can the skill work from an architecture brief instead of source code?</summary>
<div class="qa-body">

Yes. A clear plan or existing brief is valid input. The skill cites that material and labels its statements according to what the brief supports. It does not require a developer-group reconnaissance step or another group's artifact.

</div>
</details>

<details class="qa">
<summary>What happens when a costly choice remains unknown?</summary>
<div class="qa-body">

The skill asks at most two or three focused questions when the answer could materially change cost, risk, or topology. If no answer is available, it records the unknown and states the consequence. It does not silently select a region, recovery target, network boundary, or service tier.

</div>
</details>

<details class="qa">
<summary>Must the diagrams use Microsoft Azure icons?</summary>
<div class="qa-body">

Azure services use official icons obtained from Microsoft sources and retain readable service labels. Generic actors, boundaries, and notes can use simple shapes. A neutral Microsoft-inspired page layout helps readers recognize the subject, but it does not claim Microsoft authorship, approval, or endorsement.

</div>
</details>

<details class="qa">
<summary>Is opening the generated files required after the tests pass?</summary>
<div class="qa-body">

Yes. The agent opens every SVG view and the final PDF. It checks labels, arrow routes, flow numbers, icon clarity, clipping, page breaks, and reading order. Tests measure consistency, not architectural truth or pixel perfection, so a green command does not replace visual inspection.

</div>
</details>

## It's working if

- Every material architecture statement is marked observed, proposed, or unknown and points to its source or lack of one.
- Every numbered flow has the same number, endpoints, and meaning in the model, diagrams, and canonical HTML tables.
- Every Azure service uses an official icon with a readable text label, and both A4 and A3 SVG views remain legible when opened.
- `assemble.py` passes its consistency checks, while the report describes those checks as consistency evidence rather than proof of architectural truth.
- The agent opens the SVG and PDF artifacts and records visual findings before handing them back.
- Missing Chromium is reported as a missing PDF capability, not hidden behind a renamed or uninspected file.

If a proposed service appears as an observed deployment, or a flow number means different things in two artifacts, the discipline has failed even when every file exists.

## Where it fits

Atlas Azure is a user-invoked branding-group skill. It owns the architecture pack from source reading through visual inspection. It is self-contained for code analysis and can also consume a plan or existing architecture brief. It does not install software, push changes, invoke developer skills, or add delivery gates.

The theme skills and `branding-system` supply the visual system. `press` renders the prose into branded HTML but does not embed the diagrams. `atlas-azure` then validates and assembles the diagram plates and numbered flow tables, and Chromium optionally prints the final PDF. This division keeps each tool's limits visible while producing one coherent reference pack.
