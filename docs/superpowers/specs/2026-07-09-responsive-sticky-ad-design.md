# Responsive sticky advertisement design

## Goal

Keep one advertisement in the workspace while giving it different behavior at
the existing Tailwind `md` breakpoint:

- Below `md`, the advertisement remains after all editing controls.
- At `md` and above, the advertisement appears at the top of the right column
  and stays aligned with the sticky preview while the controls scroll.

## Layout

The existing two-column workspace remains unchanged. The left preview keeps its
current sticky position at `10px` from the viewport top.

The right column continues to contain the controls and one advertisement. Its
source order remains controls first and advertisement second, which gives small
screens the required reading order without JavaScript.

At `md` and above, responsive styles move the advertisement ahead of the
controls visually and make it sticky at the same `10px` top position as the
preview. The right column is taller than the advertisement because it also
contains the controls, so the advertisement has enough containing space for
sticky positioning to work.

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
- At widths of `768px` and above, the advertisement appears at the top of the
  right column and remains `10px` below the viewport top while scrolling.
- The preview and advertisement use the same top offset.
- Only one advertisement element is present.
- The project passes lint and production build checks.
