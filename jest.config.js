module.exports = {
    // Другие настройки Jest ...
    transform: {
      "^.+\\.tsx?$": "babel-jest"
    },
    moduleFileExtensions: ["ts", "tsx", "mjs", "js", "json"],
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx|mjs)$",
  };
  