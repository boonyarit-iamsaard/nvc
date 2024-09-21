const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended", "prettier"],
  plugins: ["@typescript-eslint", "simple-import-sort"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    browser: true,
  },
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
    "dist/",
    "node_modules/",
  ],
  overrides: [
    {
      files: [
        // Force ESLint to detect .tsx files
        "*.js?(x)",
        "*.ts?(x)",
      ],
    },
  ],
  rules: {
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": "error",
  },
};
