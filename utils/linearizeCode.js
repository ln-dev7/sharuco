function linearizeCode(codeString) {
  const firstLinearCode = codeString.replace(/\n/g, "\\n")
  const linearCode = firstLinearCode.replace(/\t/g, "\\t")

  return linearCode
}

export default linearizeCode
