import fs from "fs";

const contentFilePath = "./content.json";

export function save(data: any) {
  const contentString = JSON.stringify(data);

  return fs.writeFileSync(contentFilePath, contentString);
}

export function load() {
  const fileBuffer = fs.readFileSync(contentFilePath, "utf-8");
  const contentJson = JSON.parse(fileBuffer);

  return contentJson;
}
