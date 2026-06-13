# UI Design Audit — Sekai Stickers

**Date:** 2026-06-13
**Branch:** `upgrade/react19-radix3-remove-mui`
**Scope:** Main generator page (`App.jsx`, `Picker.jsx`, `Info.jsx`, `main.css`, `index.css`)
**Register:** product tool (mobile-first sticker generator)

---

## Executive Summary

The interface is functional but visually under-designed. After the MUI → Radix migration, most controls default to Radix's neutral gray styling, which strips away the intended pink/cute personality. Layout is a single centered stack that works on desktop but pushes critical controls far below the fold on mobile. There is no visible hierarchy, no brand presence beyond a theme-color meta tag, and several anti-patterns from the old codebase remain.

**Top issues to fix:**

1. **Gray takeover** — Radix `color="gray"` on every button, switch, slider, and tab removes the pink/cute identity.
2. **No visual hierarchy** — every control row looks identical; no section grouping or typographic rhythm.
3. **Mobile reachability** — primary action buttons and key sliders are below a long settings stack.
4. **Canvas feels orphaned** — thin `#ddd` border, no shadow, no background, no clear "this is your sticker" frame.
5. **Hidden heading** — only an `sr-only` `<h1>`; the page has no visible title or brand mark.
6. **No design tokens** — colors, spacing, and radii are hard-coded and inconsistent.
7. **Keyboard / accessibility gaps** — native color inputs and file inputs are not styled; some labels use `<nobr>`.
8. **Dead CSS and unused assets** — banner styles exist but component is not rendered; SF Pro font is loaded but unused.

---

## Detailed Findings

### 1. Color & Brand

#### 1.1 All interactive controls are gray
- **Location:** `App.jsx` (Buttons, Sliders, Switches, Select), `Picker.jsx` (Button, Tabs)
- **Evidence:** `color="gray"` on every Radix component
- **Impact:** High. The interface feels like a generic Radix demo, not a pink/cute tool.
- **Fix:** Introduce a brand accent color (pink) and use it for primary actions, active switches, slider fills, and selected tabs. Reserve gray for secondary/tertiary actions.

#### 1.2 No tokenized color system
- **Location:** `src/assets/main.css`, `src/index.css`
- **Evidence:** Hard-coded values: `#702464`, `#c56d87`, `#c55778`, `#ddd`, `black`, `white`
- **Impact:** Medium. Makes consistent theming impossible; future changes require global find/replace.
- **Fix:** Create CSS custom properties or Tailwind config tokens for brand pink, neutral surfaces, text, borders, and interactive states.

#### 1.3 Settings text is pure black
- **Location:** `.settings { color: black; }`
- **Evidence:** High-contrast black on default light background
- **Impact:** Medium. Looks harsh and unfinished; should be a softer ink color aligned with the brand-neutral ramp.
- **Fix:** Use a near-black tinted neutral (e.g., `#1a1a1a` or a dark gray) instead of pure black.

#### 1.4 Canvas border is a thin gray line
- **Location:** `.canvas { border: 1px solid #ddd; }`
- **Impact:** Medium. The preview — the hero of the page — has no visual weight.
- **Fix:** Use a soft shadow + rounded frame + subtle background tint. Make the sticker feel like a physical object.

---

### 2. Layout & Hierarchy

#### 2.1 Single stack with no grouping
- **Location:** `App.jsx` return block
- **Evidence:** All controls are siblings under `.settings > div`
- **Impact:** High. 12+ control rows in one undifferentiated list. Users can't scan.
- **Fix:** Group controls into 2–3 sections: (1) Content (text, font), (2) Layout (position, rotate, spacing), (3) Style (colors, stroke, effects). Use section labels or cards.

#### 2.2 Mobile reachability problem
- **Location:** `App.jsx`
- **Evidence:** Preview → vertical slider → horizontal slider → text → font → 8 more sliders/switches → color pickers → action buttons
- **Impact:** High. On a phone, users must scroll far to reach "Copy PNG" and the most-used controls.
- **Fix:** Sticky bottom action bar on mobile with Copy/Download. Move character picker and primary actions within thumb reach.

#### 2.3 Vertical slider placement is awkward
- **Location:** `.vertical` layout
- **Evidence:** Vertical slider sits to the right of the canvas
- **Impact:** Medium. On narrow screens the canvas + slider may overflow or feel cramped.
- **Fix:** Consider replacing the vertical slider with a draggable preview (already supported via pointer handlers) and removing the explicit Y slider, or move it inline with the X slider.

#### 2.4 Footer is just the Info button
- **Location:** `.footer`
- **Impact:** Low. Wasted vertical space; no useful footer links or attribution visible.
- **Fix:** Move Info into the header/app bar; keep footer minimal or remove it.

---

### 3. Typography

#### 3.1 No visible page title
- **Location:** `App.jsx`
- **Evidence:** `<h1 className="sr-only">...`
- **Impact:** High. Users landing on the page see no brand or context. Social previews are fine, but the app itself is unbranded.
- **Fix:** Add a visible header with the app name and a small character/icon mark.

#### 3.2 `<nobr>` usage
- **Location:** `App.jsx` labels: `<nobr>Font: </nobr>`, `<nobr>Font size: </nobr>`, etc.
- **Impact:** Medium. Deprecated HTML element; also indicates labels are wrapping unexpectedly.
- **Fix:** Use CSS `white-space: nowrap` or redesign labels so wrapping isn't a problem (e.g., top-aligned labels on mobile).

#### 3.3 Font stack inconsistency
- **Location:** `index.css` loads SF Pro; Tailwind `font-sans` is not overridden to use it
- **Impact:** Low. SF Pro is loaded but effectively unused; system-ui is rendered instead.
- **Fix:** Either apply SF Pro to the UI or remove the unused webfont to save bandwidth.

---

### 4. Components & Controls

#### 4.1 Native color inputs are unstyled
- **Location:** Text color / Stroke color rows
- **Evidence:** `<input type="color" />`
- **Impact:** Medium. Default browser color pickers are small and inconsistent across platforms.
- **Fix:** Wrap in styled swatch buttons that open the native picker, or use a small color preset grid.

#### 4.2 Hidden file input + "Upload" button
- **Location:** Custom image row
- **Evidence:** `input style={{ display: "none" }}` with a Button trigger
- **Impact:** Low. Works, but the pattern can be improved.
- **Fix:** Make the button itself an accessible file drop target, or show a thumbnail once uploaded.

#### 4.3 Switch labels are long and left-aligned
- **Location:** Curve / Vertical text / Text behind image rows
- **Evidence:** `<label>Text behind image: </label>` + Switch
- **Impact:** Low. Long labels make rows feel heavy.
- **Fix:** Shorten labels or use toggle cards with icon + short label.

#### 4.4 Character picker button text
- **Location:** `Picker.jsx`
- **Evidence:** Button says "Pick character"
- **Impact:** Low. Functional but generic.
- **Fix:** Show the currently selected character name/avatar on the trigger button.

#### 4.5 Picker grid images have no width/height
- **Location:** `Picker.jsx` `.picker-char-btn img`
- **Evidence:** `height: 140px; object-fit: contain;` but no `width`/`height` attributes on `<img>`
- **Impact:** Medium. Causes layout shift while images load.
- **Fix:** Add explicit `width`/`height` attributes or use a fixed aspect-ratio container.

---

### 5. Motion & Feedback

#### 5.1 No loading state for canvas
- **Location:** `App.jsx` `loaded` state
- **Evidence:** `if (!loaded || !img) return;` in draw; UI does not show loading
- **Impact:** Medium. On slow networks the canvas may be blank with no feedback.
- **Fix:** Add a skeleton or spinner overlay on the canvas while the character image loads.

#### 5.2 No success feedback after copy/download
- **Location:** `copy`, `copyWithBg`, `downloadPng`, etc.
- **Impact:** Medium. Users may tap "Copy PNG" multiple times unsure if it worked.
- **Fix:** Show a brief toast or button label change ("Copied!") after clipboard/download actions.

#### 5.3 Reduced motion not handled
- **Location:** All CSS transitions / animations
- **Impact:** Low. Currently there is little motion, but future enhancements should respect `prefers-reduced-motion`.
- **Fix:** Add `@media (prefers-reduced-motion: reduce)` rules as motion is introduced.

---

### 6. Accessibility

#### 6.1 `sr-only` heading only
- **Location:** `App.jsx`
- **Impact:** High for sighted users. The page looks unbranded.
- **Fix:** Add a visible header/title; keep the `<h1>` for screen readers or make the visible title the `<h1>`.

#### 6.2 Some labels are not programmatically associated
- **Location:** Text color / Stroke color rows
- **Evidence:** `<label>Text color: </label>` followed by `input` with `aria-label`
- **Impact:** Low. The `aria-label` saves it, but `htmlFor` association is cleaner.
- **Fix:** Use `htmlFor` + `id` on native inputs.

#### 6.3 Color contrast of CTA buttons
- **Location:** `.bannerbutton` uses `#c56d87` on `#702464` background
- **Impact:** Needs verification. Light pink on dark purple likely passes AA but should be checked.
- **Fix:** Run a contrast check; adjust if below 4.5:1.

---

### 7. Dead Code & Assets

#### 7.1 Banner CSS is unused
- **Location:** `.bannercontainer`, `.bannermessage`, `.bannerbutton`, `.bannerdismiss`
- **Evidence:** No banner component imported or rendered
- **Impact:** Low. Adds ~2KB unused CSS.
- **Fix:** Remove unused banner styles or re-implement the banner component.

#### 7.2 SF Pro webfont loaded but unused
- **Location:** `src/index.css`
- **Impact:** Low. Wastes ~300KB of font downloads.
- **Fix:** Either use it for the UI font stack or remove the `@font-face` declarations.

#### 7.3 Commented-out CSS blocks
- **Location:** `.footer > a`, `.settings` font-family, `.horizontal` margin-left, etc.
- **Impact:** Low. Noise.
- **Fix:** Delete commented-out rules.

---

## Prioritized Action Plan

### P0 — Must fix before shipping
1. **Restore brand color** — replace `color="gray"` with a pink accent on primary controls.
2. **Add visible header/title** — give the page brand context.
3. **Style the canvas preview** — frame it with shadow, rounded corners, and a subtle background.

### P1 — High impact
4. **Group controls into sections** with labels or cards.
5. **Fix mobile reachability** — sticky action bar on mobile; move Copy/Download to thumb zone.
6. **Add copy/download feedback** — button state change or toast.

### P2 — Medium impact
7. Replace native color inputs with styled swatches.
8. Show selected character on picker trigger.
9. Add explicit `width`/`height` to picker grid images.
10. Remove dead CSS and unused SF Pro font.

### P3 — Polish
11. Tokenize colors/spacing/radii in Tailwind config or CSS variables.
12. Add canvas loading state.
13. Verify contrast on all interactive elements.
14. Respect `prefers-reduced-motion` for any future animations.

---

## Files to Modify

- `src/assets/main.css` — tokens, canvas frame, cleanup
- `src/views/App.jsx` — layout, header, grouped controls, action bar, feedback
- `src/components/Picker.jsx` — trigger, image dimensions
- `src/components/Info.jsx` — consider moving to header
- `src/index.css` — remove unused SF Pro font or apply it
- `tailwind.config.js` — add brand colors/spacing tokens
