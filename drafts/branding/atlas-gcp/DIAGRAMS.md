# Diagram composition and acceptance

Use real SVG vectors and live text with `title` and `desc`. Keep Google artwork unchanged; apply the selected brand to surroundings. Read left-to-right or top-to-bottom with consistent cards and reserved connector lanes. No screenshot disguised as SVG.

Above the diagram, show only its title and a 50–100-word description, never more than 100 words. Use plain English that explains what the system does without requiring cloud expertise. Keep necessary product names and explain unfamiliar terms. Place every legend, reading guide, expanded qualification, review status, date, revision, provenance note, and print instruction below the diagram. Organize this footer into aligned, titled sections with visible bullets and consistent spacing. Keep component labels, action labels, and short safety-critical route qualifiers in the diagram; move explanations below without hiding exceptions.

Use only straight or right-angled connectors with horizontal and vertical segments; no curved architecture routes. Reserve lanes around unrelated cards, headings, labels, and badges. Distinguish line crossings from actual junctions with clear gaps or white underlays, without hiding arrowheads or changing destinations.

| Paper | Physical landscape size | viewBox |
|---|---|---|
| A4 | 297mm × 210mm | `0 0 1122 794` |
| A3 | 420mm × 297mm | `0 0 1587 1122` |
| CUSTOM | Declared millimeters at 96 pixels/inch | `0 0 widthUnits heightUnits` |

Use 48-unit safe margins, an 8-unit grid, 16-unit body labels and no essential text below 14 units. Every service icon occupies exactly 96 × 96 units at full scale, about 25.4mm. Do not scale, rotate, reflect or crop icons through parent transforms. Preserve internal whitespace and aspect ratio. A phone or fit-to-window preview naturally scales the whole page; print/native-size acceptance uses the declared dimensions. Enlarge the page or split views rather than shrinking icons.

Use separate labeled ownership, geographic, network and trust containers. A managed service is not inside a subnet merely because it uses a private connection. External people/devices/business systems stay outside provider projects. A logical responsibility group must say it is logical.

Runtime connectors are solid, control dashed, telemetry dotted. Draw actual arrow swatches beside the legend's text labels using the diagram's line styles. Identify unused styles as legend samples, not routes. Keep paper size, icon scale, and legal metadata separate from the operational legend. Put arrowheads at actual destinations and stable numeric badges away from bends, cards and crossings. Add a concise verb-and-object action label beside each arrow, separate from its badge; leave strokes and arrowheads unobscured. Numbers must not be the only explanation of an interaction. A model annotation does not prove geometric endpoints. Show material direct data paths, not only the agent route. Keep detailed parameters in the document.

Keep material route qualifications beside the action they constrain. An optional callback or logical edge must not appear to be an unconditional direct connection. Present longer safety and recovery rules in titled, numbered callout groups with visible bullets, one rule per bullet. Reserve space for these groups rather than compressing them into footer prose.

Each node group has `data-node="id"`. Each connector is a path, line or polyline with `data-flow="1"`, `data-from="source"`, `data-to="destination"` and `marker-end="url(#arrow)"`. One text element has `data-flow-label="1"` and content `1`. Every per-view declared node/flow appears exactly once. Official assets are base64 SVG images with `data-icon`, `width="96"`, `height="96"`, and `preserveAspectRatio="xMidYMid meet"`, inside their node groups. Decoded bytes must match provenance.

No scripts, event handlers, foreign HTML, external images/fonts/references or recursive payloads. Only the assembler's explicitly accepted inert CSS may occur in official embedded SVGs; unsupported artwork becomes an explicit draft limitation rather than silently rewritten bytes.

## Integrated overview

After the requested cumulative stages, draw one coherent platform-and-solution architecture, not five miniatures. Keep detail views available. Show management, customer boundary, standard/premium regions and material stateful counterparts, with visible external identity and business-system boundaries. Provide an aggregation map from every material source subsystem and canonical journey to a visible group/flow or disclosed omission. An abstract line must not imply a false direct network path or authorization guarantee.

Use a custom large-format sheet when needed to preserve 96-unit icons. Include a reading guide, expanded essential acronyms, scale note and the main denied/recovery qualifications. Judge this output separately against all five source packs and the overview requirements.

## Render and repair

Run structural validation, then open every SVG and assembled HTML in a browser. Wait for fonts/images; inspect XML and load errors. Inspect dense areas at readable zoom, not only thumbnails. Check text bounds, safe margins, actual endpoints, crossings, labels and containment. Aim for 4.5:1 normal-text contrast and 3:1 essential line contrast; accessible labels and backing carry meaning without recoloring official artwork.

Inspect every PDF page, including transitions between portrait prose and landscape diagrams. Verify declared page dimensions, searchable text, font substitution, links, table continuation, blank pages, clipped list markers and stranded headings. Confirm offline loading has no unexpected requests. A rasterized page or browser capture must actually be viewed. Save representative inspected artifacts and record all pages/views checked. Repair source geometry or export rules and rerender before freeze. Do not claim PDF/UA, print certification or universal pixel identity.

Check whether a first-time reader can identify each arrow's action and line meaning without looking up a numeric ID in the document. Inspect full views and close-ups of connector labels, bullet callouts, and legend swatches in both browser and PDF output. Passing text bounds does not establish readability. Enlarge the sheet or split views before shrinking required icons or essential text. Verify actual PDF page dimensions and disclose fit-to-paper limits; a wall sheet that needs native zoom is not a readable A3 handout.
