const services = [
  {
    icon: 'ri-camera-line',
    title: 'AV Production',
    desc: '4K video production, sound engineering, lighting design, and full post-production for any scale of project.',
    image: 'https://readdy.ai/api/search-image?query=professional%20videographer%20camera%20operator%20cinematic%20production%20dark%20studio%20dramatic%20lighting%20equipment%20setup&width=400&height=300&seq=svc1&orientation=landscape',
  },
  {
    icon: 'ri-live-line',
    title: 'Live Streaming',
    desc: 'Hybrid event broadcasting, YouTube Live, multilingual streams, and custom RTMP delivery for global audiences.',
    image: 'https://readdy.ai/api/search-image?query=live%20streaming%20broadcast%20setup%20monitors%20technical%20control%20room%20professional%20AV%20equipment%20dark%20environment&width=400&height=300&seq=svc2&orientation=landscape',
  },
  {
    icon: 'ri-team-line',
    title: 'Event Management',
    desc: 'End-to-end event planning: galas, conferences, community events, and corporate activations across the GTA.',
    image: 'https://readdy.ai/api/search-image?query=professional%20event%20management%20gala%20venue%20elegant%20stage%20lighting%20large%20audience%20production%20crew%20setup&width=400&height=300&seq=svc3&orientation=landscape',
  },
  {
    icon: 'ri-film-line',
    title: 'Community Stories',
    desc: 'Bespoke documentary shorts, impact reels, and multilingual content celebrating Toronto\'s diverse communities.',
    image: 'https://readdy.ai/api/search-image?query=documentary%20storytelling%20diverse%20community%20Toronto%20cinematic%20portrait%20interview%20professional%20lighting&width=400&height=300&seq=svc4&orientation=landscape',
  },
];

export default function ServicesStrip() {
  return (
    <section
      className="px-6 md:px-20 py-20 border-t border-[#C8922A]/10"
      style={{ background: '#FDFCF0' }}
    >
      <div
        className="flex items-center gap-3 mb-12 text-[#C8922A] text-[11px] font-bold tracking-[4px] uppercase"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        <span className="w-8 h-px bg-[#C8922A]" />
        What We Do
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((svc) => (
          <div
            key={svc.title}
            className="group bg-white border border-[#C8922A]/[0.12] hover:border-[#C8922A]/50 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden relative"
            style={{ boxShadow: '0 2px 16px rgba(44,44,46,0.06)' }}
          >
            {/* Image */}
            <div className="w-full h-40 overflow-hidden">
              <img
                src={svc.image}
                alt={svc.title}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            {/* Gold top accent on hover */}
            <div className="h-0.5 w-full bg-[#C8922A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="p-7 relative z-10">
              <div
                className="w-11 h-11 mb-5 flex items-center justify-center rounded-sm"
                style={{ background: 'rgba(200,146,42,0.1)' }}
              >
                <i className={`${svc.icon} text-[#C8922A] text-xl`} />
              </div>
              <div
                className="text-[#2C2C2E] text-base font-bold mb-3"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {svc.title}
              </div>
              <div className="text-[#2C2C2E]/60 text-[13.5px] leading-[1.65]">{svc.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
