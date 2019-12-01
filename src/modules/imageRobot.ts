import { google } from "googleapis";

const customSearch = google.customsearch("v1");

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

export async function imageRobot(
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
    const imagesUrl = await fetchGoogleAndReturnImagesLinks(query);

    parsedSentences.push({
      text: sentence.text,
      keywords: sentence.keywords,
      images: imagesUrl
    });
  }

  return parsedSentences;
}
