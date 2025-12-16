/* eslint-env node */
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

async function main() {
  try {
    const charactersPath = path.resolve(__dirname, "../src/characters-sc.json");
    const publicImgPath = path.resolve(__dirname, "../public/img");

    // 1. Read characters.json
    if (!fs.existsSync(charactersPath)) {
      console.error(`Error: characters.json not found at ${charactersPath}`);
      process.exit(1);
    }
    const charactersData = JSON.parse(fs.readFileSync(charactersPath, "utf-8"));

    // Find max ID
    let maxId = 0;
    charactersData.forEach((char) => {
      const id = parseInt(char.id);
      if (!isNaN(id) && id > maxId) {
        maxId = id;
      }
    });

    // 2. Get User Inputs
    let scanDirInput = process.argv[2];
    if (!scanDirInput) {
      scanDirInput = await question(
        "请输入扫描文件夹路径 (Enter scan directory path): "
      );
    }
    const scanDir = path.resolve(process.cwd(), scanDirInput);

    if (!fs.existsSync(scanDir)) {
      console.error(`Directory does not exist: ${scanDir}`);
      process.exit(1);
    }

    const characterName = await question(
      "请输入角色名称 (Enter Character name): "
    );
    const color = await question("请输入颜色 (Enter Color, e.g. #FFFFFF): ");

    // 3. Scan directory
    const files = fs.readdirSync(scanDir).filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext);
    });

    // Sort files to ensure order
    files.sort();

    console.log(`Found ${files.length} images.`);

    let currentId = maxId;
    let index = 0;

    const newEntries = [];

    for (const file of files) {
      currentId++;

      // Calculate relative path to public/img
      const absoluteFilePath = path.join(scanDir, file);
      let relativeImgPath = path.relative(publicImgPath, absoluteFilePath);

      // Ensure forward slashes for JSON
      relativeImgPath = relativeImgPath.split(path.sep).join("/");

      const entry = {
        id: currentId.toString(),
        name: `${characterName} ${index.toString().padStart(2, "0")}`,
        character: characterName,
        img: relativeImgPath,
        color: color,
        defaultText: {
          text: "something",
          x: 148,
          y: 58,
          r: -2,
          s: 47,
        },
      };

      newEntries.push(entry);
      charactersData.push(entry);
      index++;
    }

    // 4. Write back
    fs.writeFileSync(charactersPath, JSON.stringify(charactersData, null, 4));

    console.log(
      `Successfully added ${newEntries.length} characters to characters.json`
    );
  } catch (error) {
    console.error("Error:", error);
  } finally {
    rl.close();
  }
}

main();
