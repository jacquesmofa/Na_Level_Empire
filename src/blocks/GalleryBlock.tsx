import type { SectionOf } from '@/content';
import CmsImage from '@/components/ui/CmsImage';
import SectionLabel from '@/components/ui/SectionLabel';

export default function GalleryBlock({ block }: { block: SectionOf<'gallery'> }) {
  return (
    <section className={`px-6 md:px-20 py-20 ${block.background === 'light' ? 'bg-cream' : 'bg-charcoal'}`}>
      {block.label && <SectionLabel onLight={block.background === 'light'}>{block.label}</SectionLabel>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {block.images.map((image, i) => (
          <div key={image.url + i} className="group overflow-hidden rounded-sm bg-deep" style={{ aspectRatio: '1' }}>
            <CmsImage image={image} width={600} height={600} sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 50vw" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        ))}
      </div>
    </section>
  );
}
