function indentCode(linearCode) {
  let codeString = linearCode.replace(/\\t/g, '\t');
  codeString = codeString.replace(/\\n/g, '\n');

  // Ajouter une indentation pour chaque niveau de tabulation
  let indentationLevel = 0;
  let indentedCode = '';
  for (let i = 0; i < codeString.length; i++) {
    const char = codeString[i];
    if (char === '\t') {
      indentationLevel++;
    } else if (char === '\n') {
      indentedCode += '\n';
      for (let j = 0; j < indentationLevel; j++) {
        indentedCode += '\t';
      }
    } else {
      indentedCode += char;
    }
  }

  return indentedCode;
}

export default indentCode;
