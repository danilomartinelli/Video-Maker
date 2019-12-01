import fs from "fs";
import path from "path";

const ROOT_DIR = path.resolve(__dirname);
const contentFilePath = path.resolve(ROOT_DIR, "../content/content.json");

export function save(data: any) {
  const contentString = JSON.stringify(data);

  return fs.writeFileSync(contentFilePath, contentString);
}

export function load() {
  const fileBuffer = fs.readFileSync(contentFilePath, "utf-8");
  const contentJson = JSON.parse(fileBuffer);

  return contentJson;
}
