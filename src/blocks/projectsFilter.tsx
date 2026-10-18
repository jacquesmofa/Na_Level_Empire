import { useState, type ReactNode } from 'react';
import { FILTERS, FilterContext, useProjectsFilter, type FilterState, type ProjectFilter } from './projectsFilterContext';

/** Shares the selected filter between the filter bar (shown in the page header) and the grid. */
export function ProjectsFilterProvider({ labels, children }: { labels: FilterState['labels']; children: ReactNode }) {
  const [active, setActive] = useState<ProjectFilter>('all');
  return <FilterContext.Provider value={{ active, setActive, labels }}>{children}</FilterContext.Provider>;
}

export function ProjectsFilterBar() {
  const ctx = useProjectsFilter();
  if (!ctx) return null;
  return (
    <div className="flex gap-2 flex-wrap mt-10 relative z-10" role="group">
      {FILTERS.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => ctx.setActive(f)}
          aria-pressed={ctx.active === f}
          className={`text-[11px] font-bold tracking-[2px] uppercase px-5 py-2.5 border-none cursor-pointer transition-all duration-200 whitespace-nowrap font-heading ${
            ctx.active === f ? 'bg-gold text-charcoal' : 'bg-cream/[0.08] text-cream/60 hover:bg-gold/20 hover:text-gold'
          }`}
        >
          {ctx.labels[f]}
        </button>
      ))}
    </div>
  );
}
