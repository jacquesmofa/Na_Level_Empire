import type { SectionOf } from '@/content';
import CmsImage from '@/components/ui/CmsImage';
import LocalizedLink from '@/components/ui/LocalizedLink';
import SectionLabel from '@/components/ui/SectionLabel';

export default function TextImageBlock({ block }: { block: SectionOf<'textImage'> }) {
  const light = block.background === 'light';
  const imageLeft = block.imageSide === 'left';
  return (
    <section className={`px-6 md:px-20 py-20 ${light ? 'bg-cream' : 'bg-charcoal'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className={imageLeft ? 'lg:order-2' : ''}>
          {block.label && <SectionLabel className="mb-6">{block.label}</SectionLabel>}
          <h2 className={`leading-none mb-6 font-display ${light ? 'text-charcoal' : 'text-cream'}`} style={{ fontSize: 'clamp(36px, 4vw, 52px)' }}>
            {block.title}
          </h2>
          {block.paragraphs.map((p, i) => (
            <p key={i} className={`text-[15px] leading-[1.85] mb-5 last:mb-0 ${light ? 'text-charcoal/70' : 'text-cream/60'}`}>
              {p}
            </p>
          ))}
          {block.button && (
            <LocalizedLink
              to={block.button.link}
              className="inline-block mt-8 text-[12px] font-bold tracking-[2px] uppercase bg-gold text-charcoal px-8 py-4 no-underline transition-all duration-300 hover:bg-cream hover:-translate-y-0.5 font-heading"
            >
              {block.button.label}
            </LocalizedLink>
          )}
        </div>
        <div className={`overflow-hidden rounded-sm ${imageLeft ? 'lg:order-1' : ''}`} style={{ aspectRatio: '4/3', boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}>
          <CmsImage image={block.image} width={800} height={600} sizes="(min-width: 1024px) 45vw, 100vw" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}
