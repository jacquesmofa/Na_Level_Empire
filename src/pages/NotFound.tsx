import { Link } from 'react-router-dom';

// Copy moves to src/content/pages/not-found.json in phase (b).
export default function NotFound() {
  return (
    <main className="min-h-screen pt-[76px] flex flex-col" style={{ background: '#2C2C2E', color: '#FDFCF0' }}>
      <div
        className="flex-1 px-6 md:px-20 py-24 relative overflow-hidden flex flex-col justify-center"
        style={{ background: 'linear-gradient(135deg, #2C2C2E 0%, #1e1e20 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(200,146,42,0.07) 0%, transparent 60%)' }} />
        <div
          aria-hidden="true"
          className="absolute right-6 md:right-20 bottom-0 leading-none pointer-events-none select-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(160px, 24vw, 360px)', color: 'rgba(200,146,42,0.06)' }}
        >
          404
        </div>
        <div
          className="flex items-center gap-3 mb-4 text-[#C8922A] text-[11px] font-bold tracking-[4px] uppercase relative z-10"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <span className="w-8 h-px bg-[#C8922A]" />Error 404
        </div>
        <h1
          className="leading-[0.95] relative z-10"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 6vw, 88px)', color: '#FDFCF0' }}
        >
          PAGE NOT <em className="not-italic" style={{ color: '#C8922A' }}>FOUND</em>
        </h1>
        <p className="text-[#FDFCF0]/60 text-[17px] leading-[1.7] max-w-[480px] mt-6 mb-10 font-light relative z-10">
          The page you&apos;re looking for has moved or no longer exists. Head back home, or tell us what you were looking for.
        </p>
        <div className="flex gap-4 flex-wrap relative z-10">
          <Link
            to="/"
            className="text-[12px] font-bold tracking-[2px] uppercase bg-[#C8922A] text-[#2C2C2E] px-8 py-4 no-underline transition-all duration-300 hover:bg-[#FDFCF0] hover:text-[#2C2C2E] hover:-translate-y-0.5 whitespace-nowrap shadow-[0_4px_24px_rgba(200,146,42,0.35)]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Back to Home
          </Link>
          <Link
            to="/contact"
            className="text-[12px] font-bold tracking-[2px] uppercase bg-transparent text-[#FDFCF0] border border-[#C8922A]/40 px-8 py-4 no-underline transition-all duration-300 hover:border-[#C8922A] hover:text-[#C8922A] hover:-translate-y-0.5 whitespace-nowrap"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
