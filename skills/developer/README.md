# Developer group — the AI-native SDLC

Twenty-three promoted skills: the software delivery lifecycle rebuilt for humans working with trusted agents — inception through maintenance, four human gates, verified agent work between them, and one user-invoked `atlas` skill for Azure, AWS, and GCP reference architecture packs. The acceptance-gate ledger that makes "done" a measured claim rather than a reported one is `grit`, which lives in the `core` group because the pm group calls it too. The developer group otherwise references no other group. The narrow exception in ADR 0011 permits only `atlas` to require branding `press` and, when the user selects one, use a theme or `branding-system`.

Every Atlas run must ask, “Which cloud platform should this architecture target: Azure, AWS, or GCP?” It must wait for the answer and must never infer the platform from the skill name, repository, or other context. It asks the same question even if the user named a platform earlier. Azure, AWS, and GCP are internal provider guides under `atlas/providers/`, not separate skills. Atlas documents and reviews architecture; it does not provision resources or deploy software.

Use [Atlas](atlas/SKILL.md) and the [public documentation](https://tqnonline.github.io/skills/atlas/). Provider details live in the [Azure](https://tqnonline.github.io/skills/atlas/azure/), [AWS](https://tqnonline.github.io/skills/atlas/aws/), and [GCP](https://tqnonline.github.io/skills/atlas/gcp/) guides.

Replace the retired `/atlas-azure`, `/atlas-aws`, and `/atlas-gcp` invocations with `/atlas`. No CLI aliases are supplied. Reinstall using the root README instructions, including the required `press` dependency. Preserve local edits, then remove obsolete provider-specific skill copies or links from every project, personal, and workspace installation your tools load. Include tool-prefixed copies. Refresh the tool's catalog and verify that only `atlas` remains. Reinstallation alone may not remove stale entries.

Directory rename to `ai-native-sdlc` is planned and tracked as its own change. See the root README and wiki/Group-Developer.md.
