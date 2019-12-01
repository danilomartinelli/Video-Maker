import { google } from "googleapis";
import imageDownloader from "image-downloader";
import path from "path";

const ROOT_DIR = path.resolve(__dirname);

const customSearch = google.customsearch("v1");

async function downloadAndSave(url: string, fileName: string) {
  return await imageDownloader.image({
    url,
    dest: path.resolve(ROOT_DIR, `../content/${fileName}`)
  });
}

async function downloadAllImages(
  sentences: Array<{ text: string; keywords: string[]; images: string[] }>
) {
  const downloadedImages: string[] = [];

  for (
    let sentenceIndex = 0;
    sentenceIndex < sentences.length;
    sentenceIndex++
  ) {
    const images = sentences[sentenceIndex].images;

    for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
      const imageUrl = images[imageIndex];

      try {
        if (downloadedImages.includes(imageUrl)) {
          throw new Error("Image has already been downloaded.");
        }

        await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`);

        console.log(`		> Downloaded imagem with success: ${imageUrl}`);
        downloadedImages.push(imageUrl);
        break;
      } catch (err) {
        console.log(`		> Download error (${imageUrl}): ${err}`);
      }
    }
  }
}

async function fetchGoogleAndReturnImagesLinks(searchTerm: string) {
  const response = await customSearch.cse.list({
    auth: process.env.SEARCH_ENGINE_API_KEY,
    cx: "002751275710162669884:csrkjmitttg",
    q: searchTerm,
    searchType: "image",
    num: 2
  });

  return response.data.items!.map(item => item.link!);
}

async function getSentencesWithImagesLinks(
  searchTerm: string,
  sentences: Array<{ text: string; keywords: string[]; images: string[] }>
) {
  const parsedSentences: Array<{
    text: string;
    keywords: string[];
    images: string[];
  }> = [];

  for (const sentence of sentences) {
    const query = `${searchTerm} ${sentence.keywords[0]}`;

    console.log(`		> Querying by ${query}...`);
    const imagesUrl = await fetchGoogleAndReturnImagesLinks(query);

    parsedSentences.push({
      text: sentence.text,
      keywords: sentence.keywords,
      images: imagesUrl
    });

    console.log(
      `		> Added image url to sentence #${parsedSentences.length +
        1} of ${sentences.length + 1} sentences.`
    );
  }

  return parsedSentences;
}

export async function imageRobot(
  searchTerm: string,
  sentences: Array<{ text: string; keywords: string[]; images: string[] }>
) {
  console.log(`> Searching for ${searchTerm} on Google Images...`);
  const parsedSentences = await getSentencesWithImagesLinks(
    searchTerm,
    sentences
  );

  console.log(`> Starting to download all images...`);
  await downloadAllImages(parsedSentences);

  return parsedSentences;
}
