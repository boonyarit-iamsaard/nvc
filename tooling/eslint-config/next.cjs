const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
    browser: true,
  },
  extends: ["eslint:recommended", "next/core-web-vitals", "prettier"],
  globals: {
    React: true,
    JSX: true,
  },
  plugins: ["@typescript-eslint", "simple-import-sort"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.cjs",
    "node_modules/",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
  rules: {
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": "error",
  },
};
