# Atlas evaluation and regression boundaries

There is one installed Atlas skill. Its three provider engines keep their existing contracts and deterministic test fixtures. Repository controllers remain at `test/eval/atlas-azure/run.mjs`, `test/eval/atlas-aws/run.mjs`, and `test/eval/atlas-gcp/run.mjs`; these names select experiments, not public skills. Each controller pins the entire installed Atlas source, including the common entry point, so changes to shared instructions invalidate a frozen run.

## Live experiment

Invoke Atlas in an isolated author context. Let it ask the cloud question and obtain an explicit answer before proceeding; a provider name in a fixture is not a substitute for this exchange. The orchestrator may relay the user's approved provider selection, but must record the exchange rather than fabricate it. Keep future fixtures outside the author's workspace and transfer only revealed requirements and prior frozen outputs.

Run five cumulative stages: assisted customer service, durable agent actions, offline field service, equipment events, and regional fleet operations. Each stage needs actual model, prose, SVGs, HTML, PDF, verification, and independent four-persona review. Freeze and retain negative results unchanged. Repairs belong to separately versioned runs. Finally generate one integrated solution-and-platform visual and judge it separately against all five stages.

AWS and GCP controllers already expose overview commands. The Azure controller currently automates only the five stages; its sixth overview must be separately generated, frozen, inspected, and judged under the Azure diagram and review contracts. Do not claim automated sixth-stage parity or a completed experiment from the five-stage Azure report. Controller convergence is separate from this packaging consolidation.

## Required evidence

Report results per provider and stage, with requirement coverage, persona scores, semantic and visual findings, regressions, and hashes of the exact artifacts. Pass requires all 12 scores at least 4, every required check met, no major or critical finding, no regression, complete inspection and an independent pass. A passing skill-patch review or synthetic PDF test is not a passing live experiment. Existing historical receipts remain records of the versions they evaluated, not certificates for the current skill.

## Evaluating feedback-driven changes

Keep the previous kit, artifacts and judgments immutable. A revised skill starts a new source-pinned run; do not resume an old run with changed instructions or rewrite its negative receipts. Load `QUALITY.md` and map motivating findings to Q1–Q6 before testing. Test one score of 3 among eleven scores of 4, all scores of 4, a minor regression, and a valid negative verdict through the actual validators. None of these synthetic receipts counts as a live judgment.

For an instruction change, separately challenge the revised skill with failed-region recovery dependencies, an incompatible service combination, missing durable replay context, a stale cumulative reference, and a complete but unreadable overview. Record what the model identified, missed, or left unresolved. Have an independent reviewer judge the exact patch and test evidence using skill-patch mode. This focused evaluation tests the new rules; it does not replace a fresh five-stage-plus-overview experiment or certify the earlier designs. Renderer behavior changes additionally require freshly rendered and inspected representative PDF/SVG outputs.

Run `node scripts/run-tests.mjs` from the repository. With Chromium available, set `CHROME_PATH` to its executable so the PDF integration test runs. Check one public Atlas entry, all provider assets in a copied standalone installation, required Press resolution, provider-specific negative fixtures, whole-skill source pinning, and documentation links. Rendering implementations are intentionally not merged: their placement, SVG, page-size, and review contracts differ. Future engine changes need their own regression evidence.
