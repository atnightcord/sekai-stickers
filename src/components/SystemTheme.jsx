import { useEffect, useState } from "react";
import { Theme } from "@radix-ui/themes";

const SYSTEM_DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

function getSystemAppearance() {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia(SYSTEM_DARK_MODE_QUERY).matches ? "dark" : "light";
}

export default function SystemTheme({ children }) {
  const [appearance, setAppearance] = useState(getSystemAppearance);

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

  return (
    <Theme
      appearance={appearance}
      accentColor="pink"
      grayColor="mauve"
      radius="none"
    >
      {children}
    </Theme>
  );
}
