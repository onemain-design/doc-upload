# Pencil → Figma Translation Playbook

A working method for translating this project's Pencil design (`doc-upload.pen`) into
Figma so the result is a real, design-system-linked Figma file, not a flat pile of
redrawn rectangles. Written for another agent doing that translation, and for whoever is
directing it.

---

## Why translations go wrong (read this first)

Translating a design is **not** "redraw what the screenshot shows." Both Pencil and
Figma are design-system-backed documents: structured trees of components and instances,
with color, spacing, radius, and type coming from named tokens and styles. A faithful
translation re-expresses the source's *structure and vocabulary* in the target, it does
not re-paint its pixels.

Almost every bad result comes from treating it as pixel-copying. The tells are always the
same:

- Hardcoded hex colors and pixel spacing instead of bound variables.
- A flat tree of one-off frames instead of component instances.
- The wrong font (Inter instead of the product font) rendered without any error.
- Only the resting/default screen, none of the interaction states.
- Icons rebuilt from rotated lines that come out mangled.
- One giant `use_figma` call that half-succeeds and is impossible to debug.

The phases below are ordered to prevent exactly these.

---

## The three sources of truth

Hold all three in view before building anything:

1. **The Pencil file** (`doc-upload.pen`) — the source structure, components, and states.
2. **This repo's design system** — the shared vocabulary both tools speak: the
   `--omf-cx-*` tokens (`tokens/tokens.css`), the Merchant typeface
   (`tokens/cx-fonts.css`, `font-files/Merchant/`), and the base-component specs
   (`components/*.md`). The coded `/c/` prototype is the living reference for every state
   and copy string.
3. **The target Figma file's published design system** — the components, variables, and
   text/effect styles you must reuse instead of drawing primitives.

The translation is essentially: *map the Pencil node → the design-system concept → the
Figma component/variable/style that expresses it.* Skip the middle and you get pixels.

---

## Phase 0 — Read the Pencil source completely

**Never translate from a screenshot alone.** A screenshot loses the component structure,
the tokens, and every non-default state, which is exactly the information that makes the
translation faithful.

`.pen` files are opaque and encrypted. Access them **only** through the Pencil MCP tools,
never with filesystem read/grep. If the Pencil MCP server is not connected, stop and say
so, do not fall back to guessing from an image.

1. Load the Pencil skill / editor state first (`get_editor_state({ include_schema: true })`
   or the equivalent `read_skill` step) so you know the schema before you read.
2. Read the canvas node tree (`get_app_state`) and the token/style values (`get_style`).
3. Produce a written **inventory** before touching Figma:
   - Every artboard/screen and its major sections (header, request list, card, drop zone,
     action bar, etc.).
   - Every reusable component and where it is instanced.
   - **Every interaction state**, not just the resting frame (see Phase 3).
   - The type ramp actually used and the tokens actually referenced.

If you cannot name the sections and components in words, you are not ready to build.

---

## Phase 1 — Map the design system across both sides (the make-or-break step)

This is where most failing translations actually fail. Do it explicitly and write the map
down before you build.

**Components.** For each component in the Pencil inventory, resolve the matching Figma
component, in this order (from the `figma-generate-design` skill):

1. **Code Connect files** in the codebase (`*.figma.ts`, `*.figma.tsx`, `*.figma.js`).
   Parse the Figma URL, convert `123-456` → `123:456`, and resolve the component key
   against the *library* file.
2. **Inspect an existing Figma screen** that already uses the design system, and walk its
   instances to build an authoritative component→key map.
3. **`search_design_system`** only as a last resort, one intent per query (`"button"`,
   `"card"`, `"input"`), never synonyms packed into one string. Call `get_libraries`
   first to scope the search.

Record each component's key **and its TEXT/variant property keys** — you need those to
override placeholder text with `setProperties()` later.

**Tokens → variables.** Map this repo's `--omf-cx-*` tokens to Figma variables. Do not
hardcode. Discover variables by inspecting an existing screen's bound variables or via
`search_design_system` with `entity: "variable"` (`getLocalVariableCollectionsAsync()`
returns *only local* variables — an empty result does **not** mean none exist). The roles
you will need most (values are fallbacks; always bind the token):

| Role | Token |
| --- | --- |
| Card background | `--omf-cx-core-color-surface-base` |
| File rows / secondary surface | `--omf-cx-core-color-surface-layer-2` |
| File-type icon badge | `--omf-cx-core-color-surface-info-layer-1` |
| Card border | `--omf-cx-core-color-line-muted` |
| Titles / primary text | `--omf-cx-core-color-body-emphasis` |
| Body text | `--omf-cx-core-color-body-default` |
| Secondary / captions | `--omf-cx-core-color-body-moderate` |
| Links / primary | `--omf-cx-core-color-primary` |
| Needs attention (caution) | `--omf-cx-core-color-body-caution` |
| Uploaded (positive) | `--omf-cx-core-color-body-positive` |
| Failed / error (negative) | `--omf-cx-core-color-body-negative` |
| Card radius / row radius | `--omf-cx-shape-radius-large-1` (16) / `-default` (8) |

**Font.** This product uses **Merchant**, a self-hosted typeface. It is **not Inter**.
Loading Inter without error is a silent failure, not a success. Identify Merchant from
`tokens/cx-fonts.css` up front, load its exact style names via
`listAvailableFontsAsync()` (do not guess `"SemiBold"` vs `"Semi Bold"`), and **assert**
the rendered font family after building.

**Known token trap in this repo:** `--omf-cx-stroke-default` resolves to ~22px, not a
hairline. Use a literal `1.4px` for a hairline stroke rather than binding that token.

---

## Phase 2 — Build in Figma (the mechanics that matter)

**Load the skills before any `use_figma` call:** `figma-use` (API rules) and
`figma-generate-design` (screen-building workflow). Skipping them causes the exact
hard-to-debug failures below. Pass them in the `skillNames` param (prefix `resource:` if
loaded via MCP resource).

Build the way the skill prescribes:

- **Wrapper frame first, in its own call.** Size it to the source width (the `/c/` layout
  is a single card column; the desktop layout adds a status rail). Return its ID.
- **Then one section per `use_figma` call**, fetching the wrapper by ID and appending to
  it. Do not build sections as page children and reparent them, cross-call `appendChild`
  silently orphans nodes.
- **Instance design-system components; override text with `setProperties()`** using the
  property keys from Phase 1. Fall back to `node.characters` only for text no component
  property manages.
- **Bind variables, never hardcode:** `setBoundVariable` for spacing/radius,
  `setBoundVariableForPaint` (it returns a *new* paint, capture and reassign) for colors.
  Apply text styles via `node.textStyleId`, effect styles via `node.effectStyleId`.
- **Icons: import the SVG from the codebase** with `figma.createNodeFromSvg(...)` and
  `resize()` to the slot. Include `width`/`height` + `viewBox` in the SVG string. Never
  rebuild an icon from rotated lines/rects, Figma's line rotation is unreliable here and
  produces broken glyphs. Codebase SVGs using `currentColor` import as black, set the
  color explicitly after import.
- **Componentize repeated elements** (the requested-document card, the file row) once,
  then place instances. Do not ship a flat tree and wait for a "now componentize" pass.

API rules that bite hardest (full list in `figma-use`):

- Colors are **0–1**, not 0–255. Paint `color` has no `a`; opacity lives on the paint.
- **Load the font before any text edit**, then `await`, then mutate, then return IDs.
- `layoutSizingHorizontal/Vertical = 'FILL'` only works **after** `appendChild`.
- **Page context resets** each call, switch with `await figma.setCurrentPageAsync(page)`.
- **Return every created/mutated node ID** from every call, subsequent calls and error
  recovery depend on it.
- Keep it to **~10 logical operations per call**, validate, then continue.

---

## Phase 3 — Reproduce the states, not just the default

A document-upload flow is mostly its states. Do not stop at the resting card. Enumerate
them from the coded prototype's scenario explorer (deep-linkable via `?scenario=<id>`) and
reproduce each:

- **Per-document status:** not-started, selected/ready, uploading (progress),
  uploaded/complete, failed, needs-attention / validation-error.
- **Layout variants:** the desktop status rail vs. the single-column layout
  (`?layout=single`).
- **Multi-file:** the growing numbered/file-type list within one requested document.

**Status-icon semantics must match the design-system alert component:** the **circular
exclamation** is the error / failed state; the **triangle** is the caution /
needs-attention state. Getting these swapped is a real regression, not a cosmetic detail.

---

## Phase 4 — Validate by comparison

- **Screenshot each section by node ID**, not just the full frame, low-res full shots hide
  clipped text, overlaps, and un-overridden placeholder text ("Title", "Button").
- **Compare against the source**: the Pencil artboard and the running `/c/` prototype.
- **Explicitly assert the font is Merchant.** A successful script that rendered Inter is a
  failed translation.
- Check for: clipped text (line-height cropping), overlapping nodes, wrong component
  variants, blank icon slots, hardcoded values that should be bound.
- Fix with targeted scripts, do not rebuild the whole view.

---

## What actually made the design work here succeed (transferable principles)

These are the habits that produced good results on this project. They transfer to any
Pencil → Figma job:

1. **Source of truth first.** Read the whole source (Pencil tree, tokens, states) before
   building. Every shortcut past this shows up as rework.
2. **Component-first, always.** Reuse an existing component before building; when none
   exists, build the reusable one once and instance it. Never hand-build N near-copies.
3. **Tokens over literals.** Merchant + `--omf-cx-*` bound variables, no parallel hex or
   pixel values, no external fonts.
4. **Complete states beat screenshot fidelity.** Native structure and every interaction
   state are worth more than a pixel-perfect single frame.
5. **Verify by comparison, incrementally.** Build a section, screenshot it, compare, fix,
   move on. Return IDs so you can.
6. **Name the open questions.** When the source is ambiguous, say so, don't invent a
   treatment and pass it off as intended.

---

## Cheat sheet for this project

| Thing | Where |
| --- | --- |
| Pencil design | `doc-upload.pen` (opaque, Pencil MCP only) |
| Living reference for states/copy | the `/c/` prototype (Option C, "Instant Upload") |
| Font | **Merchant**, self-hosted (`tokens/cx-fonts.css`) — not Inter |
| Tokens | `--omf-cx-*` in `tokens/tokens.css` (`tokens/README.md`) |
| Component specs | `components/*.md` (`components/README.md`) |
| Product boundary | `docs/document-upload-prd.md` |
| Design-token roles | `docs/07-design-tokens.md` (in the dev handoff package) |
| Stroke trap | `--omf-cx-stroke-default` ≈ 22px; use literal `1.4px` for a hairline |
| Status icons | circular exclamation = failed/error; triangle = needs-attention/caution |

---

## Common failure → fix

| Failure mode | Fix |
| --- | --- |
| Redrew it from a screenshot | Read the Pencil node tree via the MCP; inventory components and states |
| Hardcoded hex / pixel spacing | Discover and bind design-system variables |
| Text came out in Inter | Identify Merchant up front; load exact styles; assert font after build |
| Flat frame tree, nothing linked | Import and instance design-system components; componentize repeats |
| Icons look mangled | Import the codebase SVG via `createNodeFromSvg`; never rotate primitives |
| Only the default screen exists | Enumerate states from `?scenario=<id>` and reproduce each |
| One huge script that half-worked | Wrapper first, then one section per `use_figma` call, validate between |
| Can't tell what changed on error | Return every created/mutated node ID from every call |
