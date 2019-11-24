// Modules
import {
  askAndReturnSearchTerm,
  askAndReturnPrefix
} from "./modules/userInput";

interface IData {
  searchTerm: string | null;
  prefix: "Who is" | "What is" | "The history of" | null;
  sourceContentOriginal: string | null;
  sourceContentSanitized: string | null;
  sentences: Array<{ text: string; keywords: string[]; images: string[] }>;
}

function start() {
  const data: IData = {
    searchTerm: null,
    prefix: null,
    sourceContentOriginal: null,
    sourceContentSanitized: null,
    sentences: []
  };

  data.searchTerm = askAndReturnSearchTerm();
  data.prefix = askAndReturnPrefix();

  console.log(data);
}

start();
