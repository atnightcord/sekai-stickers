import characters from "../characters.json";
import charactersSC from "../characters-sc.json";
import defaultCharacter from "../defaultCharacter";

const STORAGE_KEY = "sekai-stickers:editor-state";
const STORAGE_VERSION = 1;
const FONT_KEYS = new Set(["yuruka", "fangtang", "system"]);
const ALL_CHARACTERS = [defaultCharacter, ...characters, ...charactersSC];

function defaultEditorState(character = defaultCharacter) {
  return {
    character,
    text: character.defaultText.text,
    position: {
      x: character.defaultText.x,
      y: character.defaultText.y,
    },
    fontSize: character.defaultText.s,
    spaceSize: 25,
    rotate: character.defaultText.r,
    curve: false,
    vertical: false,
    textColor: character.color,
    strokeWidth: 9,
    strokeColor: "#FFFFFF",
    fontKey: "yuruka",
    textBehind: false,
    letterSpacing: 0,
  };
}

function validNumber(value, fallback, minimum = -Infinity, maximum = Infinity) {
  return Number.isFinite(value)
    ? Math.min(maximum, Math.max(minimum, value))
    : fallback;
}

function validBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}

function validColor(value, fallback) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)
    ? value.toUpperCase()
    : fallback;
}

function findCharacter(image) {
  return ALL_CHARACTERS.find((character) => character.img === image);
}

export function loadPersistedEditorState() {
  const fallback = defaultEditorState();
  if (typeof window === "undefined") return fallback;

  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (!saved || saved.version !== STORAGE_VERSION) return fallback;

    const character = saved.customImageActive
      ? defaultCharacter
      : (findCharacter(saved.characterImage) ?? defaultCharacter);
    const defaults = defaultEditorState(character);

    return {
      character,
      text: typeof saved.text === "string" ? saved.text : defaults.text,
      position: {
        x: validNumber(saved.position?.x, defaults.position.x),
        y: validNumber(saved.position?.y, defaults.position.y),
      },
      fontSize: validNumber(saved.fontSize, defaults.fontSize, 10, 100),
      spaceSize: validNumber(saved.spaceSize, defaults.spaceSize, 18, 100),
      rotate: validNumber(saved.rotate, defaults.rotate, -10, 10),
      curve: validBoolean(saved.curve, defaults.curve),
      vertical: validBoolean(saved.vertical, defaults.vertical),
      textColor: validColor(saved.textColor, defaults.textColor),
      strokeWidth: validNumber(
        saved.strokeWidth,
        defaults.strokeWidth,
        0,
        30,
      ),
      strokeColor: validColor(saved.strokeColor, defaults.strokeColor),
      fontKey: FONT_KEYS.has(saved.fontKey) ? saved.fontKey : defaults.fontKey,
      textBehind: validBoolean(saved.textBehind, defaults.textBehind),
      letterSpacing: validNumber(
        saved.letterSpacing,
        defaults.letterSpacing,
        -10,
        30,
      ),
    };
  } catch {
    return fallback;
  }
}

export function savePersistedEditorState(state) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        characterImage: state.character.img,
        customImageActive: state.customImageActive,
        text: state.text,
        position: state.position,
        fontSize: state.fontSize,
        spaceSize: state.spaceSize,
        rotate: state.rotate,
        curve: state.curve,
        vertical: state.vertical,
        textColor: state.textColor,
        strokeWidth: state.strokeWidth,
        strokeColor: state.strokeColor,
        fontKey: state.fontKey,
        textBehind: state.textBehind,
        letterSpacing: state.letterSpacing,
      }),
    );
  } catch {
    // Storage may be unavailable or full. Editing should continue normally.
  }
}
