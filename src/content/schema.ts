/**
 * Content schemas: the single source of truth for every JSON file in
 * src/content/. The CMS config (public/admin/config.yml, phase c) mirrors
 * these, and `npm run validate` checks every file against them before each
 * build, so a bad edit fails the build instead of breaking the live site.
 *
 * TypeScript types are inferred from these schemas; never write them by hand.
 *
 * This file imports only zod and ./constants.ts: it is also loaded directly
 * by Node in scripts/validate-content.ts. The site itself imports only types
 * from here, so zod never ships to visitors.
 */
import { z } from 'zod';

export { LOCALES, DEFAULT_LOCALE, PAGE_IDS, type Locale, type PageId } from './constants.ts';

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

const text = (max: number) => z.string().trim().min(1, 'cannot be empty').max(max, `must be ${max} characters or fewer`);
const optionalText = (max: number) => z.string().trim().max(max, `must be ${max} characters or fewer`).optional();

/** A site path ("/contact") or a full web/email/phone link. */
export const LinkSchema = z
  .string()
  .trim()
  .regex(/^(\/[^\s]*|https?:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+|#)$/, 'must be a site path like /contact, a full https:// link, mailto: or tel:');

export const ImageSchema = z.strictObject({
  url: z.url({ protocol: /^https$/, message: 'must be a full https:// image address' }),
  alt: text(150),
});

export const ButtonSchema = z.strictObject({
  label: text(40),
  link: LinkSchema,
});

export const SeoSchema = z.strictObject({
  title: text(70),
  description: z.string().trim().min(50, 'should be at least 50 characters').max(170, 'must be 170 characters or fewer'),
});

export const IconSchema = z.enum(['camera', 'live', 'team', 'film', 'stack', 'time', 'home', 'chart', 'play']);
export type IconName = z.infer<typeof IconSchema>;

export const StatSchema = z.strictObject({
  value: text(12),
  suffix: optionalText(4),
  label: text(60),
  /** Targets are shown with visible "Target" wording until confirmed. */
  kind: z.enum(['result', 'target']).optional(),
});

// ---------------------------------------------------------------------------
// Section blocks (each page is an ordered list of these)
// ---------------------------------------------------------------------------

const block = <T extends string, S extends z.ZodRawShape>(type: T, shape: S) =>
  z.strictObject({ type: z.literal(type), ...shape });

export const HeroBlock = block('hero', {
  eyebrow: text(60),
  headlineLines: z.array(text(20)).min(1).max(4),
  headlineAccent: text(20),
  intro: text(240),
  buttons: z.array(ButtonSchema).max(2),
  stats: z.array(StatSchema).max(4),
  reel: z.array(ImageSchema).min(2).max(8),
});

export const PageHeaderBlock = block('pageHeader', {
  eyebrow: text(60),
  title: text(40),
  titleAccent: optionalText(30),
  /** "page" is the standard inner-page header; "full" fills the screen (used by the 404 page). */
  size: z.enum(['page', 'full']).optional(),
  text: optionalText(300),
  buttons: z.array(ButtonSchema).max(2).optional(),
  watermark: optionalText(6),
});

export const RichTextBlock = block('richText', {
  label: optionalText(60),
  paragraphs: z.array(text(1200)).min(1).max(12),
  width: z.enum(['narrow', 'wide']).optional(),
});

export const QuoteBlock = block('quote', {
  /** Optional story text shown in a card beside the quote. */
  paragraphs: z.array(text(1200)).max(8).optional(),
  quote: text(240),
  source: optionalText(80),
});

export const CardSchema = z.strictObject({
  icon: IconSchema.optional(),
  image: ImageSchema.optional(),
  title: text(60),
  text: text(400),
  link: LinkSchema.optional(),
});

export const CardGridBlock = block('cardGrid', {
  label: optionalText(60),
  /** services: light cards with image; pillars: large numbered dark cards; perks: icon list on dark band; values: gold-ruled text on dark band. */
  style: z.enum(['services', 'pillars', 'perks', 'values']),
  cards: z.array(CardSchema).min(1).max(12),
});

export const StatsBandBlock = block('statsBand', {
  /** band: large gold numbers in a row; tiles: three coloured tiles. */
  style: z.enum(['band', 'tiles']),
  stats: z.array(StatSchema).min(1).max(6),
});

export const TextImageBlock = block('textImage', {
  label: optionalText(60),
  title: text(80),
  paragraphs: z.array(text(1200)).min(1).max(8),
  image: ImageSchema,
  imageSide: z.enum(['left', 'right']).optional(),
  background: z.enum(['dark', 'light']).optional(),
  button: ButtonSchema.optional(),
});

export const GalleryBlock = block('gallery', {
  label: optionalText(60),
  images: z.array(ImageSchema).min(2).max(24),
  background: z.enum(['dark', 'light']).optional(),
});

export const VideoBlock = block('video', {
  label: optionalText(60),
  title: text(100),
  youtubeUrl: z.url({ message: 'must be a YouTube link' }).regex(/youtube\.com|youtu\.be/, 'must be a YouTube link'),
  caption: optionalText(200),
});

export const PartnersBlock = block('partners', {
  label: text(60),
  partners: z
    .array(
      z.strictObject({
        name: text(60),
        logo: ImageSchema.optional(),
        url: LinkSchema.optional(),
        placeholder: z.boolean().optional(),
      }),
    )
    .min(1)
    .max(30),
});

export const CallToActionBlock = block('callToAction', {
  title: text(80),
  text: optionalText(300),
  buttons: z.array(ButtonSchema).min(1).max(2),
  style: z.enum(['gold', 'dark']).optional(),
});

export const FormBlock = block('form', {
  form: z.enum(['quote']),
  formTitle: text(60),
  fields: z.strictObject({
    firstName: text(30),
    firstNamePlaceholder: text(40),
    lastName: text(30),
    lastNamePlaceholder: text(40),
    organization: text(30),
    organizationPlaceholder: text(60),
    email: text(30),
    emailPlaceholder: text(60),
    services: text(40),
    budget: text(40),
    budgetPlaceholder: text(40),
    message: text(40),
    messagePlaceholder: text(200),
  }),
  serviceOptions: z.array(text(40)).min(1).max(12),
  budgetOptions: z.array(text(40)).min(1).max(8),
  submitLabel: text(30),
  sendingLabel: text(30),
  successTitle: text(40),
  successText: text(200),
  errorText: text(200),
  panel: z.strictObject({
    title: text(60),
    text: text(400),
    locationLabel: text(30),
    emailLabel: text(30),
    phoneLabel: text(30),
    hoursLabel: text(30),
    followLabel: text(30),
  }),
});

export const ProjectsGridBlock = block('projectsGrid', {
  showFilters: z.boolean().optional(),
  filterLabels: z.strictObject({
    all: text(20),
    current: text(20),
    past: text(20),
    av: text(20),
    event: text(20),
    stream: text(20),
    doc: text(20),
  }),
  cardLink: LinkSchema.optional(),
});

export const LatestWorkBlock = block('latestWork', {
  label: text(60),
  items: z
    .array(
      z.strictObject({
        category: text(30),
        title: text(80),
        image: ImageSchema,
        link: LinkSchema.optional(),
      }),
    )
    .length(3, 'needs exactly 3 items (one large, two small)'),
  button: ButtonSchema,
});

export const NewsFeedBlock = block('newsFeed', {
  categories: z
    .array(z.strictObject({ key: z.string().regex(/^[a-z0-9-]+$/), label: text(40) }))
    .min(1)
    .max(12),
  categoriesTitle: text(30),
  newsletterTitle: text(30),
  newsletterText: text(240),
  namePlaceholder: text(40),
  emailPlaceholder: text(40),
  subscribeLabel: text(30),
  subscribingLabel: text(30),
  subscribedText: text(120),
  errorText: text(160),
  followTitle: text(30),
});

export const JobsListBlock = block('jobsList', {
  applyLabel: text(30),
  applyLink: LinkSchema,
});

export const VideoGridBlock = block('videoGrid', {
  showChannelCard: z.boolean().optional(),
  channel: z.strictObject({
    initials: text(3),
    name: text(60),
    details: text(160),
    url: LinkSchema,
    buttonLabel: text(40),
  }),
  featuredVideo: z.strictObject({
    title: text(100),
    embedUrl: z.url().regex(/youtube\.com|youtu\.be/, 'must be a YouTube link'),
  }),
  label: text(60),
});

export const TeamGridBlock = block('teamGrid', {
  label: text(60),
});

export const SectionBlock = z.discriminatedUnion('type', [
  HeroBlock,
  PageHeaderBlock,
  RichTextBlock,
  QuoteBlock,
  CardGridBlock,
  StatsBandBlock,
  TextImageBlock,
  GalleryBlock,
  VideoBlock,
  PartnersBlock,
  CallToActionBlock,
  FormBlock,
  ProjectsGridBlock,
  LatestWorkBlock,
  NewsFeedBlock,
  JobsListBlock,
  VideoGridBlock,
  TeamGridBlock,
]);
export type Section = z.infer<typeof SectionBlock>;
export type SectionType = Section['type'];
export type SectionOf<T extends SectionType> = Extract<Section, { type: T }>;

export const PageSchema = z.strictObject({
  seo: SeoSchema,
  sections: z.array(SectionBlock).min(1, 'a page needs at least one section'),
});
export type Page = z.infer<typeof PageSchema>;

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

export const SocialSchema = z.strictObject({
  platform: z.enum(['youtube', 'instagram', 'linkedin', 'facebook', 'x']),
  /** Short text shown in the square button, e.g. "YT". */
  label: text(3),
  url: LinkSchema,
  placeholder: z.boolean().optional(),
});

export const SettingsSchema = z.strictObject({
  siteName: text(60),
  logo: ImageSchema,
  blurb: text(240),
  contact: z.strictObject({
    location: text(80),
    email: z.email(),
    phone: text(30),
    hours: text(60),
  }),
  social: z.array(SocialSchema).max(6),
  nav: z.array(ButtonSchema).min(1).max(9),
  navCta: ButtonSchema,
  footer: z.strictObject({
    pagesTitle: text(30),
    links: z.array(ButtonSchema).max(12),
    servicesTitle: text(30),
    services: z.array(text(40)).max(12),
    legalTitle: text(30),
    legal: z.array(z.strictObject({ label: text(40), link: LinkSchema.optional() })).max(8),
    copyrightName: text(60),
    copyrightSuffix: text(120),
    closingPrefix: text(60),
    closingHighlight: text(40),
  }),
  seo: SeoSchema,
  ui: z.strictObject({
    languageName: text(20),
    switchToLabel: text(10),
    switchToAria: text(60),
    menuToggleAria: text(40),
    statusCurrent: text(20),
    statusCompleted: text(20),
    targetTag: text(20),
    readTime: text(30).regex(/\{minutes\}/, 'must contain {minutes}'),
  }),
});
export type Settings = z.infer<typeof SettingsSchema>;

// ---------------------------------------------------------------------------
// Collections (one JSON file per item, per language)
// ---------------------------------------------------------------------------

const order = z.number().int().min(0).max(999);

export const ProjectSchema = z.strictObject({
  title: text(80),
  category: text(30),
  type: z.enum(['av', 'event', 'stream', 'doc']),
  status: z.enum(['current', 'past']),
  summary: text(220),
  tags: z.array(text(20)).max(4),
  image: ImageSchema,
  order,
  published: z.boolean().optional(),
  /** Not yet confirmed by the client; listed in PLACEHOLDERS.md. */
  placeholder: z.boolean().optional(),
});

export const NewsSchema = z.strictObject({
  title: text(120),
  /** Ready for /news/<slug> pages later; must match the file name. */
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'use lowercase letters, numbers and dashes'),
  category: z.string().regex(/^[a-z0-9-]+$/),
  date: z.iso.date({ message: 'must be a date like 2026-04-15' }),
  excerpt: optionalText(400),
  image: ImageSchema,
  featured: z.boolean().optional(),
  readMinutes: z.number().int().min(1).max(60).optional(),
  body: z.string().max(20000).optional(),
  published: z.boolean().optional(),
  /** Not yet confirmed by the client; listed in PLACEHOLDERS.md. */
  placeholder: z.boolean().optional(),
});

export const JobSchema = z.strictObject({
  title: text(80),
  employmentType: text(30),
  department: text(40),
  location: text(40),
  summary: text(240),
  order,
  open: z.boolean().optional(),
  /** Not yet confirmed by the client; listed in PLACEHOLDERS.md. */
  placeholder: z.boolean().optional(),
});

export const VideoSchema = z.strictObject({
  title: text(100),
  /** Optional until real links are available; cards link to the channel without it. */
  youtubeUrl: z.url().regex(/youtube\.com|youtu\.be/, 'must be a YouTube link').optional(),
  thumbnail: ImageSchema,
  duration: z.string().regex(/^\d{1,2}(:\d{2}){1,2}$/, 'must look like 12:34'),
  date: z.iso.date({ message: 'must be a date like 2026-04-15' }),
  /** "manual" today; "youtube-api" is reserved for automatic fetching later. */
  source: z.enum(['manual', 'youtube-api']).optional(),
  published: z.boolean().optional(),
  /** Not yet confirmed by the client; listed in PLACEHOLDERS.md. */
  placeholder: z.boolean().optional(),
});

export const TeamSchema = z.strictObject({
  name: text(60),
  role: text(60),
  photo: ImageSchema,
  order,
  /** Not yet confirmed by the client; listed in PLACEHOLDERS.md. */
  placeholder: z.boolean().optional(),
});

export const COLLECTIONS = {
  projects: ProjectSchema,
  news: NewsSchema,
  jobs: JobSchema,
  videos: VideoSchema,
  team: TeamSchema,
} as const;
export type CollectionName = keyof typeof COLLECTIONS;

export type Project = z.infer<typeof ProjectSchema> & { slug: string };
export type NewsItem = z.infer<typeof NewsSchema>;
export type Job = z.infer<typeof JobSchema> & { slug: string };
export type Video = z.infer<typeof VideoSchema> & { slug: string };
export type TeamMember = z.infer<typeof TeamSchema> & { slug: string };

// ---------------------------------------------------------------------------
// Cross-file rules (checked by the validator after each file passes)
// ---------------------------------------------------------------------------

/** Plain-English names for block types, used in error messages and the CMS. */
export const BLOCK_LABELS: Record<SectionType, string> = {
  hero: 'Hero',
  pageHeader: 'Page header',
  richText: 'Text',
  quote: 'Quote',
  cardGrid: 'Card grid',
  statsBand: 'Stats',
  textImage: 'Text + image',
  gallery: 'Gallery',
  video: 'Video',
  partners: 'Partners',
  callToAction: 'Call to action',
  form: 'Form',
  projectsGrid: 'Projects grid',
  latestWork: 'Latest work',
  newsFeed: 'News feed',
  jobsList: 'Jobs list',
  videoGrid: 'Video grid',
  teamGrid: 'Team grid',
};
