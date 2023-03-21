function delinearizeCode(linearCode) {
  const codeWithoutNewLines = linearCode.replace(/\\n/g, "")
  const finalCode = codeWithoutNewLines.replace(/\\t/g, "")

  return finalCode
}

export default delinearizeCode
