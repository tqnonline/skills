# Atlas staged evaluation harness: AWS

This offline harness controls five cumulative evaluations of Atlas (`skills/developer/atlas`) with its AWS provider profile, followed by a sixth final integrated-overview phase. It does not generate an architecture or invoke a model, API, or model CLI. It freezes supplied files, records independent review receipts, and reports the run.

## Quality bar and scenario

The test asks whether an AWS delivery team could implement the proposed architecture without inventing critical contracts. Diagram polish is not a substitute for resource placement, supported service tiers, authorization, network and DNS routes, durable state, deployment order, recovery behavior, and validation steps. The external architect personas treat missing deployment details as blocking findings. No AWS resources are provisioned, and a passing design review does not prove that a deployment works.

`cases.json` defines five cumulative stages: assisted customer service, durable agent actions, offline field service, equipment event processing, and multi-region fleet operations. The customer model uses provider-operated dedicated per-customer AWS accounts with dedicated application, data, search, and agent resources. US customers have 100–1,200 customer-service staff. Additional load, retention, availability and recovery numbers are synthetic test assumptions, not customer commitments. `rubric.json` defines anchored scores for junior developers, CTOs, enterprise architects and security architects. Higher complexity scores mean better management of necessary complexity, not more services.

## Run sequence

```bash
node test/eval/atlas-aws/run.mjs init --run /tmp/atlas-run
node test/eval/atlas-aws/run.mjs reveal --run /tmp/atlas-run
# Run the author in a separate context using stages/01/author-prompt.md.
node test/eval/atlas-aws/run.mjs freeze --run /tmp/atlas-run --artifacts /tmp/stage-01-output
node test/eval/atlas-aws/run.mjs judge-prompt --run /tmp/atlas-run
# Run the judge in an independent context using stages/01/judge-prompt.md.
node test/eval/atlas-aws/run.mjs record-judgment --run /tmp/atlas-run --judgment /tmp/judgment.json
# Repeat reveal through record-judgment for all five stages, then:
node test/eval/atlas-aws/run.mjs overview-reveal --run /tmp/atlas-run
node test/eval/atlas-aws/run.mjs overview-freeze --run /tmp/atlas-run --artifacts /tmp/overview-output
node test/eval/atlas-aws/run.mjs overview-judge-prompt --run /tmp/atlas-run
node test/eval/atlas-aws/run.mjs overview-record-judgment --run /tmp/atlas-run --judgment /tmp/overview-judgment.json
node test/eval/atlas-aws/run.mjs report --run /tmp/atlas-run
```

`init` accepts `--cases FILE` and `--rubric FILE`. Their defaults are the files beside this README. It refuses an existing run directory. The manifest records copies and hashes of both fixtures, the Git revision, and recursive hashes of the entire Atlas skill, including all three provider profiles. Reveal and freeze refuse source drift; evaluate a changed skill in a new run. This controller uses `providers/aws/scripts/assemble.py` within Atlas.

`reveal` writes `input.md` and `author-prompt.md` under the current stage. The input contains only cumulative requirements and paths to frozen preceding outputs. The next stage stays unavailable until the current output has a freeze and a valid judgment. The orchestrator must give the author only the generated prompt and named files. The fixture copies remain in the run for audit purposes and contain future stages.

`freeze` rejects symbolic links and requires `architecture.json`, `reference-architecture.md`, `reference-architecture.html`, `reference-architecture.pdf`, `verification.md`, and every SVG referenced by the model. It runs `assemble.py --check`, checks the PDF signature, and records recursive file hashes. When `pdfinfo` is installed, a parse failure also rejects the output. These checks establish file and structural integrity. They do not establish semantic or visual correctness. Every later operation rechecks all preceding frozen artifacts and recorded judgment hashes. These are local integrity checks, not protection against someone who can rewrite the manifest itself. Overview commands also reject Atlas source drift.

`judge-prompt` names the actual frozen files and embeds the pinned rubric and revealed input, without future requirements. It directs an independent reviewer to inspect every PDF page and every SVG without using the author's private reasoning. The delivered narrative is review evidence. If `pdfinfo` reported a page count during freeze, the receipt must list every page. If the tool could not report a count, the receipt must still provide a nonempty page list, but the harness cannot prove that the list is complete.

In Amp, the orchestrator runs the author and judge in native, separate threads. The harness controls disclosed inputs and validates receipts. It cannot prove that a model performed the inspection it claims. It also cannot turn an arbitrary local runner into a secure sandbox. Process or workspace isolation remains the orchestrator's responsibility. No network access, API key, or model CLI is required by the harness.

### Live orchestration protocol

1. Keep the controller and all future fixtures out of the author's workspace. Start an isolated author orb at the pinned skill revision. Transfer only the revealed input and earlier architecture outputs through native file-transfer tools. Merely telling an author not to read adjacent future fixtures is not isolation.
2. Invoke Atlas (`atlas`). The author must ask “Which cloud platform should this architecture target: Azure, AWS, or GCP?” and wait for explicit AWS confirmation before loading that provider profile. Use the fixture's approved neutral review-draft style. Let the author perform its normal generation and self-inspection before freeze. Preserve warnings and failures. Do not modify the skill during a run.
3. Download the delivered archive, inspect its contents, and freeze the output with this controller. Save the author execution identity and transfer details alongside the run. Local artifact paths must be remapped explicitly when transferring between orbs.
4. Start a new independent judge context for each stage. Transfer the generated judge prompt, this schema, the frozen artifact pack, and previous frozen packs for regression comparison. Do not provide the author's conversation or later requirements. Have the judge inspect the actual PDF and rendered SVGs, then return a JSON judgment with evidence.
5. Record the judgment unchanged. A valid negative judgment permits the next reveal: this is an evaluation, not a loop that edits outputs until they pass. The original result remains frozen. Do not feed judge findings to the author during the baseline run; a later feedback-assisted run would be a separate experiment.
6. Repeat through Stage 5. A negative valid judgment still advances the evaluation and never becomes a derived pass.
7. Reveal and run the final integrated overview in a new author context. It requires `integrated-overview.svg`, a real single-page A1 `integrated-overview.pdf`, and `coverage.json` bound to the Stage 5 model hash. Coverage must name every Stage 5 node, flow, and subsystem view ID. The SVG must correspond to those IDs, preserve truthful boundaries, and render every official icon at exactly 96 by 96 sheet units. Keep the detailed Stage 5 views separately.
8. Run the overview judge independently across the same four personas. Record checks `O1-A1` through `O1-A4` for hidden omissions, canonical correspondence, exact icon size, and truthful boundaries. Then generate the report.

Each record command preserves the submitted object as `raw-judgment.json`. It writes the controller's derived fields to the separate `judgment.json` receipt. Both are hash-bound in the run manifest.

The final overview freeze requires `pdfinfo` from Poppler. The controller uses it to parse the page count and page size. It does not infer PDF structure with regular expressions. The overview SVG passes the same safe-element, endpoint, flow-label, embedded-icon-byte, and official-icon provenance checks as a normal Atlas view.

One judge context applying four personas is not four independent experts. Separate contexts reduce author self-review bias but do not prove model-family independence. Record only runtime/model identities actually exposed by the host. The first run is exploratory: it has no no-skill control, repeated samples or calibrated inter-rater agreement, so it cannot establish causal improvement or statistical reliability. Live runs incur model and rendering costs and are not automatic pull-request checks.

## Judgment JSON

The judgment file has this shape:

```json
{
  "stage": 1,
  "reviewer": { "thread": "thread-or-runtime-identifier" },
  "independent": true,
  "inspected": [
    { "path": "reference-architecture.pdf", "pages": [1, 2] },
    { "path": "architecture-overview.svg" }
  ],
  "personas": [
    {
      "id": "junior-developer",
      "scores": { "clarity": 4, "complexity": 4, "understandability": 4 },
      "evidence": [
        { "path": "reference-architecture.pdf", "location": "page 2, flow 1", "observation": "The flow states its protocol and identity boundary." }
      ],
      "strengths": ["Numbered flows connect the diagram to the narrative."],
      "findings": [
        { "severity": "minor", "path": "architecture-overview.svg", "location": "node api", "issue": "The acronym is undefined.", "recommendation": "Expand it on first use." }
      ]
    }
  ],
  "requirementChecks": [
    { "id": "S1-A1", "status": "met", "evidence": "reference-architecture.pdf page 2 shows the required flow." }
  ],
  "regressionFindings": [],
  "verdict": "pass"
}
```

The `personas` array must contain exactly `junior-developer`, `cto`, `enterprise-architect`, and `security-architect`; the example abbreviates the other three objects. Each persona must have exactly the three dimensions `clarity`, `complexity`, and `understandability`, scored with integers from 1 through 5. Evidence and finding paths must name hashed frozen files. Locations and observations must be nonempty. Findings use `critical`, `major`, or `minor` severity.

Requirement checks must contain every cumulative acceptance ID exactly once. The harness assigns IDs by stage and acceptance-array position, such as `S1-A1`. Status is `met`, `partial`, or `unmet`. The receipt must also contain a string array for regressions and a `pass`, `revise`, or `blocked` verdict.

The model's verdict is advisory. The harness derives `passEligible`. Eligibility requires all 12 scores to be at least 4, no critical or major finding, every requirement to be met, and no regression finding, including minor regressions. A higher score cannot offset a score below 4. Record every regression in `regressionFindings`, regardless of severity. The same gate applies to the final integrated overview. The stored receipt records whether the submitted verdict agrees with that derivation. The report never upgrades a model's `blocked` or `revise` verdict to `pass`; a model's unsupported `pass` becomes `revise`.

`report` writes `report.json` and `report.md`, with persona scores, findings, requirement checks and links to the artifacts. Each stage is marked `complete`, `in-progress`, `skipped`, or `not-run`; normal sequential operation produces complete, in-progress, and not-run states, while skipped is reserved for a manifest that records a later stage without a prior reveal. `complete` describes execution, not architecture quality.

Run the deterministic controller checks with `node --test test/scripts/atlas-aws-eval.test.mjs`. Their synthetic PDFs and judgments test the state machine and are never reported as live model evaluations.
