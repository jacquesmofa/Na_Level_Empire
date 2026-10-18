import type { SectionOf } from '@/content';
import TargetTag from '@/components/ui/TargetTag';

const TILE_STYLES = [
  { bg: 'linear-gradient(135deg, #C8922A, #a87520)', text: '#2C2C2E', label: '#1A1A1C', tag: 'dark' as const },
  { bg: '#1e1e20', text: '#FDFCF0', label: 'rgba(253,252,240,0.55)', tag: 'gold' as const },
  { bg: 'linear-gradient(135deg, #2C2C2E, #1a1a1c)', text: '#C8922A', label: 'rgba(253,252,240,0.55)', tag: 'gold' as const },
];

export default function StatsBandBlock({ block, targetLabel }: { block: SectionOf<'statsBand'>; targetLabel: string }) {
  if (block.style === 'tiles') {
    return (
      <div className="px-6 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {block.stats.map((s, i) => {
          const t = TILE_STYLES[i % TILE_STYLES.length];
          return (
            <div key={s.label} className="p-10 rounded-sm" style={{ background: t.bg, border: '1px solid rgba(200,146,42,0.15)' }}>
              <div
                className="leading-none mb-2 font-display"
                style={{ fontSize: '64px', color: t.text, textShadow: t.text === '#C8922A' ? '0 0 30px rgba(200,146,42,0.3)' : 'none' }}
              >
                {s.value}
                {s.suffix}
              </div>
              <div className="text-xs tracking-[2px] uppercase font-heading" style={{ color: t.label }}>
                {s.label}
              </div>
              {s.kind === 'target' && <TargetTag label={targetLabel} tone={t.tag} />}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="px-6 md:px-20 py-16 grid grid-cols-2 lg:grid-cols-4 gap-10 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #2C2C2E 0%, #1e1e20 100%)' }}
    >
      {/* Gold shimmer lines and centre glow */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C8922A, transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C8922A, transparent)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(200,146,42,0.07) 0%, transparent 70%)' }} />

      {block.stats.map((s) => (
        <div key={s.label} className="relative z-10">
          <div className="leading-none font-display text-gold" style={{ fontSize: '64px', textShadow: '0 0 30px rgba(200,146,42,0.3)' }}>
            {s.value}
            {s.suffix}
          </div>
          <div className="text-cream/60 text-xs tracking-[2px] uppercase mt-2 font-heading">{s.label}</div>
          {s.kind === 'target' && <TargetTag label={targetLabel} />}
        </div>
      ))}
    </div>
  );
}
