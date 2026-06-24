> **Format:** Google Stitch DESIGN.md

# Design System

## Brand

- **Colors**: pink accent (`#cf93d9` theme-color), dark purple banner (`#702464`), soft pink CTA (`#c56d87`), white/pale backgrounds
- **Typography**: display fonts `YurukaStd`, `SSFangTangTi`; UI font stack uses Tailwind default sans / Radix themes default (SF Pro webfont loaded but not explicitly applied)
- **Personality**: cute, light, character-forward
- **Motion energy**: low; functional transitions only

## Palette

- **Accent / brand pink**: `#cf93d9` (theme-color), `#c56d87` (CTA), `#c55778` (CTA hover)
- **Dark purple**: `#702464` (banner background)
- **Canvas border**: `#dddddd`
- **Text**: black (`#000000`) on light background for settings labels
- **Scrollbar thumb**: white
- **Background**: inherited from Radix Themes default (likely light)

> Note: colors are hard-coded in CSS and not yet tokenized.

## Typography

- **Display / sticker text**: `YurukaStd, SSFangTangTi` fallbacks
- **Body / UI**: Tailwind `font-sans` (system-ui stack) plus loaded `SF Pro` webfont
- **Sizes**: Radix Themes scales (`size="2"`, `size="3"`) for UI; canvas text sized by slider (10–100px)

## Layout

- Single-column mobile-first layout: preview → vertical slider → horizontal slider → settings stack → action buttons → footer
- Centered flex container with `p-10` padding
- Preview canvas fixed at 296×256px
- Settings stack uses one label + control per row
- Character picker grid: 3 columns mobile, 4 columns ≥600px

## Components

### Buttons

- Radix `Button` with `color="gray"`, `variant="soft"` or `variant="solid"`
- Used for: Pick character, Reset, Upload/Clear, Copy PNG, Copy w/ BG, Download

### Sliders

- Radix `Slider`, mostly `color="gray"`
- Used for: vertical/horizontal position, rotate, font size, spacing, letter spacing, stroke width

### Inputs

- Radix `TextArea` for sticker text
- Native `input type="color"` for text/stroke color
- Native hidden `input type="file"` for custom image upload
- Radix `Select.Root` for font family
- Radix `Switch` for boolean options

### Picker

- Radix `Popover.Root` + `Tabs.Root` + `TextField.Root`
- Grid of character image buttons

### Canvas

- Custom canvas component with pointer handlers for drag positioning

## Spacing

- Container padding: `2.5rem` (`p-10`)
- Settings row gap: `1.5rem`
- Settings row bottom margin: `1rem`
- Picker grid gap: `0.25rem`
- Footer top margin: `2rem`

## Motion

- Currently minimal. Picker character buttons use `opacity` hover/active transitions inherited from browser defaults.
- No explicit animation tokens or reduced-motion handling.

## Responsive

- Mobile-first; desktop layout is the same stack centered on a larger viewport.
- Character grid switches from 3 → 4 columns at 600px.

## Known Issues to Audit

- Hard-coded color values; no design tokens.
- `settings` text is `color: black` on inherited light background; may be too harsh.
- Slider color is `gray` everywhere; brand pink is not used on interactive controls.
- Layout is very tall on mobile; controls may be below the fold.
- No visible heading; only an `sr-only` `<h1>` exists.
- Canvas border is a thin gray line; preview area feels disconnected from the page.
- Banner component exists in CSS but may not be rendered.
- `SF Pro` webfont is loaded but not assigned to any class.
