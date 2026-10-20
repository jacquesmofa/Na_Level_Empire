import { useEffect, useId, useState, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import type { SectionOf, SiteSettings } from '@/content';
import Honeypot from '@/components/ui/Honeypot';
import LocalizedLink from '@/components/ui/LocalizedLink';
import SectionLabel from '@/components/ui/SectionLabel';
import { isBot, submitForm } from '@/lib/forms';
import { useLocale } from '@/lib/locale';
import { fillSubject, SITE_CONFIG, type InquiryTopic } from '@/site.config';

const inputClass =
  'px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-cream/50 border border-gold/20 focus:border-gold font-body';
const inputStyle = { background: 'rgba(253,252,240,0.04)', color: '#FDFCF0' };
const labelClass = 'text-cream/50 text-[11px] font-bold tracking-[2px] uppercase font-heading';

export default function FormBlock({ block, settings }: { block: SectionOf<'form'>; settings: SiteSettings }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [topic, setTopic] = useState<InquiryTopic>(block.topics[0].topic);
  const id = useId();
  const locale = useLocale();
  const { search } = useLocation();
  const f = block.fields;

  // A link like /contact?team=partnerships opens the form with that team chosen.
  useEffect(() => {
    const wanted = new URLSearchParams(search).get('team');
    const match = block.topics.find((t) => t.topic === wanted);
    if (match) setTopic(match.topic);
  }, [search, block.topics]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    const data = new FormData(e.currentTarget);
    const text = (name: string) => String(data.get(name) ?? '').trim();
    const email = text('email');
    const name = `${text('first_name')} ${text('last_name')}`.trim();
    const result = await submitForm(
      // e.g. "[PARTNERSHIPS] New partnership inquiry — Jane Smith" (subjects: src/site.config.ts)
      fillSubject(SITE_CONFIG.forms.subjects.inquiry[topic], { name: name || email }),
      {
        team: block.topics.find((t) => t.topic === topic)?.label ?? topic,
        name,
        email,
        organization: text('organization'),
        services: data.getAll('services').map(String).join(', '),
        budget: text('budget'),
        message: text('message'),
        page_language: locale.toUpperCase(),
      },
      { bot: isBot(e.currentTarget) },
    );
    // Only claim success when the form service confirmed it.
    setStatus(result.ok ? 'done' : 'error');
  };

  const field = (name: string, label: string, placeholder: string, type = 'text', required = false) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={`${id}-${name}`} className={labelClass}>
        {label}
      </label>
      <input id={`${id}-${name}`} name={name} type={type} placeholder={placeholder} required={required} className={inputClass} style={inputStyle} />
    </div>
  );

  const details = [
    { label: block.panel.locationLabel, val: settings.contact.location },
    { label: block.panel.emailLabel, val: settings.contact.email, href: `mailto:${settings.contact.email}` },
    { label: block.panel.phoneLabel, val: settings.contact.phone, href: `tel:${settings.contact.phone.replace(/[^\d+]/g, '')}` },
    { label: block.panel.hoursLabel, val: settings.contact.hours },
  ];

  return (
    <div className="px-6 md:px-20 py-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Form */}
      <div className="p-10 md:p-14 rounded-sm bg-deep" style={{ border: '1px solid rgba(200,146,42,0.12)' }}>
        <SectionLabel className="mb-8">{block.formTitle}</SectionLabel>
        {status === 'done' ? (
          <div className="text-center py-16" role="status">
            <div className="text-gold text-5xl mb-6 font-display">{block.successTitle}</div>
            <p className="text-cream/55 text-base leading-relaxed">{block.successText}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
            <Honeypot />
            <div className="flex flex-col gap-2">
              <label htmlFor={`${id}-topic`} className={labelClass}>
                {f.topic}
              </label>
              <select
                id={`${id}-topic`}
                name="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value as InquiryTopic)}
                className="px-4 py-3.5 text-sm outline-none cursor-pointer border border-gold/20 focus:border-gold font-body"
                style={{ ...inputStyle, background: '#1e1e20' }}
              >
                {block.topics.map((t) => (
                  <option key={t.topic} value={t.topic}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field('first_name', f.firstName, f.firstNamePlaceholder, 'text', true)}
              {field('last_name', f.lastName, f.lastNamePlaceholder, 'text', true)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field('organization', f.organization, f.organizationPlaceholder)}
              {field('email', f.email, f.emailPlaceholder, 'email', true)}
            </div>
            <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
              <legend className={`${labelClass} mb-2`}>{f.services}</legend>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {block.serviceOptions.map((s) => (
                  <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" name="services" value={s} className="w-4 h-4 cursor-pointer" style={{ accentColor: '#C8922A' }} />
                    <span className="text-cream/55 text-sm group-hover:text-gold transition-colors">{s}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-col gap-2">
              <label htmlFor={`${id}-budget`} className={labelClass}>
                {f.budget}
              </label>
              <select id={`${id}-budget`} name="budget" className="px-4 py-3.5 text-sm outline-none cursor-pointer border border-gold/20 font-body" style={{ ...inputStyle, background: '#1e1e20' }}>
                <option value="">{f.budgetPlaceholder}</option>
                {block.budgetOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor={`${id}-message`} className={labelClass}>
                {f.message}
              </label>
              <textarea id={`${id}-message`} name="message" placeholder={f.messagePlaceholder} maxLength={500} rows={5} className={`${inputClass} resize-y`} style={inputStyle} />
            </div>
            {status === 'error' && (
              <p role="alert" className="text-gold text-sm">
                {block.errorText}{' '}
                <a href={`mailto:${settings.contact.email}`} className="underline">
                  {settings.contact.email}
                </a>
                .
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="self-start text-[13px] font-bold tracking-[2px] uppercase px-10 py-4 cursor-pointer transition-all duration-300 border-none mt-2 disabled:opacity-60 whitespace-nowrap hover:-translate-y-0.5 bg-gold text-charcoal font-heading"
              style={{ boxShadow: '0 4px 24px rgba(200,146,42,0.35)' }}
            >
              {status === 'sending' ? block.sendingLabel : block.submitLabel}
            </button>
          </form>
        )}
      </div>

      {/* Info panel */}
      <div
        className="p-10 md:p-14 flex flex-col justify-between min-h-[500px] rounded-sm relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #C8922A 0%, #a87520 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(44,44,46,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(44,44,46,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative z-10">
          <div className="leading-none mb-6 font-display text-charcoal" style={{ fontSize: '40px' }}>
            {block.panel.title}
          </div>
          <p className="text-sm leading-[1.8] text-night">
            {block.panel.text}
          </p>
        </div>
        <div className="flex flex-col gap-7 mt-10 relative z-10">
          {details.map((d) => (
            <div key={d.label}>
              <div className="text-[10px] font-bold tracking-[3px] uppercase mb-1.5 font-heading text-night">
                {d.label}
              </div>
              {d.href ? (
                <a href={d.href} className="text-base font-medium text-charcoal no-underline">
                  {d.val}
                </a>
              ) : (
                <div className="text-base font-medium text-charcoal">{d.val}</div>
              )}
            </div>
          ))}
          <div>
            <div className="text-[10px] font-bold tracking-[3px] uppercase mb-3 font-heading text-night">
              {block.panel.followLabel}
            </div>
            <div className="flex gap-3">
              {settings.social.map((s) => (
                <LocalizedLink
                  key={s.platform}
                  to={s.url}
                  aria-label={settings.ui.socialNames[s.platform]}
                  className="w-10 h-10 flex items-center justify-center text-xs font-bold no-underline transition-all cursor-pointer text-night hover:bg-charcoal/[0.12] font-heading"
                  style={{ border: '1px solid rgba(44,44,46,0.25)' }}
                >
                  {s.label}
                </LocalizedLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
