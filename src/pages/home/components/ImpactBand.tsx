const stats = [
  { num: '$500K', label: 'Year 3 Revenue Target' },
  { num: '25%', label: 'Profit Reinvested' },
  { num: '8+', label: 'Community Hires Year 1' },
  { num: 'B Corp', label: 'Certification Pathway' },
];

export default function ImpactBand() {
  return (
    <div
      className="px-6 md:px-20 py-16 grid grid-cols-2 lg:grid-cols-4 gap-10 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #2C2C2E 0%, #1e1e20 100%)' }}
    >
      {/* Gold shimmer line top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C8922A, transparent)' }} />
      {/* Gold shimmer line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C8922A, transparent)' }} />
      {/* Subtle gold glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(200,146,42,0.07) 0%, transparent 70%)' }}
      />

      {stats.map((s) => (
        <div key={s.label} className="relative z-10">
          <div
            className="leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '64px', color: '#C8922A', textShadow: '0 0 30px rgba(200,146,42,0.3)' }}
          >
            {s.num}
          </div>
          <div
            className="text-[#FDFCF0]/60 text-xs tracking-[2px] uppercase mt-2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
