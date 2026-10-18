import type { SectionOf } from '@/content';
import CmsImage from '@/components/ui/CmsImage';
import LocalizedLink from '@/components/ui/LocalizedLink';

const BUTTON_STYLES = [
  'bg-gold text-charcoal hover:bg-cream hover:text-charcoal shadow-[0_4px_24px_rgba(200,146,42,0.35)]',
  'bg-transparent text-cream border border-gold/40 hover:border-gold hover:text-gold',
];

export default function HeroBlock({ block }: { block: SectionOf<'hero'> }) {
  // The reel scrolls through the images twice so the loop is seamless.
  const reel = [...block.reel, ...block.reel];

  return (
    <section
      className="min-h-[calc(100vh-76px)] grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #2C2C2E 0%, #1e1e20 60%, #252527 100%)' }}
    >
      {/* Subtle grid bg */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(200,146,42,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,42,0.6) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Gold glow top-left */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 0% 0%, rgba(200,146,42,0.08) 0%, transparent 70%)' }}
      />

      {/* Left */}
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-20 relative z-10 animate-fadeUp">
        <div className="flex items-center gap-3 mb-7 text-gold text-[11px] font-bold tracking-[4px] uppercase font-heading">
          <span className="w-8 h-px bg-gold" />
          {block.eyebrow}
        </div>

        <h1
          className="leading-[0.92] mb-8 font-display text-cream"
          style={{ fontSize: 'clamp(72px, 7vw, 112px)', letterSpacing: '1px' }}
        >
          {block.headlineLines.map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
          <em className="not-italic text-gold" style={{ textShadow: '0 0 40px rgba(200,146,42,0.4)' }}>
            {block.headlineAccent}
          </em>
        </h1>

        <p className="text-cream/60 text-[17px] leading-[1.7] max-w-[440px] mb-12 font-light">{block.intro}</p>

        <div className="flex gap-4 flex-wrap">
          {block.buttons.map((b, i) => (
            <LocalizedLink
              key={b.link + i}
              to={b.link}
              className={`text-[12px] font-bold tracking-[2px] uppercase px-8 py-4 no-underline transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap font-heading ${BUTTON_STYLES[i % 2]}`}
            >
              {b.label}
            </LocalizedLink>
          ))}
        </div>

        {block.stats.length > 0 && (
          <div className="flex gap-10 mt-16 pt-10 border-t border-gold/15 flex-wrap">
            {block.stats.map((s) => (
              <div key={s.label}>
                <div className="leading-none font-display text-cream" style={{ fontSize: '40px' }}>
                  {s.value}
                  {s.suffix && <span className="text-gold">{s.suffix}</span>}
                </div>
                <div className="text-cream/45 text-[11px] uppercase tracking-[2px] mt-1 font-heading">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right — reel */}
      <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-night">
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex flex-col gap-0" style={{ animation: 'reelScroll 18s linear infinite' }}>
            {reel.map((image, i) => (
              <div key={i} style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }} aria-hidden={i >= block.reel.length}>
                <CmsImage
                  image={i >= block.reel.length ? { ...image, alt: '' } : image}
                  width={640}
                  height={360}
                  sizes="50vw"
                  widths={[640, 960, 1280]}
                  priority={i === 0}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, #2C2C2E 0%, transparent 30%)' }} />
        {/* Gold bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 z-20" style={{ background: 'linear-gradient(180deg, transparent, #C8922A, transparent)' }} />
        {/* Gold shimmer overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(200,146,42,0.04) 0%, transparent 50%, rgba(200,146,42,0.04) 100%)' }}
        />
      </div>

      <style>{`
        @keyframes reelScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.7s ease both; }
      `}</style>
    </section>
  );
}
