import { teamMembers } from '@/mocks/nlem';

export default function About() {
  return (
    <main className="min-h-screen pt-[76px]" style={{ background: '#2C2C2E', color: '#FDFCF0' }}>
      <div className="px-6 md:px-20 pt-20 pb-14 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2C2C2E 0%, #1e1e20 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(200,146,42,0.07) 0%, transparent 60%)' }} />
        <div className="flex items-center gap-3 mb-4 text-[#C8922A] text-[11px] font-bold tracking-[4px] uppercase relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>
          <span className="w-8 h-px bg-[#C8922A]" />Our Story
        </div>
        <h1 className="leading-[0.95] relative z-10" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 6vw, 88px)', color: '#FDFCF0' }}>
          ABOUT <em className="not-italic" style={{ color: '#C8922A' }}>NLEM</em>
        </h1>
      </div>

      <div className="px-6 md:px-20 py-12 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-14 rounded-sm" style={{ background: '#1e1e20', border: '1px solid rgba(200,146,42,0.1)' }}>
          {['Na Level Empire Media was founded on a single conviction: that extraordinary audiovisual production and genuine community empowerment are not competing goals — they are the same goal, pursued at the same time.',
            'We are a Toronto-based audiovisual production and event management social enterprise, incorporated under Ontario law, operating at the intersection of creative excellence and social accountability.',
            "What makes us different isn't just what we produce — it's who produces it. Our workforce is deliberately drawn from communities that have historically been shut out of Canada's creative industries: newcomers, Indigenous youth, individuals with disabilities, and young people from low-income backgrounds.",
            'Every client who works with NLEM gets world-class production. And every project we complete advances a workforce that is stronger, more skilled, and more connected to the industry they deserve to lead.'
          ].map((p, i) => <p key={i} className="text-[15px] leading-[1.85] mb-5 last:mb-0" style={{ color: 'rgba(253,252,240,0.6)' }}>{p}</p>)}
        </div>
        <div className="p-14 flex flex-col justify-end relative overflow-hidden min-h-[360px] rounded-sm" style={{ background: 'linear-gradient(135deg, #C8922A 0%, #a87520 100%)' }}>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(44,44,46,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(44,44,46,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative z-10 leading-[1.1]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: '#2C2C2E' }}>"We don't just tell stories. We build the people who tell them."</div>
          <div className="relative z-10 text-sm mt-4 tracking-[2px] uppercase" style={{ color: 'rgba(44,44,46,0.65)' }}>— Na Level Empire Media Founding Charter</div>
        </div>
      </div>

      <div className="px-6 md:px-20 py-12">
        <div className="flex items-center gap-3 mb-10 text-[#C8922A] text-[11px] font-bold tracking-[4px] uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>
          <span className="w-8 h-px bg-[#C8922A]" />Leadership
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((m) => (
            <div key={m.initials} className="group overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1.5 rounded-sm" style={{ background: '#1e1e20', border: '1px solid rgba(200,146,42,0.1)' }}>
              <div className="overflow-hidden" style={{ aspectRatio: '3/4' }}>
                <img src={m.image} alt={m.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-5" style={{ borderTop: '2px solid #C8922A' }}>
                <div className="text-[#FDFCF0] text-base font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{m.name}</div>
                <div className="text-[#C8922A] text-xs tracking-[1px] uppercase mt-1">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-20 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ background: '#1e1e20', borderTop: '1px solid rgba(200,146,42,0.1)' }}>
        {[
          { title: 'Impact', body: 'We measure success in two currencies: client satisfaction and community transformation. Both matter equally.' },
          { title: 'Excellence', body: "Social enterprise doesn't mean second-best. We deliver production quality that competes with any studio in Canada." },
          { title: 'Inclusion', body: "A team built from Toronto's diversity creates content that is richer, more authentic, and more culturally resonant." },
          { title: 'Transparency', body: 'We publish our annual Social Impact Report. Stakeholders deserve to see exactly where our profits go.' },
          { title: 'Sustainability', body: 'Financial sustainability and environmental responsibility are both embedded in our Ontario corporate governance.' },
          { title: 'Collaboration', body: 'Our best work happens in partnership — with clients, community organizations, colleges, and the city we love.' },
        ].map((v) => (
          <div key={v.title} className="pt-6" style={{ borderTop: '2px solid #C8922A' }}>
            <div className="text-[#FDFCF0] text-base font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>{v.title}</div>
            <div className="text-[13.5px] leading-[1.65]" style={{ color: 'rgba(253,252,240,0.55)' }}>{v.body}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
