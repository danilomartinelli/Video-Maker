// Modules
import {
  askAndReturnSearchTerm,
  askAndReturnPrefix
} from "./modules/userInput";

function start() {
  const content = {
    searchTerm: "",
    prefix: ""
  };

  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();

  console.log(content);
}

start();
