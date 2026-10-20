import type { SiteSettings } from '@/content';
import LocalizedLink from '@/components/ui/LocalizedLink';
import NewsletterForm from '@/components/ui/NewsletterForm';
import { cld } from '@/lib/image';

export default function Footer({ settings, extraLinks = [] }: { settings: SiteSettings; extraLinks?: { label: string; link: string }[] }) {
  const { footer } = settings;
  const columnTitle = 'text-gold text-[11px] font-bold tracking-[3px] uppercase mb-5 font-heading';

  return (
    <footer style={{ background: 'linear-gradient(180deg, #2C2C2E 0%, #1a1a1c 100%)' }} className="border-t border-gold/20">
      {/* Gold accent line */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #C8922A, transparent)' }} />

      {/* Newsletter strip (every page); sign-ups go to the forms inbox */}
      <div className="px-6 md:px-20 pt-14 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,520px)] gap-8 items-center border-b border-gold/10">
        <div>
          <h2 className="font-display text-cream leading-none mb-3" style={{ fontSize: '36px', letterSpacing: '1px' }}>
            {footer.newsletter.title}
          </h2>
          <p className="text-cream/55 text-sm leading-relaxed max-w-md">{footer.newsletter.text}</p>
        </div>
        <NewsletterForm texts={footer.newsletter} layout="inline" />
      </div>

      <div className="px-6 md:px-20 pt-16 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <LocalizedLink to="/" className="flex items-center no-underline mb-5">
            <img src={cld(settings.logo.url, { width: 360 })} alt={settings.logo.alt} className="h-12 w-auto object-contain" />
          </LocalizedLink>
          <p className="text-cream/55 text-sm leading-relaxed mt-4 max-w-xs">{settings.blurb}</p>
          <div className="flex gap-3 mt-6">
            {settings.social.map((s) => (
              <LocalizedLink
                key={s.platform}
                to={s.url}
                aria-label={settings.ui.socialNames[s.platform]}
                className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold no-underline transition-all duration-200 hover:border-gold hover:bg-gold/10 cursor-pointer font-heading"
              >
                {s.label}
              </LocalizedLink>
            ))}
          </div>
        </div>

        {/* Pages */}
        <div>
          <div className={columnTitle}>{footer.pagesTitle}</div>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            {[...footer.links, ...extraLinks].map((p) => (
              <li key={p.link}>
                <LocalizedLink to={p.link} className="text-cream/55 text-sm no-underline transition-colors duration-200 hover:text-gold cursor-pointer">
                  {p.label}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <div className={columnTitle}>{footer.servicesTitle}</div>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            {footer.services.map((s) => (
              <li key={s} className="text-cream/55 text-sm hover:text-cream transition-colors duration-200 cursor-pointer">
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <div className={columnTitle}>{footer.legalTitle}</div>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            {footer.legal.map((l) => (
              <li key={l.label} className="text-cream/55 text-sm cursor-pointer hover:text-gold transition-colors duration-200">
                {l.link ? (
                  <LocalizedLink to={l.link} className="no-underline text-inherit">
                    {l.label}
                  </LocalizedLink>
                ) : (
                  l.label
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gold/10 px-6 md:px-20 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-cream/55 text-xs">
          <span suppressHydrationWarning>&copy; {new Date().getFullYear()}</span> <span className="text-gold font-semibold">{footer.copyrightName}</span>
          {footer.copyrightSuffix}
        </p>
        <p className="text-cream/55 text-xs">
          {footer.closingPrefix} <span className="text-gold font-semibold">{footer.closingHighlight}</span>
        </p>
      </div>
    </footer>
  );
}
