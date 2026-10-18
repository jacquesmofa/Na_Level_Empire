/**
 * One-time move of the prototype's Readdy images into Cloudinary.
 *
 *   node scripts/migrate-images.ts plan            -> scripts/image-migration/plan.json
 *   (upload: scripts/image-migration/upload-in-browser.js, run in a browser
 *    that can reach Cloudinary, using the unsigned preset "nlem_migration";
 *    Cloudinary downloads each image from Readdy itself)
 *   node scripts/migrate-images.ts apply results.json  -> rewrites src/content
 *
 * No API secret is involved at any point.
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'src', 'content');
const DEV = join(ROOT, 'src', 'dev');
const OUT = join(ROOT, 'scripts', 'image-migration');
const LEGACY = /^https:\/\/(?:readdy\.ai\/api\/search-image\?|storage\.readdy-site\.link\/)/;

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : p.endsWith('.json') ? [p] : [];
  });

type Found = { url: string; publicId: string };

/** A readable Cloudinary name from where the image is first used. */
function nameFor(file: string, path: (string | number)[], root?: unknown): string {
  const rel = relative(CONTENT, file).replace(/\\/g, '/');
  const parts = rel.split('/'); // e.g. projects/en/slug.json, pages/en/home.json, settings/en/site.json
  const slug = parts.at(-1)!.replace(/\.json$/, '');
  if (parts[0] === 'settings') return 'nlem/brand/logo';
  if (parts[0] === 'pages' || rel.startsWith('../dev')) {
    const section = path[1] as number;
    const type = (root as { sections?: { type: string }[] })?.sections?.[section]?.type ?? `section${section}`;
    const nums = path.slice(2).filter((x): x is number => typeof x === 'number');
    const kebab = type.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    return `nlem/pages/${slug}-${kebab}${nums.length ? `-${nums.map((n) => n + 1).join('-')}` : ''}`;
  }
  return `nlem/${parts[0]}/${slug}`;
}

function walk(node: unknown, path: (string | number)[], visit: (url: string, path: (string | number)[]) => string | void): unknown {
  if (Array.isArray(node)) return node.map((x, i) => walk(x, [...path, i], visit));
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === 'url' && typeof v === 'string' && LEGACY.test(v)) out[k] = visit(v, [...path, k]) ?? v;
      else out[k] = walk(v, [...path, k], visit);
    }
    return out;
  }
  return node;
}

const all = () => [...files(CONTENT), ...files(DEV)];

if (process.argv[2] === 'plan') {
  const seen = new Map<string, Found>();
  const used = new Set<string>();
  for (const f of all().sort()) {
    const data = JSON.parse(readFileSync(f, 'utf8'));
    walk(data, [], (url, path) => {
      if (seen.has(url)) return;
      let id = nameFor(f, path, data);
      for (let n = 2; used.has(id); n++) id = `${nameFor(f, path, data)}-${n}`;
      used.add(id);
      seen.set(url, { url, publicId: id });
    });
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'plan.json'), JSON.stringify([...seen.values()], null, 2) + '\n');
  console.log(`${seen.size} image(s) to move -> scripts/image-migration/plan.json`);
} else if (process.argv[2] === 'apply') {
  const results = JSON.parse(readFileSync(process.argv[3], 'utf8')) as { url: string; secure_url?: string; error?: string }[];
  const map = new Map(results.filter((r) => r.secure_url).map((r) => [r.url, r.secure_url!]));
  const failed = results.filter((r) => !r.secure_url);
  let changed = 0;
  for (const f of all()) {
    const before = readFileSync(f, 'utf8');
    const after = JSON.stringify(walk(JSON.parse(before), [], (url) => map.get(url)), null, 2) + '\n';
    if (after !== before) {
      writeFileSync(f, after);
      changed++;
    }
  }
  console.log(`Rewrote ${changed} file(s); ${map.size} image(s) moved; ${failed.length} failed.`);
  for (const r of failed) console.log(`  ✗ ${r.url.slice(0, 80)}… ${r.error ?? ''}`);
  if (failed.length) process.exit(1);
} else {
  console.log('Usage: node scripts/migrate-images.ts plan | apply <results.json>');
}
