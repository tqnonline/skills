# AWS SVG composition and visual acceptance

Use editable SVG shapes and text on neutral white. Use AWS official orange (`#FF9900`) and navy (`#232F3E`) as restrained accents with accessible dark text and pale neutral boundaries. Preserve official artwork. This is an AWS-oriented review style, not AWS authorship or endorsement.

| Sheet | Width × height | viewBox | Official icon box |
|---|---|---|---|
| A4 landscape | 297mm × 210mm | `0 0 1122 794` | exactly `96 × 96` units |
| A3 landscape | 420mm × 297mm | `0 0 1587 1122` | exactly `96 × 96` units |
| A1 integrated overview | 841mm × 594mm | `0 0 3179 2245` | exactly `96 × 96` units |

A1 is optional and only for a user-requested single integrated solution-and-platform overview. It uses one physical sheet and the declared coordinate scaling. It is not a contact sheet or a separate exporter. Keep A4/A3 detail views. Use a 48-unit safe inset, an 8-unit grid, 2-unit connectors, and body labels of at least 16 units. Do not shrink icons or text to make a crowded view fit.

All three sheets use approximately 96 coordinate units per inch. A 96-unit icon therefore occupies about 25.4 mm on every sheet. Do not apply a parent scale or nested viewBox that changes this effective size. A reduced screen preview needs zoom; the full-size export must retain the declared dimensions. The structural check reads image attributes; rendered transform and print-scale inspection remains required.

Use labeled Organization, OU, account, Region, Availability Zone, VPC, subnet and trust boundaries only when evidence supports them. A regional managed service is not inside a subnet. Draw its endpoint in the subnet and the managed service outside. Distinguish VPC attachment from resource ownership and logical groupings from deployment.

Each node has one `data-node`. Each visible flow has one directed path/line/polyline with `data-flow`, `data-from`, `data-to`, `marker-end`, and one matching `data-flow-label`. Numbers remain stable across views. Separate runtime, control and telemetry with solid, dashed and dotted lines plus a text legend. Include `title` and `desc`.

Embed original official bytes as `data:image/svg+xml;base64,...` with `data-icon`, exact width/height and `preserveAspectRatio="xMidYMid meet"`. Keep icons inside the owning node. No external images, fonts, scripts, handlers, foreign HTML, DTD/entity, unsafe processing instruction, style attribute, or unresolved fragment is allowed. Duplicate IDs remain a rejection, including inside an embedded icon.

## Automated checks and human checks

`assemble.py --check` validates schema, IDs, references, platform/workload presence, page dimensions, exact icon coordinate size, hashes, inert SVG, annotation agreement, arrow marker presence, and the explicit managed-service/subnet rule. These checks are bounded. They do not infer whether a line touches the right shape, a group visually contains a node, labels overlap, routes cross, an arrow is visible, a Region supports a selected feature, or an architecture is sufficient.

Inspect every SVG in a browser and every PDF page at final print size. Check full view and dense regions at 200 percent: containment, line endpoints, direction, crossings, clipping, labels, multi-digit badges, effective printed icon size, transparent padding, contrast, grayscale meaning, font substitution, page edges, searchable text, and flow-table agreement. Check A1 at its actual physical dimensions; a reduced preview is not the geometry review. Record the pages and regions inspected and separate automated results from human findings.

Trace every numbered connector from its named source to its arrowhead without relying on hidden SVG annotations. Check that each badge visibly belongs to that route. Zero coincident segments or label collisions does not establish traceability: route congestion can still prevent review. Reserve distinct routing corridors and separate control, runtime and telemetry paths without shrinking icons or text. Keep explanatory qualifiers on the sheet when aggregation could imply a false route, such as DNS proxying business traffic. If the requested single visual remains untraceable, preserve complete coverage, record the failed readability check and return `needs-decision`; do not silently omit flows or claim that the flow register fixes the visual.
