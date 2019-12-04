import path from "path";
import gm from "gm";

const ROOT_DIR = path.resolve(__dirname);

const imageMagick = gm.subClass({ imageMagick: true });

async function convertAllImages(
  sentences: Array<{ text: string; keywords: string[]; images: string[] }>
) {
  for (
    let sentenceIndex = 0;
    sentenceIndex < sentences.length;
    sentenceIndex++
  ) {
    await new Promise((resolve, reject) => {
      const inputFile = path.resolve(
        ROOT_DIR,
        `../content/${sentenceIndex}-original.png[0]`
      );
      const outputFile = path.resolve(
        ROOT_DIR,
        `../content/${sentenceIndex}-converted.png`
      );
      const width = 1920;
      const height = 1080;

      imageMagick(inputFile)
        .out("(")
        .out("-clone")
        .out("0")
        .out("-background", "white")
        .out("-blur", "0x9")
        .out("-resize", `${width}x${height}^`)
        .out(")")
        .out("(")
        .out("-clone")
        .out("0")
        .out("-background", "white")
        .out("-resize", `${width}x${height}`)
        .out(")")
        .out("-delete", "0")
        .out("-gravity", "center")
        .out("-compose", "over")
        .out("-composite")
        .out("-extent", `${width}x${height}`)
        .write(outputFile, error => {
          if (error) return reject(error);

          console.log(`   > Image converted: ${outputFile}`);
          resolve();
        });
    });
  }
}

async function createAllSentenceImages(
  sentences: Array<{ text: string; keywords: string[]; images: string[] }>
) {
  for (
    let sentenceIndex = 0;
    sentenceIndex < sentences.length;
    sentenceIndex++
  ) {
    const text = sentences[sentenceIndex].text;

    await new Promise((resolve, reject) => {
      const outputFile = path.resolve(
        ROOT_DIR,
        `../content/${sentenceIndex}-sentence.png`
      );

      imageMagick("")
        .out("-size", "1920x400")
        .out("-gravity", "center")
        .out("-background", "transparent")
        .out("-fill", "white")
        .out("-kerning", "-1")
        .out(`caption:${text}`)
        .write(outputFile, error => {
          if (error) return reject(error);

          console.log(`     > Sentence created: ${outputFile}`);
          resolve();
        });
    });
  }
}

async function createYoutubeThumbnail() {
  await new Promise((resolve, reject) => {
    const inputFile = path.resolve(ROOT_DIR, `../content/0-converted.png`);
    const outputFile = path.resolve(
      ROOT_DIR,
      `../content/youtube-thumbnail.png`
    );

    imageMagick(inputFile).write(outputFile, error => {
      if (error) return reject(error);

      console.log("     > YouTube thumbnail created");
      resolve();
    });
  });
}

export async function videoRobot(
  sentences: Array<{ text: string; keywords: string[]; images: string[] }>
) {
  console.log(`> Starting to convert all images...`);
  await convertAllImages(sentences);

  console.log(`> Starting to create sentences in images...`);
  await createAllSentenceImages(sentences);

  console.log(`> Starting to create thumbnail for YouTube...`);
  await createYoutubeThumbnail();
}
