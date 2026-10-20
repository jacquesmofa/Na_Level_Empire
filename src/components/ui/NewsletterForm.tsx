import { useId, useState, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import Honeypot from '@/components/ui/Honeypot';
import { isBot, submitForm } from '@/lib/forms';
import { useLocale } from '@/lib/locale';
import { fillSubject, SITE_CONFIG } from '@/site.config';

export type NewsletterTexts = {
  namePlaceholder?: string;
  emailPlaceholder: string;
  subscribeLabel: string;
  subscribingLabel: string;
  subscribedText: string;
  errorText: string;
};

const inputClass =
  'border border-gold/20 focus:border-gold text-cream px-4 py-3 text-sm outline-none transition-colors placeholder:text-cream/50 font-body';
const inputStyle = { background: 'rgba(253,252,240,0.05)' };

/**
 * Newsletter sign-up, sent to the forms inbox (src/site.config.ts).
 * "stacked": name + email + button (News page sidebar).
 * "inline":  email + button on one row (footer strip on every page).
 */
export default function NewsletterForm({ texts, layout = 'stacked' }: { texts: NewsletterTexts; layout?: 'stacked' | 'inline' }) {
  const locale = useLocale();
  const { pathname } = useLocation();
  const id = useId();
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const withName = layout === 'stacked' && Boolean(texts.namePlaceholder);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    const data = new FormData(e.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const name = String(data.get('name') ?? '').trim();
    if (!email) return;
    setStatus('sending');
    const result = await submitForm(
      fillSubject(SITE_CONFIG.forms.subjects.newsletter, { email, name }),
      { name, email, signed_up_on: pathname, language: locale.toUpperCase() },
      { bot: isBot(e.currentTarget) },
    );
    // Only thank the visitor when the form service confirmed the sign-up.
    setStatus(result.ok ? 'done' : 'error');
  };

  if (status === 'done') {
    return (
      <div className="text-gold text-sm font-semibold py-3" role="status">
        {texts.subscribedText}
      </div>
    );
  }

  const button = (
    <button
      type="submit"
      disabled={status === 'sending'}
      className="text-charcoal text-[12px] font-bold tracking-[2px] uppercase px-7 py-3 cursor-pointer transition-all duration-300 border-none disabled:opacity-60 hover:-translate-y-0.5 bg-gold font-heading whitespace-nowrap"
      style={{ boxShadow: '0 4px 16px rgba(200,146,42,0.3)' }}
    >
      {status === 'sending' ? texts.subscribingLabel : texts.subscribeLabel}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-3">
      <Honeypot />
      {withName && (
        <input name="name" type="text" aria-label={texts.namePlaceholder} placeholder={texts.namePlaceholder} required autoComplete="name" className={inputClass} style={inputStyle} />
      )}
      <div className={layout === 'inline' ? 'flex flex-col sm:flex-row gap-3' : 'flex flex-col gap-3'}>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          aria-label={texts.emailPlaceholder}
          placeholder={texts.emailPlaceholder}
          required
          autoComplete="email"
          className={`${inputClass} ${layout === 'inline' ? 'flex-1 min-w-0' : ''}`}
          style={inputStyle}
        />
        {button}
      </div>
      {status === 'error' && (
        <p role="alert" className="text-gold text-sm">
          {texts.errorText}
        </p>
      )}
    </form>
  );
}
