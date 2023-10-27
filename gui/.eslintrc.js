module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: ["plugin:vue/vue3-strongly-recommended", "@vue/typescript/recommended", "eslint:recommended", "prettier"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  },
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "comma-dangle": ["error", "never"],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "off",
    "no-undef": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "vue/multi-word-component-names": "off",
    "space-before-function-paren": "off",
    "vue/attribute-hyphenation": "off",
    quotes: [2, "double", "avoid-escape"],
    camelcase: "off",
    "import/first": "off",
    "vue/require-default-prop": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "vue/v-on-event-hyphenation": "off"
  },
  globals: {
    _: true
  }
}
