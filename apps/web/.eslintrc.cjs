/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@nvc/eslint-config/next.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
