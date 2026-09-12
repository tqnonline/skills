# Azure provider guide

Turn code or a clear plan into an explainable architecture pack, not merely a service inventory.

## When to load

- The user requests an Azure reference architecture pack from a repository or scoped implementation plan.
- An existing architecture document needs evidence, numbered SVG views, or a branded PDF edition.

## Procedure

Load only after Atlas has obtained explicit Azure confirmation. Resolve all paths in this guide and sibling references relative to this provider directory. References to the installed directory mean this directory, not the Atlas root. This guide is not a separately invoked skill.

This workflow only authors and reviews architecture documentation. Do not deploy or provision resources on Azure, AWS, or GCP. Describe proposed runtime tests without executing them or claiming they passed.

1. Read `METHOD.md`. Establish repository path and revision or plan path and version, audience, current versus target state, output directory, and brand. Inspect instructions before code. Never execute an unfamiliar repository merely to document it.
2. Read `LANDING-ZONES.md` on every run. Gather evidence through the host's search and source-reading tools. Assess all eight platform design areas and trace critical workload paths. Consume an existing brief or platform contract, but check it against the input. Call the Skill tool with `research` when current service facts need primary sources. The analysis works without another skill group.
3. Ask at most three focused questions together when missing facts change trust boundaries, data residency, recovery, cost, service selection, or brand. Continue independent analysis. Record reversible assumptions; never silently convert unknown infrastructure into observed infrastructure.
4. Select the brand with the user. Call the requested theme skill through the Skill tool; it calls `branding-system` and can produce `press-palette.md`. Reuse an established project design when present. With neither, offer a neutral, print-first technical style or a named theme. Do not imply Microsoft authorship or endorsement.
5. Write `architecture.json`, including its required platform coverage records, and `reference-architecture.md` using `OUTPUT.md`. Distinguish observed, proposed, and unknown claims. Explain service configuration, landing-zone placement, inherited controls, workload obligations, alternatives, and failure behavior. Present the outline and consequential decisions before polishing.
6. Read `SOURCES.md` for official icon sources and Microsoft examples. Inspect the relevant samples as visual references, not architecture templates to copy blindly. Obtain only the icon families the design uses. Record source, package version, retrieval date, and hashes. Preserve official artwork; branding changes its surroundings, not the icons.
7. Read `DIAGRAMS.md`. Author editable, self-contained platform and workload SVG views from the canonical model; add network/security and recovery detail where relevant. Use exact 96 × 96-unit service-icon boxes for new Atlas diagrams; legacy validator allowances do not override this rule. Enlarge cards rather than crowd labels. Use A4 for a readable small view and A3 for a larger one; follow the explicit single-visual exception when requested. Put stable flow numbers beside directed traffic connectors and generate their explanatory tables from the same model.
8. Confirm the caller accepts the narrative for rendering, including an explicitly labeled review draft if that is the requested stage. Call the Skill tool with `press` and render the approved Markdown to HTML with the selected palette and `--html-only`. Press does not embed images; do not send it Markdown image syntax and expect diagrams.
9. Run this skill's assembler from its installed directory, using absolute input paths:

   ```bash
   python3 scripts/assemble.py --model /work/architecture.json --check
   python3 scripts/assemble.py --model /work/architecture.json \
     --html /work/narrative.html --out /work/reference-architecture.html \
     --browser /path/to/chromium
   ```

   It validates the model and SVGs, adds diagram sheets and canonical flow tables to press HTML, and prints a PDF. `--html-only` explicitly omits PDF. Node 20 powers press; Python 3.9 or newer and a Chromium-family browser power assembly. The scripts run locally and require no cloud credentials or proprietary drawing software.
10. Apply `METHOD.md`'s deployment-realism and cumulative-consistency checks. Open each SVG and the assembled HTML. Inspect every PDF page, including A3 sheets, at intended print scale. Follow `DIAGRAMS.md` and `OUTPUT.md`: check placement, labels, arrows, routes, effective icon size, flow agreement, clipping, page breaks, links, and font substitution. Capture representative views. A successful script is not evidence of architectural correctness or pixel-perfect layout.
11. Read `REVIEW.md` and run the independent quality judgment. Require evidence-backed scores from all four audience perspectives and save `quality-review.json`. Only a passing judgment permits `review-ready`; correct authorized source errors and re-review, or return the unresolved draft. Preserve frozen benchmark results.
12. Deliver the editable sources, SVGs, HTML, real PDF, icon provenance, verification receipt, and independent judgment. List unresolved assumptions and exact checks run. Keep a draft labeled as a draft. Ask the design owner to approve consequential choices; do not claim approval or publish externally.

## Stop conditions

- Input is unavailable or too vague to identify workload boundaries → ask for the repository or a scoped plan.
- A consequential choice lacks evidence or owner approval → mark the pack `needs-decision`; finish unaffected sections.
- An official icon is unavailable → use a labeled neutral placeholder only in a disclosed draft; do not claim the official-icon requirement passed.
- Model, numbering, SVG safety, or page-size validation fails → repair the source, not the check.
- Landing-zone coverage or the platform view is absent → the pack is incomplete even if its application diagram is correct.
- Browser or PDF inspection is unavailable → report `incomplete` with missing checks and files, not a completed PDF delivery.
- Independent judgment is unavailable or blocked → report `incomplete`; a completed `revise` judgment leaves `needs-decision`, never `review-ready`.
- Diagrams imply infrastructure absent from the code → separate current and proposed views before delivery.

## Output contract

`OUTPUT.md` defines the machine model, narrative sections, artifact manifest, and receipt. Status is `review-ready`, `needs-decision`, or `incomplete`; it is never inferred from the existence of a PDF. Paths in this skill resolve from its installed directory, not from a hardcoded catalog checkout. Use the host's native skill loader, file reader, browser, and artifact links; no tool-specific agent command is required.
