# Microsoft reference sources and icon provenance

## Official asset sources

Read the current source page before a delivery. Record the retrieval date and the package version actually used; a user-supplied archive is not necessarily the current package.

| Family | Official source | Handling |
|---|---|---|
| Azure | https://learn.microsoft.com/en-us/azure/architecture/icons/ | Primary service icon source; supplied V24 is a versioned input, not a permanent default. |
| Microsoft 365 | https://learn.microsoft.com/en-us/previous-versions/microsoft-365/solutions/architecture-icons-templates | Retired page. Treat its package as legacy and verify current product naming. |
| Dynamics 365 | https://learn.microsoft.com/en-us/dynamics365/get-started/icons | Use only if the architecture includes this product family. |
| Fabric | https://learn.microsoft.com/en-us/fabric/fundamentals/icons | Follow the official download link; the supplied repository archive is https://github.com/microsoft/fabric-samples/blob/main/docs-samples/Icons.zip. |
| Power Platform | https://learn.microsoft.com/en-us/power-platform/guidance/icons | Includes product-specific assets; do not replace them with vaguely similar Azure icons. |

Microsoft permits these icons in architectural diagrams, training materials, and documentation. Its pages restrict copying, distribution, and display to those purposes and reserve other rights. The instructions say to keep product names near icons and not crop, flip, rotate, distort, or change their shape. Preserve the original artwork, including colors. Icons must not represent the author's own product or imply Microsoft endorsement. Retain a rights note with redistributed diagrams. These permissions do not make the assets part of this repository's Apache license.

Do not vendor entire icon packs into this skill. Fetch from an official source or use a user-provided archive at run time. This keeps the skill portable to text-only distribution channels and avoids freezing an old catalog. List archive entries before extraction; reject absolute paths, parent traversal, symlinks, unreasonable expanded sizes, and unexpected executable files. Extract only selected SVGs into a working asset directory. Inspect XML for active content and external references before embedding. Keep original SVG bytes so their hashes remain auditable.

Record per-icon ID, product, official source URL, archive filename/version, retrieval date, license URL, original member path, and SHA-256. Keep the archive hash in the receipt as well. Downloads must not require a user's private attachment URL after the skill is installed. The initial user supplied Azure V24, Microsoft 365 2024, Dynamics 365, and Power Platform archives; those are reference inputs, not bundled dependencies.

## Architecture Center examples

Sources reviewed for this skill on September 6, 2026. Recheck current service names and constraints when generating a pack.

| Reference | What to learn | What not to assume |
|---|---|---|
| [Object text extraction](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/ai/extract-object-text) | Stage-based grouping, numbered business workflow, roles of Microsoft 365 and Power Platform alongside AI. | Every document-processing workload needs the same platform stack. |
| [Virtual WAN hub and spoke](https://learn.microsoft.com/en-us/azure/architecture/networking/architecture/hub-spoke-virtual-wan-architecture) | Labeled topology boundaries, route semantics, dedicated network detail and operational considerations. | Every workload needs Virtual WAN, or an unlabeled line proves routing works. |
| [Custom document models](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/architecture/build-deploy-custom-models) | Training versus inference stages, model lifecycle, alternatives, and supporting service explanations. | Model names and service packaging stay unchanged. |
| [Multiple-agent workflow automation](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/idea/multiple-agent-workflow-automation) | Separate runtime orchestration and build/deployment activity. | Example step numbers are infallible: the reviewed diagram description and workflow assign the last two actions differently. Validate your own mapping. |
| [Dynamic agents at scale](https://learn.microsoft.com/en-us/azure/architecture/solution-ideas/articles/ai-agents-at-scale) | Separate overview, security/deployment, selection, and evaluation views; show operational controls. | A solution idea is a verified deployment recipe for every organization. |

The supplied sample SVGs illustrate these pages' visual vocabulary. Inspect them for grouping, whitespace, legends, arrow paths, and accessible descriptions. Do not copy their node positions into unrelated workloads or reuse their product choices as requirements. Do not redistribute full example artwork without checking its applicable terms.

Currentness matters: Microsoft changes Foundry names, icon packages, service availability, quotas, and model versions. Prefer current product labels and record any older icon alias. Check region, SKU, networking, and preview status in service documentation. Link to dated pricing assumptions, not timeless cost promises.
