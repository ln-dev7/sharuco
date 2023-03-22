import indentCode from "@/utils/indentCode"
import Prism from "prismjs"

function highlight(code, language) {
  let grammar = Prism.languages["javascript"]
  if (language === "css") {
    grammar = Prism.languages["css"]
  } else if (language === "html") {
    grammar = Prism.languages["html"]
  } else {
    grammar = Prism.languages["javascript"]
  }
  if (!grammar) {
    console.warn(`Prism does not support ${language} syntax highlighting.`)
    return code
  }
  return Prism.highlight(indentCode(code), grammar, language)
}

export default highlight
