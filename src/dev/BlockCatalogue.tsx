import { getSettings, type Page } from '@/content';
import BlockRenderer from '@/blocks/BlockRenderer';
import catalogue from './catalogue.json';

/** Development-only page (/__blocks) showing the new block types in each style. */
export default function BlockCatalogue() {
  const page = catalogue as Page;
  return (
    <main className="min-h-screen bg-charcoal text-cream pt-[76px]">
      <BlockRenderer sections={page.sections} settings={getSettings('en')} />
    </main>
  );
}
