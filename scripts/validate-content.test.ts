/**
 * Proves the safety net: broken content must fail validation (and therefore
 * the build), and the real content must pass.
 * Run with: npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
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

test('a non-https image fails', () => {
  const errors = validateWith((d) => edit(d, 'team/fr/director-of-events.json', (t) => (t.photo.url = 'http://example.com/a.jpg')));
  assert.ok(errors.some((e) => e.includes('photo') && e.includes('https://')), errors.join('\n'));
});
