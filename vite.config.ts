import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { validateContent } from './scripts/validate-content.ts';

// BASE_PATH lets the site be served from a subfolder (e.g. /staging/).
// Defaults to the domain root.
const base = process.env.BASE_PATH || '/';

/**
 * Checks all content before Vite builds or serves the site. On Vercel a
 * failure stops the build, so the previous deployment stays live.
 */
function validateContentPlugin(): Plugin {
  return {
    name: 'nlem:validate-content',
    buildStart() {
      const errors = validateContent(resolve(import.meta.dirname, 'src/content'));
      if (errors.length) {
        this.error(`Content check failed: ${errors.length} problem(s)\n  ✗ ${errors.join('\n  ✗ ')}\n`);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BASE_PATH__: JSON.stringify(base),
  },
  plugins: [validateContentPlugin(), react()],
  base,
  build: {
    // Source maps would publish the full source code; keep them local only.
    sourcemap: false,
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
