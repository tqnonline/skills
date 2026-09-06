# Branding group

Branding applies one identity to every surface an agent can help produce. Six user-invoked theme skills cover verbal identity, semantic color, open-source typography, product and native UI, documents, PDF, decks, print, email, social media, iconography, data visualization, environmental work, motion, generated video, and color grading.

`branding-system` is the model-invoked common engine. It defines the surface, accessibility, provenance, motion, `DESIGN.md` interoperability, and output contracts once. Each theme supplies the same four profile documents and calls that engine. A single-theme install brings its required engine without bringing unrelated themes.

`everforest-branding`, `catppuccin-branding`, `gruvbox-branding`, `nord-branding`, and `solarized-branding` adapt open palette projects. `ai-branding` defaults to an Anthropic-inspired profile and offers a separate `provider: openai` option. Company marks require their own permission and never mix across provider variants.

`exhibit` builds one self-contained, interactive HTML page that walks a reader through a topic as a journey of acts, each with a figure and a control that changes a model, in the colors, type, and motion of a selected theme. A reader of a `press` page reads a document someone approved; a reader of an `exhibit` page moves controls and watches a claim hold or fail at their own settings. A topic with no model to change is a document, and `press` renders it.

`press` remains the deterministic document renderer. The common engine generates a compatible palette file for any profile, but final PDF accessibility and print proof still require artifact-level review.

`atlas-azure` turns a repository or implementation plan into a reference architecture pack. It records evidence and assumptions, authors numbered official-icon SVG diagrams on A4 or A3 sheets, and combines press prose with diagram plates and generated flow tables in a branded HTML and PDF. Technical and visual inspection remain required after structural validation.

The group installs on its own and references no other group.
