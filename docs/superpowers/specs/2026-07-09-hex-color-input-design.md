# HEX color input

## Scope

Update the existing Text color and Stroke color rows in the Style section. No other controls or sections change.

## Interaction

Each color row keeps its current color preview and Reset button. A HEX value button is added between them.

- The button displays the current color as a normalized uppercase `#RRGGBB` value.
- Clicking either the color preview or the HEX value opens the same color picker.
- The picker includes a HEX text field.
- Entering a valid three- or six-digit HEX value updates the preview, canvas, and displayed value.
- Invalid or incomplete input remains editable but does not change the active color.
- Reset restores the existing default and updates every representation immediately.

## Structure

A shared color-control component owns the picker visibility and temporary HEX input. The parent continues to own the active Text color and Stroke color values.

The component receives the active color, accessible label, reset action, and color-change callback. This keeps both rows visually and behaviorally identical without duplicating validation logic.

## Validation

- Verify both color rows show the correct current HEX value.
- Verify both HEX buttons open their corresponding picker.
- Verify valid three- and six-digit values change the canvas color.
- Verify invalid input does not change the canvas color.
- Verify picker changes update the HEX field.
- Verify both Reset buttons restore their previous defaults.
- Verify keyboard focus and accessible labels remain usable.
- Run lint and production build.
