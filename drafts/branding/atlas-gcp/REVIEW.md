# Independent quality judgment

Run this gate after author inspection on every generated or revised pack. A fresh independent context reviews the actual evidence and artifacts, not the author's private reasoning. One reviewer applying four perspectives is not four independent experts or evidence of model diversity. Record only identities exposed by the host.

## Modes and inputs

`architecture-pack` requires the revealed requirements, source revision, canonical model, narrative, all SVGs, HTML, actual PDF, evidence and prior frozen packs for revisions. `skill-patch` reviews changed instructions/tooling, exact diff, tests and affected samples; the reviewer confirms an applicability table first. A skill-patch pass cannot approve a scenario or excuse a missing changed-behavior test.

Read requirements first. Open every PDF page and SVG, including dense regions at readable scale. Trace one normal journey, a denied/degraded journey and recovery. Check actual resource placement, authorization, state, networking, source support, effective 96-unit icon size, arrows, labels, print layout and cumulative consistency. Preserve prior findings until source-backed closure. Do not repair artifacts during judgment.

For diagram readability, verify concise action labels beside arrows and separate stable reference badges. A reader must not need the flow table merely to identify an action. Inspect titled, bulleted rule callouts and actual labeled line-and-arrow legend samples, with print and legal metadata separate. Check nearby route qualifications, unobscured connectors, and readable full-view and close-up browser/PDF renders at the declared size. Record missing or ambiguous presentation as findings under directed flows and readability; passing geometry or text extraction alone is insufficient. Preserve provider icon rules and disclose reduced-paper readability limits.

Count the introduction: only a title and a plain-English description of 50–100 words may appear above the diagram. Check that all legends and supporting notes sit below it in aligned sections, while necessary component/action labels and short route qualifiers remain visible in the body. Verify every architecture connector uses straight horizontal or vertical segments and right-angle bends, with no curves or ambiguous junctions. Inspect the actual SVG and PDF header, footer, and dense routing at the declared print scale. Treat unexplained jargon, misplaced legends, and routed text collisions as review findings, not cosmetic preferences.

## Four perspectives

| ID | Review task |
|---|---|
| `junior-developer` | Follow the customer journey, state ownership, terms and implementation/denied-path details without guessing. |
| `cto` | Find business scope, trade-offs, costs, commitments, material risks and decisions blocking approval. |
| `enterprise-architect` | Determine deployment placement, interfaces, dependencies, service variants, migration and recovery gates consistently. |
| `security-architect` | Trace identity, trust, effective permissions, customer isolation, qualified residency, audit and security-state restoration. |

Each scores `clarity`, `complexity`, and `understandability` from 1–5. Complexity measures management of necessary complexity, not number of services. Anchors: 1 unusable/misleading; 2 substantial guessing/contradiction; 3 main review task possible with explicit follow-up; 4 actionable with minor gaps; 5 complete for supplied scope with traceable evidence. Length and polish do not justify high scores.

## Receipt

Save `quality-review.json` with:

- `mode`, `scope`, `independent: true`, `reviewer`, `inputRevision`.
- `artifactHashes`: mapping of artifact-relative paths to actual SHA-256 for exact reviewed inputs. Architecture packs include canonical JSON, Markdown, HTML, PDF and every referenced SVG. Exclude the judgment itself and detached final manifest.
- `inspected`: objects with `path`; the PDF also lists every actual integer `pages` value; SVG records name inspected `regions`.
- `personas`: exactly four objects with `id`, `scores` containing the three integer dimensions, nonempty `evidence` and `strengths`.
- `findings`: stable `id`, severity `critical`/`major`/`minor`, `path`, `location`, `issue`, `consequence`, `recommendation`, and `origin` (`overview`, `source`, `export`, `skill`).
- `requirementChecks`: objects with `id`, `status` (`met`, `partial`, `unmet`) and evidence. Supply every required ID from the input plus `placement`, `directed-flows`, `truthful-abstraction`, `icon-readability`, `cumulative-consistency`. Skill-patch-only exclusions require an applicability reason and must not exclude changed behavior.
- `verdict`: `pass`, `revise`, or `blocked`; `limitations`: unavailable evidence, sampled checks and unexecuted cloud tests.

For machine coverage, put `requirements: [{"id":"S1-A1"}, ...]` in the architecture model for all supplied acceptance IDs. The validator checks that exact ID set plus the five generic checks. It requires `pdfinfo` to determine full page coverage. Receipt checks cannot prove that a reviewer actually inspected pixels or understood the design.

Pass requires every score ≥3, every required check met, no major/critical finding, actual required inspection and intact hashes. Use `revise` for assessable defects and `blocked` for unavailable evidence/capability. A disclosed contradiction is not a passing design. Run `scripts/validate-review.py` before setting final status. Missing author semantic/visual checks still prevent review-ready even if the receipt validates.

Freeze exports, judge, validate the receipt, then write final verification and detached hashes. Repairs use a new version and preserve earlier findings. Benchmark judgments remain unchanged; do not feed critique into the baseline author's next stage. The benchmark controller uses its documented receipt schema; it must enforce the same score, artifact and inspection gates rather than treating a skill-patch receipt as an architecture judgment.
