import type { ReactNode } from 'react';
import type { SectionOf } from '@/content';
import LocalizedLink from '@/components/ui/LocalizedLink';
import SectionLabel from '@/components/ui/SectionLabel';

const BUTTON_STYLES = [
  'bg-gold text-charcoal hover:bg-cream hover:text-charcoal shadow-[0_4px_24px_rgba(200,146,42,0.35)]',
  'bg-transparent text-cream border border-gold/40 hover:border-gold hover:text-gold',
];

/** `below` lets a following block (the projects filters) sit inside the header, as in the original design. */
export default function PageHeaderBlock({ block, below }: { block: SectionOf<'pageHeader'>; below?: ReactNode }) {
  const full = block.size === 'full';
  const buttons = block.buttons ?? [];

  return (
    <div
      className={
        full
          ? 'flex-1 px-6 md:px-20 py-24 relative overflow-hidden flex flex-col justify-center'
          : 'px-6 md:px-20 pt-20 pb-14 relative overflow-hidden'
      }
      style={{ background: 'linear-gradient(135deg, #2C2C2E 0%, #1e1e20 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(200,146,42,0.07) 0%, transparent 60%)' }} />
      {block.watermark && (
        <div
          aria-hidden="true"
          className="absolute right-6 md:right-20 bottom-0 leading-none pointer-events-none select-none font-display"
          style={{ fontSize: 'clamp(160px, 24vw, 360px)', color: 'rgba(200,146,42,0.06)' }}
        >
          {block.watermark}
        </div>
      )}
      <SectionLabel className="mb-4 relative z-10">{block.eyebrow}</SectionLabel>
      <h1 className="leading-[0.95] relative z-10 font-display text-cream" style={{ fontSize: 'clamp(52px, 6vw, 88px)' }}>
        {block.title}
        {block.titleAccent && (
          <>
            {' '}
            <em className="not-italic text-gold">{block.titleAccent}</em>
          </>
        )}
      </h1>
      {block.text && (
        <p className="text-cream/60 text-[17px] leading-[1.7] max-w-[480px] mt-6 mb-10 font-light relative z-10">{block.text}</p>
      )}
      {buttons.length > 0 && (
        <div className="flex gap-4 flex-wrap relative z-10">
          {buttons.map((b, i) => (
            <LocalizedLink
              key={b.link + i}
              to={b.link}
              className={`text-[12px] font-bold tracking-[2px] uppercase px-8 py-4 no-underline transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap font-heading ${BUTTON_STYLES[i % 2]}`}
            >
              {b.label}
            </LocalizedLink>
          ))}
        </div>
      )}
      {below}
    </div>
  );
}
