import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { validateContent } from './scripts/validate-content.ts';
import { buildCmsConfig, toYaml } from './scripts/cms-config.ts';

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
      if (this.environment?.config.consumer === 'server') return; // already checked by the browser build
      const errors = validateContent(resolve(import.meta.dirname, 'src/content'));
      if (errors.length) {
        this.error(`Content check failed: ${errors.length} problem(s)\n  ✗ ${errors.join('\n  ✗ ')}\n`);
      }
    },
  };
}

/**
 * Ships the CMS: copies the pinned Sveltia build into dist/admin and writes
 * dist/admin/config.yml with this site's real address (from Vercel), which
 * the GitHub login needs.
 */
function cmsPlugin(): Plugin {
  return {
    name: 'nlem:cms',
    apply: (_config, { isSsrBuild }) => !isSsrBuild,
    closeBundle() {
      const out = resolve(import.meta.dirname, 'dist/admin');
      mkdirSync(out, { recursive: true });
      copyFileSync(resolve(import.meta.dirname, 'node_modules/@sveltia/cms/dist/sveltia-cms.js'), resolve(out, 'sveltia-cms.js'));
      const siteUrl =
        process.env.CMS_SITE_URL ||
        (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
      writeFileSync(resolve(out, 'config.yml'), toYaml(buildCmsConfig(siteUrl)));
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BASE_PATH__: JSON.stringify(base),
  },
  plugins: [validateContentPlugin(), react(), cmsPlugin()],
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
