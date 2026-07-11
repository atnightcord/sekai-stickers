const FALLBACK_ACCENT = "#C55693";

const HUE_ACCENTS = [
  [15, "red"],
  [40, "orange"],
  [55, "amber"],
  [70, "yellow"],
  [95, "lime"],
  [135, "grass"],
  [165, "green"],
  [185, "teal"],
  [198, "cyan"],
  [205, "sky"],
  [240, "blue"],
  [255, "indigo"],
  [275, "violet"],
  [295, "purple"],
  [315, "plum"],
  [338, "pink"],
  [352, "crimson"],
  [360, "red"],
];

function parseHexColor(color) {
  const match = /^#?([0-9a-f]{6})$/i.exec(color ?? "");
  if (!match) return null;

  const value = Number.parseInt(match[1], 16);
  return {
    hex: `#${match[1].toUpperCase()}`,
    red: (value >> 16) & 255,
    green: (value >> 8) & 255,
    blue: value & 255,
  };
}

function rgbToHsl({ red, green, blue }) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;

  if (delta === 0) {
    return { hue: 0, saturation: 0, lightness: lightness * 100 };
  }

  let hue;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;

  hue = (hue * 60 + 360) % 360;
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));

  return { hue, saturation: saturation * 100, lightness: lightness * 100 };
}

function mixColor(color, target, targetWeight) {
  const source = parseHexColor(color) ?? parseHexColor(FALLBACK_ACCENT);
  const destination = parseHexColor(target);
  const mix = (sourceValue, targetValue) =>
    Math.round(sourceValue * (1 - targetWeight) + targetValue * targetWeight);

  return `#${[mix(source.red, destination.red), mix(source.green, destination.green), mix(source.blue, destination.blue)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function colorWithAlpha(color, alpha) {
  const parsed = parseHexColor(color) ?? parseHexColor(FALLBACK_ACCENT);
  return `rgba(${parsed.red}, ${parsed.green}, ${parsed.blue}, ${alpha})`;
}

export function resolveRadixAccentColor(color) {
  const parsed = parseHexColor(color);
  if (!parsed) return "pink";

  const { hue, saturation, lightness } = rgbToHsl(parsed);
  if (saturation < 12) return "gray";
  if (saturation < 36 && lightness < 72 && hue >= 20 && hue < 55) {
    return "brown";
  }

  return HUE_ACCENTS.find(([maximumHue]) => hue < maximumHue)?.[1] ?? "red";
}

export function createCharacterAccentStyle(color, appearance) {
  const accent = parseHexColor(color)?.hex ?? FALLBACK_ACCENT;
  const isDark = appearance === "dark";
  const surface = isDark ? "#241D24" : "#FFFFFF";

  return {
    "--brand": accent,
    "--brand-strong": mixColor(
      accent,
      isDark ? "#FFFFFF" : "#000000",
      isDark ? 0.28 : 0.22,
    ),
    "--brand-soft": mixColor(accent, surface, isDark ? 0.72 : 0.82),
    "--border": mixColor(accent, surface, isDark ? 0.56 : 0.76),
    "--border-strong": mixColor(accent, surface, isDark ? 0.4 : 0.6),
    "--panel-border": colorWithAlpha(accent, isDark ? 0.52 : 0.34),
    "--mobile-bar-border": colorWithAlpha(accent, isDark ? 0.46 : 0.32),
    "--scrollbar-thumb": colorWithAlpha(accent, 0.55),
  };
}
