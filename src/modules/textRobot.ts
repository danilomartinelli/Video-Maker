import algorithmia from "algorithmia";

async function fetchContentFromWikipedia(searchTerm: string) {
  const algorithmiaAuthenticated = algorithmia(process.env.ALGORITHMIA_API_KEY);
  const wikipediaAlgorithm = algorithmiaAuthenticated.algo(
    "web/WikipediaParser/0.1.2"
  );
  const wikipediaResponde = await wikipediaAlgorithm.pipe({
    articleName: searchTerm,
    lang: "en"
  });
  const wikipediaContent = wikipediaResponde.get();

  return wikipediaContent.content;
}

function sanitizeContent(content: string) {
  return content;
}

function breakContentIntoSentences(content: string) {
  return [];
}

export async function textRobot(searchTerm: string) {
  const sourceContentOriginal = await fetchContentFromWikipedia(searchTerm);
  const sourceContentSanitized = sanitizeContent(sourceContentOriginal);
  const sentences = breakContentIntoSentences(sourceContentSanitized);

  return { sourceContentOriginal, sourceContentSanitized, sentences };
}
