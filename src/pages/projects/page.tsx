import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '@/mocks/nlem';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Current', value: 'current' },
  { label: 'Past', value: 'past' },
  { label: 'AV Production', value: 'av' },
  { label: 'Events', value: 'event' },
  { label: 'Live Streaming', value: 'stream' },
  { label: 'Documentary', value: 'doc' },
];

export default function Projects() {
  const [active, setActive] = useState('all');
  const navigate = useNavigate();

  const filtered = active === 'all' ? projects : projects.filter((p) => p.type === active || p.status === active);

  return (
    <main className="min-h-screen pt-[76px]" style={{ background: '#2C2C2E', color: '#FDFCF0' }}>
      {/* Header */}
      <div
        className="px-6 md:px-20 pt-20 pb-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2C2C2E 0%, #1e1e20 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(200,146,42,0.07) 0%, transparent 60%)' }} />
        <div
          className="flex items-center gap-3 mb-4 text-[#C8922A] text-[11px] font-bold tracking-[4px] uppercase relative z-10"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <span className="w-8 h-px bg-[#C8922A]" />
          Our Portfolio
        </div>
        <h1
          className="leading-[0.95] relative z-10"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 6vw, 88px)', color: '#FDFCF0' }}
        >
          PROJECTS &amp; <em className="not-italic" style={{ color: '#C8922A' }}>WORK</em>
        </h1>
        <div className="flex gap-2 flex-wrap mt-10 relative z-10">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`text-[11px] font-bold tracking-[2px] uppercase px-5 py-2.5 border-none cursor-pointer transition-all duration-200 whitespace-nowrap ${
                active === f.value
                  ? 'bg-[#C8922A] text-[#2C2C2E]'
                  : 'bg-[#FDFCF0]/[0.08] text-[#FDFCF0]/60 hover:bg-[#C8922A]/20 hover:text-[#C8922A]'
              }`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-20 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden rounded-sm"
            style={{ background: '#1e1e20', border: '1px solid rgba(200,146,42,0.1)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
            onClick={() => navigate('/contact')}
          >
            <div className="w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            {/* Gold top border on hover */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C8922A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10" />
            <div
              className={`absolute top-4 left-4 text-[10px] font-bold tracking-[2px] uppercase px-3 py-1.5 ${
                p.status === 'current'
                  ? 'bg-[#C8922A] text-[#2C2C2E]'
                  : 'bg-[#FDFCF0]/10 text-[#FDFCF0]/60'
              }`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {p.status === 'current' ? '● CURRENT' : 'COMPLETED'}
            </div>
            <div className="p-7">
              <div className="text-[#C8922A] text-[10px] font-bold tracking-[2px] uppercase mb-2.5" style={{ fontFamily: "'Syne', sans-serif" }}>{p.cat}</div>
              <div className="text-[#FDFCF0] text-lg font-bold mb-2.5 leading-[1.3]" style={{ fontFamily: "'Syne', sans-serif" }}>{p.title}</div>
              <div className="text-[#FDFCF0]/50 text-[13.5px] leading-[1.65] mb-5">{p.desc}</div>
              <div className="flex gap-2 flex-wrap border-t border-[#C8922A]/10 pt-5">
                {p.tags.map((t) => (
                  <span key={t} className="text-[11px] text-[#C8922A]/70 bg-[#C8922A]/[0.08] px-2.5 py-1 rounded-sm">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
