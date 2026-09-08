# Independent quality judgment

Run this pass after author checks and before delivery on every architecture-pack generation or revision. It is a document and design review, not deployment certification. When changing the skill itself, use the scoped skill-patch mode below. A sample review does not establish that all future generations will pass.

## Review modes

- `architecture-pack`: assess the supplied architecture requirements and complete delivered pack. The model, narrative, views, placement, normal/denied/recovery journeys and applicable deployment contracts remain required. Do not select skill-patch mode to avoid an unresolved architecture requirement.
- `skill-patch`: assess changed skill instructions or tooling against the user's change request and motivating findings. Supply the exact changed files, diff, relevant tests and representative artifacts for affected behavior. Record an applicability table before scoring: each check is applicable or not applicable, with a reason tied to the change. For an icon-sizing sample, measure and inspect the images, typography and exported page; do not demand a fabricated canonical model or recovery journey. For a change to architecture reasoning, review the instruction response and any supplied scenario evidence separately; an instruction-only pass does not establish scenario closure. The independent reviewer must confirm that exclusions do not hide changed behavior. Missing evidence for an applicable check is a gap, not an exclusion.

Both modes retain independent review, all four perspectives, source hashes, concrete findings and the same score/severity thresholds. In skill-patch mode, score how the changed behavior supports each audience within the declared scope. Mark non-applicable architecture checks explicitly rather than grading absent architecture content. Name the mode and limits beside every reported verdict; a skill-patch pass cannot upgrade an architecture pack's status.

## Separation and inputs

Use the host's native independent reviewer or a fresh context. The author does not grade its own work. Give the reviewer the requirements, source revision, evidence and this rubric, plus the mode's required inputs. For architecture packs, include the canonical model, all delivered SVGs and actual PDF, and coverage mapping. Give prior frozen outputs when checking a revision. Do not substitute the author's conversation or verification claims for artifact inspection. Record the exposed reviewer identity only; one context applying four perspectives is not four independent experts or model diversity.

If an independent context or required artifact inspection is unavailable, record `blocked` and the missing capability. Deliver the available draft as `incomplete`, not `review-ready`. Do not silently replace independence with an author self-review or fabricate a pass.

## Review procedure

Apply every step in architecture-pack mode. In skill-patch mode, use the reviewer-confirmed applicability table; inspect every supplied representative PDF page and SVG, and record the limits of sample coverage.

1. Read the supplied requirements and relevant evidence before judging the design. Check every material subsystem against the placement and configuration tables, including dependencies present only in prose. Apply `METHOD.md`'s deployment-realism checks where relevant.
2. Open every delivered PDF page and SVG. Inspect full views and dense regions at readable scale. Check the larger-icon rule after transforms and print scaling, labels, multi-digit list markers, actual containment, arrow endpoints, contrast, and first-time-reader navigation. A text-bound check or thumbnail alone is insufficient.
3. Trace one normal customer journey, one denied or degraded journey, and recovery. Check that network, identity, durability, retention and effective permissions agree across the model, prose and visual. Explain why each alleged contradiction matters; do not invent a failure because a cloud test was not run.
4. Compare revisions for lost requirements and stale current settings. Distinguish new visual defects from inherited source defects. Preserve unresolved findings until source-backed closure; a different judge's silence is not evidence of a fix.
5. Apply all four perspectives below. Return evidence-backed findings and the decision rule's verdict. Do not repair the artifact during judgment.

## Audience rubric

Score `clarity`, `complexity`, and `understandability` from 1 to 5 for each audience. Complexity means management of necessary complexity, not number of services. Clarity measures explicit, consistent explanation; understandability measures whether the audience can perform its review task without guessing.

| Audience ID | Review task |
|---|---|
| `junior-developer` | Follow the customer journey, identify direct state ownership, understand terms, and locate implementation and denied-path details. |
| `cto` | Identify business scope, current tier choices, alternatives, cost drivers, operating commitments and decisions preventing approval. |
| `enterprise-architect` | Determine actual placement, interfaces, dependencies, deployment order and recovery gates without resolving contradictions between views. |
| `security-architect` | Trace identity and trust boundaries, effective privileges, residency qualifications, exceptions, audit and security-state recovery. |

Anchors apply to each dimension: **1** = unusable or materially misleading; **2** = substantial guessing or contradictory contracts; **3** = main task is possible with explicit follow-up; **4** = precise and actionable with minor gaps; **5** = complete for the supplied scope with traceable evidence and no material ambiguity. Do not award a high score merely because the pack is long or polished.

## Judgment record and decision

Save `quality-review.json` beside the pack. Require these fields:

- `mode`: `architecture-pack` or `skill-patch`; `scope`: requirements and, for skill patches, the reviewer-confirmed applicability table.
- `independent`: boolean; `reviewer`: exposed identity and method; `inputRevision`: reviewed source version.
- `artifactHashes`: SHA-256 values for exact reviewed inputs. Include PDF, SVGs, model and narrative for architecture packs; changed skill files, tests and supplied samples for skill patches. Do not invent hashes for excluded artifacts. A repair changes the reviewed version. Exclude the judgment itself; follow `OUTPUT.md`'s detached-manifest finalization order.
- `inspected`: artifact-relative paths, actual PDF page numbers, and dense SVG regions inspected.
- `personas`: exactly the four audience IDs, each with the three integer scores, strengths, and evidence paths/locations supporting the scores.
- `findings`: stable ID, `critical`/`major`/`minor` severity, source location, issue, consequence, recommendation, and `overview`/`source`/`export`/`skill` origin. Deduplicate shared findings while retaining persona references.
- `requirementChecks`: each supplied requirement or acceptance ID, `met`/`partial`/`unmet`, and evidence. Also cover placement, directed flows, truthful abstraction, effective icon size/readability, and cumulative consistency. In skill-patch mode only, a check outside the declared change may be `not-applicable` with the reviewer-confirmed reason; never exclude a user requirement or changed behavior.
- `verdict`: `pass`, `revise`, or `blocked`; `limitations`: unavailable evidence and unexecuted cloud tests. Record an empty findings list only when supported by the inspection.

Return `pass` only when every score is at least 3, all applicable required checks are met, and no critical or major finding remains. Minor findings remain visible. Use `revise` for an assessable deliverable that fails this rule; use `blocked` when the review cannot be completed. A disclosed internal contradiction cannot pass merely because it appears in the open-decisions section.

The author checks the record for complete coverage and valid paths, without rewriting the verdict. For architecture packs, only an architecture-pack `pass` permits final `review-ready`, and only if the other technical and visual checks also pass. A completed `revise` leaves `needs-decision`; missing required artifacts or a blocked review leave `incomplete`. For skill patches, report the patch verdict and scope without assigning status to unrelated architecture outputs. An independent pass never grants owner approval or proves Azure deployment readiness.

For ordinary delivery, correct source errors within the authorized scope and obtain a new independent assessment of changed artifacts and affected dependencies. Preserve the earlier judgment and hashes. Do not loop indefinitely on decisions requiring an owner; return the remaining draft and decisions. For a frozen benchmark, preserve the negative result and make repairs only in a separately authorized version.
