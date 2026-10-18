import type { SectionOf } from '@/content';
import CmsImage from '@/components/ui/CmsImage';
import SectionLabel from '@/components/ui/SectionLabel';

export default function GalleryBlock({ block }: { block: SectionOf<'gallery'> }) {
  return (
    <section className={`px-6 md:px-20 py-20 ${block.background === 'light' ? 'bg-cream' : 'bg-charcoal'}`}>
      {block.label && <SectionLabel>{block.label}</SectionLabel>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {block.images.map((image, i) => (
          <div key={image.url + i} className="group overflow-hidden rounded-sm bg-deep" style={{ aspectRatio: '1' }}>
            <CmsImage image={image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        ))}
      </div>
    </section>
  );
}
