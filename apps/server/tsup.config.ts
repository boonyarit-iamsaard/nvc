import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entry: ["src"],
  format: ["esm"],
  outDir: "dist",
  sourcemap: true,
});
