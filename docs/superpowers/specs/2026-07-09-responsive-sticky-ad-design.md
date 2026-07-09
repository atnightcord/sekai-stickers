# Responsive sticky advertisement design

## Goal

Keep one advertisement in the workspace while giving it different behavior at
the existing Tailwind `md` breakpoint:

- Below `md`, the advertisement remains after all editing controls.
- At `md` and above, the advertisement appears below the preview in the left
  column. The preview and advertisement stay together while the controls
  scroll.

## Layout

The existing two-column widths remain unchanged. The preview and advertisement
share a left-column wrapper. Below `md`, that wrapper does not create a layout
box, allowing the visible order to remain preview, controls, then
advertisement.

At `md` and above, the wrapper becomes the first grid column. It stacks the
preview above the advertisement and is sticky at `10px` from the viewport top.
The controls remain the only content in the right column and provide the page
height needed for the left column to stay visible while scrolling.

## Constraints

- Render exactly one `AdUnit`; do not create separate desktop and mobile ads.
- Use the project's existing Tailwind `md` breakpoint, which is the default
  `768px` breakpoint in the installed Tailwind 3 configuration.
- Do not change the preview size or the two-column widths.
- Do not add JavaScript viewport detection.
- Preserve the existing mobile action bar and control order.

## Verification

- At widths below `768px`, controls appear before the advertisement and the
  advertisement is not sticky.
- At widths of `768px` and above, the advertisement appears below the preview
  in the left column.
- The preview and advertisement move as one sticky column positioned `10px`
  below the viewport top.
- Only one advertisement element is present.
- The project passes lint and production build checks.
