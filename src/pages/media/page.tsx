import { ytVideos } from '@/mocks/nlem';

export default function Media() {
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
          Video Content
        </div>
        <h1
          className="leading-[0.95] relative z-10"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 6vw, 88px)', color: '#FDFCF0' }}
        >
          MEDIA <em className="not-italic" style={{ color: '#C8922A' }}>HUB</em>
        </h1>
      </div>

      <div className="px-6 md:px-20 pb-20 pt-10">
        {/* Channel info */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10 p-7 relative overflow-hidden"
          style={{ background: '#1e1e20', borderLeft: '3px solid #C8922A', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #C8922A, #a87520)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#FDFCF0' }}
          >
            NL
          </div>
          <div>
            <div className="text-[#FDFCF0] text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Na Level Empire Media</div>
            <div className="text-[#FDFCF0]/50 text-sm mt-1">@nalevelempiremedia &nbsp;·&nbsp; Toronto, Ontario &nbsp;·&nbsp; Audiovisual Production &amp; Social Enterprise</div>
          </div>
          <a
            href="https://www.youtube.com/@nalevelempiremedia"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:ml-auto text-[12px] font-bold tracking-[1px] uppercase px-7 py-3 no-underline transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
            style={{ background: '#C8922A', color: '#2C2C2E', fontFamily: "'Syne', sans-serif", boxShadow: '0 4px 20px rgba(200,146,42,0.3)' }}
          >
            Subscribe on YouTube
          </a>
        </div>

        {/* Featured video */}
        <div
          className="w-full mb-10 overflow-hidden"
          style={{ aspectRatio: '16/9', background: '#1e1e20', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}
        >
          <iframe
            src="https://www.youtube.com/embed?listType=user_uploads&list=nalevelempiremedia"
            title="Na Level Empire Media — Latest Video"
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* Grid label */}
        <div
          className="flex items-center gap-3 mb-6 text-[#C8922A] text-[11px] font-bold tracking-[4px] uppercase"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <span className="w-8 h-px bg-[#C8922A]" />
          Recent Videos
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ytVideos.map((v) => (
            <a
              key={v.id}
              href="https://www.youtube.com/@nalevelempiremedia"
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1.5 no-underline block rounded-sm"
              style={{ background: '#1e1e20', border: '1px solid rgba(200,146,42,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src={v.image}
                  alt={v.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(200,146,42,0.9)' }}
                  >
                    <i className="ri-play-fill text-[#2C2C2E] text-sm ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-[#2C2C2E]/90 text-[#FDFCF0] text-[11px] px-1.5 py-0.5 font-medium">{v.dur}</div>
              </div>
              <div className="p-4">
                <div className="text-[#FDFCF0] text-[13px] font-semibold leading-[1.4] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{v.title}</div>
                <div className="text-[#FDFCF0]/45 text-xs">{v.views} · {v.time}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
