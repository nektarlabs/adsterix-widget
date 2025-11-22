import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  external: ["react", "react-dom"],
  treeshake: true,
  splitting: false,
})
