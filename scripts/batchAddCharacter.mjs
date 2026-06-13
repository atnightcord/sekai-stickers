/* global process, __dirname */
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function getMaxId(characters) {
  let maxId = 0;
  for (const char of characters) {
    const idNum = parseInt(char.id, 10);
    if (!Number.isNaN(idNum)) {
      maxId = Math.max(maxId, idNum);
    }
  }
  return maxId;
}

function isDirectory(entryPath) {
  try {
    return fs.statSync(entryPath).isDirectory();
  } catch (err) {
    return false;
  }
}

function collectImages(folderPath) {
  const files = fs.readdirSync(folderPath);
  return files
    .filter((file) => IMAGE_EXTS.includes(path.extname(file).toLowerCase()))
    .sort();
}

async function main() {
  const charactersPath = path.resolve(__dirname, "../src/characters-sc.json");
  const publicImgPath = path.resolve(__dirname, "../public/img");

  try {
    const charactersData = readJson(charactersPath);
    let maxId = getMaxId(charactersData);

    let scanRoot = process.argv[2];
    if (!scanRoot) {
      scanRoot = await question(
        "请输入扫描根目录路径 (root dir with subfolders): "
      );
    }
    const rootDir = path.resolve(process.cwd(), scanRoot);
    if (!fs.existsSync(rootDir)) {
      console.error(`Directory does not exist: ${rootDir}`);
      process.exit(1);
    }

    const entries = fs.readdirSync(rootDir);
    const subdirs = entries
      .map((name) => ({ name, full: path.join(rootDir, name) }))
      .filter(({ full }) => isDirectory(full));

    if (subdirs.length === 0) {
      console.error("No subdirectories found to process.");
      process.exit(1);
    }

    let addedCount = 0;
    const newEntries = [];

    for (const { name: characterName, full: dirPath } of subdirs) {
      const color = await question(
        `为角色 ${characterName} 输入颜色 (e.g. #FFFFFF): `
      );
      const images = collectImages(dirPath);
      if (images.length === 0) {
        console.warn(`Skip ${characterName}: no image files found.`);
        continue;
      }

      let index = 0;
      for (const file of images) {
        maxId += 1;
        const absoluteFilePath = path.join(dirPath, file);
        let relativeImgPath = path.relative(publicImgPath, absoluteFilePath);
        relativeImgPath = relativeImgPath.split(path.sep).join("/");

        const entry = {
          id: String(maxId),
          name: `${characterName} ${String(index).padStart(2, "0")}`,
          character: characterName,
          img: relativeImgPath,
          color,
          defaultText: {
            text: "something",
            x: 148,
            y: 58,
            r: -2,
            s: 47,
          },
        };

        charactersData.push(entry);
        newEntries.push(entry);
        index += 1;
        addedCount += 1;
      }
    }

    if (addedCount === 0) {
      console.warn(
        "No entries added. Ensure subfolders contain supported image files."
      );
    } else {
      fs.writeFileSync(charactersPath, JSON.stringify(charactersData, null, 4));
      console.log(
        `Successfully added ${addedCount} entries to characters-sc.json`
      );
    }
  } catch (error) {
    console.error("Error:", error.message || error);
  } finally {
    rl.close();
  }
}

main();
