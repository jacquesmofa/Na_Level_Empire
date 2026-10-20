import type { NewsItem, SectionOf, SiteSettings } from '@/content';
import CmsImage from '@/components/ui/CmsImage';
import LocalizedLink from '@/components/ui/LocalizedLink';
import NewsletterForm from '@/components/ui/NewsletterForm';
import { formatMonthYear, useLocale } from '@/lib/locale';

type Props = { block: SectionOf<'newsFeed'>; news: NewsItem[]; settings: SiteSettings };

const panel = 'p-7 rounded-sm bg-deep';
const panelStyle = { border: '1px solid rgba(200,146,42,0.12)' };
const panelTitle = 'text-cream text-[13px] font-bold tracking-[2px] uppercase border-b pb-4 mb-5 font-heading';

export default function NewsFeedBlock({ block, news, settings }: Props) {
  const locale = useLocale();
  const categoryLabel = (key: string) => block.categories.find((c) => c.key === key)?.label ?? key;
  const featured = news.find((n) => n.featured) ?? news[0];
  const rest = news.filter((n) => n !== featured);

  return (
    <div className="px-6 md:px-20 py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
      <div>
        {/* Featured */}
        {featured && (
          <article
            className="group grid grid-cols-1 md:grid-cols-2 cursor-pointer hover:-translate-y-1 transition-transform duration-300 mb-4 overflow-hidden rounded-sm bg-deep"
            style={{ border: '1px solid rgba(200,146,42,0.12)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
          >
            <div className="overflow-hidden min-h-[220px] md:min-h-[280px]">
              <CmsImage
                image={featured.image}
                width={700}
                height={450}
                sizes="(min-width: 768px) 30vw, 100vw"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                style={{ minHeight: '220px' }}
              />
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                <span className="inline-block text-charcoal text-[10px] font-bold tracking-[2px] uppercase px-3 py-1.5 mb-4 bg-gold font-heading">
                  {categoryLabel(featured.category)}
                </span>
                <h2 className="text-cream text-xl font-bold leading-[1.3] mb-4 font-heading">{featured.title}</h2>
                {featured.excerpt && <div className="text-cream/55 text-sm leading-[1.65]">{featured.excerpt}</div>}
              </div>
              <div className="text-gold text-xs tracking-[1px] mt-5">
                {formatMonthYear(featured.date, locale)}
                {featured.readMinutes && <> &bull; {settings.ui.readTime.replace('{minutes}', String(featured.readMinutes))}</>}
              </div>
            </div>
          </article>
        )}

        {/* List */}
        <div className="flex flex-col gap-2">
          {rest.map((n) => (
            <article
              key={n.slug}
              className="group p-6 grid grid-cols-[100px_1fr] gap-5 cursor-pointer transition-all duration-200 overflow-hidden rounded-sm bg-deep border border-gold/[0.08] hover:border-l-gold"
            >
              <div className="overflow-hidden rounded-sm" style={{ aspectRatio: '1' }}>
                <CmsImage image={n.image} width={200} height={200} sizes="100px" widths={[200, 400]} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div>
                <div className="text-gold text-[10px] font-bold tracking-[2px] uppercase mb-1.5 font-heading">{categoryLabel(n.category)}</div>
                <h3 className="text-cream text-sm font-semibold leading-[1.4] font-heading">{n.title}</h3>
                <div className="text-cream/55 text-xs mt-2">{formatMonthYear(n.date, locale)}</div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="flex flex-col gap-5">
        <div className={panel} style={panelStyle}>
          <div className={panelTitle} style={{ borderColor: 'rgba(200,146,42,0.15)' }}>
            {block.categoriesTitle}
          </div>
          <ul className="list-none p-0 m-0 flex flex-col gap-1">
            {block.categories.map((c) => (
              <li
                key={c.key}
                className="flex justify-between items-center py-2.5 text-cream/55 text-sm cursor-pointer hover:text-gold transition-colors duration-200"
                style={{ borderBottom: '1px solid rgba(200,146,42,0.06)' }}
              >
                <span>{c.label}</span>
                <span className="text-charcoal text-[11px] px-2 py-0.5 font-bold bg-gold">{news.filter((n) => n.category === c.key).length}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={panel} style={panelStyle}>
          <div className={panelTitle} style={{ borderColor: 'rgba(200,146,42,0.15)' }}>
            {block.newsletterTitle}
          </div>
          <p className="text-cream/55 text-sm leading-[1.65] mb-4">{block.newsletterText}</p>
          <NewsletterForm texts={block} />
        </div>

        <div className={panel} style={panelStyle}>
          <div className={panelTitle} style={{ borderColor: 'rgba(200,146,42,0.15)' }}>
            {block.followTitle}
          </div>
          <div className="flex gap-2 flex-wrap mt-1">
            {settings.social.map((s) => (
              <LocalizedLink
                key={s.platform}
                to={s.url}
                aria-label={settings.ui.socialNames[s.platform]}
                className="w-10 h-10 flex items-center justify-center text-xs font-bold no-underline transition-all cursor-pointer text-gold border border-gold/30 hover:bg-gold/[0.12] font-heading"
              >
                {s.label}
              </LocalizedLink>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
