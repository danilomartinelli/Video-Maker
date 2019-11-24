// Modules
import {
  askAndReturnSearchTerm,
  askAndReturnPrefix
} from "./modules/userInput";
import { textRobot } from "./modules/textRobot";

interface IData {
  searchTerm: string | null;
  prefix: "Who is" | "What is" | "The history of" | null;
  sourceContentOriginal: string | null;
  sourceContentSanitized: string | null;
  sentences: Array<{ text: string; keywords: string[]; images: string[] }>;
}

async function start() {
  const data: IData = {
    searchTerm: null,
    prefix: null,
    sourceContentOriginal: null,
    sourceContentSanitized: null,
    sentences: []
  };

  // User Input
  data.searchTerm = askAndReturnSearchTerm();
  data.prefix = askAndReturnPrefix();

  // Text Robot
  const {
    sourceContentOriginal,
    sourceContentSanitized,
    sentences
  } = await textRobot(data.searchTerm);
  data.sourceContentOriginal = sourceContentOriginal;
  data.sourceContentSanitized = sourceContentSanitized;
  data.sentences = sentences;

  console.log(data);
}

start();
