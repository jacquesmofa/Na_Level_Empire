import type { SectionOf } from '@/content';

export default function QuoteBlock({ block }: { block: SectionOf<'quote'> }) {
  const paragraphs = block.paragraphs ?? [];
  return (
    <div className={`px-6 md:px-20 py-12 grid grid-cols-1 gap-4 mb-4 ${paragraphs.length ? 'md:grid-cols-2' : ''}`}>
      {paragraphs.length > 0 && (
        <div className="p-14 rounded-sm bg-deep" style={{ border: '1px solid rgba(200,146,42,0.1)' }}>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[15px] leading-[1.85] mb-5 last:mb-0" style={{ color: 'rgba(253,252,240,0.6)' }}>
              {p}
            </p>
          ))}
        </div>
      )}
      <figure
        className="m-0 p-14 flex flex-col justify-end relative overflow-hidden min-h-[360px] rounded-sm"
        style={{ background: 'linear-gradient(135deg, #C8922A 0%, #a87520 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(44,44,46,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(44,44,46,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <blockquote className="m-0 relative z-10 leading-[1.1] font-display text-charcoal" style={{ fontSize: '36px' }}>
          {block.quote}
        </blockquote>
        {block.source && (
          <figcaption className="relative z-10 text-sm mt-4 tracking-[2px] uppercase" style={{ color: 'rgba(44,44,46,0.65)' }}>
            — {block.source}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
