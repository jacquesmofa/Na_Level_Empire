import type { ReactNode } from 'react';

/** Small gold label with a leading rule ("— WHAT WE DO"). */
export default function SectionLabel({ children, className = 'mb-12' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-gold text-[11px] font-bold tracking-[4px] uppercase font-heading ${className}`}>
      <span className="w-8 h-px bg-gold" />
      {children}
    </div>
  );
}
