import type { ReactNode } from 'react';

/** Small gold label with a leading rule ("— WHAT WE DO"). */
type Props = { children: ReactNode; className?: string; onLight?: boolean };

/** On cream/white sections the label uses the deeper "gold ink" so small text stays readable (WCAG AA). */
export default function SectionLabel({ children, className = 'mb-12', onLight = false }: Props) {
  return (
    <div className={`flex items-center gap-3 ${onLight ? 'text-gold-ink' : 'text-gold'} text-[11px] font-bold tracking-[4px] uppercase font-heading ${className}`}>
      <span className="w-8 h-px bg-gold" />
      {children}
    </div>
  );
}
