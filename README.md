# tqnonline/skills

This is the skills repository of The Quentin (tqnonline): a curated, growing bundle of the AI-native skills we use across our work — authored once, running the same way in Claude Code, OpenCode, Codex, Cursor, GitHub Copilot, and Amp. We are curating and building AI-native skills that deliver business value through trusted agents with human judgment — driving growth in personal, professional, and sustainable accomplishments. Software delivery is where we started, because it is where we could prove the method; it is one group among six, not the repository's identity.

**Full documentation:** every skill has its own page at [tqnonline.github.io/skills](https://tqnonline.github.io/skills/). Start with [the grit page](https://tqnonline.github.io/skills/grit/) to see the pattern the rest of the catalog follows.

## The thesis

Every skill here, whatever its group, carries one philosophy: **Set the frontier: redefining growth with human judgment and trusted AI agents**. Knowledge work is being redefined by where value now concentrates — at the two ends of any process, not the middle. Human judgment holds the gates; trusted agents do the work in between; and routine execution, which artificial intelligence has made a baseline capability, stops being the differentiator. A branding skill applies this the same way a delivery skill does: the agent drafts and renders, a person owns the message and signs the result. This repository invests where the advantage still lives — encoded judgment at one end (grill loops, gates, contracts, routing rules) and verified, trustworthy execution at the other (separate verifiers for consequential work, a provider policy enforced in continuous integration, a model registry kept current by an honest, disclosed research process).

![Set the frontier — value concentrates at the two ends](docs/assets/set-the-frontier.svg)

## Skill groups

Six groups, each a bounded area of work rather than a technology layer. Each group installs on its own: any group may reference `core`, and no group references another, so adopting one never drags in the rest. All six groups are shipping, and every group has at least one promoted skill.

| Group | What it is | Status |
|-------|------------|--------|
| **Core — shared doctrine** | The doctrine and tooling more than one group needs, belonging to no audience in particular: verification before completion, coverage, the grill round protocol, value probing, the run trace, and three skills — `grit`, `research`, and `retro`, the loop that reads the traces back. Every group may reference it; it references none of them. | Shipping |
| **Developer — the AI-native SDLC** | The software delivery lifecycle rebuilt for humans plus trusted agents: inception, backlog, design, implementation, secure DevOps, reliability, and maintenance, plus the daily craft of test-first work, diagnosis, prototyping, deepening, shared language, issue triage, and human-step wizards — 22 skills. | Shipping |
| **PM — the AI-native transformation practice** | The business side of the same AI-native transformation coin: discovery, TOM design, epic and PRD authoring, business cases grounded in cost including the agent fleet's own, roadmapping, RAID, benefits realization against a north star, and 4Ps leadership reporting, plus charting work too big for one session — 16 skills. | Shipping |
| **Branding** | One shared verbal, visual, accessibility, physical, and motion system applied across product UI, documents, print, environmental work, and video. Six theme skills use open-source fonts and accessible light and dark roles; `press` renders approved documents, `exhibit` builds interactive explanations, and `atlas-azure` produces reference architecture packs with official-icon SVGs and branded PDFs. | Shipping — 10 skills |
| **Writing** | The writing sequence, explore then structure then render: `freewrite` mines raw material with judgment held off, `outline` orders it into beats and grounds every term before a beat leans on it, and `draft` renders prose one beat at a time against an auditable coverage map — 3 skills. | Shipping |
| **Productivity** | Delightful automations: the personal and team workflows worth never doing by hand again. `brief` places agent rules, `handoff` carries a run forward, `questionnaire` reaches the person who can decide, `wait-what` repairs a failed explanation, `teach` carries a concept across sessions, and `spotlight` turns established context into the smallest source-grounded visual — 6 skills. | Shipping |

## The operating model

What follows walks the first fully built group — the AI-native SDLC — in depth; it is the worked example of the thesis, and the pattern the other groups will follow. Its skills implement one journey, from a raw idea to a system running in production, framed by four human gates. Everything between the gates is agent-run: a single writer per checkout, a separate verifier wherever the output feeds a consequential decision.

![The operating model — four human gates, agents in between](docs/assets/operating-model.svg)

The `conduct` skill decides whether a task runs as a loop, a graph, or a hybrid, following the evidence-backed rules in its `RUBRIC.md` — routing on whether an outcome can be verified, never on how difficult it appears. It resolves a model for each step through `model-routing`, and for any high-consequence write it inserts a `human` node with a named owner and a service-level agreement, not a plain stop condition. That routing decision is one phase of a broader, self-maturing discipline every real-work skill runs — the **4D Diamond**: Discover, Define, Design, Deliver — orthogonal to the four gates above: the gates decide when a human signs off, `DDDD.md` describes how a skill does its own work in the stretch between one gate and the next. Drawn as a diamond, the four phases sit at its four points and the one baseline they mature together sits at the summit their four facets converge on and elevate — enriched and accomplished, not just finished. The pm group runs its own version of the same cycle, routing its execution shape through its own router, `arrange` — grill-loop, parallel-fan, or hybrid — rather than loop, graph, or hybrid; see [Architecture: PM arrange](wiki/Architecture-PM-Arrange.md).

![The 4D Diamond — Discover, Define, Design, Deliver, elevating one summit](docs/assets/4d-diamond.svg)

## AI-native delivery: agentic pods and dynamic workflows

Delivery itself runs as three orchestrated stages, built on Claude Code's dynamic-workflow runtime with full parity on OpenCode's deterministic runner. Each stage applies the same discipline the inception grill applies to ideas: deep, fact-finding introspection before action, at every step. The assessment stage interrogates a work item from four independent perspectives — contract completeness, alignment with the signed PRD, the reality of the codebase, and the design tradeoffs the item makes without stating them — verifies every finding adversarially as each perspective lands, and posts what it learned back to the item's thread. Those answers refine the work item where it lives: in the backlog. Nothing is implemented until a human reads the critique and moves the item to `ready`.

![AI-native delivery — three workflows with human gates between runs](docs/assets/delivery-pipeline.svg)

A change too large to hold in a reviewer's head never ships as one giant pull request. The delivery workflow plans in layers, commits per layer, and raises a dependency-ordered stack of single-concern pull requests — a multi-concern change stacks by default, never as a fallback for when someone remembers to ask for it — with the `gh stack` tooling, now backed by GitHub's own native stacked-PR public preview: a stack map on the pull request itself, and an automatic server-side rebase and retarget of every layer above one that merges. The shakedown then evaluates each layer against its own stack base, checks its coverage and use-case traceability against explicit floors — 85-90% on the business capability itself, 75-80% at integration boundaries — and consumes the checks the repository already runs (including GitHub Code Quality on its separate Actions path) rather than repeating them. Before any of it is reported done, a verification-before-completion pass opens the actual diff and checks it against the work item; a green build is evidence nothing broke, not evidence the right thing shipped. The full doctrine lives in [STACKING.md](skills/developer/deliver/STACKING.md), [COVERAGE.md](skills/core/COVERAGE.md), [VERIFICATION.md](skills/core/VERIFICATION.md), and [REPO-SETUP.md](skills/developer/deliver/REPO-SETUP.md) — the readiness checklist these skills follow, or set up, in every repository they work on.

This is a research-driven system, and it evolves with the field. The routing rules cite the findings they rest on. The model registry is curated against live provider catalogs on a disclosed schedule, with every change arriving as a reviewable pull request. Structural decisions are recorded as architecture decision records, and a deterministic test harness — 123 checks and growing — keeps the documentation, the policies, and the workflows honest as the practices they encode keep moving.

## Choose your altitude

The same gates, contracts, and evidence serve every rung of a career; what changes is the question each persona asks of them.

![One system, every altitude — from first job to the C-suite](docs/assets/persona-ladder.svg)

### For leaders — CIO · CDAIO · CTO

This model gives a concrete answer to a question that is often left vague: who is accountable when an AI agent acts. Every consequential decision has a named human owner and a service-level agreement, not an unspecified "human in the loop." Every agent action traces back to an approved PRD, a recorded governance tier, and an audit trail, rather than a chat transcript someone might reconstruct after the fact. Model selection follows a registry that is reviewed on a schedule and checked in continuous integration. For a CTO, the delivery pipeline is what AI-native throughput looks like without giving up review quality: stacked, reviewable pull requests and a sandboxed shakedown on every one. For a CDAIO or CIO, the governance overlay turns responsible-AI frameworks into work items with tests. Start at [wiki/Architecture-Role-Journey.md](wiki/Architecture-Role-Journey.md) and [skills/developer/responsible-ai-governance](skills/developer/responsible-ai-governance/SKILL.md).

### For architects and engineering managers

The routing rule underneath the gates is simple to state and consistently applied: route on whether an outcome can be verified, not on how difficult a task appears. See [wiki/Architecture-Loop-vs-Graph.md](wiki/Architecture-Loop-vs-Graph.md) for the full rule. A model is assigned per task, not per project. A single writer holds each checkout, with a separate verifier wherever one agent grading its own work would be a conflict of interest. Delegation happens through a work-item contract precise enough that anyone picking it up cold — a person or an agent — can act on it correctly; see [wiki/Architecture-Agentic-Pods.md](wiki/Architecture-Agentic-Pods.md).

### For developers

To install the skills and start using them:

```bash
npx skills@latest add tqnonline/skills
./scripts/install-adapters.sh
```

From there: run `/impact` to turn a raw idea into a PRD that has been through the grill loop, run `/sdlc` to carry out a gated build against it, and run `/shakedown <PR#>` to have any pull request built, tested, and reviewed by an agent in an isolated sandbox before merge. `scripts/pipeline.sh` drives the full assess-deliver-shakedown pipeline on either engine. Per-tool setup for Claude Code, OpenCode, Codex, Cursor, GitHub Copilot, and Amp is at [wiki/Tool-Guidance.md](wiki/Tool-Guidance.md) and [wiki/Installation.md](wiki/Installation.md).

### Starting out

If you are early in your career, this system is built to grow your judgment, not to exercise it for you. The gates do not hand you answers; they hand you the questions experienced engineers have learned to ask — what evidence says this is done, what single concern does this change carry, what would refute this finding — and they put those questions to you on every work item. A critique from the assess stage arrives as open questions on the thread, and answering them well is your work, not the agent's. Treat every gate as a repetition at judgment: the goal is to internalize the questions until you would ask them unprompted, which is the point where the system has succeeded and you have outgrown needing it as a crutch. Begin with [wiki/Skill-Impact.md](wiki/Skill-Impact.md) to see how an idea becomes a plan, then follow one work item through [wiki/Architecture-Agentic-Pods.md](wiki/Architecture-Agentic-Pods.md) — and when a critique lands on your item, write the answers yourself before reaching for an agent.

### For the business side — PM · Business Architect · Transformation Leader · CBTO

The pm group climbs a parallel ladder on the business side of the same AI-transformation coin, with the same gates and the same evidence discipline as the developer ladder above — not a second system, the other half of the first one.

![The other side of the coin — from PM to Chief Business Transformation Officer](docs/assets/persona-ladder-pm.svg)

A product or program manager starts at `discover`, `map`, and `carve`, learning root cause and DIVE the way the developer ladder's early rungs teach critique before code. A business architect runs `tom-architect` for process decomposition, maturity assessment, and platform capability mapping, then applies the pre-gate blind-spot checklist an agent owner runs before every gate. A transformation leader works the roadmap and the RAID registers, treating the agent fleet as a team they own rather than a tool they invoke. At the top of the ladder, a Chief Business Transformation Officer asks the same question a CDAIO asks on the engineering side — accountability — answered here through `realize`'s north-star rollup and `case`'s costing, which accounts for the agent fleet's own token and run spend alongside build, run, and opportunity cost. Start at [wiki/Group-PM.md](wiki/Group-PM.md) and [wiki/Personas.md](wiki/Personas.md#the-pm-ladder), or run `/ask-pm` with a plain description of what you are trying to do.

## Install

```bash
npx skills@latest add tqnonline/skills
./scripts/install-adapters.sh
```

Adapters are idempotent; use `./scripts/install-adapters.sh --dry-run` to preview.

## Skills index

Every skill has a wiki page covering what it is, how to use it, and its best practices. The full index with one-line purposes is at [wiki/Home.md](wiki/Home.md).

### Core — shared doctrine

Doctrine every other group may reference, and which references no group in return: `VERIFICATION.md`, `COVERAGE.md`, `GRILL.md`, and `VALUE.md` sit at the group root alongside its one skill.

| Skill | Invocation | Purpose |
|-------|------------|---------|
| [research](skills/core/research/SKILL.md) | model | Investigate a question against primary sources and capture cited findings as a file in the repository |
| [retro](skills/core/retro/SKILL.md) | user | Mine accumulated run traces for repeating failure patterns and propose skill changes a human approves |
| [grit](skills/core/grit/SKILL.md) | user | Completion discipline for substantial agent work — an acceptance-gate ledger written before implementation, a 5-10 layer verification depth tree, and a met, unmet, and abandoned audit backed by runnable gates |

### Developer — the AI-native SDLC

| Skill | Invocation | Purpose |
|-------|------------|---------|
| [conduct](skills/developer/conduct/SKILL.md) | model | Choose loop/graph/hybrid execution, assign a model per node, map to harness adapters |
| [model-routing](skills/developer/model-routing/SKILL.md) | model | Resolve the tier and role assignment for a task node from the canonical registry — shared by every group, not developer-only |
| [update-models](skills/developer/update-models/SKILL.md) | user | Research provider catalogs and propose an evidence-backed registry update — curates the registry every group routes through |
| [impact](skills/developer/impact/SKILL.md) | user | Idea-to-PRD pipeline: grill loop, value probing, governance-tier recording, backlog handoff |
| [recon](skills/developer/recon/SKILL.md) | model | Brownfield codebase brief via signal-first archetype triage, read-only |
| [slice](skills/developer/slice/SKILL.md) | model | Decompose a signed PRD into epics, features, stories, and operability items |
| [raise](skills/developer/raise/SKILL.md) | model | Publish sliced backlog to GitHub, Linear, or Azure DevOps with pickup-protocol labels |
| [sdlc](skills/developer/sdlc/SKILL.md) | user | Full gated SDLC loop — SPEC-TS ledger, human gates, verifier challenge |
| [architect](skills/developer/architect/SKILL.md) | mixed | Cross-cutting technical design and ADRs at the design gate |
| [safeguard](skills/developer/safeguard/SKILL.md) | mixed | Security assessment and hardening at the secure-DevOps gate |
| [deliver](skills/developer/deliver/SKILL.md) | mixed | CI/CD, supply chain, release readiness, stacked PRs, and repo setup |
| [operate](skills/developer/operate/SKILL.md) | mixed | The post-release lane: SLOs, instrumentation, and incident readiness; quality assurance and test gaps; patch cadence and technical-debt burn-down |
| [shakedown](skills/developer/shakedown/SKILL.md) | user | Sandbox build, test, execute, and agent-reviewed pass on any pull request before merge |
| [ask-fde](skills/developer/ask-fde/SKILL.md) | user | Router mapping intent to the correct developer, pm, or branding skill |
| [responsible-ai-governance](skills/developer/responsible-ai-governance/SKILL.md) | overlay | Regulated-industry and responsible-AI governance applied on top of the stack rules |
| [tdd](skills/developer/tdd/SKILL.md) | model | Test-first delivery of one vertical slice at a time, refactoring only under green |
| [debug](skills/developer/debug/SKILL.md) | model | Gated diagnosis loop for hard bugs and performance regressions, one falsifiable hypothesis at a time |
| [prototype](skills/developer/prototype/SKILL.md) | model | Throwaway build that answers one design question, then is deleted or deliberately graduated |
| [refactor](skills/developer/refactor/SKILL.md) | user | Survey a codebase for deepening opportunities, then work the one a human picks |
| [glossary](skills/developer/glossary/SKILL.md) | model | Build and sharpen the project's shared language, with an explicit avoid list per term |
| [triage](skills/developer/triage/SKILL.md) | user | Move issues and external pull requests through a state machine of triage roles, ending in an agent-ready brief |
| [wizard](skills/developer/wizard/SKILL.md) | model | Generate a resumable shell wizard for the steps only a human can perform |

### PM — the AI-native transformation practice

| Skill | Invocation | Purpose |
|-------|------------|---------|
| [arrange](skills/pm/arrange/SKILL.md) | model | Choose grill-loop, parallel-fan, or hybrid execution shape for multi-round pm work |
| [chart](skills/pm/chart/SKILL.md) | user | Chart work too big for one session as decision tickets on the tracker, resolved one at a time |
| [constitution](skills/pm/constitution/SKILL.md) | user | Product Constitution author and reviewer — principles, positioning, quarterly review |
| [discover](skills/pm/discover/SKILL.md) | user | Business problem discovery and root-cause analysis |
| [map](skills/pm/map/SKILL.md) | model | Personas, process flows, and the Business Understanding Document |
| [tom-architect](skills/pm/tom-architect/SKILL.md) | user | Target Operating Model: L1-L4 processes, maturity, RACI, platform mapping |
| [carve](skills/pm/carve/SKILL.md) | model | DIVE-tested epic decomposition into a manifest |
| [prd-draft](skills/pm/prd-draft/SKILL.md) | user | One INVEST-compliant PRD per approved epic, with the nine-check structural validation pass |
| [prd-review](skills/pm/prd-review/SKILL.md) | user | 11-Star Experience Framework PRD scoring |
| [case](skills/pm/case/SKILL.md) | user | Business case with agent-fleet costing for the Investment gate |
| [roadmap](skills/pm/roadmap/SKILL.md) | user | Now/next/later sequencing and PI planning |
| [raid](skills/pm/raid/SKILL.md) | user | Risks, Assumptions, Issues, Dependencies registers |
| [realize](skills/pm/realize/SKILL.md) | user | Benefits realization against the north star |
| [report](skills/pm/report/SKILL.md) | user | 4Ps leadership pack at five cadences |
| [grill](skills/pm/grill/SKILL.md) | user | Plain / with-docs / provoke interrogation before a gate |
| [ask-pm](skills/pm/ask-pm/SKILL.md) | user | Router mapping intent to the correct pm skill |

### Branding

| Skill | Invocation | Purpose |
|-------|------------|---------|
| [everforest-branding](skills/branding/everforest-branding/SKILL.md) | user | Apply a warm botanical identity across digital, print, environmental, and motion surfaces |
| [catppuccin-branding](skills/branding/catppuccin-branding/SKILL.md) | user | Apply a precise pastel identity with accessible light and dark roles |
| [ai-branding](skills/branding/ai-branding/SKILL.md) | user | Apply an Anthropic-inspired identity by default or a separate OpenAI-inspired profile |
| [gruvbox-branding](skills/branding/gruvbox-branding/SKILL.md) | user | Apply an earthy retro-modern identity with strong technical character |
| [nord-branding](skills/branding/nord-branding/SKILL.md) | user | Apply a cool, spacious identity with neutral evidence and clear structure |
| [solarized-branding](skills/branding/solarized-branding/SKILL.md) | user | Apply a restrained blue-and-gold identity across light and dark environments |
| [press](skills/branding/press/SKILL.md) | user | Render an approved markdown document to a branded HTML page and PDF |
| [branding-system](skills/branding/branding-system/SKILL.md) | model | Apply the shared verbal, surface, accessibility, provenance, motion, and verification contract |
| [exhibit](skills/branding/exhibit/SKILL.md) | user | Build an interactive, branded HTML page that walks a reader through a topic as a journey |
| [atlas-azure](skills/branding/atlas-azure/SKILL.md) | user | Turn a repository or plan into an evidence-grounded Azure architecture pack with numbered SVG diagrams and a branded PDF |

### Productivity

| Skill | Invocation | Purpose |
|-------|------------|---------|
| [brief](skills/productivity/brief/SKILL.md) | user | Author the rules, definitions, and boundaries a team's agents read, placed per tool surface |
| [handoff](skills/productivity/handoff/SKILL.md) | user | Project a run's trace into a document another session or person picks up cold |
| [questionnaire](skills/productivity/questionnaire/SKILL.md) | user | Turn a decision you cannot answer alone into a questionnaire for the one person who can |
| [wait-what](skills/productivity/wait-what/SKILL.md) | user | Diagnose why an explanation failed, then take a different route to the same point |
| [teach](skills/productivity/teach/SKILL.md) | user | Teach a concept across sessions, checking understanding by application rather than recall |
| [spotlight](skills/productivity/spotlight/SKILL.md) | user | Turn established context into the smallest source-grounded visual that helps a human understand or decide |

### Writing

The sequence runs explore, then structure, then render. Each stage hands its output to the next, and each is invoked on its own.

| Skill | Invocation | Purpose |
|-------|------------|---------|
| [freewrite](skills/writing/freewrite/SKILL.md) | user | Mine raw fragments with generation held apart from judgment, keeping contradictions rather than resolving them |
| [outline](skills/writing/outline/SKILL.md) | user | Order fragments into beats, grounding every term before a beat leans on it |
| [draft](skills/writing/draft/SKILL.md) | user | Render an outline into prose one beat at a time, against an auditable coverage map |

## Validation

```bash
node scripts/validate.mjs
node scripts/run-tests.mjs
```

## License

Apache-2.0 — see [LICENSE](LICENSE) and [NOTICE](NOTICE).
