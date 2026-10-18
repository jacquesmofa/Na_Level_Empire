import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { getCustomPages, LOCALES, PAGE_PATHS, type PageId } from '@/content';
import { localePrefix } from '@/lib/locale';
import Layout from './Layout';
import PageView from './PageView';

// Development only: /__blocks shows every new block type. Removed from production builds.
const BlockCatalogue = import.meta.env.DEV ? lazy(() => import('@/dev/BlockCatalogue')) : null;

const pages = Object.entries(PAGE_PATHS) as [Exclude<PageId, 'not-found'>, string][];

/** English pages at /, French pages under /fr/. */
const routes: RouteObject[] = LOCALES.map((locale) => ({
  path: localePrefix(locale) || '/',
  element: <Layout locale={locale} />,
  children: [
    ...pages.map(([id, path]) =>
      path === '/' ? { index: true, element: <PageView key={`${locale}-${id}`} id={id} /> } : { path: path.slice(1), element: <PageView key={`${locale}-${id}`} id={id} /> },
    ),
    // Pages editors created in the CMS
    ...getCustomPages(locale).map((p) => ({ path: p.slug, element: <PageView key={`${locale}-custom-${p.slug}`} customSlug={p.slug} /> })),
    ...(BlockCatalogue && locale === 'en' ? [{ path: '__blocks', element: <BlockCatalogue /> }] : []),
    { path: '*', element: <PageView key={`${locale}-not-found`} id="not-found" /> },
  ],
}));

export default routes;
