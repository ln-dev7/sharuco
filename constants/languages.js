export const allLanguages = [
  { name: 'Bash', color: '#89e051', extension: '.sh' },
  { name: 'Bow Framework', color: '#fbd8d2', extension: '.php' },
  { name: 'C', color: '#555555', extension: '.c' },
  { name: 'C++', color: '#f34b7d', extension: '.cpp' },
  { name: 'C#', color: '#178600', extension: '.cs' },
  { name: 'Clojure', color: '#db5855', extension: '.clj' },
  { name: 'CSS', color: '#563d7c', extension: '.css' },
  { name: 'Dart', color: '#00B4AB', extension: '.dart' },
  { name: 'Elixir', color: '#6e4a7e', extension: '.ex' },
  { name: 'Erlang', color: '#B83998', extension: '.erl' },
  { name: 'Go', color: '#00ADD8', extension: '.go' },
  { name: 'GraphQL', color: '#e10098', extension: '.graphql' },
  { name: 'Haskell', color: '#5e5086', extension: '.hs' },
  { name: 'HTML', color: '#e34c26', extension: '.html' },
  { name: 'Java', color: '#b07219', extension: '.java' },
  { name: 'JavaScript', color: '#f1e05a', extension: '.js' },
  { name: 'Kotlin', color: '#F18E33', extension: '.kt' },
  { name: 'Lua', color: '#000080', extension: '.lua' },
  { name: 'Matlab', color: '#0076A8', extension: '.m' },
  { name: 'Objective-C', color: '#438eff', extension: '.m' },
  { name: 'Perl', color: '#0298c3', extension: '.pl' },
  { name: 'PHP', color: '#4F5D95', extension: '.php' },
  { name: 'Python', color: '#3572A5', extension: '.py' },
  { name: 'R', color: '#198CE7', extension: '.R' },
  { name: 'Ruby', color: '#701516', extension: '.rb' },
  { name: 'Rust', color: '#dea584', extension: '.rs' },
  { name: 'Scala', color: '#c22d40', extension: '.scala' },
  { name: 'Shell', color: '#89e051', extension: '.sh' },
  { name: 'SQL', color: '#e53c3c', extension: '.sql' },
  { name: 'Swift', color: '#F05138', extension: '.swift' },
  { name: 'TypeScript', color: '#2b7489', extension: '.ts' },
  { name: 'VBScript', color: '#15AABF', extension: '.vbs' },
  { name: 'Verilog', color: '#848bf3', extension: '.v' },
  { name: 'VHDL', color: '#543978', extension: '.vhd' },
  { name: 'Visual Basic', color: '#945DB7', extension: '.vb' },
  { name: 'WebAssembly', color: '#654FF0', extension: '.wasm' },
  { name: 'XML', color: '#555555', extension: '.xml' },
  { name: 'XSLT', color: '#EB8CEB', extension: '.xslt' },
  { name: 'YAML', color: '#cb171e', extension: '.yaml' },
  { name: 'Other', color: '#cccccc', extension: '.txt' },
];

export const getExtensionByName = (name) => {
  const lowercaseName = name.toLowerCase();
  const language = allLanguages.find(
    (lang) => lang.name.toLowerCase() === lowercaseName
  );
  return language ? language.extension : null;
};

export const languagesName = allLanguages.map((language) =>
  language.name.toLocaleLowerCase()
);

export const getLanguageColor = (language) => {
  const languageIndex = languagesName.indexOf(language.toLocaleLowerCase());
  return allLanguages[languageIndex].color;
};
