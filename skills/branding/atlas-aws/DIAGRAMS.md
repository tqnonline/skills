# AWS SVG composition and visual acceptance

Use editable SVG shapes and text on neutral white. Use AWS official orange (`#FF9900`) and navy (`#232F3E`) as restrained accents with accessible dark text and pale neutral boundaries. Preserve official artwork. This is an AWS-oriented review style, not AWS authorship or endorsement.

| Sheet | Width × height | viewBox | Official icon box |
|---|---|---|---|
| A4 landscape | 297mm × 210mm | `0 0 1122 794` | exactly `96 × 96` units |
| A3 landscape | 420mm × 297mm | `0 0 1587 1122` | exactly `96 × 96` units |
| A1 integrated overview | 841mm × 594mm | `0 0 3179 2245` | exactly `96 × 96` units |

A1 is optional and only for a user-requested single integrated solution-and-platform overview. It uses one physical sheet and the declared coordinate scaling. It is not a contact sheet or a separate exporter. Keep A4/A3 detail views. Use a 48-unit safe inset, an 8-unit grid, 2-unit connectors, and body labels of at least 16 units. Do not shrink icons or text to make a crowded view fit.

All three sheets use approximately 96 coordinate units per inch. A 96-unit icon therefore occupies about 25.4 mm on every sheet. Do not apply a parent scale or nested viewBox that changes this effective size. A reduced screen preview needs zoom; the full-size export must retain the declared dimensions. The structural check reads image attributes; rendered transform and print-scale inspection remains required.

## Sheet layout and language

Above each diagram, place only its title and one visible plain-English description of 50–100 words, never more than 100. Count the description separately from the title. Explain what the view shows and its purpose. Retain necessary AWS product names and explain unfamiliar terms on first use. SVG `title` and `desc` remain required for accessibility but do not replace the visible description.

Put all legends, reading guides, expanded qualifications, status, date, revision, provenance and print metadata below the diagram. Use neatly aligned footer sections with descriptive titles and short bullets. Keep consistent left edges, spacing and column widths. Include only sections needed for that view; do not add decorative cards, unrelated headings or redundant labels. Write the description and supporting notes in plain English rather than compressed technical shorthand.

Keep component names, action labels, supported boundary labels and short critical route qualifiers in the diagram body. For example, retain “DNS lookup only” beside a route that could otherwise appear to carry business traffic, and explain the limitation fully in the footer. Moving a qualification below the diagram must not make a route misleading. Reserve space for the description and footer before routing; do not shrink official icons or text to fit them.

## Architecture labels and connectors

Use labeled Organization, OU, account, Region, Availability Zone, VPC, subnet and trust boundaries only when evidence supports them. A regional managed service is not inside a subnet. Draw its endpoint in the subnet and the managed service outside. Distinguish VPC attachment from resource ownership and logical groupings from deployment.

Each node has one `data-node`. Each visible flow has one directed path/line/polyline with `data-flow`, `data-from`, `data-to`, `marker-end`, and one matching `data-flow-label`. Preserve stable flow IDs and numbers across views and revisions, readable action labels and visible arrowheads at the destination. Keep each numeric badge separate from its action label, with both visibly associated with the same route. Separate runtime, control and telemetry with solid, dashed and dotted lines. In the footer legend, draw actual solid, dashed and dotted arrow swatches beside their text labels, matching the connector styles used in the diagram; a text-only legend is insufficient. Include `title` and `desc`.

Use only straight connectors or horizontal and vertical segments joined at right angles. Do not use curves, rounded elbows, spline routing or curved crossing bridges for architecture connectors. This restriction does not alter official icon artwork. Route crossings away from labels, icons and arrowheads. Distinguish a crossing with no connection from an actual junction: use an unambiguous gap at a nonjoining crossing and a visible junction dot only where routes truly connect. Explain that notation in the footer legend. Preserve one directed flow element and its annotations when drawing a visual gap; separate routes into different corridors if the gap would obscure their meaning.

Embed original official bytes as `data:image/svg+xml;base64,...` with `data-icon`, exact width/height and `preserveAspectRatio="xMidYMid meet"`. Keep icons inside the owning node. No external images, fonts, scripts, handlers, foreign HTML, DTD/entity, unsafe processing instruction, style attribute, or unresolved fragment is allowed. Duplicate IDs remain a rejection, including inside an embedded icon.

## Automated checks and human checks

`assemble.py --check` validates schema, IDs, references, platform/workload presence, page dimensions, exact icon coordinate size, hashes, inert SVG, annotation agreement, arrow marker presence, and the explicit managed-service/subnet rule. These checks are bounded. They do not infer whether a line touches the right shape, a group visually contains a node, labels overlap, routes cross, an arrow is visible, a Region supports a selected feature, or an architecture is sufficient.

Inspect every actual SVG in a browser and every exported PDF page at final print size. Check the full view and dense routing regions at 200 percent: description word count, header/footer placement, plain-English notes, absence of curved connectors, crossing/junction distinction, containment, line endpoints, direction, clipping, labels, multi-digit badges, effective printed icon size, transparent padding, contrast, grayscale meaning, font substitution, page edges, searchable text, and flow-table agreement. Check A1 at its actual physical dimensions; a reduced preview is not the geometry review. Record the description count and the pages, regions and print dimensions inspected. Separate automated results from human findings; the structural checker does not enforce these presentation rules.

Trace every numbered connector from its named source to its arrowhead without relying on hidden SVG annotations. Check that each badge and action label visibly belongs to that route. Zero coincident segments or label collisions does not establish traceability: route congestion can still prevent review. Reserve distinct routing corridors and separate control, runtime and telemetry paths without shrinking icons or text. Keep short critical qualifiers beside the affected routes and expanded explanations in the footer when aggregation could imply a false route, such as DNS proxying business traffic. If the requested single visual remains untraceable, preserve complete coverage, record the failed readability check and return `needs-decision`; do not silently omit flows or claim that the flow register fixes the visual.
