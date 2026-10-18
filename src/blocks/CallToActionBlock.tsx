import type { SectionOf } from '@/content';
import LocalizedLink from '@/components/ui/LocalizedLink';

export default function CallToActionBlock({ block }: { block: SectionOf<'callToAction'> }) {
  const gold = block.style !== 'dark';
  return (
    <div className="px-6 md:px-20 py-12">
      <div
        className="p-10 md:p-14 rounded-sm relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8"
        style={{ background: gold ? 'linear-gradient(135deg, #C8922A 0%, #a87520 100%)' : '#1e1e20', border: '1px solid rgba(200,146,42,0.15)' }}
      >
        <div className="relative z-10 max-w-2xl">
          <div className={`leading-none mb-4 font-display ${gold ? 'text-charcoal' : 'text-cream'}`} style={{ fontSize: '40px' }}>
            {block.title}
          </div>
          {block.text && <p className={`text-sm leading-[1.8] ${gold ? 'text-night' : 'text-cream/60'}`}>{block.text}</p>}
        </div>
        <div className="flex gap-4 flex-wrap relative z-10">
          {block.buttons.map((b, i) => (
            <LocalizedLink
              key={b.link + i}
              to={b.link}
              className={`text-[12px] font-bold tracking-[2px] uppercase px-8 py-4 no-underline transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap font-heading ${
                i === 0
                  ? gold
                    ? 'bg-charcoal text-cream hover:bg-deep'
                    : 'bg-gold text-charcoal hover:bg-cream'
                  : gold
                    ? 'border border-charcoal/40 text-charcoal hover:border-charcoal'
                    : 'border border-gold/40 text-cream hover:border-gold hover:text-gold'
              }`}
            >
              {b.label}
            </LocalizedLink>
          ))}
        </div>
      </div>
    </div>
  );
}
