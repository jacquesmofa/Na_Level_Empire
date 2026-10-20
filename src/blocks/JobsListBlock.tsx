import { useId, useRef, useState, type FormEvent } from 'react';
import type { Job, SectionOf, SiteSettings } from '@/content';
import Honeypot from '@/components/ui/Honeypot';
import { isBot, submitForm } from '@/lib/forms';
import { useLocale } from '@/lib/locale';
import { fillSubject, SITE_CONFIG } from '@/site.config';

const chip = 'text-[11px] px-2.5 py-1 font-semibold tracking-[1px] uppercase font-heading';
const inputClass =
  'px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-cream/50 border border-gold/20 focus:border-gold font-body';
const inputStyle = { background: 'rgba(253,252,240,0.04)', color: '#FDFCF0' };
const labelClass = 'text-cream/50 text-[11px] font-bold tracking-[2px] uppercase font-heading';

type Props = { block: SectionOf<'jobsList'>; jobs: Job[]; settings: SiteSettings };

/** Open roles. "Apply Now" opens an application form with that role chosen; it is emailed to the forms inbox. */
export default function JobsListBlock({ block, jobs, settings }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [role, setRole] = useState(jobs[0]?.slug ?? '');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const id = useId();
  const locale = useLocale();
  const a = block.application;

  const open = (slug: string) => {
    setRole(slug);
    setStatus('idle');
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    const data = new FormData(e.currentTarget);
    const text = (name: string) => String(data.get(name) ?? '').trim();
    const roleTitle = jobs.find((j) => j.slug === role)?.title ?? role;
    const result = await submitForm(
      // e.g. "[CAREERS] New application — AV Apprentice — Jane Smith" (subjects: src/site.config.ts)
      fillSubject(SITE_CONFIG.forms.subjects.application, { role: roleTitle, name: text('name') }),
      {
        role: roleTitle,
        name: text('name'),
        email: text('email'),
        phone: text('phone'),
        cv_or_portfolio: text('portfolio'),
        why_this_role: text('why'),
        page_language: locale.toUpperCase(),
      },
      { bot: isBot(e.currentTarget) },
    );
    setStatus(result.ok ? 'done' : 'error');
  };

  const field = (name: string, label: string, placeholder: string, type = 'text', required = false, autoComplete?: string) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={`${id}-${name}`} className={labelClass}>
        {label}
      </label>
      <input id={`${id}-${name}`} name={name} type={type} placeholder={placeholder} required={required} autoComplete={autoComplete} className={inputClass} style={inputStyle} />
    </div>
  );

  return (
    <div className="px-6 md:px-20 pb-16 flex flex-col gap-3">
      {jobs.map((j) => (
        <article
          key={j.slug}
          className="px-9 py-8 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6 transition-all duration-200 rounded-sm bg-deep hover:bg-raised border border-gold/10 border-l-[3px] border-l-transparent hover:border-l-gold"
        >
          <div>
            <h3 className="text-cream text-lg font-bold mb-3 font-heading">{j.title}</h3>
            <div className="flex gap-2 flex-wrap">
              <span className={chip} style={{ background: 'rgba(200,146,42,0.12)', color: '#C8922A' }}>
                {j.employmentType}
              </span>
              <span className={chip} style={{ background: 'rgba(200,146,42,0.06)', color: '#C8922A' }}>
                {j.department}
              </span>
              <span className={chip} style={{ background: 'rgba(253,252,240,0.05)', color: 'rgba(253,252,240,0.55)' }}>
                {j.location}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => open(j.slug)}
            aria-haspopup="dialog"
            className="text-[11px] font-bold tracking-[2px] uppercase px-6 py-3 cursor-pointer transition-all duration-200 whitespace-nowrap text-center bg-transparent text-gold border border-gold/40 hover:bg-gold hover:text-charcoal font-heading"
          >
            {block.applyLabel}
          </button>
        </article>
      ))}

      {/* Application form (native modal dialog: Esc closes it, focus stays inside) */}
      <dialog
        ref={dialog}
        aria-labelledby={`${id}-title`}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto w-[calc(100%-2rem)] max-w-xl max-h-[90vh] p-0 rounded-sm bg-deep text-cream border border-gold/20 backdrop:bg-black/75"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
      >
        <div className="p-8 md:p-10 relative">
          <button
            type="button"
            onClick={close}
            aria-label={a.closeLabel}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-cream/60 hover:text-gold bg-transparent border-none cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <h2 id={`${id}-title`} className="font-display text-gold leading-none mb-3 pr-10" style={{ fontSize: '40px' }}>
            {status === 'done' ? a.successTitle : a.title}
          </h2>

          {status === 'done' ? (
            <p className="text-cream/55 text-base leading-relaxed py-4" role="status">
              {a.successText}
            </p>
          ) : (
            <>
              {a.intro && <p className="text-cream/55 text-sm leading-relaxed mb-6">{a.intro}</p>}
              <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
                <Honeypot />
                <div className="flex flex-col gap-2">
                  <label htmlFor={`${id}-role`} className={labelClass}>
                    {a.roleLabel}
                  </label>
                  <select
                    id={`${id}-role`}
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="px-4 py-3.5 text-sm outline-none cursor-pointer border border-gold/20 focus:border-gold font-body"
                    style={{ ...inputStyle, background: '#1e1e20' }}
                  >
                    {jobs.map((j) => (
                      <option key={j.slug} value={j.slug}>
                        {j.title}
                      </option>
                    ))}
                  </select>
                </div>
                {field('name', a.name, a.namePlaceholder, 'text', true, 'name')}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {field('email', a.email, a.emailPlaceholder, 'email', true, 'email')}
                  {field('phone', a.phone, a.phonePlaceholder, 'tel', false, 'tel')}
                </div>
                {field('portfolio', a.portfolio, a.portfolioPlaceholder, 'text', true)}
                <div className="flex flex-col gap-2">
                  <label htmlFor={`${id}-why`} className={labelClass}>
                    {a.why}
                  </label>
                  <textarea id={`${id}-why`} name="why" placeholder={a.whyPlaceholder} maxLength={1500} rows={4} className={`${inputClass} resize-y`} style={inputStyle} />
                </div>
                {status === 'error' && (
                  <p role="alert" className="text-gold text-sm">
                    {a.errorText}{' '}
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
                  {status === 'sending' ? a.sendingLabel : a.submitLabel}
                </button>
              </form>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
