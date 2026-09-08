---
name: atlas-gcp
description: Builds evidence-grounded Google Cloud reference architectures from repositories or requirements, with official-icon SVG diagrams, HTML, PDF, and independent quality judgment. User-invoked. Use when asked to document a GCP architecture or produce an architecture review pack.
requires: press
---

# Atlas GCP (user-invoked)

Turn evidence into an explainable Google Cloud architecture pack, not a renamed Azure diagram.

## Contract

```yaml
contract:
  invocation: user
  thesis: evidence
  verbs: [read, write-repo]
  scope: guest
  trace: none
```

## When to invoke

- The user requests a Google Cloud reference architecture from code or requirements.
- A GCP architecture needs official-icon diagrams, a review PDF, or a cumulative quality evaluation.

## Procedure

1. Read `METHOD.md`. Record input revision, repository/plan/mixed mode, audience, current versus target state, output profile and directory. Inspect repository instructions. Never run unfamiliar code to discover its architecture.
2. Read `GCP-FOUNDATIONS.md` and `GCP-SEMANTICS.md` on every run. Assess all eight foundation areas, distinguish ownership from network attachment, and trace critical workload paths. Read `AGENTS-AND-SAAS.md` when agents or commercial SaaS appear.
3. Ask at most three focused questions together about missing consequential constraints. Continue independent work. Mark synthetic or reversible assumptions; do not infer deployed resources from SDK imports or a proposed plan.
4. Reuse an approved project brand or ask for a theme. Call the requested theme through the Skill tool; it calls `branding-system`. A neutral, white-paper technical style is suitable for a disclosed review draft. Google artwork is not a product endorsement.
5. Read `OUTPUT.md`; write the canonical `architecture.json` and `reference-architecture.md`. Reconcile requirements, configurations, alternatives, inherited controls, owners, failures, and open decisions. Present consequential design choices before polishing. Approved review-draft rendering does not approve deployment.
6. Read `SOURCES.md`. Verify selected product variants, locations, limits and official icon mappings against current primary sources. Call the Skill tool with `research` when needed. Record retrieval dates and original asset hashes. Never rename API identifiers merely to match a marketing label.
7. Read `DIAGRAMS.md`. Build self-contained, editable platform and workload SVGs with stable numbered directed flows. Use official service-icon boxes exactly 96 × 96 units at the declared scale. Add network/security and recovery views when needed. An explicitly requested integrated overview is one coherent visual, not a contact sheet.
8. Call the Skill tool with `press` to render the accepted Markdown or labeled review draft to narrative HTML with `--html-only` and the chosen palette. Resolve the installed script path. Press does not embed diagram images; the assembler owns them.
9. Run `python3 scripts/assemble.py --model /work/architecture.json --check` from this skill's installed directory. Then run `python3 scripts/assemble.py --model /work/architecture.json --html /work/narrative.html --out /work/reference-architecture.html --browser /path/to/chromium`. Use absolute inputs. This produces a real PDF; `--html-only` is an explicit reduced profile, not PDF parity.
10. Apply the semantic and cumulative checks in `METHOD.md`. Open every SVG, assembled HTML and every PDF page. Check actual arrow endpoints, placement, icon size, clipping, legibility, contrast, searchability and page dimensions. Save inspection evidence. Script success is not architectural correctness.
11. Read `REVIEW.md`. Freeze exports, obtain an independent four-audience LLM judgment of the actual documents and diagrams, and validate the hash-bound receipt. Only a valid architecture-pack pass plus completed author checks permits `review-ready`. Preserve failures and separately version repairs.
12. Deliver the sources, SVGs, HTML, actual PDF, palette, provenance, verification receipt, judgment and detached hashes. For cumulative or skill-quality experiments, read `EVALUATION.md`; reveal one stage at a time and independently judge the final integrated overview.

## Stop conditions

- Missing input or consequential owner decision: ask the smallest blocking question; finish unaffected sections and label the draft `needs-decision`.
- Invalid GCP placement, unsafe SVG, missing official artwork, broken export, or unsupported service claim: repair the source or report the gap. Never weaken validation to obtain a pass.
- Missing PDF or visual inspection in a full-profile run, or unavailable independent review: `incomplete`.
- A completed negative judgment: `needs-decision`, not `review-ready`. Preserve the original evaluation result.
- Never provision resources, read secret stores, certify compliance, or claim tested recovery merely to author a reference design.

## Output contract

`OUTPUT.md` defines files and the canonical model. `REVIEW.md` defines independent judgment. `review-ready` means ready for human architecture review, not deployment approval. This draft is not promoted into the catalog until its packaging and evaluation evidence support that decision. Scripts must work from the installed directory without another Atlas skill or cloud credentials.
