import indentCode from "@/utils/indentCode"
import Prism from "prismjs"

function highlight(code, language) {
  const grammar = Prism.languages[language]
  if (!grammar) {
    console.warn(`Prism does not support ${language} syntax highlighting.`)
    return code
  }
  return Prism.highlight(indentCode(code), grammar, language)
}

export default highlight
