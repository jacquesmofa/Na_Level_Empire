/**
 * Prerendering: turns every page, in both languages, into real HTML after
 * `vite build`. Search engines and link previews then see the full content
 * and the right title for each page; React takes over in the browser.
 *
 * Writes (cleanUrls on Vercel): dist/index.html, dist/<page>.html,
 * dist/fr.html, dist/fr/<page>.html, dist/404.html, sitemap.xml, robots.txt.
 *
 * Usage: node scripts/prerender.ts   (after vite build and the SSR build)
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const ssrEntry = resolve(root, 'dist-ssr/entry-server.js');

/** Public address of the site, used for canonical links, sitemap and social previews. */
export function siteUrl(env: NodeJS.ProcessEnv = process.env): string {
  const raw = env.CMS_SITE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://na-level-empire.vercel.app');
  return raw.replace(/\/+$/, '');
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export type PageEntry = { path: string; locale: 'en' | 'fr'; title: string; description: string; image?: string; isHome: boolean; alternates: Record<string, string> };

/** The <head> tags for one page. */
export function headTags(page: PageEntry, opts: { site: string; siteName: string; fonts: string[]; jsonLd?: object; noindex?: boolean }): string {
  const url = (p: string) => opts.site + (p === '/' ? '/' : p);
  const lines = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
  ];
  if (opts.noindex) {
    lines.push('<meta name="robots" content="noindex" />');
  } else {
    lines.push(`<link rel="canonical" href="${url(page.path)}" />`);
    for (const [lang, p] of Object.entries(page.alternates)) lines.push(`<link rel="alternate" hreflang="${lang}" href="${url(p)}" />`);
    lines.push(`<link rel="alternate" hreflang="x-default" href="${url(page.alternates.en)}" />`);
  }
  lines.push(
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(opts.siteName)}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url(page.path)}" />`,
    `<meta property="og:locale" content="${page.locale === 'fr' ? 'fr_CA' : 'en_CA'}" />`,
    `<meta name="twitter:card" content="${page.image ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
  );
  if (page.image) lines.push(`<meta property="og:image" content="${esc(page.image)}" />`, `<meta name="twitter:image" content="${esc(page.image)}" />`);
  for (const f of opts.fonts) lines.push(`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin />`);
  if (opts.jsonLd) lines.push(`<script type="application/ld+json">${JSON.stringify(opts.jsonLd).replace(/</g, '\\u003c')}</script>`);
  return lines.map((l) => `    ${l}`).join('\n');
}

export function sitemap(site: string, pages: PageEntry[]): string {
  const url = (p: string) => site + (p === '/' ? '/' : p);
  const body = pages
    .map((p) => {
      const alts = [...Object.entries(p.alternates), ['x-default', p.alternates.en]]
        .map(([l, a]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${url(a)}"/>`)
        .join('\n');
      return `  <url>\n    <loc>${url(p.path)}</loc>\n${alts}\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`;
}

export function robots(site: string): string {
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml\n`;
}

/** File that Vercel (cleanUrls) serves for a path: "/" -> index.html, "/fr" -> fr.html, "/fr/about" -> fr/about.html. */
export function fileFor(path: string): string {
  return path === '/' ? 'index.html' : `${path.slice(1)}.html`;
}

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ssr: any = await import(pathToFileURL(ssrEntry).href);
  const { render, getPage, getCustomPages, getSettings, LOCALES, PAGE_PATHS, localizePath, cld } = ssr;
  const site = siteUrl();
  const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
  const [before, rest] = template.split('<!--seo:start-->');
  if (!rest) throw new Error('dist/index.html has no <!--seo:start--> marker');
  const after = rest.split('<!--seo:end-->')[1];

  // Preload the fonts the first screen needs: Bebas Neue and Syne (latin).
  const assets = readdirSync(resolve(dist, 'assets'));
  const fonts = assets
    .filter((f) => /^(bebas-neue-latin-400|syne-latin-(700|800)|dm-sans-latin-400)-normal.*\.woff2$/.test(f))
    .map((f) => `/assets/${f}`);

  /** First image in a page's sections (hero reel, header background, …), sized for link previews. */
  const firstImage = (value: unknown): string | undefined => {
    if (Array.isArray(value)) {
      for (const v of value) {
        const found = firstImage(v);
        if (found) return found;
      }
    } else if (value && typeof value === 'object') {
      const o = value as Record<string, unknown>;
      if (typeof o.url === 'string' && typeof o.alt === 'string') return cld(o.url, { width: 1200 });
      for (const v of Object.values(o)) {
        const found = firstImage(v);
        if (found) return found;
      }
    }
    return undefined;
  };

  const pages: PageEntry[] = [];
  const write = (path: string, html: string) => {
    const file = resolve(dist, fileFor(path));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
  };
  const doc = (locale: string, head: string, body: string, path: string) =>
    before.replace('<html lang="en">', `<html lang="${locale}">`) +
    head.trimStart() +
    after.replace('<div id="root"></div>', `<div id="root" data-path="${esc(path)}">${body}</div>`);

  for (const locale of LOCALES as ('en' | 'fr')[]) {
    const settings = getSettings(locale);
    const logo = cld(settings.logo.url, { width: 512 });
    const sameAs = settings.social.map((s: { url: string }) => s.url).filter((u: string) => /^https?:/.test(u));
    const fixed = Object.entries(PAGE_PATHS as Record<string, string>).map(([id, path]) => ({ id, path, page: getPage(locale, id) }));
    const custom = getCustomPages(locale).map((p: { slug: string }) => ({ id: `custom:${p.slug}`, path: `/${p.slug}`, page: p }));
    for (const { id, path, page } of [...fixed, ...custom]) {
      const localized = localizePath(path, locale);
      const entry: PageEntry = {
        path: localized,
        locale,
        title: page.seo.title,
        description: page.seo.description,
        image: firstImage(page.sections),
        isHome: id === 'home',
        alternates: { en: localizePath(path, 'en'), fr: localizePath(path, 'fr') },
      };
      const jsonLd =
        id === 'home'
          ? {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: settings.siteName,
              url: site + localized,
              logo,
              email: settings.contact.email,
              address: { '@type': 'PostalAddress', addressLocality: 'Toronto', addressRegion: 'ON', addressCountry: 'CA' },
              ...(sameAs.length ? { sameAs } : {}),
            }
          : undefined;
      write(localized, doc(locale, headTags(entry, { site, siteName: settings.siteName, fonts, jsonLd }), render(localized), localized));
      pages.push(entry);
    }
  }

  // 404 page (English). Vercel serves dist/404.html with a 404 status for unknown paths.
  const nf = getPage('en', 'not-found');
  const nfEntry: PageEntry = { path: '/404', locale: 'en', title: nf.seo.title, description: nf.seo.description, isHome: false, alternates: { en: '/404', fr: '/fr/404' } };
  writeFileSync(resolve(dist, '404.html'), doc('en', headTags(nfEntry, { site, siteName: getSettings('en').siteName, fonts, noindex: true }), render('/404'), ''));

  writeFileSync(resolve(dist, 'sitemap.xml'), sitemap(site, pages));
  writeFileSync(resolve(dist, 'robots.txt'), robots(site));
  console.log(`Prerendered ${pages.length} pages + 404 for ${site}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  if (!existsSync(ssrEntry)) throw new Error('Run the SSR build first (npm run build does this).');
  await main();
}
