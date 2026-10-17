import { Link } from 'react-router-dom';

const reelItems = [
  {
    cat: 'Documentary',
    title: 'Community Voices: Scarborough Rising',
    large: true,
    image: 'https://readdy.ai/api/search-image?query=cinematic%20documentary%20film%20Scarborough%20Toronto%20youth%20community%20storytelling%20dramatic%20lighting%20urban%20street%20photography&width=700&height=700&seq=reel_lg&orientation=squarish',
  },
  {
    cat: 'Live Event AV',
    title: 'Toronto Non-Profit Gala 2025',
    large: false,
    image: 'https://readdy.ai/api/search-image?query=nonprofit%20gala%20event%20professional%20stage%20lighting%20elegant%20ballroom%20Toronto%20AV%20production%20dramatic%20atmosphere&width=700&height=340&seq=reel_sm1&orientation=landscape',
  },
  {
    cat: 'Brand Film',
    title: 'Credit Union Impact Campaign',
    large: false,
    image: 'https://readdy.ai/api/search-image?query=corporate%20brand%20film%20production%20professional%20lighting%20director%20camera%20modern%20office%20cinematic%20dark%20background&width=700&height=340&seq=reel_sm2&orientation=landscape',
  },
];

export default function LatestWork() {
  return (
    <section
      className="px-6 md:px-20 py-24"
      style={{ background: '#FDFCF0' }}
    >
      <div
        className="flex items-center gap-3 mb-12 text-[#C8922A] text-[11px] font-bold tracking-[4px] uppercase"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        <span className="w-8 h-px bg-[#C8922A]" />
        Latest Work
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Large item */}
        <div
          className="group relative overflow-hidden cursor-pointer lg:row-span-2 min-h-[360px] rounded-sm"
          style={{ background: '#2C2C2E', boxShadow: '0 8px 40px rgba(44,44,46,0.15)' }}
        >
          <img
            src={reelItems[0].image}
            alt={reelItems[0].title}
            className="w-full h-full object-cover object-top absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2E]/90 via-[#2C2C2E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-start justify-end p-7">
            <div className="w-12 h-12 border border-[#C8922A] rounded-full flex items-center justify-center mb-4">
              <i className="ri-play-fill text-[#C8922A] text-lg ml-0.5" />
            </div>
            <div className="text-[#C8922A] text-[10px] font-bold tracking-[2px] uppercase mb-1.5" style={{ fontFamily: "'Syne', sans-serif" }}>
              {reelItems[0].cat}
            </div>
            <div className="text-[#FDFCF0] text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
              {reelItems[0].title}
            </div>
          </div>
          {/* Always-visible label at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#2C2C2E]/80 to-transparent group-hover:opacity-0 transition-opacity duration-300">
            <div className="text-[#C8922A] text-[10px] font-bold tracking-[2px] uppercase mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{reelItems[0].cat}</div>
            <div className="text-[#FDFCF0] text-base font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{reelItems[0].title}</div>
          </div>
        </div>

        {/* Small items */}
        {reelItems.slice(1).map((item) => (
          <div
            key={item.title}
            className="group relative overflow-hidden cursor-pointer rounded-sm"
            style={{ background: '#2C2C2E', aspectRatio: '16/9', boxShadow: '0 8px 40px rgba(44,44,46,0.15)' }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover object-top absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2E]/90 via-[#2C2C2E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-start justify-end p-7">
              <div className="w-10 h-10 border border-[#C8922A] rounded-full flex items-center justify-center mb-3">
                <i className="ri-play-fill text-[#C8922A] text-sm ml-0.5" />
              </div>
              <div className="text-[#C8922A] text-[10px] font-bold tracking-[2px] uppercase mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                {item.cat}
              </div>
              <div className="text-[#FDFCF0] text-base font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
                {item.title}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#2C2C2E]/80 to-transparent group-hover:opacity-0 transition-opacity duration-300">
              <div className="text-[#C8922A] text-[10px] font-bold tracking-[2px] uppercase mb-0.5" style={{ fontFamily: "'Syne', sans-serif" }}>{item.cat}</div>
              <div className="text-[#FDFCF0] text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{item.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          to="/projects"
          className="text-[12px] font-bold tracking-[2px] uppercase border border-[#C8922A]/40 text-[#2C2C2E] px-10 py-4 no-underline transition-all duration-300 hover:border-[#C8922A] hover:bg-[#C8922A] hover:text-[#2C2C2E] whitespace-nowrap"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          View All Projects
        </Link>
      </div>
    </section>
  );
}
