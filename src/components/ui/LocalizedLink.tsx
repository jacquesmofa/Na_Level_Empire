import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { localizePath, useLocale } from '@/lib/locale';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string; children: ReactNode };

/**
 * Link for content-provided targets. Site paths get the language prefix and
 * use the router; external links open in a new tab; "#" stays a plain anchor.
 */
export default function LocalizedLink({ to, children, ...rest }: Props) {
  const locale = useLocale();
  if (to.startsWith('/')) {
    return (
      <Link to={localizePath(to, locale)} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(to);
  return (
    <a href={to} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
    </a>
  );
}
