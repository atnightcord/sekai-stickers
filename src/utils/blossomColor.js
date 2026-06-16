import {
  hexToHsl,
  lightnessToSliderValue,
} from "@dayflow/blossom-color-picker";

/** Map canvas hex (#RRGGBB) to Blossom controlled value. */
export function hexToBlossomValue(hex) {
  const { h, s, l } = hexToHsl(hex);
  return {
    hue: h,
    saturation: lightnessToSliderValue(l),
    lightness: l,
    originalSaturation: s,
    alpha: 100,
    layer: "outer",
  };
}
