# ADR 0011: Atlas belongs to developer with a narrow branding exception

## Status

Accepted

## Context

Atlas Azure and Atlas AWS create cloud reference architectures from repositories and implementation plans. Their primary work is technical architecture: evidence classification, cloud platform boundaries, service selection, flows, operational constraints, and architecture review. Branded HTML, PDF, and diagrams are outputs of that work, not its organizing purpose.

The user approved Atlas GCP for promotion alongside Azure and AWS. All three share the platform-selection contract and have equal catalog status. Promotion does not establish a passing live architecture evaluation.

ADR 0007 otherwise prevents one group from referencing another. Atlas already needs the deterministic document rendering supplied by branding `press`. A user may also want an established theme, in which case Atlas needs the selected theme and `branding-system`. Moving copies of those capabilities into developer would create competing contracts and weaken the reason group independence exists.

## Decision

Consolidate Azure, AWS, and promoted GCP into one public `skills/developer/atlas` skill. Keep their methods and rendering engines intact under `providers/azure`, `providers/aws`, and `providers/gcp`. Provider guides are internal documents, not separately discoverable skills. This preserves provider-specific validation while giving users one entry point.

Permit one narrow exception to ADR 0007. Atlas requires branding `press`. It may use a branding theme and `branding-system` only when the user selects that theme or visual system. No other developer skill gains permission to reference branding, and Atlas gains no general permission to depend on other branding capabilities.

Every Atlas run must ask exactly, “Which cloud platform should this architecture target: Azure, AWS, or GCP?” The run must wait for the answer. It must never infer a platform from the invoked skill name, repository contents, or other context. When the user named a platform earlier, the run must still ask the user to confirm it explicitly before continuing.

## Consequences

- The developer catalog has 23 promoted skills. The branding catalog has nine; the full catalog has 60.
- Catalog, site, and wiki documentation list Atlas once, with provider guides and examples linked beneath it.
- GCP has equal promoted support within Atlas. No provider remains in drafts.
- Installing Atlas includes required `press`. A selected theme may also bring that theme and `branding-system`; theme dependencies remain optional.
- Retired provider invocations are not aliases. Preserve local customizations, remove stale installed provider copies or links, and refresh discovery after reinstalling Atlas.
- Evaluation controllers retain their provider-specific names but pin the whole Atlas source. Deterministic regression tests do not establish a passing live six-phase evaluation.
- Group independence remains unchanged for every other skill and dependency.
- Platform selection adds a mandatory human confirmation before source analysis or architecture work begins, even when the invoked Atlas skill or repository appears to identify the platform.
