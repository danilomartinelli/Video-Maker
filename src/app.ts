// Modules
import {
  askAndReturnSearchTerm,
  askAndReturnPrefix
} from "./modules/userInput";
import { textRobot } from "./modules/textRobot";
import { save, load } from "./modules/state";

interface IData {
  searchTerm: string | null;
  prefix: "Who is" | "What is" | "The history of" | null;
  sourceContentOriginal: string | null;
  sourceContentSanitized: string | null;
  sentences: Array<{ text: string; keywords: string[]; images: string[] }>;
  maximumSentences: number;
}

async function start() {
  let data: IData = {
    searchTerm: null,
    prefix: null,
    sourceContentOriginal: null,
    sourceContentSanitized: null,
    sentences: [],
    maximumSentences: 7
  };

  // User Input
  data = load();
  data.searchTerm = askAndReturnSearchTerm();
  data.prefix = askAndReturnPrefix();
  save(data);

  // Text Robot
  data = load();
  const {
    sourceContentOriginal,
    sourceContentSanitized,
    sentences
  } = await textRobot(data.searchTerm!, data.maximumSentences);
  data.sourceContentOriginal = sourceContentOriginal;
  data.sourceContentSanitized = sourceContentSanitized;
  data.sentences = sentences;
  save(data);

  console.dir(data, { depth: null });
}

start();
