/** @type {import('prettier').Config} */
export default {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  proseWrap: "preserve",
  endOfLine: "lf",
  overrides: [
    {
      files: "*.md",
      options: { proseWrap: "always" }
    },
    {
      files: ["*.yml", "*.yaml"],
      options: { singleQuote: false }
    },
    {
      files: ["*.json", "*.jsonc"],
      options: { trailingComma: "none" }
    }
  ]
};