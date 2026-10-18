import type { SectionOf } from '@/content';
import CmsImage from '@/components/ui/CmsImage';
import Icon from '@/components/ui/Icon';
import LocalizedLink from '@/components/ui/LocalizedLink';
import SectionLabel from '@/components/ui/SectionLabel';

export default function LatestWorkBlock({ block }: { block: SectionOf<'latestWork'> }) {
  const [large, ...small] = block.items;
  const heading = 'font-heading';

  return (
    <section className="px-6 md:px-20 py-24 bg-cream">
      <SectionLabel>{block.label}</SectionLabel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Large item */}
        <LocalizedLink
          to={large.link ?? '/projects'}
          className="group block no-underline relative overflow-hidden cursor-pointer lg:row-span-2 min-h-[360px] rounded-sm bg-charcoal"
          style={{ boxShadow: '0 8px 40px rgba(44,44,46,0.15)' }}
        >
          <CmsImage
            image={large.image}
            className="w-full h-full object-cover object-top absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-start justify-end p-7">
            <div className="w-12 h-12 border border-gold rounded-full flex items-center justify-center mb-4">
              <Icon name="play" className="text-gold text-lg ml-0.5" />
            </div>
            <div className={`text-gold text-[10px] font-bold tracking-[2px] uppercase mb-1.5 ${heading}`}>{large.category}</div>
            <div className={`text-cream text-lg font-bold ${heading}`}>{large.title}</div>
          </div>
          {/* Always-visible label at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-charcoal/80 to-transparent group-hover:opacity-0 transition-opacity duration-300">
            <div className={`text-gold text-[10px] font-bold tracking-[2px] uppercase mb-1 ${heading}`}>{large.category}</div>
            <div className={`text-cream text-base font-bold ${heading}`}>{large.title}</div>
          </div>
        </LocalizedLink>

        {/* Small items */}
        {small.map((item) => (
          <LocalizedLink
            key={item.title}
            to={item.link ?? '/projects'}
            className="group block no-underline relative overflow-hidden cursor-pointer rounded-sm bg-charcoal"
            style={{ aspectRatio: '16/9', boxShadow: '0 8px 40px rgba(44,44,46,0.15)' }}
          >
            <CmsImage
              image={item.image}
              className="w-full h-full object-cover object-top absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-start justify-end p-7">
              <div className="w-10 h-10 border border-gold rounded-full flex items-center justify-center mb-3">
                <Icon name="play" className="text-gold text-sm ml-0.5" />
              </div>
              <div className={`text-gold text-[10px] font-bold tracking-[2px] uppercase mb-1 ${heading}`}>{item.category}</div>
              <div className={`text-cream text-base font-bold ${heading}`}>{item.title}</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal/80 to-transparent group-hover:opacity-0 transition-opacity duration-300">
              <div className={`text-gold text-[10px] font-bold tracking-[2px] uppercase mb-0.5 ${heading}`}>{item.category}</div>
              <div className={`text-cream text-sm font-bold ${heading}`}>{item.title}</div>
            </div>
          </LocalizedLink>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <LocalizedLink
          to={block.button.link}
          className={`text-[12px] font-bold tracking-[2px] uppercase border border-gold/40 text-charcoal px-10 py-4 no-underline transition-all duration-300 hover:border-gold hover:bg-gold hover:text-charcoal whitespace-nowrap ${heading}`}
        >
          {block.button.label}
        </LocalizedLink>
      </div>
    </section>
  );
}
