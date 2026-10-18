/**
 * Proves the safety net: broken content must fail validation (and therefore
 * the build), and the real content must pass.
 * Run with: npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateContent } from './validate-content.ts';

const CONTENT = fileURLToPath(new URL('../src/content', import.meta.url));

/** Copies the real content into a temp folder shaped like <root>/src/content, applies a change, validates. */
function validateWith(change: (dir: string) => void): string[] {
  const root = mkdtempSync(join(tmpdir(), 'nlem-content-'));
  const dir = join(root, 'src', 'content');
  cpSync(CONTENT, dir, { recursive: true });
  try {
    change(dir);
    return validateContent(dir);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const edit = (dir: string, file: string, fn: (data: any) => void) => {
  const p = join(dir, file);
  const data = JSON.parse(readFileSync(p, 'utf8'));
  fn(data);
  writeFileSync(p, JSON.stringify(data));
};

test('the real content passes', () => {
  assert.deepEqual(validateContent(CONTENT), []);
});

test('a missing required field fails with the file and field named', () => {
  const errors = validateWith((d) => edit(d, 'jobs/en/sound-engineer.json', (j) => delete j.title));
  assert.ok(errors.some((e) => e.includes('jobs/en/sound-engineer.json') && e.includes('title') && e.includes('is required')), errors.join('\n'));
});

test('text over the length limit fails', () => {
  const errors = validateWith((d) => edit(d, 'pages/en/home.json', (p) => (p.sections[0].eyebrow = 'x'.repeat(200))));
  assert.ok(errors.some((e) => e.includes('[0] (Hero)') && e.includes('60 characters')), errors.join('\n'));
});

test('an unknown section type fails', () => {
  const errors = validateWith((d) => edit(d, 'pages/fr/about.json', (p) => p.sections.push({ type: 'carousel' })));
  assert.ok(errors.some((e) => e.includes('pages/fr/about.json') && e.includes('unknown section type')), errors.join('\n'));
});

test('a misspelled field fails', () => {
  const errors = validateWith((d) => edit(d, 'settings/en/site.json', (s) => (s.blrb = 'typo')));
  assert.ok(errors.some((e) => e.includes('unknown field(s): blrb')), errors.join('\n'));
});

test('invalid JSON fails', () => {
  const errors = validateWith((d) => writeFileSync(join(d, 'team/en/executive-director.json'), '{ "name": '));
  assert.ok(errors.some((e) => e.includes('is not valid JSON')), errors.join('\n'));
});

test('an item missing its translation fails', () => {
  const errors = validateWith((d) => unlinkSync(join(d, 'videos/fr/4k-event-reel-2025.json')));
  assert.ok(errors.some((e) => e.includes('videos/fr/4k-event-reel-2025.json: missing translation')), errors.join('\n'));
});

test('two featured stories fail', () => {
  const errors = validateWith((d) => edit(d, 'news/en/meet-the-apprentices.json', (n) => (n.featured = true)));
  assert.ok(errors.some((e) => e.includes('only one story can be featured')), errors.join('\n'));
});

test('a news category that is not on the News page fails', () => {
  const errors = validateWith((d) => edit(d, 'news/en/meet-the-apprentices.json', (n) => (n.category = 'sports')));
  assert.ok(errors.some((e) => e.includes('"sports" is not a category')), errors.join('\n'));
});

test('an image outside our Cloudinary folder fails', () => {
  const errors = validateWith((d) => edit(d, 'team/fr/director-of-events.json', (t) => (t.photo.url = 'https://example.com/a.jpg')));
  assert.ok(errors.some((e) => e.includes('photo') && e.includes('Cloudinary')), errors.join('\n'));
});

test('an image in our Cloudinary folder passes', () => {
  const url = 'https://res.cloudinary.com/beavj5sp/image/upload/v1760000000/nlem/team/director-of-events.jpg';
  const errors = validateWith((d) => {
    edit(d, 'team/en/director-of-events.json', (t) => (t.photo.url = url));
    edit(d, 'team/fr/director-of-events.json', (t) => (t.photo.url = url));
  });
  assert.deepEqual(errors, []);
});

test('English and French with different sections fail', () => {
  const errors = validateWith((d) => edit(d, 'pages/fr/home.json', (p) => p.sections.pop()));
  assert.ok(errors.some((e) => e.includes('pages/fr/home.json') && e.includes('English has 4 item(s), this language has 3')), errors.join('\n'));
});

test('a changed image or link in only one language fails', () => {
  const errors = validateWith((d) => edit(d, 'jobs/fr/sound-engineer.json', (j) => (j.order = 999)));
  assert.ok(errors.some((e) => e.includes('jobs/fr/sound-engineer.json') && e.includes('order')), errors.join('\n'));
});

const customPage = (slug: string, title: string) => ({
  title,
  slug,
  showInNav: true,
  navOrder: 10,
  seo: { title, description: 'A page created by an editor in the CMS, used here to test the validator rules.' },
  sections: [{ type: 'richText', paragraphs: ['Hello'] }],
});
const addCustom = (d: string, locale: string, slug: string, data: object) => {
  mkdirSync(join(d, 'custom-pages', locale), { recursive: true });
  writeFileSync(join(d, 'custom-pages', locale, `${slug}.json`), JSON.stringify(data));
};

test('an editor page in both languages passes', () => {
  const errors = validateWith((d) => {
    addCustom(d, 'en', 'partners', customPage('partners', 'Partners'));
    addCustom(d, 'fr', 'partners', customPage('partners', 'Partenaires'));
  });
  assert.deepEqual(errors, []);
});

test('an editor page using a reserved address fails', () => {
  const errors = validateWith((d) => {
    addCustom(d, 'en', 'contact', customPage('contact', 'Contact'));
    addCustom(d, 'fr', 'contact', customPage('contact', 'Contact'));
  });
  assert.ok(errors.some((e) => e.includes('custom-pages/en/contact.json') && e.includes('already used')), errors.join('\n'));
});

test('an editor page without its French version fails', () => {
  const errors = validateWith((d) => addCustom(d, 'en', 'events', customPage('events', 'Events')));
  assert.ok(errors.some((e) => e.includes('custom-pages/fr/events.json: missing translation')), errors.join('\n'));
});
