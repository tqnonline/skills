# SVG composition and visual acceptance

## Page and layout rules

SVG means Scalable Vector Graphics: editable shapes and text that retain detail when enlarged. Deliver real vector paths and text, not a screenshot wrapped in SVG. Use a white or approved light print surface. Use the document brand for headings, boundary fills, connector roles, and callouts. Microsoft service artwork retains its original colors and proportions.

Use these exact landscape dimensions for the primary architecture sheets:

| Sheet | SVG width and height | viewBox | Safe inset |
|---|---|---|---|
| A4 | 297mm × 210mm | 0 0 1122 794 | 48 units |
| A3 | 420mm × 297mm | 0 0 1587 1122 | 48 units |

These coordinate systems approximate 96 screen pixels per inch. Work on an 8-unit grid. Use a consistent node size within a view, generous whitespace, 32–48-unit icons, and a 2-unit connector stroke. Start at 16-unit body labels (about 12 points at full print size), with no essential label below 14 units. Keep title, subtitle, view identifier, state, legend, and revision within the safe inset. The SVG contains its own title block; the assembler gives it a full sheet without a second title consuming its height.

Start with A4 when an end-to-end view fits without crowding. Move to A3 when the layout needs more space, not to accommodate more prose. If A3 still needs tiny text or many crossings, split overview, deployment/security, runtime, and operations views. Node count is a warning signal, not the acceptance criterion. Do not scale an A3 diagram down onto an A4 document page. The combined PDF uses named pages so each diagram preserves its declared size.

Print narrative pages on white paper with dark text. Keep color to rules, badges, diagram boundaries, and compact table headings. Screen background panels must not continue as partial-page gray blocks or get stretched over A3 sheets. Inspect page edges, full-page backgrounds, and transitions between portrait prose and landscape diagrams. The assembler provides this print adaptation without changing the screen palette or official artwork.

## Visual grammar

- Read left to right or top to bottom. Align peer nodes and route orthogonal connectors through reserved lanes.
- Use labeled containers for actual system, subscription, region, network, subnet, and trust boundaries. Do not imply a deployment boundary that the evidence does not support.
- Put arrowheads at destinations. Use separate directed paths for materially different request and return interactions.
- Distinguish runtime, control, and telemetry through line patterns plus a text legend, not color alone. Use solid, dashed, and dotted lines consistently.
- Put one numbered badge near each interaction, away from icons, bends, intersections, and text. Numbers identify flows, not components. Do not draw decorative connectors.
- Keep numbers globally stable across views. A filtered view can show flows 2, 5, and 9; it does not renumber them. Record retired IDs rather than silently changing existing references during revision.
- Use short service labels near icons and responsibility labels below them. Keep implementation detail in the flow table or component catalog.
- Include SVG `title` and `desc` elements, readable text, and text equivalents in the PDF. Avoid text converted to outlines unless separately required for a print vendor; preserve an editable original.

## Machine annotations

The assembler checks these annotations against `architecture.json`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="210mm" viewBox="0 0 1122 794">
  <title>V1 — Proposed processing architecture</title>
  <desc>A producer sends events to a queue; a worker processes them.</desc>
  <g data-node="producer"><!-- shape, product label, responsibility --></g>
  <g data-node="queue"><!-- official icon and label --></g>
  <path data-flow="1" data-from="producer" data-to="queue"
        d="M 300 350 H 480" marker-end="url(#arrow)"/>
  <text data-flow-label="1" x="390" y="338">1</text>
</svg>
```

Every declared node and flow appears exactly once per view. A flow has one directed `path`, `line`, or `polyline`, its declared endpoints, and one numbered text label. A view includes both endpoints of every visible flow. The checker verifies identifiers and annotations, not the geometric truth of a line's endpoints. The author must inspect routing against node positions.

Embed official icon SVG bytes as base64 `data:image/svg+xml` images using `preserveAspectRatio="xMidYMid meet"`. Give each image `data-icon` matching a provenance entry; the checker compares the decoded bytes to its SHA-256 hash. Do not recolor, crop, rotate, flip, distort, or trace Microsoft icons. No external images, scripts, event handlers, foreign HTML, fonts fetched from a URL, or external references belong in a deliverable. Local fragment references for gradients and arrow markers are allowed. A missing icon stays a named draft limitation.

## Render-and-repair loop

1. Run `assemble.py --check`. Inspect the model evidence and flow descriptions yourself; identifiers alone do not establish technical correctness.
2. Open each SVG in an installed browser at its declared aspect ratio. Wait for fonts and images. Check the browser for XML errors and failed images. Measure text and shape bounds where the browser permits it; inspect dense regions at 200% zoom.
3. Verify no text overlaps a node boundary, badge, line, or icon; no line crosses a label or unrelated node; no content clips at the safe inset. Check that every arrow starts and ends at the correct node and every declared boundary contains the intended components.
4. Check normal text contrast of at least 4.5:1 and essential connector/boundary contrast of at least 3:1. Official multicolor icons are not recolored to pass a theme test; provide adjacent accessible labels and a suitable neutral backing.
5. Open the assembled HTML and exercise the contents links. Confirm the generated flow table matches the actual numbered arrows and the document's narrative.
6. Inspect all PDF pages with a PDF viewer or rasterize them for review. Check A4/A3 page dimensions, full-sheet diagrams, table continuations, headings stranded at page bottoms, clipped columns, glyph substitution, blank pages, searchable text, and working links. Record actual fonts and rendering tools. Browser PDF output is not automatically PDF/UA or press-certified.
7. Repair source SVG geometry or palette/layout rules, rerun the assembler, and capture the corrected result. Keep one representative inspected diagram and a dense PDF page with the verification receipt. Do not call the result pixel-perfect merely because it parses or a screenshot exists.

Pixel-perfect here means inspected alignment, consistent spacing, legible text at the requested paper size, faithful icons, unambiguous routes, and no visible collisions or clipping. It is a visual acceptance target, not a guarantee that different font installations rasterize identically.
