import readline from "readline-sync";

export function askAndReturnSearchTerm() {
  return readline.question("Type a Wikipedia search term: ");
}

export function askAndReturnPrefix() {
  const prefixes: Array<"Who is" | "What is" | "The history of"> = [
    "Who is",
    "What is",
    "The history of"
  ];

  const selectedPrefixIndex = readline.keyInSelect(
    prefixes,
    "Choose one option: ",
    { cancel: false }
  );

  return prefixes[selectedPrefixIndex];
}
