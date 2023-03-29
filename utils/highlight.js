import indentCode from "@/utils/indentCode"
import Prism from "prismjs"

function highlight(code, language) {
  let grammar = Prism.languages[language]
  if (!grammar) {
    grammar = Prism.languages["javascript"]
  } else {
    grammar = Prism.languages[language]
  }
  return Prism.highlight(indentCode(code), grammar, language)
}

export default highlight
