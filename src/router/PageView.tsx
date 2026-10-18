import { useEffect } from 'react';
import { getCustomPages, getPage, getSettings, type Page, type PageId } from '@/content';
import BlockRenderer from '@/blocks/BlockRenderer';
import { useLocale } from '@/lib/locale';

/** One page: its sections, plus the browser tab title and description. */
export default function PageView({ id, customSlug }: { id?: PageId; customSlug?: string }) {
  const locale = useLocale();
  const page: Page = customSlug
    ? (getCustomPages(locale).find((p) => p.slug === customSlug) ?? getPage(locale, 'not-found'))
    : getPage(locale, id ?? 'not-found');
  const settings = getSettings(locale);
  const startsWithHero = page.sections[0]?.type === 'hero';
  const fullHeader = page.sections.some((s) => s.type === 'pageHeader' && s.size === 'full');

  useEffect(() => {
    document.title = page.seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', page.seo.description);
  }, [page]);

  return (
    <main id="main" tabIndex={-1} className={`outline-none min-h-screen bg-charcoal text-cream ${startsWithHero ? '' : 'pt-[76px]'} ${fullHeader ? 'flex flex-col' : ''}`}>
      <BlockRenderer sections={page.sections} settings={settings} />
    </main>
  );
}
