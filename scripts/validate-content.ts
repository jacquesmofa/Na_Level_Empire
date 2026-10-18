/**
 * Validates every file in src/content/ against src/content/schema.ts.
 *
 * Runs in three places, so a bad edit can never reach the live site:
 *   - `npm run validate` (and CI)
 *   - inside `vite build` / `vite dev` through the plugin in vite.config.ts,
 *     which makes the Vercel build fail and keeps the previous deployment live
 *   - scripts/validate-content.test.ts
 *
 * Messages are written for editors: file, field, and what is wrong.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { z } from 'zod';
import {
  BLOCK_LABELS,
  COLLECTIONS,
  CustomPageSchema,
  LOCALES,
  PAGE_IDS,
  PageSchema,
  SettingsSchema,
  UiStringsSchema,
  type SectionType,
} from '../src/content/schema.ts';
import { isSharedField } from '../src/content/sharedFields.ts';

type Issue = z.core.$ZodIssue;

function describePath(data: unknown, path: PropertyKey[]): string {
  const parts: string[] = [];
  let node: unknown = data;
  for (const key of path) {
    if (typeof key === 'number') {
      const label =
        node && Array.isArray(node) && node[key] && typeof node[key] === 'object' && 'type' in node[key]
          ? ` (${BLOCK_LABELS[(node[key] as { type: SectionType }).type] ?? (node[key] as { type: string }).type})`
          : '';
      parts.push(`${parts.length ? '' : ''}[${key}]${label}`);
    } else {
      parts.push(String(key));
    }
    node = node && typeof node === 'object' ? (node as Record<PropertyKey, unknown>)[key] : undefined;
  }
  return parts.join(' → ').replace(/ → \[/g, '[');
}

function formatIssue(file: string, data: unknown, issue: Issue): string {
  const where = issue.path.length ? describePath(data, issue.path) : '(whole file)';
  let message = issue.message;
  if (issue.code === 'unrecognized_keys') message = `unknown field(s): ${issue.keys.join(', ')}`;
  if (issue.code === 'invalid_type' && issue.input === undefined) message = 'is required';
  if (issue.code === 'invalid_union' && 'note' in issue && issue.note === 'No matching discriminator') {
    message = `unknown section type; use one of: ${Object.keys(BLOCK_LABELS).join(', ')}`;
  }
  return `${file} → ${where}: ${message}`;
}

function readJson(path: string, errors: string[], root: string): unknown {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    errors.push(`${relative(root, path)}: is not valid JSON (${(err as Error).message})`);
    return undefined;
  }
}

function check(schema: z.ZodType, path: string, errors: string[], root: string): unknown {
  const data = readJson(path, errors, root);
  if (data === undefined) return undefined;
  const result = schema.safeParse(data);
  if (!result.success) {
    for (const issue of result.error.issues) errors.push(formatIssue(relative(root, path), data, issue));
    return undefined;
  }
  return data;
}

const jsonFiles = (dir: string) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : []);

/** Returns a list of problems; empty means the content is valid. */
export function validateContent(contentDir: string): string[] {
  const errors: string[] = [];
  const root = join(contentDir, '..', '..');

  for (const locale of LOCALES) {
    // Settings
    const settingsPath = join(contentDir, 'settings', locale, 'site.json');
    if (!existsSync(settingsPath)) errors.push(`${relative(root, settingsPath)}: file is missing`);
    else check(SettingsSchema, settingsPath, errors, root);

    // Interface text
    const uiPath = join(contentDir, 'ui', locale, 'strings.json');
    if (!existsSync(uiPath)) errors.push(`${relative(root, uiPath)}: file is missing`);
    else check(UiStringsSchema, uiPath, errors, root);

    // Pages: every page must exist, and only known pages may exist
    const pageDir = join(contentDir, 'pages', locale);
    for (const id of PAGE_IDS) {
      const p = join(pageDir, `${id}.json`);
      if (!existsSync(p)) errors.push(`${relative(root, p)}: file is missing`);
    }
    for (const f of jsonFiles(pageDir)) {
      const id = basename(f, '.json');
      const p = join(pageDir, f);
      if (!(PAGE_IDS as readonly string[]).includes(id)) {
        errors.push(`${relative(root, p)}: unknown page "${id}"; pages are: ${PAGE_IDS.join(', ')}`);
        continue;
      }
      check(PageSchema, p, errors, root);
    }
  }

  // Development catalogue page (src/dev/catalogue.json) uses the same page schema
  const catalogue = join(contentDir, '..', 'dev', 'catalogue.json');
  if (existsSync(catalogue)) check(PageSchema, catalogue, errors, root);

  // Collections: validate each item, and require every item in every language
  const folderCollections: [string, z.ZodType][] = [...Object.entries(COLLECTIONS), ['custom-pages', CustomPageSchema]];
  for (const [name, schema] of folderCollections) {
    const slugsByLocale = LOCALES.map((locale) => {
      const dir = join(contentDir, name, locale);
      const files = jsonFiles(dir);
      for (const f of files) {
        const p = join(dir, f);
        const slug = basename(f, '.json');
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
          errors.push(`${relative(root, p)}: file name must use lowercase letters, numbers and dashes`);
        }
        const data = check(schema, p, errors, root) as { slug?: string } | undefined;
        if (data && 'slug' in data && data.slug !== slug) {
          errors.push(`${relative(root, p)} → slug: must match the file name ("${slug}")`);
        }
      }
      return new Set(files.map((f) => basename(f, '.json')));
    });
    const all = new Set(slugsByLocale.flatMap((s) => [...s]));
    for (const slug of all) {
      LOCALES.forEach((locale, i) => {
        if (!slugsByLocale[i].has(slug)) errors.push(`src/content/${name}/${locale}/${slug}.json: missing translation`);
      });
    }
  }

  // News: at most one featured story; categories must exist on the News page
  for (const locale of LOCALES) {
    const dir = join(contentDir, 'news', locale);
    const stories = jsonFiles(dir)
      .map((f) => ({ f, data: readJsonQuiet(join(dir, f)) as { featured?: boolean; category?: string } | undefined }))
      .filter((s) => s.data);
    const featured = stories.filter((s) => s.data?.featured);
    if (featured.length > 1) {
      errors.push(`src/content/news/${locale}: only one story can be featured; featured now: ${featured.map((s) => s.f).join(', ')}`);
    }
    const newsPage = readJsonQuiet(join(contentDir, 'pages', locale, 'news.json')) as
      | { sections?: { type: string; categories?: { key: string }[] }[] }
      | undefined;
    const feed = newsPage?.sections?.find((s) => s.type === 'newsFeed');
    if (feed?.categories) {
      const keys = new Set(feed.categories.map((c) => c.key));
      for (const s of stories) {
        if (s.data?.category && !keys.has(s.data.category)) {
          errors.push(`src/content/news/${locale}/${s.f} → category: "${s.data.category}" is not a category on the News page (${[...keys].join(', ')})`);
        }
      }
    }
  }

  // English and French must keep the same structure: same sections in the
  // same order, same list lengths, same images, links and settings. Only
  // text may differ.
  const pairs: string[] = ['settings/{l}/site.json', 'ui/{l}/strings.json', ...PAGE_IDS.map((id) => `pages/{l}/${id}.json`)];
  for (const name of [...Object.keys(COLLECTIONS), 'custom-pages']) {
    for (const f of jsonFiles(join(contentDir, name, LOCALES[0]))) pairs.push(`${name}/{l}/${f}`);
  }
  for (const pattern of pairs) {
    const [base, ...others] = LOCALES.map((l) => pattern.replace('{l}', l));
    const baseData = readJsonQuiet(join(contentDir, base));
    for (const other of others) {
      const otherData = readJsonQuiet(join(contentDir, other));
      if (baseData === undefined || otherData === undefined) continue;
      compareStructure(baseData, otherData, [], `src/content/${other}`, errors);
    }
  }

  return errors;
}

function compareStructure(a: unknown, b: unknown, path: PropertyKey[], file: string, errors: string[]): void {
  const where = () => (path.length ? describePath(b, path) : '(whole file)');
  const fail = (msg: string): void => {
    errors.push(`${file} → ${where()}: English and French must match (${msg})`);
  };
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return fail('one is a list, the other is not');
    if (a.length !== b.length) return fail(`English has ${a.length} item(s), this language has ${b.length}`);
    a.forEach((item, i) => compareStructure(item, b[i], [...path, i], file, errors));
    return;
  }
  if (a && typeof a === 'object' && b && typeof b === 'object') {
    const ka = Object.keys(a).sort();
    const kb = Object.keys(b).sort();
    const missing = ka.filter((k) => !kb.includes(k));
    const extra = kb.filter((k) => !ka.includes(k));
    if (missing.length || extra.length) {
      return fail([missing.length && `missing: ${missing.join(', ')}`, extra.length && `extra: ${extra.join(', ')}`].filter(Boolean).join('; '));
    }
    for (const k of ka) compareStructure((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], [...path, k], file, errors);
    return;
  }
  const key = path.at(-1);
  const parent = path.at(-2);
  const shared = typeof a !== 'string' || (typeof key === 'string' && isSharedField(key, typeof parent === 'string' ? parent : undefined, file));
  if (shared && a !== b) fail(`English is ${JSON.stringify(a)}, this language is ${JSON.stringify(b)}`);
}

function readJsonQuiet(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return undefined;
  }
}

// CLI: node scripts/validate-content.ts [contentDir]
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = process.argv[2] ?? fileURLToPath(new URL('../src/content', import.meta.url));
  const errors = validateContent(dir);
  if (errors.length) {
    console.error(`\nContent check failed: ${errors.length} problem(s)\n`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    console.error('\nFix the file(s) above in the CMS or in the JSON, then save again.\n');
    process.exit(1);
  }
  console.log('Content check passed.');
}
