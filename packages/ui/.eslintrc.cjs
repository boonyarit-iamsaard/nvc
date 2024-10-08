/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@nvc/eslint-config/react-internal.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.lint.json",
    tsconfigRootDir: __dirname,
  },
};
