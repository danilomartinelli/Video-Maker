import algorithmia from "algorithmia";
import sentenceBoundaryDetection from "sbd";
import NaturalLanguageUnderstandingV1 from "ibm-watson/natural-language-understanding/v1";
import { IamAuthenticator } from "ibm-watson/auth";

const nlu = new NaturalLanguageUnderstandingV1({
  authenticator: new IamAuthenticator({ apikey: process.env.WATSON_API_KEY! }),
  version: "2018-04-05",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api"
});

async function fetchContentFromWikipedia(searchTerm: string) {
  const algorithmiaAuthenticated = algorithmia(process.env.ALGORITHMIA_API_KEY);
  const wikipediaAlgorithm = algorithmiaAuthenticated.algo(
    "web/WikipediaParser/0.1.2"
  );
  const wikipediaResponse = await wikipediaAlgorithm.pipe({
    articleName: searchTerm,
    lang: "en"
  });
  const wikipediaContent = wikipediaResponse.get();

  return wikipediaContent.content;
}

function sanitizeContent(content: string) {
  const allLines = content.split("\n");
  const withoutBlankLines = allLines.filter(line => line.trim().length !== 0);
  const withoutMarkdown = withoutBlankLines.filter(
    line => !line.trim().startsWith("=")
  );
  const sanitizedContentWithDates = withoutMarkdown.join(" ");
  const sanitizedContent = sanitizedContentWithDates
    .replace(/\((?:\([^()]*\)|[^()])*\)/gm, "")
    .replace(/  /g, " ");

  return sanitizedContent;
}

async function breakContentIntoSentences(content: string, limit: number) {
  const sentences = sentenceBoundaryDetection
    .sentences(content)
    .slice(0, limit);

  const parsedSentences: Array<{
    text: string;
    keywords: string[];
    images: string[];
  }> = [];

  for (const sentence of sentences) {
    const nluResponse = await nlu.analyze({
      text: sentence,
      features: {
        keywords: {}
      }
    });

    parsedSentences.push({
      text: sentence,
      keywords: nluResponse.result.keywords!.map(keyword => keyword.text!),
      images: []
    });
  }

  return parsedSentences;
}

export async function textRobot(searchTerm: string, maximumSentences: number) {
  const sourceContentOriginal = await fetchContentFromWikipedia(searchTerm);
  const sourceContentSanitized = sanitizeContent(sourceContentOriginal);
  const sentences = await breakContentIntoSentences(
    sourceContentSanitized,
    maximumSentences
  );

  return { sourceContentOriginal, sourceContentSanitized, sentences };
}
