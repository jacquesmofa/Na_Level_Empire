export default function Impact() {
  return (
    <main className="min-h-screen pt-[76px]" style={{ background: '#2C2C2E', color: '#FDFCF0' }}>
      <div className="px-6 md:px-20 pt-20 pb-14 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2C2C2E 0%, #1e1e20 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(200,146,42,0.07) 0%, transparent 60%)' }} />
        <div className="flex items-center gap-3 mb-4 text-[#C8922A] text-[11px] font-bold tracking-[4px] uppercase relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>
          <span className="w-8 h-px bg-[#C8922A]" />Our Mission in Action
        </div>
        <h1 className="leading-[0.95] relative z-10" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 6vw, 88px)', color: '#FDFCF0' }}>
          SOCIAL <em className="not-italic" style={{ color: '#C8922A' }}>IMPACT</em>
        </h1>
      </div>

      <div className="px-6 md:px-20 py-12 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[
          { num: '01', icon: 'ri-stack-line', title: 'Skills That Last a Lifetime', body: 'Every production is a classroom. Our apprentice-based model trains youth in camera operation, sound engineering, lighting, editing, and live streaming — skills that translate directly into sustainable careers in Toronto\'s $2B+ media industry.' },
          { num: '02', icon: 'ri-team-line', title: 'Who We Hire First', body: 'We actively recruit from Toronto\'s underrepresented communities: newcomers and refugees, Indigenous youth, individuals with disabilities, and young people from low-income backgrounds. Our workforce reflects the city we serve.' },
          { num: '03', icon: 'ri-time-line', title: '25% Profit Reinvestment', body: 'A minimum of 25% of net profits is reinvested into our training programs, mental health support, equipment access for employees, and community partnerships — a commitment written into our corporate governance documents.' },
          { num: '04', icon: 'ri-home-4-line', title: 'B Corp Pathway', body: 'We are on a structured path to B Corp Certification by Year 3 — a globally recognized standard for businesses meeting the highest standards of social and environmental performance, transparency, and legal accountability.' },
        ].map((b) => (
          <div key={b.num} className="p-14 relative overflow-hidden rounded-sm" style={{ background: '#1e1e20', border: '1px solid rgba(200,146,42,0.1)' }}>
            <div className="absolute top-5 right-5 pointer-events-none select-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '96px', color: 'rgba(200,146,42,0.05)', lineHeight: '0.85' }}>{b.num}</div>
            <div className="w-12 h-12 flex items-center justify-center mb-7 rounded-sm" style={{ background: 'rgba(200,146,42,0.1)' }}>
              <i className={`${b.icon} text-[#C8922A] text-2xl`} />
            </div>
            <div className="text-[#FDFCF0] leading-none mb-5" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px' }}>{b.title}</div>
            <div className="text-[#FDFCF0]/55 text-sm leading-[1.75]">{b.body}</div>
          </div>
        ))}
      </div>

      <div className="px-6 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[
          { val: '8–12', label: 'Community Hires — Year 1 Target', bg: 'linear-gradient(135deg, #C8922A, #a87520)', textColor: '#2C2C2E', labelColor: 'rgba(44,44,46,0.65)' },
          { val: '1,200+', label: 'Training Hours Delivered Annually', bg: '#1e1e20', textColor: '#FDFCF0', labelColor: 'rgba(253,252,240,0.55)' },
          { val: '70%+', label: 'Employee Retention Rate Target', bg: 'linear-gradient(135deg, #2C2C2E, #1a1a1c)', textColor: '#C8922A', labelColor: 'rgba(253,252,240,0.55)' },
        ].map((m) => (
          <div key={m.label} className="p-10 rounded-sm" style={{ background: m.bg, border: '1px solid rgba(200,146,42,0.15)' }}>
            <div className="leading-none mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '64px', color: m.textColor, textShadow: m.textColor === '#C8922A' ? '0 0 30px rgba(200,146,42,0.3)' : 'none' }}>{m.val}</div>
            <div className="text-xs tracking-[2px] uppercase" style={{ fontFamily: "'Syne', sans-serif", color: m.labelColor }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div className="px-6 md:px-20 py-12 border-t flex flex-wrap items-center gap-4" style={{ borderColor: 'rgba(200,146,42,0.1)' }}>
        <div className="text-[#C8922A] text-[11px] font-bold tracking-[3px] uppercase flex-shrink-0" style={{ fontFamily: "'Syne', sans-serif" }}>Community Partners</div>
        {['George Brown College', 'Ontario Trillium Foundation', 'MaRS Discovery District', 'OMDC', 'BDC Social Enterprise', 'Toronto Metropolitan Univ.', 'Ontario Nonprofit Network'].map((p) => (
          <div key={p} className="text-[#FDFCF0]/55 text-xs font-semibold px-5 py-2.5 cursor-pointer transition-all duration-200 hover:text-[#C8922A]" style={{ border: '1px solid rgba(200,146,42,0.2)', fontFamily: "'Syne', sans-serif" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = '#C8922A'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(200,146,42,0.2)'; }}
          >{p}</div>
        ))}
      </div>
    </main>
  );
}
