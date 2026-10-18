import type { Project, SectionOf, SiteSettings } from '@/content';
import CmsImage from '@/components/ui/CmsImage';
import LocalizedLink from '@/components/ui/LocalizedLink';
import { ProjectsFilterBar } from './projectsFilter';
import { useProjectsFilter } from './projectsFilterContext';

type Props = { block: SectionOf<'projectsGrid'>; projects: Project[]; settings: SiteSettings; filterInHeader: boolean };

export default function ProjectsGridBlock({ block, projects, settings, filterInHeader }: Props) {
  const filter = useProjectsFilter();
  const active = filter?.active ?? 'all';
  const shown = active === 'all' ? projects : projects.filter((p) => p.type === active || p.status === active);

  return (
    <>
      {/* Filters render in the page header when one precedes this block; otherwise here. */}
      {block.showFilters !== false && !filterInHeader && (
        <div className="px-6 md:px-20 pt-8">
          <ProjectsFilterBar />
        </div>
      )}
      <div className="px-6 md:px-20 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map((p) => (
          <LocalizedLink
            key={p.slug}
            to={block.cardLink ?? '/contact'}
            className="group block no-underline cursor-pointer transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden rounded-sm bg-deep"
            style={{ border: '1px solid rgba(200,146,42,0.1)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
          >
            <div className="w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
              <CmsImage image={p.image} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
            </div>
            {/* Gold top border on hover */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10" />
            <div
              className={`absolute top-4 left-4 text-[10px] font-bold tracking-[2px] uppercase px-3 py-1.5 font-heading ${
                p.status === 'current' ? 'bg-gold text-charcoal' : 'bg-cream/10 text-cream/60'
              }`}
            >
              {p.status === 'current' ? settings.ui.statusCurrent : settings.ui.statusCompleted}
            </div>
            <div className="p-7">
              <div className="text-gold text-[10px] font-bold tracking-[2px] uppercase mb-2.5 font-heading">{p.category}</div>
              <div className="text-cream text-lg font-bold mb-2.5 leading-[1.3] font-heading">{p.title}</div>
              <div className="text-cream/50 text-[13.5px] leading-[1.65] mb-5">{p.summary}</div>
              <div className="flex gap-2 flex-wrap border-t border-gold/10 pt-5">
                {p.tags.map((t) => (
                  <span key={t} className="text-[11px] text-gold/70 bg-gold/[0.08] px-2.5 py-1 rounded-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </LocalizedLink>
        ))}
      </div>
    </>
  );
}
