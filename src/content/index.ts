/**
 * The only way components get content. Files are bundled at build time and
 * were already validated by scripts/validate-content.ts (via the Vite plugin),
 * so here they are only typed and sorted. Only types are imported from the
 * schema, so zod is not shipped to visitors.
 */
import type { CustomPage, Job, NewsItem, Page, Project, Settings, TeamMember, UiStrings, Video } from './schema';
import type { Locale, PageId } from './constants';

type Files<T> = Record<string, T>;

const settingsFiles = import.meta.glob<Settings>('./settings/*/site.json', { eager: true, import: 'default' });
const uiFiles = import.meta.glob<UiStrings>('./ui/*/strings.json', { eager: true, import: 'default' });
const pageFiles = import.meta.glob<Page>('./pages/*/*.json', { eager: true, import: 'default' });
const customPageFiles = import.meta.glob<Omit<CustomPage, 'slug'> & { slug: string }>('./custom-pages/*/*.json', { eager: true, import: 'default' });
const projectFiles = import.meta.glob<Omit<Project, 'slug'>>('./projects/*/*.json', { eager: true, import: 'default' });
const newsFiles = import.meta.glob<NewsItem>('./news/*/*.json', { eager: true, import: 'default' });
const jobFiles = import.meta.glob<Omit<Job, 'slug'>>('./jobs/*/*.json', { eager: true, import: 'default' });
const videoFiles = import.meta.glob<Omit<Video, 'slug'>>('./videos/*/*.json', { eager: true, import: 'default' });
const teamFiles = import.meta.glob<Omit<TeamMember, 'slug'>>('./team/*/*.json', { eager: true, import: 'default' });

/** Items of a collection in one language, each with its slug (the file name). */
function inLocale<T>(files: Files<T>, locale: Locale): (T & { slug: string })[] {
  return Object.entries(files)
    .filter(([path]) => path.split('/')[2] === locale)
    .map(([path, data]) => ({ ...data, slug: path.split('/').pop()!.replace(/\.json$/, '') }));
}

/** Site settings plus the interface text for one language. */
export type SiteSettings = Settings & { ui: UiStrings };

export function getSettings(locale: Locale): SiteSettings {
  return { ...settingsFiles[`./settings/${locale}/site.json`], ui: uiFiles[`./ui/${locale}/strings.json`] };
}

/** Pages editors created, in one language, ordered for navigation. */
export function getCustomPages(locale: Locale): CustomPage[] {
  return inLocale(customPageFiles, locale).sort((a, b) => (a.navOrder ?? 999) - (b.navOrder ?? 999) || a.title.localeCompare(b.title));
}

/** Navigation: the fixed menu from settings, then editor pages marked "show in navigation". */
export function getNav(locale: Locale): { label: string; link: string }[] {
  const custom = getCustomPages(locale)
    .filter((p) => p.showInNav)
    .map((p) => ({ label: p.title, link: `/${p.slug}` }));
  return [...getSettings(locale).nav, ...custom];
}

export function getPage(locale: Locale, id: PageId): Page {
  return pageFiles[`./pages/${locale}/${id}.json`];
}

const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;
const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date);

export function getProjects(locale: Locale): Project[] {
  return inLocale(projectFiles, locale).filter((p) => p.published !== false).sort(byOrder);
}

export function getNews(locale: Locale): NewsItem[] {
  return inLocale(newsFiles, locale).filter((n) => n.published !== false).sort(byDateDesc);
}

export function getJobs(locale: Locale): Job[] {
  return inLocale(jobFiles, locale).filter((j) => j.open !== false).sort(byOrder);
}

export function getVideos(locale: Locale): Video[] {
  return inLocale(videoFiles, locale).filter((v) => v.published !== false).sort(byDateDesc);
}

export function getTeam(locale: Locale): TeamMember[] {
  return inLocale(teamFiles, locale).sort(byOrder);
}

export type { CustomPage, Job, NewsItem, Page, Project, Settings, TeamMember, UiStrings, Video } from './schema';
export type { Section, SectionOf, SectionType, IconName } from './schema';
export { LOCALES, DEFAULT_LOCALE, PAGE_PATHS, type Locale, type PageId } from './constants';
