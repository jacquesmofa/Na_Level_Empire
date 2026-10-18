/**
 * Builds the Sveltia CMS configuration (public/admin/config.yml) FROM the Zod
 * schema, so the CMS and the validator can never disagree:
 *   - every field, list and section type comes from src/content/schema.ts
 *   - required flags, lengths, list sizes and dropdown options come from Zod
 *   - only the human-friendly labels and hints live here (LABELS below);
 *     a schema field without a label stops the script with an error
 *
 *   node scripts/cms-config.ts write   -> regenerate public/admin/config.yml
 *   node scripts/cms-config.ts check   -> fail if the committed file is out of date (CI)
 *
 * The build (vite.config.ts) also writes dist/admin/config.yml with the real
 * site address taken from Vercel.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import {
  BLOCK_LABELS,
  COLLECTIONS,
  CustomPageSchema,
  PAGE_IDS,
  PageSchema,
  SettingsSchema,
  UiStringsSchema,
  type PageId,
  type SectionType,
} from '../src/content/schema.ts';
import { isSharedField } from '../src/content/sharedFields.ts';
import { SITE_CONFIG } from '../src/site.config.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const CONFIG_PATH = join(ROOT, 'public', 'admin', 'config.yml');

/** Placeholder written into the committed file; the build swaps in the real address. */
export const SITE_URL_PLACEHOLDER = 'https://SITE_URL';

const REPO = SITE_CONFIG.repo;
const CLOUDINARY = { cloud_name: SITE_CONFIG.cloudinary.cloud, api_key: SITE_CONFIG.cloudinary.apiKey };

// ---------------------------------------------------------------------------
// Labels and hints (the only hand-written part)
// ---------------------------------------------------------------------------

type Label = { label: string; hint?: string };
const L = (label: string, hint?: string): Label => (hint ? { label, hint } : { label });

const LABELS: Record<string, Label> = {
  // shared
  title: L('Title'),
  label: L('Label'),
  text: L('Text'),
  link: L('Link', 'A page of this site like /contact, or a full https:// address'),
  url: L('Link', 'A full https:// address, or # if not ready yet'),
  image: L('Image'),
  alt: L('Image description', 'What the image shows, for people using screen readers (required)'),
  icon: L('Icon'),
  style: L('Style'),
  type: L('Type'),
  name: L('Name'),
  placeholder: L('Placeholder (not confirmed yet)', 'Tick while this item is not confirmed by the client; listed in PLACEHOLDERS.md'),
  order: L('Sort order', 'Lower numbers come first'),
  published: L('Show on site'),
  slug: L('Web address', 'Lowercase words joined by dashes, e.g. spring-gala. Set it when creating; do not change it later'),
  seo: L('Search and sharing', 'How this page appears in Google and when shared'),
  description: L('Search description', '50–170 characters shown under the title in search results'),
  sections: L('Sections', 'Add, remove and drag sections to build the page. Keep English and French in the same order'),
  buttons: L('Buttons'),
  button: L('Button'),
  stats: L('Numbers'),
  value: L('Number', 'e.g. 100, $500K, 70%'),
  suffix: L('Small gold suffix', 'e.g. + or K'),
  kind: L('Is this a result or a target?', 'Targets show a "Target" tag on the site'),
  paragraphs: L('Paragraphs'),
  width: L('Width'),
  size: L('Size'),
  background: L('Background'),
  // hero / headers
  eyebrow: L('Small gold label'),
  headlineLines: L('Headline lines', 'One short word or phrase per line'),
  headlineAccent: L('Gold last line'),
  intro: L('Intro text'),
  reel: L('Scrolling images', '4 to 8 images shown in the moving reel'),
  titleAccent: L('Gold word(s) after the title'),
  watermark: L('Large faded text behind the header'),
  // quote / cards / media
  quote: L('Quote'),
  source: L('Quote source'),
  cards: L('Cards'),
  images: L('Images'),
  youtubeUrl: L('YouTube link', 'Paste the address of the video page'),
  caption: L('Caption'),
  partners: L('Partners'),
  logo: L('Logo'),
  imageSide: L('Image side'),
  // form block
  form: L('Which form'),
  formTitle: L('Form title'),
  fields: L('Field labels'),
  firstName: L('First name label'),
  firstNamePlaceholder: L('First name example'),
  lastName: L('Last name label'),
  lastNamePlaceholder: L('Last name example'),
  organization: L('Organization label'),
  organizationPlaceholder: L('Organization example'),
  email: L('Email'),
  emailPlaceholder: L('Email example'),
  services: L('Services'),
  budget: L('Budget label'),
  budgetPlaceholder: L('Budget prompt'),
  message: L('Message label'),
  messagePlaceholder: L('Message example'),
  serviceOptions: L('Services to tick'),
  budgetOptions: L('Budget ranges'),
  submitLabel: L('Send button'),
  sendingLabel: L('Send button while sending'),
  successTitle: L('Success title'),
  successText: L('Success message'),
  errorText: L('Error message', 'Shown when sending fails'),
  panel: L('Gold information panel'),
  locationLabel: L('Location label'),
  emailLabel: L('Email label'),
  phoneLabel: L('Phone label'),
  hoursLabel: L('Hours label'),
  followLabel: L('Social links label'),
  // projects grid
  showFilters: L('Show filter buttons'),
  filterLabels: L('Filter button labels'),
  all: L('All'),
  current: L('Current'),
  past: L('Past'),
  av: L('AV Production'),
  event: L('Events'),
  stream: L('Live Streaming'),
  doc: L('Documentary'),
  cardLink: L('Where project cards lead', 'Usually /contact'),
  items: L('Tiles', 'Exactly 3: the first is the large tile'),
  category: L('Category'),
  // news feed
  categories: L('News categories'),
  key: L('Category code', 'Short code used by stories, e.g. company'),
  categoriesTitle: L('Categories title'),
  newsletterTitle: L('Newsletter title'),
  newsletterText: L('Newsletter text'),
  namePlaceholder: L('Name field prompt'),
  subscribeLabel: L('Subscribe button'),
  subscribingLabel: L('Subscribe button while sending'),
  subscribedText: L('Thank-you message'),
  followTitle: L('Follow us title'),
  // jobs / videos / team
  applyLabel: L('Apply button text'),
  applyLink: L('Apply button link'),
  showChannelCard: L('Show channel card'),
  channel: L('YouTube channel'),
  initials: L('Initials in the circle'),
  details: L('Channel details line'),
  buttonLabel: L('Button text'),
  featuredVideo: L('Featured video'),
  embedUrl: L('YouTube link'),
  // settings
  siteName: L('Site name'),
  blurb: L('Short description (footer)'),
  contact: L('Contact details'),
  location: L('Location'),
  phone: L('Phone'),
  hours: L('Business hours'),
  social: L('Social links'),
  platform: L('Network'),
  nav: L('Menu links', 'Extra pages marked "show in navigation" are added automatically after these'),
  navCta: L('Menu button'),
  footer: L('Footer'),
  pagesTitle: L('Pages column title'),
  links: L('Page links'),
  servicesTitle: L('Services column title'),
  legalTitle: L('Legal column title'),
  legal: L('Legal items'),
  copyrightName: L('Copyright name'),
  copyrightSuffix: L('Text after the copyright name'),
  closingPrefix: L('Closing line'),
  closingHighlight: L('Closing line gold word'),
  // interface text
  languageName: L('Language name'),
  switchToLabel: L('Language switch button'),
  switchToAria: L('Language switch description (screen readers)'),
  menuToggleAria: L('Menu button description (screen readers)'),
  skipToContent: L('Skip link (keyboard users)'),
  statusCurrent: L('"Current" badge'),
  statusCompleted: L('"Completed" badge'),
  targetTag: L('"Target" tag'),
  readTime: L('Reading time', 'Keep {minutes} where the number goes'),
  quoteEmailSubject: L('Email subject for quote requests', 'Keep {name} where the sender name goes'),
  newsletterEmailSubject: L('Email subject for newsletter sign-ups'),
  socialNames: L('Social network names (screen readers)'),
  youtube: L('YouTube'),
  instagram: L('Instagram'),
  linkedin: L('LinkedIn'),
  facebook: L('Facebook'),
  x: L('X (Twitter)'),
  // collections
  status: L('Status'),
  summary: L('Summary'),
  tags: L('Tags', 'Up to 4 short tags'),
  date: L('Date'),
  excerpt: L('Excerpt', 'Shown on the featured story'),
  featured: L('Featured story', 'Only one story can be featured'),
  readMinutes: L('Reading time (minutes)'),
  body: L('Full story', 'Optional; for a future page per story'),
  employmentType: L('Job type'),
  department: L('Department'),
  open: L('Open (shown on site)'),
  thumbnail: L('Thumbnail'),
  duration: L('Length', 'e.g. 12:34'),
  role: L('Role'),
  photo: L('Photo', 'Portrait, 3:4'),
  showInNav: L('Show in navigation', 'Adds this page to the menu and footer'),
  navOrder: L('Position in the menu', 'Lower numbers come first'),
};

/** Same field name, different meaning by parent: "parent.field". */
const CONTEXT_LABELS: Record<string, Label> = {
  'contact.email': L('Email address'),
  'fields.email': L('Email label'),
  'fields.services': L('Services label'),
  'footer.services': L('Services list'),
  'social.label': L('Short text on the button', 'e.g. YT'),
  'social.url': L('Profile link', 'Use # until the real profile exists'),
  'videos.source': L('Source', '"manual" for links pasted by hand'),
  'partners.url': L('Website'),
  'channel.url': L('Channel link'),
  'stats.label': L('Description'),
  'seo.title': L('Browser tab title', 'Up to 70 characters'),
  'cards.text': L('Card text'),
  'items.link': L('Tile link'),
};

const OPTION_LABELS: Record<string, string> = {
  result: 'Result (achieved)',
  target: 'Target (goal)',
  page: 'Standard page header',
  full: 'Full screen (404 style)',
  services: 'Light cards with images',
  pillars: 'Large numbered dark cards',
  perks: 'Icons on a dark band',
  values: 'Gold-ruled text on a dark band',
  band: 'Large gold numbers in a row',
  tiles: 'Three coloured tiles',
  narrow: 'Narrow',
  wide: 'Wide',
  left: 'Left',
  right: 'Right',
  dark: 'Dark',
  light: 'Light',
  gold: 'Gold',
  quote: 'Quote request',
  av: 'AV Production',
  event: 'Event',
  stream: 'Live Streaming',
  doc: 'Documentary',
  current: 'Current',
  past: 'Completed',
  manual: 'Pasted by hand',
  'youtube-api': 'Fetched automatically (later)',
};

const PAGE_LABELS: Record<PageId, string> = {
  home: 'Home',
  projects: 'Projects',
  media: 'Media Hub',
  news: 'News',
  impact: 'Social Impact',
  careers: 'Careers',
  about: 'About',
  contact: 'Contact',
  'not-found': '404 (page not found)',
};

// ---------------------------------------------------------------------------
// Zod -> CMS fields
// ---------------------------------------------------------------------------

type Json = Record<string, any>;
type Field = Record<string, unknown>;

const LONG_TEXT = new Set(['paragraphs', 'intro', 'text', 'summary', 'excerpt', 'description', 'newsletterText', 'successText', 'errorText', 'blurb', 'quote', 'messagePlaceholder', 'caption', 'details']);

function labelFor(key: string, parent: string): Label {
  const l = CONTEXT_LABELS[`${parent}.${key}`] ?? LABELS[key];
  if (!l) throw new Error(`No CMS label for field "${key}" (in "${parent}"). Add it to LABELS in scripts/cms-config.ts.`);
  return l;
}

const isImage = (s: Json) => s?.type === 'object' && s.properties && Object.keys(s.properties).sort().join() === 'alt,url';
const isUnion = (s: Json) => Array.isArray(s?.oneOf ?? s?.anyOf);

function convert(key: string, schema: Json, parent: string, required: boolean, collection: string): Field {
  const { label, hint } = labelFor(key, parent);
  const f: Field = { name: key, label };
  if (hint) f.hint = hint;
  if (!required) f.required = false;
  // Translatable text gets its own value per language; everything else is copied.
  f.i18n = isSharedField(key, parent, collection) || schema.type === 'boolean' || schema.type === 'integer' || schema.type === 'number' || schema.enum ? 'duplicate' : true;

  if (isImage(schema)) {
    return {
      ...f,
      widget: 'object',
      i18n: true,
      fields: [
        { name: 'url', label: 'Image file', widget: 'image', i18n: 'duplicate', hint: `Choose or upload in Cloudinary (folder ${SITE_CONFIG.cloudinary.folder})` },
        { name: 'alt', ...labelFor('alt', key), widget: 'string', i18n: true, maxlength: schema.properties.alt.maxLength },
      ],
    };
  }
  if (schema.type === 'array') {
    const item = schema.items as Json;
    const list: Field = { ...f, widget: 'list' };
    if (schema.minItems !== undefined) list.min = schema.minItems;
    if (schema.maxItems !== undefined) list.max = schema.maxItems;
    if (key !== 'sections') list.i18n = true;
    if (isUnion(item)) {
      list.i18n = true;
      list.typeKey = 'type';
      list.types = (item.oneOf ?? item.anyOf).map((alt: Json) => {
        const t = alt.properties.type.const as SectionType;
        return { name: t, label: BLOCK_LABELS[t], widget: 'object', fields: objectFields(alt, t, collection, ['type']) };
      });
      return list;
    }
    if (item.type === 'object') {
      list.fields = isImage(item) ? convert('image', item, key, true, collection).fields : objectFields(item, key, collection);
      if (key === 'reel' || key === 'images') list.summary = '{{fields.alt}}';
      return list;
    }
    const sub: Field = { name: 'item', label, widget: (item.maxLength ?? 0) > 120 || LONG_TEXT.has(key) ? 'text' : 'string' };
    if (item.maxLength) sub.maxlength = item.maxLength;
    list.field = sub;
    return list;
  }
  if (schema.type === 'object') return { ...f, widget: 'object', i18n: true, fields: objectFields(schema, key, collection) };
  if (schema.enum) {
    return { ...f, widget: 'select', options: schema.enum.map((v: string) => ({ label: OPTION_LABELS[v] ?? v, value: v })) };
  }
  if (schema.type === 'boolean') return { ...f, widget: 'boolean', default: false };
  if (schema.type === 'integer' || schema.type === 'number') {
    const n: Field = { ...f, widget: 'number', value_type: schema.type === 'integer' ? 'int' : 'float' };
    if (schema.minimum !== undefined) n.min = schema.minimum;
    if (schema.maximum !== undefined) n.max = schema.maximum;
    return n;
  }
  if (schema.format === 'date') {
    return { ...f, widget: 'datetime', format: 'YYYY-MM-DD', date_format: 'YYYY-MM-DD', time_format: false, picker_utc: true };
  }
  if (key === 'body') return { ...f, widget: 'markdown' };
  const s: Field = { ...f, widget: (schema.maxLength ?? 0) > 200 || LONG_TEXT.has(key) ? 'text' : 'string' };
  if (schema.minLength && schema.minLength > 1) s.minlength = schema.minLength;
  if (schema.maxLength) s.maxlength = schema.maxLength;
  if (schema.pattern) s.pattern = [schema.pattern, hintForPattern(key)];
  return s;
}

function hintForPattern(key: string): string {
  if (key === 'slug' || key === 'key') return 'Use lowercase letters, numbers and dashes';
  if (key === 'duration') return 'Like 12:34';
  return 'Use a site path like /contact or a full https:// link';
}

function objectFields(schema: Json, parent: string, collection: string, skip: string[] = []): Field[] {
  const req = new Set<string>(schema.required ?? []);
  return Object.entries<Json>(schema.properties)
    .filter(([k]) => !skip.includes(k))
    .map(([k, v]) => convert(k, v, parent, req.has(k), collection));
}

const jsonSchema = (s: z.ZodType) => z.toJSONSchema(s, { io: 'input', unrepresentable: 'any' }) as Json;
const fieldsOf = (s: z.ZodType, collection: string) => objectFields(jsonSchema(s), 'root', collection);

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

const COLLECTION_LABELS: Record<string, [string, string, string]> = {
  projects: ['Projects', 'Project', 'title'],
  news: ['News', 'Story', 'title'],
  jobs: ['Jobs', 'Job', 'title'],
  videos: ['Videos', 'Video', 'title'],
  team: ['Team', 'Team member', 'name'],
};

export function buildCmsConfig(siteUrl = SITE_URL_PLACEHOLDER): Json {
  const folderCollection = (name: string, schema: z.ZodType, [label, singular, idField]: [string, string, string], extra: Json = {}) => ({
    name,
    label,
    label_singular: singular,
    folder: `src/content/${name}`,
    format: 'json',
    extension: 'json',
    create: true,
    delete: true,
    i18n: true,
    identifier_field: idField,
    slug: '{{slug}}',
    summary: `{{${idField}}}`,
    fields: fieldsOf(schema, name),
    ...extra,
  });

  // One definition of the page fields, referenced by every page (a YAML anchor in the output).
  const pageFields = fieldsOf(PageSchema, 'pages');
  const customFields = fieldsOf(CustomPageSchema, 'custom-pages').map((f) => (f.name === 'sections' ? pageFields.find((p) => p.name === 'sections')! : f));

  return {
    backend: {
      name: 'github',
      repo: REPO,
      branch: 'main',
      base_url: siteUrl,
      auth_endpoint: 'api/auth',
      commit_messages: {
        create: 'CMS: create {{collection}} "{{slug}}"',
        update: 'CMS: update {{collection}} "{{slug}}"',
        delete: 'CMS: delete {{collection}} "{{slug}}"',
        uploadMedia: 'CMS: upload "{{path}}"',
        deleteMedia: 'CMS: delete "{{path}}"',
      },
    },
    site_url: siteUrl,
    display_url: siteUrl,
    media_folder: 'public/uploads',
    public_folder: '/uploads',
    media_library: { name: 'cloudinary', config: CLOUDINARY, output_filename_only: false, use_transformations: false },
    i18n: { structure: 'multiple_folders', locales: ['en', 'fr'], default_locale: 'en' },
    collections: [
      {
        name: 'pages',
        label: 'Pages',
        description: 'The main pages of the site. They cannot be deleted; change their sections freely.',
        format: 'json',
        i18n: true,
        files: PAGE_IDS.map((id) => ({ name: id, label: PAGE_LABELS[id], file: `src/content/pages/{{locale}}/${id}.json`, i18n: true, fields: pageFields })),
      },
      folderCollection('custom-pages', CustomPageSchema, ['Extra pages', 'Page', 'title'], {
        description: 'Pages you create. Each one is served at /web-address and /fr/web-address.',
        slug: '{{fields.slug}}',
        fields: customFields,
      }),
      ...Object.entries(COLLECTIONS).map(([name, schema]) =>
        folderCollection(name, schema as z.ZodType, COLLECTION_LABELS[name], name === 'news' ? { slug: '{{fields.slug}}' } : {}),
      ),
      {
        name: 'settings',
        label: 'Site settings',
        format: 'json',
        i18n: true,
        files: [
          { name: 'site', label: 'Site settings', file: 'src/content/settings/{{locale}}/site.json', i18n: true, fields: fieldsOf(SettingsSchema, 'settings') },
          { name: 'ui', label: 'Interface text', file: 'src/content/ui/{{locale}}/strings.json', i18n: true, fields: fieldsOf(UiStringsSchema, 'ui') },
        ],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// YAML output (small serializer: maps, lists, strings, numbers, booleans)
// ---------------------------------------------------------------------------

function scalar(v: unknown): string {
  if (typeof v === 'string') {
    const plain = /^[A-Za-z_/][\w./{} -]*$/.test(v) && !/^(true|false|null|yes|no|on|off)$/i.test(v) && !v.includes(': ') && !v.includes(' #') && !v.endsWith(' ');
    return plain ? v : JSON.stringify(v);
  }
  return String(v);
}

/** Objects/lists used more than once are written once with an anchor (&a1) and referenced (*a1) afterwards. */
function yaml(v: unknown, indent: number, anchors: Map<object, { id: string; written: boolean }>): string {
  const pad = ' '.repeat(indent);
  const ref = (x: object) => anchors.get(x);
  const head = (x: unknown) => {
    const a = x && typeof x === 'object' ? ref(x as object) : undefined;
    if (!a) return { alias: '', anchor: '' };
    if (a.written) return { alias: ` *${a.id}`, anchor: '' };
    a.written = true;
    return { alias: '', anchor: ` &${a.id}` };
  };
  if (Array.isArray(v)) {
    if (!v.length) return ' []';
    return v
      .map((item) => {
        if (item && typeof item === 'object') {
          const { alias, anchor } = head(item);
          if (alias) return `\n${pad}-${alias}`;
          const body = yaml(item, indent + 2, anchors).replace(/^\n/, '').replace(new RegExp(`^${' '.repeat(indent + 2)}`), '');
          return anchor ? `\n${pad}-${anchor}\n${' '.repeat(indent + 2)}${body}` : `\n${pad}- ${body}`;
        }
        return `\n${pad}- ${scalar(item)}`;
      })
      .join('');
  }
  if (v && typeof v === 'object') {
    return Object.entries(v)
      .map(([k, x]) => {
        if (x && typeof x === 'object') {
          const { alias, anchor } = head(x);
          return alias ? `\n${pad}${k}:${alias}` : `\n${pad}${k}:${anchor}${yaml(x, indent + 2, anchors)}`;
        }
        return `\n${pad}${k}: ${scalar(x)}`;
      })
      .join('');
  }
  return ` ${scalar(v)}`;
}

function findShared(root: unknown): Map<object, { id: string; written: boolean }> {
  const seen = new Map<object, number>();
  const visit = (x: unknown) => {
    if (!x || typeof x !== 'object') return;
    const n = (seen.get(x) ?? 0) + 1;
    seen.set(x, n);
    if (n > 1) return;
    Object.values(x).forEach(visit);
  };
  visit(root);
  const anchors = new Map<object, { id: string; written: boolean }>();
  let i = 0;
  for (const [x, n] of seen) if (n > 1) anchors.set(x, { id: `shared${++i}`, written: false });
  return anchors;
}

export function toYaml(config: Json): string {
  return `# GENERATED from src/content/schema.ts by scripts/cms-config.ts. Do not edit by hand:\n# change the schema (and labels in scripts/cms-config.ts), then run: npm run cms:config\n${yaml(config, 0, findShared(config)).replace(/^\n/, '')}\n`;
}

// CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const generated = toYaml(buildCmsConfig());
  if (process.argv[2] === 'write') {
    writeFileSync(CONFIG_PATH, generated);
    console.log('Wrote public/admin/config.yml');
  } else if (process.argv[2] === 'check') {
    let current = '';
    try {
      current = readFileSync(CONFIG_PATH, 'utf8');
    } catch {
      /* missing file */
    }
    if (current !== generated) {
      console.error('public/admin/config.yml does not match the content schema. Run: npm run cms:config');
      process.exit(1);
    }
    console.log('CMS config matches the content schema.');
  } else {
    console.log('Usage: node scripts/cms-config.ts write | check');
  }
}
