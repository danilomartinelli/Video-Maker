import algorithmia from "algorithmia";
import sentenceBoundaryDetection from "sbd";

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

function breakContentIntoSentences(content: string) {
  const sentences = sentenceBoundaryDetection.sentences(content);

  return sentences.map(sentence => ({
    text: sentence,
    keywords: [],
    images: []
  }));
}

export async function textRobot(searchTerm: string) {
  const sourceContentOriginal = await fetchContentFromWikipedia(searchTerm);
  const sourceContentSanitized = sanitizeContent(sourceContentOriginal);
  const sentences = breakContentIntoSentences(sourceContentSanitized);

  return { sourceContentOriginal, sourceContentSanitized, sentences };
}
