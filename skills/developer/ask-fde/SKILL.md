---
name: ask-fde
description: User-invoked skill router. Maps intent to the correct developer or branding skill. Use when unsure which skill to run.
---

# Ask FDE (user-invoked)

Route user intent to the right skill in this monorepo.

## Contract

```yaml
contract:
  invocation: user
  thesis: scaffold
  verbs: [read]
  scope: guest
  trace: none
```

## When to invoke

- User asks "which skill" or describes a goal without naming a skill

## Procedure

1. Classify intent: inception | backlog | build | secure | operate | branding | product/program/transformation
2. Map to skill:
   - product, program, or transformation management intent → `ask-pm`
   - inception → `impact` (+ `recon` if brownfield)
   - backlog → `slice` → `raise`
   - build → `conduct` / `sdlc`
   - test-first work, a regression test, or red-green-refactor → `tdd`
   - a bug, a crash, or a performance regression to diagnose → `debug`
   - a design question worth answering by building something throwaway → `prototype`
   - shallow modules, tangled boundaries, or "where should the seam go" → `refactor`
   - inconsistent naming, unclear jargon, or a shared language to settle → `glossary`
   - design → `architect`
   - reference architecture documentation, cloud diagrams, or an architecture PDF → `atlas`; Atlas asks for explicit cloud confirmation before selecting its provider profile
   - security → `safeguard`
   - release → `deliver` + `shakedown`
   - production, reliability, quality, or maintenance → `operate`
   - models → `update-models` / `model-routing`
   - governance → `responsible-ai-governance`
   - natural, forest-led branding → `everforest-branding`
   - pastel branding → `catppuccin-branding`
   - Anthropic-inspired branding, or an OpenAI option → `ai-branding`
   - warm retro-modern branding → `gruvbox-branding`
   - cool, spacious branding → `nord-branding`
   - blue-and-gold light or dark branding → `solarized-branding`
   - PDF → `press`
   - an interactive, branded page with controls the reader moves → `exhibit`
   - incoming issues or external pull requests to sort → `triage`
   - a setup step only a human can perform, in a dashboard the agent cannot reach → `wizard`
   - a question to settle against primary sources, written down for reuse → `research`
   - repeated failures across runs, and what should change in the skills → `retro`
   - a session ending with work unfinished, to be picked up cold → `handoff`
   - a decision you cannot answer alone, needing the one person who can → `questionnaire`
   - a message that did not land, needing a different route to the same point → `wait-what`
   - learning a concept over more than one session → `teach`
   - writing: raw material first → `freewrite`, then structure → `outline`, then prose → `draft`
   - completion discipline, or "is it actually done" → `grit`
3. `Call the Skill tool` with chosen name

## Stop conditions

- Ambiguous → ask one clarifying question, then route

## Output contract

Chosen skill name + one-sentence rationale.
