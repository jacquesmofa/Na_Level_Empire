import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { getCustomPages, getNav, getSettings, type Locale } from '@/content';
import { LocaleProvider } from '@/lib/locale';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/** Shared frame for every page in one language. */
export default function Layout({ locale }: { locale: Locale }) {
  const settings = getSettings(locale);
  const nav = getNav(locale);
  // Editor pages shown in the menu also get a footer link.
  const extraLinks = getCustomPages(locale)
    .filter((p) => p.showInNav)
    .map((p) => ({ label: p.title, link: `/${p.slug}` }));

  useEffect(() => {
    document.documentElement.lang = locale === 'fr' ? 'fr-CA' : 'en-CA';
  }, [locale]);

  return (
    <LocaleProvider value={locale}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[10000] focus:bg-gold focus:text-charcoal focus:px-4 focus:py-2 focus:text-sm focus:font-bold font-heading"
      >
        {settings.ui.skipToContent}
      </a>
      <Navbar settings={settings} nav={nav} />
      <Outlet />
      <Footer settings={settings} extraLinks={extraLinks} />
    </LocaleProvider>
  );
}
