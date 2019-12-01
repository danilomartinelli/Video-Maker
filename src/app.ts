// Modules
import {
  askAndReturnSearchTerm,
  askAndReturnPrefix
} from "./modules/userInput";
import { textRobot } from "./modules/textRobot";
import { imageRobot } from "./modules/imageRobot";
import { save, load } from "./modules/state";

interface IData {
  searchTerm: string | null;
  prefix: "Who is" | "What is" | "The history of" | null;
  sourceContentOriginal: string | null;
  sourceContentSanitized: string | null;
  sentences: Array<{ text: string; keywords: string[]; images: string[] }>;
  maximumSentences: number;
}

async function initData() {
  const data: IData = {
    searchTerm: null,
    prefix: null,
    sourceContentOriginal: null,
    sourceContentSanitized: null,
    sentences: [],
    maximumSentences: 7
  };

  save(data);
}

async function userInputStep() {
  const data: IData = load();

  data.searchTerm = askAndReturnSearchTerm();
  data.prefix = askAndReturnPrefix();

  save(data);
}

async function textInputStep() {
  const data: IData = load();

  const {
    sourceContentOriginal,
    sourceContentSanitized,
    sentences
  } = await textRobot(data.searchTerm!, data.maximumSentences);

  data.sourceContentOriginal = sourceContentOriginal;
  data.sourceContentSanitized = sourceContentSanitized;
  data.sentences = sentences;

  save(data);
}

async function imageInputStep() {
  const data: IData = load();

  data.sentences = await imageRobot(data.searchTerm!, data.sentences);

  save(data);
}

async function start() {
  await initData();
  await userInputStep();
  await textInputStep();
  await imageInputStep();

  const data = load();

  console.dir(data, { depth: null });
}

start();
