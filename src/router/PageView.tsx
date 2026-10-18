import { useEffect } from 'react';
import { getPage, getSettings, type PageId } from '@/content';
import BlockRenderer from '@/blocks/BlockRenderer';
import { useLocale } from '@/lib/locale';

/** One page: its sections, plus the browser tab title and description. */
export default function PageView({ id }: { id: PageId }) {
  const locale = useLocale();
  const page = getPage(locale, id);
  const settings = getSettings(locale);
  const startsWithHero = page.sections[0]?.type === 'hero';
  const fullHeader = page.sections.some((s) => s.type === 'pageHeader' && s.size === 'full');

  useEffect(() => {
    document.title = page.seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', page.seo.description);
  }, [page]);

  return (
    <main className={`min-h-screen bg-charcoal text-cream ${startsWithHero ? '' : 'pt-[76px]'} ${fullHeader ? 'flex flex-col' : ''}`}>
      <BlockRenderer sections={page.sections} settings={settings} />
    </main>
  );
}
