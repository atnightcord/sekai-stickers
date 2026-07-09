import { useId, useRef } from "react";
import { TextField } from "@radix-ui/themes";
import { BlossomColorPicker } from "@dayflow/blossom-color-picker-react";
import { hexToBlossomValue } from "../utils/blossomColor";

const COMPLETE_HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

function normalizeHex(value) {
  const match = value.trim().match(COMPLETE_HEX_PATTERN);
  if (!match) return null;

  const digits = match[1];
  const expanded =
    digits.length === 3
      ? digits
          .split("")
          .map((digit) => digit + digit)
          .join("")
      : digits;

  return `#${expanded.toUpperCase()}`;
}

export default function ColorControl({ color, label, onChange }) {
  const inputId = useId();
  const colorInputRef = useRef(null);
  const normalizedColor = normalizeHex(color) ?? "#000000";
  const blossomValue = hexToBlossomValue(normalizedColor);

  const openNativePicker = () => {
    colorInputRef.current?.showPicker?.();
    colorInputRef.current?.focus();
    colorInputRef.current?.click();
  };

  const handleNativeColorChange = (event) => {
    const nextHex = normalizeHex(event.target.value);
    if (nextHex) onChange(nextHex);
  };

  return (
    <div className="color-picker-triggers">
      <BlossomColorPicker
        className="blossom-color-field"
        value={blossomValue}
        onChange={(nextColor) => onChange(nextColor.hex.toUpperCase())}
        showAlphaSlider={false}
        coreSize={30}
        petalSize={28}
        adaptivePositioning
        aria-label={label}
      />

      <div className="hex-input-field">
        <label className="sr-only" htmlFor={inputId}>
          {label} HEX value
        </label>
        <TextField.Root
          id={inputId}
          className="hex-color-input"
          value={normalizedColor}
          readOnly
          onClick={openNativePicker}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openNativePicker();
            }
          }}
          aria-label={`${label} HEX value`}
        />
      </div>

      <input
        ref={colorInputRef}
        className="native-color-input native-color-input--hidden"
        type="color"
        value={normalizedColor}
        onChange={handleNativeColorChange}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
