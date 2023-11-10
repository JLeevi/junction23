module.exports = {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  tabWidth: 2,
  trailingComma: "all",
  singleQuote: false,
  semi: false,
  importOrder: ["^[A-Za-z]/(.*)$", "^@ui/(.*)$", "^@(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
