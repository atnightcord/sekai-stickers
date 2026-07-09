# Radix color picker and canvas dragging

## Scope

Fix three related interaction problems without changing the sticker rendering, export behavior, sliders, or unrelated page layout:

1. Replace the flower-style color picker with a Radix UI-based picker.
2. Make touch dragging on the preview move text instead of scrolling the page.
3. Keep mouse dragging accurate across responsive preview sizes and long distances.

## Color controls

Text color and Stroke color keep the existing row structure: color swatch, HEX value, and Reset.

- The HEX value opens a Radix UI Popover.
- The color swatch also opens the same controlled Popover.
- The Popover uses Radix UI layout and TextField components plus the browser's native color input.
- Three- and six-digit HEX values are accepted and normalized to uppercase six-digit values.
- Invalid input remains visible with an error message but does not change the active color.
- Reset restores the existing default and updates the swatch, HEX value, and canvas.
- The Blossom color picker packages, styles, conversion helper, and flower-specific CSS are removed when no longer used.

Radix Themes does not provide a dedicated color picker component, so the native color input supplies the platform color-selection surface while Radix UI supplies the Popover, field, buttons, and layout.

## Pointer dragging

The entire preview canvas is the drag surface on mouse and touch devices.

- The canvas uses Pointer Events for mouse, touch, and pen input.
- Touch gestures that begin on the canvas are reserved for text movement and do not scroll the page.
- Pointer capture keeps the drag active when the pointer moves outside the canvas.
- Pointer cancel and lost capture end the drag safely.

## Coordinate mapping

The canvas drawing coordinates remain `296 × 256`, while its displayed size can scale responsively.

On pointer down, store:

- the pointer's starting client coordinates;
- the text's starting canvas position;
- the current ratio between canvas dimensions and displayed dimensions.

On pointer move, calculate the new position from the original drag start:

`new position = starting text position + client movement × canvas/display ratio`

This avoids cumulative rounding errors, compensates for responsive scaling, and keeps long-distance movement aligned with the pointer.

## Verification

- Both color rows show the current HEX value and open a non-flower Radix UI Popover.
- Native color selection and valid three- or six-digit HEX input update the correct color.
- Invalid HEX input does not change the active color.
- Both Reset buttons restore their existing defaults.
- Touch drag on the preview changes the text position without changing page scroll.
- Mouse drag movement matches the scaled canvas distance at desktop and mobile widths.
- Dragging outside the canvas continues until pointer release.
- Lint and production build pass.
