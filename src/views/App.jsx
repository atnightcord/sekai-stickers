import "../assets/main.css";
import Canvas from "../components/Canvas";
import { useState, useEffect } from "react";
import characters from "../characters.json";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
//import Button from "@mui/material/Button";
//import Switch from "@mui/material/Switch";
import Picker from "../components/Picker";
import Info from "../components/Info";
import log from "../utils/log";
import {Button,Switch} from '@radix-ui/themes';

const { ClipboardItem } = window;

function App() {
  // using this to trigger the useEffect because lazy to think of a better way
  const [rand, setRand] = useState(0);

  const [infoOpen, setInfoOpen] = useState(false);

  const handleClickOpen = () => {
    setInfoOpen(true);
  };

  const handleClose = () => {
    setInfoOpen(false);
  };

  const [character, setCharacter] = useState(49);
  const [text, setText] = useState(characters[character].defaultText.text);
  const [position, setPosition] = useState({
    x: characters[character].defaultText.x,
    y: characters[character].defaultText.y,
  });
  const [fontSize, setFontSize] = useState(characters[character].defaultText.s);
  const [spaceSize, setSpaceSize] = useState(1);
  const [rotate, setRotate] = useState(characters[character].defaultText.r);
  const [curve, setCurve] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const img = new Image();

  useEffect(() => {
    setText(characters[character].defaultText.text);
    setPosition({
      x: characters[character].defaultText.x,
      y: characters[character].defaultText.y,
    });
    setRotate(characters[character].defaultText.r);
    setFontSize(characters[character].defaultText.s);
    setLoaded(false);
  }, [character]);

  img.src = "/img/" + characters[character].img;

  img.onload = () => {
    setLoaded(true);
  };

  let angle = (Math.PI * text.length) / 7;

  const draw = (ctx) => {
    ctx.canvas.width = 296;
    ctx.canvas.height = 256;

    if (loaded && document.fonts.check("12px YurukaStd")) {
      var hRatio = ctx.canvas.width / img.width;
      var vRatio = ctx.canvas.height / img.height;
      var ratio = Math.min(hRatio, vRatio);
      var centerShift_x = (ctx.canvas.width - img.width * ratio) / 2;
      var centerShift_y = (ctx.canvas.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
      );
      ctx.font = `${fontSize}px YurukaStd, SSFangTangTi`;
      ctx.lineWidth = 9;
      ctx.save();

      ctx.translate(position.x, position.y);
      ctx.rotate(rotate / 10);
      ctx.textAlign = "center";
      ctx.strokeStyle = "white";
      ctx.fillStyle = characters[character].color;
      var lines = text.split("\n");
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
      } else {
        for (var i = 0, k = 0; i < lines.length; i++) {
          ctx.strokeText(lines[i], 0, k);
          ctx.fillText(lines[i], 0, k);
          k += spaceSize;
        }
        ctx.restore();
      }
    }
  };

  const download = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    const link = document.createElement("a");
    link.download = `${characters[character].name}_generated.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadWebp = async () => {
    // resize height to 512px
    const canvas = document.getElementsByTagName("canvas")[0];
    const ctx = canvas.getContext('2d');
    const ratio = 512 / canvas.height;
    ctx.scale(ratio, ratio);
    const link = document.createElement("a");
    link.download = `${characters[character].name}_generated.webp`;
    link.href = canvas.toDataURL('image/webp');
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
    link.download = `${characters[character].name}_generated.jpg`;
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
    await log(characters[character].id, characters[character].name, "copy");
    setRand(rand + 1);
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
    await log(characters[character].id, characters[character].name, "copy");
    setRand(rand + 1);
  };

  return (
    <div className="App font-sans">
      <div className="container">
        <div className="vertical">
          <div className="canvas">
            <Canvas draw={draw} />
          </div>
          <Slider
            value={curve ? 256 - position.y + fontSize * 3 : 256 - position.y}
            onChange={(e, v) =>
              setPosition({
                ...position,
                y: curve ? 256 + fontSize * 3 - v : 256 - v,
              })
            }
            min={0}
            max={256}
            step={1}
            orientation="vertical"
            track={false}
            color="secondary"
          />
        </div>
        <div className="horizontal">
          <Slider
            className="slider-horizontal"
            value={position.x}
            onChange={(e, v) => setPosition({ ...position, x: v })}
            min={0}
            max={296}
            step={1}
            track={false}
            color="secondary"
          />
          <div className="settings settingsitems">
            <div>
              <label>Rotate: </label>
              <Slider
                value={rotate}
                onChange={(e, v) => setRotate(v)}
                min={-10}
                max={10}
                step={0.2}
                track={false}
                color="secondary"
              />
            </div>
            <div>
              <label>
                <nobr>Font size: </nobr>
              </label>
              <Slider
                value={fontSize}
                onChange={(e, v) => setFontSize(v)}
                min={10}
                max={100}
                step={1}
                track={false}
                color="secondary"
              />
            </div>
            <div>
              <label>
                <nobr>Spacing: </nobr>
              </label>
              <Slider
                value={spaceSize}
                onChange={(e, v) => setSpaceSize(v)}
                min={18}
                max={100}
                step={1}
                track={false}
                color="secondary"
              />
            </div>
            <div>
              <label>Curve (Beta): </label>
              <Switch
                onClick={() => setCurve(!curve)}
                color="secondary"
              />
            </div>
          </div>
          <div className="text">
            <TextField
              label="Text"
              size="small"
              color="secondary"
              value={text}
              multiline={true}
              fullWidth
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="picker">
            <Picker setCharacter={setCharacter} />
          </div>
          <div className="grid grid-cols-2 gap-2 py-2">
            <Button size="3" variant="soft" onClick={copy}>
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
            <Button size="3" variant="soft" onClick={downloadWebp}>
              Save WEBP
            </Button>
          </div>
        </div>
        <div className="footer">
          <Info />
        </div>
      </div>
    </div>
  );
}

export default App;
