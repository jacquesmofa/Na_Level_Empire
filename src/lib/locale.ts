import { createContext, useContext } from 'react';
import { DEFAULT_LOCALE, type Locale } from '@/content';

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export const LocaleProvider = LocaleContext.Provider;

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** URL prefix of a language: "" for English, "/fr" for French. */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

/** Adds the language prefix to a site path: "/contact" -> "/fr/contact". */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith('/')) return path;
  const prefix = localePrefix(locale);
  if (!prefix) return path;
  return path === '/' ? prefix : `${prefix}${path}`;
}

/** The same page in another language, from the current URL path. */
export function switchLocalePath(pathname: string, from: Locale, to: Locale): string {
  const fromPrefix = localePrefix(from);
  const bare = fromPrefix && pathname.startsWith(fromPrefix) ? pathname.slice(fromPrefix.length) || '/' : pathname;
  return localizePath(bare, to);
}

/** Formats an ISO date (2026-04-15) as "April 2026" / "avril 2026". */
export function formatMonthYear(isoDate: string, locale: Locale): string {
  const [y, m] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat(`${locale}-CA`, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}
