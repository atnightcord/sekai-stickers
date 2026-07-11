import { useEffect, useMemo, useState } from "react";
import { Theme } from "@radix-ui/themes";
import {
  createCharacterAccentStyle,
  resolveRadixAccentColor,
} from "../utils/themeAccent";

const SYSTEM_DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

function getSystemAppearance() {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia(SYSTEM_DARK_MODE_QUERY).matches ? "dark" : "light";
}

export default function SystemTheme({ accentColor, children }) {
  const [appearance, setAppearance] = useState(getSystemAppearance);
  const characterAccentStyle = useMemo(
    () => createCharacterAccentStyle(accentColor, appearance),
    [accentColor, appearance],
  );

  useEffect(() => {
    if (!window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia(SYSTEM_DARK_MODE_QUERY);
    const updateAppearance = (event) => {
      setAppearance(event.matches ? "dark" : "light");
    };

    updateAppearance(mediaQuery);
    mediaQuery.addEventListener("change", updateAppearance);

    return () => mediaQuery.removeEventListener("change", updateAppearance);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const property = "--scrollbar-thumb";
    const previousColor = root.style.getPropertyValue(property);

    root.style.setProperty(property, characterAccentStyle[property]);

    return () => {
      if (previousColor) root.style.setProperty(property, previousColor);
      else root.style.removeProperty(property);
    };
  }, [characterAccentStyle]);

  return (
    <Theme
      appearance={appearance}
      accentColor={resolveRadixAccentColor(accentColor)}
      grayColor="mauve"
      radius="none"
      style={characterAccentStyle}
    >
      {children}
    </Theme>
  );
}
