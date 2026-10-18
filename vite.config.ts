import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// BASE_PATH lets the site be served from a subfolder (e.g. /staging/).
// Defaults to the domain root.
const base = process.env.BASE_PATH || "/";

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BASE_PATH__: JSON.stringify(base),
  },
  plugins: [react()],
  base,
  build: {
    // Source maps would publish the full source code; keep them local only.
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
});
