/**
 * Plain constants shared by the site and the content schema.
 * Kept separate from schema.ts so the site never bundles zod.
 */
export const LOCALES = ['en', 'fr'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/** Every page of the site. Editors change a page's sections, not the list of pages. */
export const PAGE_IDS = ['home', 'projects', 'media', 'news', 'impact', 'careers', 'about', 'contact', 'not-found'] as const;
export type PageId = (typeof PAGE_IDS)[number];

/** URL path of each page (without the /fr prefix). */
export const PAGE_PATHS: Record<Exclude<PageId, 'not-found'>, string> = {
  home: '/',
  projects: '/projects',
  media: '/media',
  news: '/news',
  impact: '/impact',
  careers: '/careers',
  about: '/about',
  contact: '/contact',
};
