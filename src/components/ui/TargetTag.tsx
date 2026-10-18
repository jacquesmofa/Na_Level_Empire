/** Marks a number as a goal rather than a result ("Target" / "Objectif"). */
export default function TargetTag({ label, tone = 'gold' }: { label: string; tone?: 'gold' | 'dark' }) {
  const colors = tone === 'gold' ? 'border-gold/50 text-gold' : 'border-charcoal/40 text-charcoal/80';
  return (
    <span className={`inline-block mt-2 px-2 py-0.5 border text-[9px] font-bold tracking-[2px] uppercase font-heading ${colors}`}>
      {label}
    </span>
  );
}
