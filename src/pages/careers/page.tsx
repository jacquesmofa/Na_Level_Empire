import { useNavigate } from 'react-router-dom';
import { jobs } from '@/mocks/nlem';

export default function Careers() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen pt-[76px]" style={{ background: '#2C2C2E', color: '#FDFCF0' }}>
      <div className="px-6 md:px-20 pt-20 pb-14 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2C2C2E 0%, #1e1e20 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(200,146,42,0.07) 0%, transparent 60%)' }} />
        <div className="flex items-center gap-3 mb-4 text-[#C8922A] text-[11px] font-bold tracking-[4px] uppercase relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>
          <span className="w-8 h-px bg-[#C8922A]" />Join the Empire
        </div>
        <h1 className="leading-[0.95] relative z-10" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 6vw, 88px)', color: '#FDFCF0' }}>
          CAREERS &amp; <em className="not-italic" style={{ color: '#C8922A' }}>TRAINING</em>
        </h1>
      </div>

      <div className="px-6 md:px-20 py-12 max-w-2xl">
        <p className="text-[#FDFCF0]/60 text-base leading-[1.8] mb-5">We don't just hire talent — we build it. Every role at Na Level Empire Media comes with mentorship, professional development, and the knowledge that your work is creating real change in Toronto's communities.</p>
        <p className="text-[#FDFCF0]/60 text-base leading-[1.8]">Whether you're an experienced AV professional or someone taking their first step into the industry, there's a place for you here.</p>
      </div>

      <div className="px-6 md:px-20 pb-16 flex flex-col gap-3">
        {jobs.map((j) => (
          <div key={j.id} className="px-9 py-8 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6 cursor-pointer transition-all duration-200 rounded-sm" style={{ background: '#1e1e20', border: '1px solid rgba(200,146,42,0.1)', borderLeft: '3px solid transparent' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = '#C8922A'; (e.currentTarget as HTMLDivElement).style.background = '#252527'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'transparent'; (e.currentTarget as HTMLDivElement).style.background = '#1e1e20'; }}
          >
            <div>
              <div className="text-[#FDFCF0] text-lg font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>{j.title}</div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[11px] px-2.5 py-1 font-semibold tracking-[1px] uppercase" style={{ background: 'rgba(200,146,42,0.12)', color: '#C8922A', fontFamily: "'Syne', sans-serif" }}>{j.type}</span>
                <span className="text-[11px] px-2.5 py-1 font-semibold tracking-[1px] uppercase" style={{ background: 'rgba(200,146,42,0.06)', color: 'rgba(200,146,42,0.7)', fontFamily: "'Syne', sans-serif" }}>{j.dept}</span>
                <span className="text-[11px] px-2.5 py-1 font-semibold tracking-[1px] uppercase" style={{ background: 'rgba(253,252,240,0.05)', color: 'rgba(253,252,240,0.45)', fontFamily: "'Syne', sans-serif" }}>{j.loc}</span>
              </div>
            </div>
            <button onClick={() => navigate('/contact')} className="text-[11px] font-bold tracking-[2px] uppercase px-6 py-3 cursor-pointer transition-all duration-200 whitespace-nowrap" style={{ background: 'transparent', color: '#C8922A', border: '1px solid rgba(200,146,42,0.4)', fontFamily: "'Syne', sans-serif" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#C8922A'; (e.currentTarget as HTMLButtonElement).style.color = '#2C2C2E'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#C8922A'; }}
            >Apply Now</button>
          </div>
        ))}
      </div>

      <div className="px-6 md:px-20 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" style={{ background: '#1e1e20', borderTop: '1px solid rgba(200,146,42,0.1)' }}>
        {[
          { icon: 'ri-stack-line', title: 'Paid Training', desc: 'Structured on-the-job training with experienced mentors from Day 1. No experience left behind.' },
          { icon: 'ri-time-line', title: 'Flexible Hours', desc: 'We understand life is complicated. We work with you to build schedules that work.' },
          { icon: 'ri-team-line', title: 'Community', desc: 'Join a team that looks like Toronto — diverse, creative, motivated, and rooted in purpose.' },
          { icon: 'ri-line-chart-line', title: 'Career Growth', desc: 'Clear progression paths from apprentice to lead — and access to external certifications funded by NLEM.' },
        ].map((p) => (
          <div key={p.title} className="flex flex-col gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-sm" style={{ background: 'rgba(200,146,42,0.1)' }}>
              <i className={`${p.icon} text-[#C8922A] text-xl`} />
            </div>
            <div className="text-[#FDFCF0] text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{p.title}</div>
            <div className="text-[#FDFCF0]/50 text-[13px] leading-[1.6]">{p.desc}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
