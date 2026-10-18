import type { CSSProperties, ReactNode } from 'react';
import type { SectionOf } from '@/content';
import CmsImage from '@/components/ui/CmsImage';
import Icon from '@/components/ui/Icon';
import LocalizedLink from '@/components/ui/LocalizedLink';
import SectionLabel from '@/components/ui/SectionLabel';

type Card = SectionOf<'cardGrid'>['cards'][number];

/** Wraps a card in a link when the editor gave it one. */
function CardShell({ card, className, style, children }: { card: Card; className: string; style?: CSSProperties; children: ReactNode }) {
  return card.link ? (
    <LocalizedLink to={card.link} className={`block no-underline ${className}`} style={style}>
      {children}
    </LocalizedLink>
  ) : (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

export default function CardGridBlock({ block }: { block: SectionOf<'cardGrid'> }) {
  switch (block.style) {
    case 'services':
      return (
        <section className="px-6 md:px-20 py-20 border-t border-gold/10 bg-cream">
          {block.label && <SectionLabel>{block.label}</SectionLabel>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {block.cards.map((card) => (
              <CardShell
                key={card.title}
                card={card}
                className="group bg-white border border-gold/[0.12] hover:border-gold/50 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden relative"
                style={{ boxShadow: '0 2px 16px rgba(44,44,46,0.06)' }}
              >
                {card.image && (
                  <div className="w-full h-40 overflow-hidden">
                    <CmsImage
                      image={card.image}
                      width={400}
                      height={300}
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                {/* Gold top accent on hover */}
                <div className="h-0.5 w-full bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="p-7 relative z-10">
                  {card.icon && (
                    <div className="w-11 h-11 mb-5 flex items-center justify-center rounded-sm" style={{ background: 'rgba(200,146,42,0.1)' }}>
                      <Icon name={card.icon} className="text-gold text-xl" />
                    </div>
                  )}
                  <div className="text-charcoal text-base font-bold mb-3 font-heading">{card.title}</div>
                  <div className="text-charcoal/60 text-[13.5px] leading-[1.65]">{card.text}</div>
                </div>
              </CardShell>
            ))}
          </div>
        </section>
      );

    case 'pillars':
      return (
        <div className="px-6 md:px-20 py-12 mb-4">
          {block.label && <SectionLabel className="mb-10">{block.label}</SectionLabel>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {block.cards.map((card, i) => (
              <CardShell
                key={card.title}
                card={card}
                className="p-14 relative overflow-hidden rounded-sm bg-deep"
                style={{ border: '1px solid rgba(200,146,42,0.1)' }}
              >
                <div
                  aria-hidden="true"
                  className="absolute top-5 right-5 pointer-events-none select-none font-display"
                  style={{ fontSize: '96px', color: 'rgba(200,146,42,0.05)', lineHeight: '0.85' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                {card.icon && (
                  <div className="w-12 h-12 flex items-center justify-center mb-7 rounded-sm" style={{ background: 'rgba(200,146,42,0.1)' }}>
                    <Icon name={card.icon} className="text-gold text-2xl" />
                  </div>
                )}
                <div className="text-cream leading-none mb-5 font-display" style={{ fontSize: '40px' }}>
                  {card.title}
                </div>
                <div className="text-cream/55 text-sm leading-[1.75]">{card.text}</div>
              </CardShell>
            ))}
          </div>
        </div>
      );

    case 'perks':
      return (
        <div className="px-6 md:px-20 py-16 bg-deep" style={{ borderTop: '1px solid rgba(200,146,42,0.1)' }}>
          {block.label && <SectionLabel className="mb-10">{block.label}</SectionLabel>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {block.cards.map((card) => (
              <CardShell key={card.title} card={card} className="flex flex-col gap-3">
                {card.icon && (
                  <div className="w-10 h-10 flex items-center justify-center rounded-sm" style={{ background: 'rgba(200,146,42,0.1)' }}>
                    <Icon name={card.icon} className="text-gold text-xl" />
                  </div>
                )}
                <div className="text-cream text-sm font-bold font-heading">{card.title}</div>
                <div className="text-cream/50 text-[13px] leading-[1.6]">{card.text}</div>
              </CardShell>
            ))}
          </div>
        </div>
      );

    case 'values':
      return (
        <div className="px-6 md:px-20 py-16 bg-deep" style={{ borderTop: '1px solid rgba(200,146,42,0.1)' }}>
          {block.label && <SectionLabel className="mb-10">{block.label}</SectionLabel>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {block.cards.map((card) => (
              <CardShell key={card.title} card={card} className="pt-6" style={{ borderTop: '2px solid #C8922A' }}>
                <div className="text-cream text-base font-bold mb-3 font-heading">{card.title}</div>
                <div className="text-[13.5px] leading-[1.65]" style={{ color: 'rgba(253,252,240,0.55)' }}>
                  {card.text}
                </div>
              </CardShell>
            ))}
          </div>
        </div>
      );
  }
}
