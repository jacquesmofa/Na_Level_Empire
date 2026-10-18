import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Settings } from '@/content';
import { LOCALES } from '@/content';
import { localizePath, switchLocalePath, useLocale } from '@/lib/locale';
import LocalizedLink from '@/components/ui/LocalizedLink';

export default function Navbar({ settings }: { settings: Settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const locale = useLocale();
  const otherLocale = LOCALES.find((l) => l !== locale) ?? locale;
  const switchTo = switchLocalePath(location.pathname, locale, otherLocale);
  const isActive = (path: string) => location.pathname === localizePath(path, locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const switchLink = (className: string) => (
    <Link to={switchTo} hrefLang={otherLocale} lang={otherLocale} aria-label={settings.ui.switchToAria} className={className}>
      {settings.ui.switchToLabel}
    </Link>
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-500 ${
          scrolled
            ? 'bg-charcoal/[0.97] backdrop-blur-2xl border-b border-gold/30 shadow-[0_4px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent backdrop-blur-sm border-b border-white/5'
        }`}
        style={{ height: '76px' }}
      >
        {/* Logo */}
        <Link to={localizePath('/', locale)} className="flex items-center gap-3 no-underline group flex-shrink-0">
          <div className="h-11 w-auto flex items-center justify-center">
            <img
              src={settings.logo.url}
              alt={settings.logo.alt}
              className="h-10 w-auto object-contain"
              style={{ maxWidth: '180px' }}
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-7 list-none m-0 p-0">
          {settings.nav.map((link) => (
            <li key={link.link}>
              <LocalizedLink
                to={link.link}
                className={`relative text-[11px] font-bold tracking-[2px] uppercase no-underline transition-colors duration-200 pb-1 font-heading ${
                  isActive(link.link) ? 'text-gold' : 'text-cream/70 hover:text-cream'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-px bg-gold transition-transform duration-300 origin-left ${
                    isActive(link.link) ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </LocalizedLink>
            </li>
          ))}
        </ul>

        {/* Language switch + CTA */}
        <div className="hidden lg:flex items-center gap-6">
          {switchLink(
            'text-[11px] font-bold tracking-[2px] uppercase no-underline transition-colors duration-200 font-heading text-cream/70 hover:text-gold',
          )}
          <LocalizedLink
            to={settings.navCta.link}
            className="block text-[11px] font-bold tracking-[2px] uppercase bg-gold text-charcoal px-6 py-3 no-underline transition-all duration-300 hover:bg-cream hover:text-charcoal hover:-translate-y-0.5 whitespace-nowrap shadow-[0_0_20px_rgba(200,146,42,0.3)] font-heading"
          >
            {settings.navCta.label}
          </LocalizedLink>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-none p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={settings.ui.menuToggleAria}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu: inert while closed, so its links can't be reached by keyboard or screen readers */}
      <div
        id="mobile-menu"
        inert={!menuOpen}
        className={`fixed inset-0 bg-charcoal z-40 flex flex-col items-center justify-center gap-6 transition-all duration-[400ms] ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="mb-6">
          <img src={settings.logo.url} alt={settings.logo.alt} className="h-14 w-auto object-contain" />
        </div>
        {settings.nav.map((link) => (
          <LocalizedLink
            key={link.link}
            to={link.link}
            className={`text-5xl tracking-[3px] no-underline transition-colors duration-200 font-display ${
              isActive(link.link) ? 'text-gold' : 'text-cream/60 hover:text-cream'
            }`}
          >
            {link.label}
          </LocalizedLink>
        ))}
        <LocalizedLink
          to={settings.navCta.link}
          className="mt-4 text-2xl tracking-[3px] no-underline bg-gold text-charcoal px-8 py-3 font-bold font-display"
        >
          {settings.navCta.label}
        </LocalizedLink>
        {switchLink('text-xl tracking-[3px] no-underline text-cream/60 hover:text-gold font-display')}
      </div>
    </>
  );
}
