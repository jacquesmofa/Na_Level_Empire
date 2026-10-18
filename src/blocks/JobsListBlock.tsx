import type { Job, SectionOf } from '@/content';
import LocalizedLink from '@/components/ui/LocalizedLink';

export default function JobsListBlock({ block, jobs }: { block: SectionOf<'jobsList'>; jobs: Job[] }) {
  const chip = 'text-[11px] px-2.5 py-1 font-semibold tracking-[1px] uppercase font-heading';
  return (
    <div className="px-6 md:px-20 pb-16 flex flex-col gap-3">
      {jobs.map((j) => (
        <article
          key={j.slug}
          className="px-9 py-8 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6 transition-all duration-200 rounded-sm bg-deep hover:bg-raised border border-gold/10 border-l-[3px] border-l-transparent hover:border-l-gold"
        >
          <div>
            <h3 className="text-cream text-lg font-bold mb-3 font-heading">{j.title}</h3>
            <div className="flex gap-2 flex-wrap">
              <span className={chip} style={{ background: 'rgba(200,146,42,0.12)', color: '#C8922A' }}>
                {j.employmentType}
              </span>
              <span className={chip} style={{ background: 'rgba(200,146,42,0.06)', color: '#C8922A' }}>
                {j.department}
              </span>
              <span className={chip} style={{ background: 'rgba(253,252,240,0.05)', color: 'rgba(253,252,240,0.55)' }}>
                {j.location}
              </span>
            </div>
          </div>
          <LocalizedLink
            to={block.applyLink}
            className="text-[11px] font-bold tracking-[2px] uppercase px-6 py-3 cursor-pointer transition-all duration-200 whitespace-nowrap no-underline text-center bg-transparent text-gold border border-gold/40 hover:bg-gold hover:text-charcoal font-heading"
          >
            {block.applyLabel}
          </LocalizedLink>
        </article>
      ))}
    </div>
  );
}
