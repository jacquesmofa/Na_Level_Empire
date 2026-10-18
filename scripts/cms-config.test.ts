/**
 * The CMS config must be valid YAML, identical to what the schema produces,
 * and cover every field of every schema (checked through the generator).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { buildCmsConfig, CONFIG_PATH, toYaml } from './cms-config.ts';
import { BLOCK_LABELS, PAGE_IDS } from '../src/content/schema.ts';

const committed = readFileSync(CONFIG_PATH, 'utf8');
const parsed = parse(committed) as any;

test('config.yml is up to date with the schema', () => {
  assert.equal(committed, toYaml(buildCmsConfig()), 'run: npm run cms:config');
});

test('config.yml parses to exactly the schema-derived config', () => {
  assert.deepEqual(parsed, JSON.parse(JSON.stringify(buildCmsConfig())));
});

test('every fixed page is editable and every section type is offered', () => {
  const pages = parsed.collections.find((c: any) => c.name === 'pages');
  assert.deepEqual(pages.files.map((f: any) => f.name), [...PAGE_IDS]);
  const sections = pages.files[0].fields.find((f: any) => f.name === 'sections');
  assert.deepEqual(sections.types.map((t: any) => t.name).sort(), Object.keys(BLOCK_LABELS).sort());
});

test('editors can create pages, projects, stories, jobs, videos and team members', () => {
  for (const name of ['custom-pages', 'projects', 'news', 'jobs', 'videos', 'team']) {
    const c = parsed.collections.find((x: any) => x.name === name);
    assert.ok(c?.create && c?.folder === `src/content/${name}`, name);
  }
});

test('images use Cloudinary with only the public key; no secret anywhere', () => {
  assert.equal(parsed.media_library.name, 'cloudinary');
  assert.deepEqual(Object.keys(parsed.media_library.config).sort(), ['api_key', 'cloud_name']);
  assert.doesNotMatch(committed, /secret/i);
});

test('English and French: text is translated, images and links are copied', () => {
  const project = parsed.collections.find((c: any) => c.name === 'projects');
  const byName = Object.fromEntries(project.fields.map((f: any) => [f.name, f]));
  assert.equal(byName.title.i18n, true);
  assert.equal(byName.order.i18n, 'duplicate');
  assert.equal(byName.image.fields.find((f: any) => f.name === 'url').i18n, 'duplicate');
});

test("config.yml passes Sveltia's own config schema", async () => {
  const { default: Ajv } = await import('ajv');
  const schema = JSON.parse(readFileSync(new URL('../node_modules/@sveltia/cms/schema/sveltia-cms.json', import.meta.url), 'utf8'));
  const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false });
  const valid = ajv.validate(schema, parsed);
  const errors = (ajv.errors ?? []).slice(0, 15).map((e) => `${e.instancePath} ${e.message} ${JSON.stringify(e.params)}`);
  assert.ok(valid, errors.join('\n'));
});
