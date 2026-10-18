import type { SectionOf } from '@/content';
import CmsImage from '@/components/ui/CmsImage';
import LocalizedLink from '@/components/ui/LocalizedLink';

export default function PartnersBlock({ block }: { block: SectionOf<'partners'> }) {
  const chip =
    'text-cream/55 text-xs font-semibold px-5 py-2.5 cursor-pointer transition-all duration-200 hover:text-gold border border-gold/20 hover:border-gold font-heading no-underline';
  return (
    <div className="px-6 md:px-20 py-12 border-t flex flex-wrap items-center gap-4" style={{ borderColor: 'rgba(200,146,42,0.1)' }}>
      <div className="text-gold text-[11px] font-bold tracking-[3px] uppercase flex-shrink-0 font-heading">{block.label}</div>
      {block.partners.map((p) => {
        const content = p.logo ? <CmsImage image={p.logo} width={160} height={48} sizes="160px" widths={[160, 320]} className="h-6 w-auto object-contain" /> : p.name;
        return p.url ? (
          <LocalizedLink key={p.name} to={p.url} className={chip}>
            {content}
          </LocalizedLink>
        ) : (
          <div key={p.name} className={chip}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
