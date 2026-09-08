# Eval

The deterministic harness under `test/structure` and `test/scripts` proves the
repository is well formed: manifests agree, doctrine documents carry the
headings they promise, scripts behave as their contracts say. None of it can
prove a skill works. A skill is a prompt that has to win selection against
thirty-three siblings and then steer a model usefully, and a file can be
perfectly well formed and never be chosen.

This directory measures the first half of that: does the catalog's own wording
get the right skill picked.

The [Atlas Azure staged harness](atlas-azure/README.md) separately evaluates
generated architecture packs. It reveals five cumulative SaaS specifications,
freezes PDFs and diagrams, and records independent LLM critiques for four
audiences. Its controller runs offline; native agent threads perform the live
generation and review. It is a single-arm evaluation, not the paired-arm
comparison described below.

## What runs today

`run-routing.mjs` reads every promoted skill's description straight from the
tree, presents the catalog to a model alongside a labeled user utterance, and
records which skill comes back. Scoring is exact-match on the name, so no judge
model is involved and no rubric is open to interpretation.

Each case runs several times. Selection is stochastic, and a case that routes
correctly once and wrongly twice is not a passing case — measuring once would
report it as one. The default threshold is every run, because a skill that is
selected two times in three is a skill that fails a third of the people who ask
for it.

```bash
node test/eval/run-routing.mjs                 # every case, three runs each
node test/eval/run-routing.mjs --runs 5        # more attempts, tighter estimate
node test/eval/run-routing.mjs --case r001     # one case
```

The run writes a dated scorecard to `results/`, so a regression is a diff
between two files rather than something a person has to remember. A scorecard
is an immutable historical record. It can predate cases later added to the
table, but its stated case count must match its results and those results must
still agree with the case IDs and expected skills in the current table. A
missing model is a skip and never a pass: no attempt was made, so no result is
recorded.

## What it found

Two entries in `routing.jsonl` exist because the eval caught something a green
harness could not see.

`conduct` and `arrange` were both renamed from `orchestrate`, and their
descriptions were left nearly identical in shape — each opened with the
invocation axis, then "choose", then a list ending in "hybrid". A request using
`conduct`'s own vocabulary, "decide whether to run it as a loop or a graph",
routed to `arrange` on two runs out of three. Every structural test was green
while one of the two was effectively unreachable. Rewriting both descriptions to
lead with the kind of work they route fixed it.

The same probe was then used to test the claim that a thin description costs
selection. `operate`'s description was temporarily replaced with the four-word
line it used to carry, "Quality and maintainability assurance." Uncontested
requests still reached it; the contested one — thin test coverage, where `grit`
also has a claim — dropped to one run in two. A thin description does not lose
everywhere. It loses on contested ground, which is where selection is decided.

## What this does not measure

Routing accuracy is necessary and not sufficient. It says the right skill was
chosen; it says nothing about whether invoking that skill produced better work
than not invoking it. That is the paired-arm question — run a task with the
skill and without it, score the difference — and it needs planted defects,
per-task checklists, and a judge from a different model family than the one
being graded, since this repository's own rubric holds that agreement among one
model family is not verification. It is not built here yet, and this file should
not be read as claiming otherwise.

The table carries no case for `ask-fde` or `ask-pm`. They are routers, and a
case expecting a router would score the fallback rather than the selection. It
also omits `branding-system`, which is a shared dependency reached only after a
theme skill selects the profile.

## Cost

The eval is not a pull-request check. Every case is a model call, and the
workflow that carries it runs weekly or on demand — `test/structure/eval-harness.test.mjs`
fails if a `pull_request` trigger is ever added, so the cost cannot start
quietly. What does run on every pull request is everything about the eval that
needs no model: the table is valid, it names skills that exist, it covers the
catalog, and the runner states its contract.
