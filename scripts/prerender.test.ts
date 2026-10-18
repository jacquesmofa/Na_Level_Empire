import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileFor, headTags, robots, siteUrl, sitemap, type PageEntry } from './prerender.ts';

const page: PageEntry = {
  path: '/fr/about',
  locale: 'fr',
  title: 'À propos & "nous"',
  description: 'Une description <assez> longue.',
  isHome: false,
  alternates: { en: '/about', fr: '/fr/about' },
};

test('site address: CMS_SITE_URL wins, then Vercel production address', () => {
  assert.equal(siteUrl({ CMS_SITE_URL: 'https://example.ca/' }), 'https://example.ca');
  assert.equal(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'nlem.vercel.app' }), 'https://nlem.vercel.app');
});

test('each page maps to the file Vercel serves with clean URLs', () => {
  assert.equal(fileFor('/'), 'index.html');
  assert.equal(fileFor('/fr'), 'fr.html');
  assert.equal(fileFor('/fr/about'), 'fr/about.html');
});

test('head tags: escaped text, canonical and both languages', () => {
  const head = headTags(page, { site: 'https://x.ca', siteName: 'NLEM', fonts: ['/assets/a.woff2'] });
  assert.match(head, /<title>À propos &amp; &quot;nous&quot;<\/title>/);
  assert.match(head, /content="Une description &lt;assez&gt; longue\."/);
  assert.match(head, /rel="canonical" href="https:\/\/x\.ca\/fr\/about"/);
  assert.match(head, /hreflang="en" href="https:\/\/x\.ca\/about"/);
  assert.match(head, /hreflang="x-default" href="https:\/\/x\.ca\/about"/);
  assert.match(head, /rel="preload" href="\/assets\/a\.woff2" as="font"/);
  assert.doesNotMatch(head, /noindex/);
});

test('404 page is not indexed and has no canonical', () => {
  const head = headTags(page, { site: 'https://x.ca', siteName: 'NLEM', fonts: [], noindex: true });
  assert.match(head, /name="robots" content="noindex"/);
  assert.doesNotMatch(head, /canonical/);
});

test('structured data cannot close its script tag', () => {
  const head = headTags(page, { site: 'https://x.ca', siteName: 'NLEM', fonts: [], jsonLd: { name: '</script><b>' } });
  assert.doesNotMatch(head, /<\/script><b>/);
});

test('sitemap lists language alternates; robots blocks the CMS and API', () => {
  const xml = sitemap('https://x.ca', [page]);
  assert.match(xml, /<loc>https:\/\/x\.ca\/fr\/about<\/loc>/);
  assert.match(xml, /hreflang="en" href="https:\/\/x\.ca\/about"/);
  const txt = robots('https://x.ca');
  assert.match(txt, /Disallow: \/admin/);
  assert.match(txt, /Disallow: \/api\//);
  assert.match(txt, /Sitemap: https:\/\/x\.ca\/sitemap\.xml/);
});

// After `npm run build`: every page exists as real HTML with its own title.
const dist = resolve(import.meta.dirname, '../dist');
test('built pages contain their content (skipped before a build)', { skip: !existsSync(resolve(dist, 'sitemap.xml')) }, () => {
  for (const f of ['index.html', 'about.html', 'fr.html', 'fr/contact.html', '404.html']) {
    const html = readFileSync(resolve(dist, f), 'utf8');
    assert.match(html, /<div id="root" data-path="[^"]*"><[a-z]/, `${f} is prerendered`);
    assert.equal((html.match(/<title>/g) ?? []).length, 1, `${f} has one title`);
  }
  assert.match(readFileSync(resolve(dist, 'fr.html'), 'utf8'), /<html lang="fr">/);
});
