import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { getSettings, type Locale } from '@/content';
import { LocaleProvider } from '@/lib/locale';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/** Shared frame for every page in one language. */
export default function Layout({ locale }: { locale: Locale }) {
  const settings = getSettings(locale);

  useEffect(() => {
    document.documentElement.lang = locale === 'fr' ? 'fr-CA' : 'en-CA';
  }, [locale]);

  return (
    <LocaleProvider value={locale}>
      <Navbar settings={settings} />
      <Outlet />
      <Footer settings={settings} />
    </LocaleProvider>
  );
}
