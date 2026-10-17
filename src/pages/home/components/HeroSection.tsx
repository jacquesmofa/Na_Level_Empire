import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const reelImages = [
  'https://readdy.ai/api/search-image?query=professional%20film%20crew%20diverse%20team%20shooting%20documentary%20cinematic%20camera%20rig%20dramatic%20lighting%20urban%20Toronto%20production%20day&width=640&height=360&seq=reel1&orientation=landscape',
  'https://readdy.ai/api/search-image?query=live%20event%20soundboard%20audio%20engineer%20mixing%20console%20dramatic%20stage%20lighting%20concert%20production%20dark%20atmosphere&width=640&height=360&seq=reel2&orientation=landscape',
  'https://readdy.ai/api/search-image?query=aerial%20view%20media%20empire%20Toronto%20skyline%20cinematic%20drone%20shot%20golden%20hour%20city%20lights%20dramatic&width=640&height=360&seq=reel3&orientation=landscape',
  'https://readdy.ai/api/search-image?query=videographer%20on%20set%20professional%20camera%20operator%20cinematic%20lighting%20film%20production%20dark%20studio&width=640&height=360&seq=reel4&orientation=landscape',
  'https://readdy.ai/api/search-image?query=gala%20event%20production%20elegant%20stage%20lighting%20large%20venue%20professional%20AV%20setup%20dramatic%20atmosphere&width=640&height=360&seq=reel5&orientation=landscape',
  'https://readdy.ai/api/search-image?query=diverse%20media%20production%20team%20collaboration%20modern%20studio%20creative%20professionals%20Toronto%20cinematic&width=640&height=360&seq=reel6&orientation=landscape',
];

export default function HeroSection() {
  const reelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reelRef.current) return;
    const items = [...reelImages, ...reelImages];
    reelRef.current.innerHTML = items
      .map(
        (src) =>
          `<div style="width:100%;aspect-ratio:16/9;overflow:hidden;"><img src="${src}" alt="Production reel" style="width:100%;height:100%;object-fit:cover;object-position:top;" loading="lazy" /></div>`
      )
      .join('');
  }, []);

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
        <div
          className="flex items-center gap-3 mb-7 text-[#C8922A] text-[11px] font-bold tracking-[4px] uppercase"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <span className="w-8 h-px bg-[#C8922A]" />
          Toronto&apos;s AV Social Enterprise
        </div>

        <h1
          className="leading-[0.92] mb-8"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(72px, 7vw, 112px)',
            letterSpacing: '1px',
            color: '#FDFCF0',
          }}
        >
          WHERE<br />VISION<br />MEETS<br />
          <em className="not-italic" style={{ color: '#C8922A', textShadow: '0 0 40px rgba(200,146,42,0.4)' }}>IMPACT</em>
        </h1>

        <p className="text-[#FDFCF0]/60 text-[17px] leading-[1.7] max-w-[440px] mb-12 font-light">
          Cinematic-grade audiovisual production and event management — powered by a workforce built from Toronto&apos;s most vibrant communities.
        </p>

        <div className="flex gap-4 flex-wrap">
          <Link
            to="/projects"
            className="text-[12px] font-bold tracking-[2px] uppercase bg-[#C8922A] text-[#2C2C2E] px-8 py-4 no-underline transition-all duration-300 hover:bg-[#FDFCF0] hover:text-[#2C2C2E] hover:-translate-y-0.5 whitespace-nowrap shadow-[0_4px_24px_rgba(200,146,42,0.35)]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            View Our Work
          </Link>
          <Link
            to="/contact"
            className="text-[12px] font-bold tracking-[2px] uppercase bg-transparent text-[#FDFCF0] border border-[#C8922A]/40 px-8 py-4 no-underline transition-all duration-300 hover:border-[#C8922A] hover:text-[#C8922A] hover:-translate-y-0.5 whitespace-nowrap"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Start a Project
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-10 mt-16 pt-10 border-t border-[#C8922A]/15 flex-wrap">
          {[
            { num: '100', suffix: '+', label: 'Events Produced' },
            { num: '50', suffix: '+', label: 'Lives Impacted' },
            { num: '12', suffix: 'K', label: 'Training Hours' },
          ].map((s) => (
            <div key={s.label}>
              <div
                className="leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', color: '#FDFCF0' }}
              >
                {s.num}
                <span style={{ color: '#C8922A' }}>{s.suffix}</span>
              </div>
              <div className="text-[#FDFCF0]/45 text-[11px] uppercase tracking-[2px] mt-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — reel */}
      <div className="hidden lg:flex relative items-center justify-center overflow-hidden" style={{ background: '#1a1a1c' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div
            ref={reelRef}
            className="flex flex-col gap-0"
            style={{ animation: 'reelScroll 18s linear infinite' }}
          />
        </div>
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(to right, #2C2C2E 0%, transparent 30%)' }}
        />
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
