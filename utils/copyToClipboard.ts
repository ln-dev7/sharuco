import indentCode from "@/utils/indentCode"

function copyToClipboard(code: string): void {
  const text = indentCode(code)
  navigator.clipboard.writeText(text)
}

export default copyToClipboard
