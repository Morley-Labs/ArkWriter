import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "lucid-cardano": path.resolve(__dirname, "node_modules/lucid-cardano/esm/src")
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"]
  },
  optimizeDeps: {
    include: ["lucid-cardano"],
    exclude: ["lucide-react"],
    esbuildOptions: {
      target: "esnext",
      jsx: "automatic"  // â FIX: Ensure JSX is properly transformed
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      external: [
        "lucid-cardano",
        "node-fetch",
        "fs",
        "path",
        "crypto",
        "util",
        "stream",
        "buffer"
      ],
      output: {
        format: "esm",
      },
    },
  }
});
