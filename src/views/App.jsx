import "../assets/main.css";
import Canvas from "../components/Canvas";
import { useState, useEffect, useRef, useMemo } from "react";
import { BlossomColorPicker } from "@dayflow/blossom-color-picker-react";
import "@dayflow/blossom-color-picker/styles.css";
import { hexToBlossomValue } from "../utils/blossomColor";
import defaultCharacter from "../defaultCharacter";
import Picker from "../components/Picker";
import Info from "../components/Info";
import log from "../utils/log";
import { Button, Switch, Select, Slider, TextArea } from "@radix-ui/themes";

const { ClipboardItem } = window;
const DEFAULT_STROKE_WIDTH = 9;
const FONT_STACKS = {
  yuruka: "YurukaStd, SSFangTangTi, sans-serif",
  fangtang: "SSFangTangTi, sans-serif",
  system:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};
const DEFAULT_FONT_KEY = "yuruka";

function App() {
  const [character, setCharacter] = useState(defaultCharacter);
  const [text, setText] = useState(character.defaultText.text);
  const [position, setPosition] = useState({
    x: character.defaultText.x,
    y: character.defaultText.y,
  });
  const [fontSize, setFontSize] = useState(character.defaultText.s);
  const [spaceSize, setSpaceSize] = useState(25);
  const [rotate, setRotate] = useState(character.defaultText.r);
  const [curve, setCurve] = useState(false);
  const [vertical, setVertical] = useState(false);
  const [textColor, setTextColor] = useState(character.color);
  const [strokeWidth, setStrokeWidth] = useState(DEFAULT_STROKE_WIDTH);
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [loaded, setLoaded] = useState(false);
  const [customImage, setCustomImage] = useState(null);
  const [fontKey, setFontKey] = useState(DEFAULT_FONT_KEY);
  const [textBehind, setTextBehind] = useState(false);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  const textBlossomValue = useMemo(
    () => hexToBlossomValue(textColor),
    [textColor],
  );
  const strokeBlossomValue = useMemo(
    () => hexToBlossomValue(strokeColor),
    [strokeColor],
  );

  const applyCharacterDefaults = (selectedCharacter) => {
    setText(selectedCharacter.defaultText.text);
    setPosition({
      x: selectedCharacter.defaultText.x,
      y: selectedCharacter.defaultText.y,
    });
    setRotate(selectedCharacter.defaultText.r);
    setFontSize(selectedCharacter.defaultText.s);
    setSpaceSize(25);
    setCurve(false);
    setVertical(false);
    setTextColor(selectedCharacter.color);
    setStrokeColor("#ffffff");
    setStrokeWidth(DEFAULT_STROKE_WIDTH);
    setLoaded(false);
  };

  const handleCharacterSelect = (selectedCharacter) => {
    setCharacter(selectedCharacter);
    applyCharacterDefaults(selectedCharacter);
  };

  const handleUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target && ev.target.result;
      if (typeof result === "string") {
        setLoaded(false);
        setCustomImage(result);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const clearUpload = () => {
    setLoaded(false);
    setCustomImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const getPoint = (e) => {
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handlePointerDown = (e) => {
    const { x, y } = getPoint(e);
    isDragging.current = true;
    lastPos.current = { x, y };
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const { x, y } = getPoint(e);
    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    if (dx !== 0 || dy !== 0) {
      setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPos.current = { x, y };
    }
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  const handlePointerUp = (e) => {
    isDragging.current = false;
    if (e && e.cancelable) {
      e.preventDefault();
    }
  };

  const resetSettings = () => {
    setText(character.defaultText.text);
    setPosition({
      x: character.defaultText.x,
      y: character.defaultText.y,
    });
    setRotate(character.defaultText.r);
    setFontSize(character.defaultText.s);
    setSpaceSize(25);
    setCurve(false);
    setVertical(false);
    setTextColor(character.color);
    setStrokeColor("#ffffff");
    setStrokeWidth(DEFAULT_STROKE_WIDTH);
    setFontKey(DEFAULT_FONT_KEY);
    setTextBehind(false);
    setLetterSpacing(0);
  };

  useEffect(() => {
    let cancelled = false;
    const src = customImage ?? "/img/" + character.img;
    const image = new Image();
    image.onload = () => {
      if (!cancelled) {
        imgRef.current = image;
        setLoaded(true);
      }
    };
    image.onerror = () => {
      if (!cancelled) setLoaded(false);
    };
    image.src = src;
    return () => {
      cancelled = true;
    };
  }, [character, customImage]);

  let angle = (Math.PI * text.length) / 7;

  const drawText = (ctx) => {
    ctx.font = `${fontSize}px ${FONT_STACKS[fontKey]}`;
    ctx.lineWidth = strokeWidth;
    ctx.save();

    ctx.translate(position.x, position.y);
    ctx.rotate(rotate / 10);
    ctx.textAlign = "center";
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = textColor;
    const lines = text.split("\n");
    if (curve) {
      for (let line of lines) {
        for (let i = 0; i < line.length; i++) {
          ctx.rotate(angle / line.length / 2.5);
          ctx.save();
          ctx.translate(0, -1 * fontSize * 3.5);
          ctx.strokeText(line[i], 0, 0);
          ctx.fillText(line[i], 0, 0);
          ctx.restore();
        }
      }
    } else if (vertical) {
      const letterStep = fontSize + letterSpacing;
      const lineStep = fontSize + spaceSize - 40;
      let xOffset = 0;
      for (const line of lines) {
        let yOffset = 0;
        for (let i = 0; i < line.length; i++) {
          ctx.strokeText(line[i], xOffset, yOffset);
          ctx.fillText(line[i], xOffset, yOffset);
          yOffset += letterStep;
        }
        xOffset += lineStep;
      }
    } else {
      if (letterSpacing === 0) {
        for (let i = 0, k = 0; i < lines.length; i++) {
          ctx.strokeText(lines[i], 0, k);
          ctx.fillText(lines[i], 0, k);
          k += spaceSize;
        }
      } else {
        ctx.textAlign = "left";
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const lineY = i * spaceSize;
          const metrics = ctx.measureText(line);
          let charX = -metrics.width / 2;
          for (let j = 0; j < line.length; j++) {
            ctx.strokeText(line[j], charX, lineY);
            ctx.fillText(line[j], charX, lineY);
            const charMetrics = ctx.measureText(line[j]);
            charX += charMetrics.width + letterSpacing;
          }
        }
        ctx.textAlign = "center";
      }
    }
    ctx.restore();
  };

  const draw = (ctx) => {
    ctx.canvas.width = 296;
    ctx.canvas.height = 256;
    const img = imgRef.current;
    if (!loaded || !img) return;

    var hRatio = ctx.canvas.width / img.width;
    var vRatio = ctx.canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);
    var centerShift_x = (ctx.canvas.width - img.width * ratio) / 2;
    var centerShift_y = (ctx.canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (textBehind) {
      drawText(ctx);
    }

    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio,
    );

    if (!textBehind) {
      drawText(ctx);
    }
  };

  const download = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    const link = document.createElement("a");
    link.download = `${character.name}_generated.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadWebp = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    const ctx = canvas.getContext("2d");
    const ratio = 512 / canvas.height;
    ctx.scale(ratio, ratio);
    const link = document.createElement("a");
    link.download = `${character.name}_generated.webp`;
    link.href = canvas.toDataURL("image/webp");
    link.click();
  };

  const downloadJpg = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const compositeOperation = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(data, 0, 0);
    ctx.globalCompositeOperation = compositeOperation;
    const link = document.createElement("a");
    link.download = `${character.name}_generated.jpg`;
    link.href = imageData;
    link.click();
  };

  function b64toBlob(b64Data, contentType = null, sliceSize = null) {
    contentType = contentType || "image/png";
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  const copy = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": b64toBlob(canvas.toDataURL().split(",")[1]),
      }),
    ]);
    await log(character.id, character.name, "copy");
  };

  const copyWithBg = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const compositeOperation = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(data, 0, 0);
    ctx.globalCompositeOperation = compositeOperation;
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": b64toBlob(imageData.split(",")[1]),
      }),
    ]);
    await log(character.id, character.name, "copy");
  };

  return (
    <main className="app-shell">
      <div className="app-chrome">
        <header className="app-header">
          <div className="app-header-copy">
            <p className="app-eyebrow">Sekai Stickers</p>
            <h1 className="app-title">Make a sticker in seconds</h1>
            <p className="app-subtitle">
              Pick a character, type your line, drag the text into place, then
              copy or save the result.
            </p>
          </div>
          <div className="app-header-actions">
            <Info />
          </div>
        </header>

        <div className="workspace-grid">
          <section className="preview-panel" aria-labelledby="preview-title">
            <div className="preview-stage">
              <div className="axis-grid">
                <div className="axis-grid-canvas">
                  <div
                    className="canvas"
                    role="img"
                    aria-label="Sticker preview canvas"
                  >
                    <Canvas
                      draw={draw}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerLeave={handlePointerUp}
                    />
                    {!loaded && (
                      <div className="canvas-loading">Loading sticker…</div>
                    )}
                  </div>
                </div>

                <Slider
                  className="slider-vertical"
                  value={[
                    curve ? 256 - position.y + fontSize * 3 : 256 - position.y,
                  ]}
                  onValueChange={([v]) =>
                    setPosition({
                      ...position,
                      y: curve ? 256 + fontSize * 3 - v : 256 - v,
                    })
                  }
                  min={0}
                  max={256}
                  step={1}
                  orientation="vertical"
                />

                <Slider
                  className="slider-horizontal"
                  value={[position.x]}
                  onValueChange={([v]) => setPosition({ ...position, x: v })}
                  min={0}
                  max={296}
                  step={1}
                />

                <div className="axis-grid-empty" />
              </div>
            </div>
          </section>

          <section className="controls-panel" aria-labelledby="controls-title">
            <div className="w-full flex flex-row gap-4 justify-between items-center mb-6">
              <div className="controls-panel-head !mb-0">
                <p className="section-kicker">Controls</p>
                <h2 id="controls-title">Tune the sticker</h2>
              </div>
              <Button
                className="w-full"
                size="2"
                variant="soft"
                color="gray"
                onClick={resetSettings}
              >
                Reset all
              </Button>
            </div>
            <div className="control-sections">
              <section
                className="control-section"
                aria-labelledby="content-title"
              >
                <div className="control-section-head">
                  <h3 id="content-title">Content</h3>
                  <p>Choose a character and write the line.</p>
                </div>

                <div className="control-stack">
                  <div className="picker">
                    <Picker
                      character={character}
                      setCharacter={handleCharacterSelect}
                    />
                  </div>

                  <div className="form-field text form-field--full">
                    <label className="field-label" htmlFor="sticker-text">
                      Sticker text
                    </label>
                    <TextArea
                      id="sticker-text"
                      size="2"
                      placeholder="Type the sticker text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="text-input"
                    />
                  </div>

                  <div className="control-row">
                    <label
                      className="field-label field-label--inline"
                      htmlFor="font-select"
                    >
                      Font
                    </label>
                    <Select.Root value={fontKey} onValueChange={setFontKey}>
                      <Select.Trigger id="font-select" />
                      <Select.Content>
                        <Select.Item value="yuruka">YurukaStd</Select.Item>
                        <Select.Item value="fangtang">SSFangTangTi</Select.Item>
                        <Select.Item value="system">System Sans</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </div>
                </div>
              </section>

              <section
                className="control-section"
                aria-labelledby="layout-title"
              >
                <div className="control-section-head">
                  <h3 id="layout-title">Layout</h3>
                  <p>Shape the position, angle, and spacing.</p>
                </div>

                <div className="control-stack">
                  <div className="slider-field">
                    <div className="slider-field-head">
                      <label className="field-label" htmlFor="rotate-slider">
                        Rotate
                      </label>
                      <span>{rotate.toFixed(1)}°</span>
                    </div>
                    <Slider
                      id="rotate-slider"
                      value={[rotate]}
                      onValueChange={([v]) => setRotate(v)}
                      min={-10}
                      max={10}
                      step={0.2}
                    />
                  </div>

                  <div className="slider-field">
                    <div className="slider-field-head">
                      <label className="field-label" htmlFor="font-size-slider">
                        Font size
                      </label>
                      <span>{fontSize}px</span>
                    </div>
                    <Slider
                      id="font-size-slider"
                      value={[fontSize]}
                      onValueChange={([v]) => setFontSize(v)}
                      min={10}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="slider-field">
                    <div className="slider-field-head">
                      <label className="field-label" htmlFor="spacing-slider">
                        Line spacing
                      </label>
                      <span>{spaceSize}px</span>
                    </div>
                    <Slider
                      id="spacing-slider"
                      value={[spaceSize]}
                      onValueChange={([v]) => setSpaceSize(v)}
                      min={18}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="slider-field">
                    <div className="slider-field-head">
                      <label
                        className="field-label"
                        htmlFor="letter-spacing-slider"
                      >
                        Letter spacing
                      </label>
                      <span>{letterSpacing}px</span>
                    </div>
                    <Slider
                      id="letter-spacing-slider"
                      value={[letterSpacing]}
                      onValueChange={([v]) => setLetterSpacing(v)}
                      min={-10}
                      max={30}
                      step={1}
                    />
                  </div>

                  <div className="toggle-grid">
                    <div className="toggle-row">
                      <div>
                        <label className="field-label" htmlFor="curve-toggle">
                          Curve text
                        </label>
                        <p className="toggle-help">Wrap text around an arc.</p>
                      </div>
                      <Switch
                        id="curve-toggle"
                        checked={curve}
                        onCheckedChange={setCurve}
                      />
                    </div>

                    <div className="toggle-row">
                      <div>
                        <label
                          className="field-label"
                          htmlFor="vertical-toggle"
                        >
                          Vertical text
                        </label>
                        <p className="toggle-help">
                          Stack characters top to bottom.
                        </p>
                      </div>
                      <Switch
                        id="vertical-toggle"
                        checked={vertical}
                        onCheckedChange={setVertical}
                      />
                    </div>

                    <div className="toggle-row">
                      <div>
                        <label className="field-label" htmlFor="behind-toggle">
                          Text behind image
                        </label>
                        <p className="toggle-help">
                          Place the sticker in front of the text.
                        </p>
                      </div>
                      <Switch
                        id="behind-toggle"
                        checked={textBehind}
                        onCheckedChange={setTextBehind}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section
                className="control-section"
                aria-labelledby="style-title"
              >
                <div className="control-section-head">
                  <h3 id="style-title">Style</h3>
                  <p>Control color, outline, and custom artwork.</p>
                </div>

                <div className="control-stack">
                  <div className="slider-field">
                    <div className="slider-field-head">
                      <label
                        className="field-label"
                        htmlFor="stroke-width-slider"
                      >
                        Stroke width
                      </label>
                      <span>{strokeWidth}px</span>
                    </div>
                    <Slider
                      id="stroke-width-slider"
                      value={[strokeWidth]}
                      onValueChange={([v]) => setStrokeWidth(v)}
                      min={0}
                      max={30}
                      step={0.5}
                    />
                  </div>

                  <div className="control-row control-row--color">
                    <div>
                      <label className="field-label" htmlFor="text-color">
                        Text color
                      </label>
                      <p className="toggle-help">
                        Use the character accent or pick your own.
                      </p>
                    </div>
                    <div className="color-control-group">
                      <BlossomColorPicker
                        className="blossom-color-field"
                        value={textBlossomValue}
                        onChange={(c) => setTextColor(c.hex)}
                        showAlphaSlider={false}
                        coreSize={30}
                        petalSize={28}
                        adaptivePositioning
                        aria-label="Text color"
                      />
                      <Button
                        size="2"
                        variant="soft"
                        color="gray"
                        onClick={() => setTextColor(character.color)}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>

                  <div className="control-row control-row--color">
                    <div>
                      <label className="field-label" htmlFor="stroke-color">
                        Stroke color
                      </label>
                      <p className="toggle-help">
                        Outline color for better contrast.
                      </p>
                    </div>
                    <div className="color-control-group">
                      <BlossomColorPicker
                        className="blossom-color-field"
                        value={strokeBlossomValue}
                        onChange={(c) => setStrokeColor(c.hex)}
                        showAlphaSlider={false}
                        coreSize={30}
                        petalSize={28}
                        adaptivePositioning
                        aria-label="Stroke color"
                      />
                      <Button
                        size="2"
                        variant="soft"
                        color="gray"
                        onClick={() => setStrokeColor("#ffffff")}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>

                  <div className="control-row control-row--upload">
                    <div>
                      <label className="field-label" htmlFor="custom-image">
                        Custom image
                      </label>
                      <p className="toggle-help">
                        Replace the character art with your own image.
                      </p>
                    </div>
                    <div className="upload-control-group">
                      <input
                        id="custom-image"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        aria-label="Custom image upload"
                        style={{ display: "none" }}
                      />
                      <Button
                        size="2"
                        variant="soft"
                        color="gray"
                        onClick={triggerUpload}
                      >
                        Upload
                      </Button>
                      {customImage && (
                        <Button
                          size="2"
                          variant="soft"
                          color="gray"
                          onClick={clearUpload}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section
                className="control-section export-section"
                aria-labelledby="export-title"
              >
                <div className="control-section-head">
                  <h3 id="export-title">Export</h3>
                  <p>Copy fast on mobile, or save a file locally.</p>
                </div>

                <div className="export-grid">
                  <Button size="3" onClick={copy}>
                    Copy PNG
                  </Button>
                  <Button size="3" variant="soft" onClick={copyWithBg}>
                    Copy JPG
                  </Button>
                  <Button size="3" variant="soft" onClick={download}>
                    Save PNG
                  </Button>
                  <Button size="3" variant="soft" onClick={downloadJpg}>
                    Save JPG
                  </Button>
                  <Button
                    className="export-wide"
                    size="3"
                    variant="soft"
                    onClick={downloadWebp}
                  >
                    Save WEBP
                  </Button>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>

      <div className="mobile-action-bar">
        <Button size="3" onClick={copy}>
          Copy PNG
        </Button>
        <Button size="3" variant="soft" onClick={download}>
          Save PNG
        </Button>
      </div>
    </main>
  );
}

export default App;
