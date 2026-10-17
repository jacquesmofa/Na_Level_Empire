import { useState, type FormEvent } from 'react';
import { submitForm } from '@/lib/forms';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    const data = new FormData(e.currentTarget);
    const text = (name: string) => String(data.get(name) ?? '').trim();
    const services = ['Video Production','Event Management','Live Streaming','Sound Engineering','Lighting Design','Equipment Rental','Documentary / Story','Post-Production']
      .filter((s) => data.get(s));
    const name = `${text('first_name')} ${text('last_name')}`.trim();
    const result = await submitForm(`New quote request from ${name || 'the website'}`, {
      name,
      email: text('email'),
      organization: text('organization'),
      services: services.join(', '),
      budget: text('budget'),
      message: text('message'),
      // Hidden honeypot: only bots tick it, and Web3Forms then drops the message.
      ...(data.get('botcheck') ? { botcheck: 'on' } : {}),
    });
    // Only claim success when the form service confirmed it.
    setStatus(result.ok ? 'done' : 'error');
  };

  const inputStyle = {
    background: 'rgba(253,252,240,0.04)',
    border: '1px solid rgba(200,146,42,0.2)',
    color: '#FDFCF0',
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <main className="min-h-screen pt-[76px]" style={{ background: '#2C2C2E', color: '#FDFCF0' }}>
      <div className="px-6 md:px-20 pt-20 pb-14 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2C2C2E 0%, #1e1e20 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(200,146,42,0.07) 0%, transparent 60%)' }} />
        <div className="flex items-center gap-3 mb-4 text-[#C8922A] text-[11px] font-bold tracking-[4px] uppercase relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>
          <span className="w-8 h-px bg-[#C8922A]" />Work With Us
        </div>
        <h1 className="leading-[0.95] relative z-10" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 6vw, 88px)', color: '#FDFCF0' }}>
          GET IN <em className="not-italic" style={{ color: '#C8922A' }}>TOUCH</em>
        </h1>
      </div>

      <div className="px-6 md:px-20 py-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Form */}
        <div className="p-10 md:p-14 rounded-sm" style={{ background: '#1e1e20', border: '1px solid rgba(200,146,42,0.12)' }}>
          <div className="flex items-center gap-3 mb-8 text-[#C8922A] text-[11px] font-bold tracking-[4px] uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>
            <span className="w-8 h-px bg-[#C8922A]" />Tell Us About Your Project
          </div>
          {status === 'done' ? (
            <div className="text-center py-16">
              <div className="text-[#C8922A] text-5xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Message Sent!</div>
              <p className="text-[#FDFCF0]/55 text-base leading-relaxed">Thank you! The Na Level Empire Media team will respond within 1 business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[['first_name','First Name','Jane'],['last_name','Last Name','Smith']].map(([name,label,ph]) => (
                  <div key={name} className="flex flex-col gap-2">
                    <label className="text-[#FDFCF0]/50 text-[11px] font-bold tracking-[2px] uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>{label}</label>
                    <input name={name} type="text" placeholder={ph} required className="px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-[#FDFCF0]/25" style={inputStyle} onFocus={(e)=>{e.currentTarget.style.borderColor='#C8922A';}} onBlur={(e)=>{e.currentTarget.style.borderColor='rgba(200,146,42,0.2)';}} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-[#FDFCF0]/50 text-[11px] font-bold tracking-[2px] uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>Organization</label>
                  <input name="organization" type="text" placeholder="Your company / nonprofit" className="px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-[#FDFCF0]/25" style={inputStyle} onFocus={(e)=>{e.currentTarget.style.borderColor='#C8922A';}} onBlur={(e)=>{e.currentTarget.style.borderColor='rgba(200,146,42,0.2)';}} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#FDFCF0]/50 text-[11px] font-bold tracking-[2px] uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>Email</label>
                  <input name="email" type="email" placeholder="you@organization.com" required className="px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-[#FDFCF0]/25" style={inputStyle} onFocus={(e)=>{e.currentTarget.style.borderColor='#C8922A';}} onBlur={(e)=>{e.currentTarget.style.borderColor='rgba(200,146,42,0.2)';}} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#FDFCF0]/50 text-[11px] font-bold tracking-[2px] uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>Services Needed</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {['Video Production','Event Management','Live Streaming','Sound Engineering','Lighting Design','Equipment Rental','Documentary / Story','Post-Production'].map((s) => (
                    <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="checkbox" name={s} className="w-4 h-4 cursor-pointer" style={{ accentColor: '#C8922A' }} />
                      <span className="text-[#FDFCF0]/55 text-sm group-hover:text-[#C8922A] transition-colors">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#FDFCF0]/50 text-[11px] font-bold tracking-[2px] uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>Project Budget Range</label>
                <select name="budget" className="px-4 py-3.5 text-sm outline-none cursor-pointer" style={{ ...inputStyle, background: '#1e1e20' }}>
                  <option value="">Select a range</option>
                  {['Under $5,000','$5,000 – $15,000','$15,000 – $50,000','$50,000 – $100,000','$100,000+'].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#FDFCF0]/50 text-[11px] font-bold tracking-[2px] uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>Tell Us More</label>
                <textarea name="message" placeholder="Describe your project, event, or idea — the more detail, the better we can prepare…" maxLength={500} rows={5} className="px-4 py-3.5 text-sm outline-none resize-y placeholder:text-[#FDFCF0]/25" style={inputStyle} onFocus={(e)=>{e.currentTarget.style.borderColor='#C8922A';}} onBlur={(e)=>{e.currentTarget.style.borderColor='rgba(200,146,42,0.2)';}} />
              </div>
              {status === 'error' && (
                <p role="alert" className="text-[#C8922A] text-sm">
                  Sorry, your message didn&apos;t send. Please try again, or email us at{' '}
                  <a href="mailto:hello@nalevelempire.ca" className="underline">hello@nalevelempire.ca</a>.
                </p>
              )}
              <button type="submit" disabled={status === 'sending'} className="self-start text-[13px] font-bold tracking-[2px] uppercase px-10 py-4 cursor-pointer transition-all duration-300 border-none mt-2 disabled:opacity-60 whitespace-nowrap hover:-translate-y-0.5" style={{ background: '#C8922A', color: '#2C2C2E', fontFamily: "'Syne', sans-serif", boxShadow: '0 4px 24px rgba(200,146,42,0.35)' }}>
                {status === 'sending' ? 'Sending…' : 'Send Message →'}
              </button>
            </form>
          )}
        </div>

        {/* Info panel */}
        <div className="p-10 md:p-14 flex flex-col justify-between min-h-[500px] rounded-sm relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #C8922A 0%, #a87520 100%)' }}>
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(44,44,46,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(44,44,46,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative z-10">
            <div className="leading-none mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', color: '#2C2C2E' }}>Let's Build Something Meaningful</div>
            <p className="text-sm leading-[1.8]" style={{ color: 'rgba(44,44,46,0.7)' }}>We work with nonprofits, government agencies, educational institutions, and mission-driven businesses across the GTA. Social procurement inquiries are always welcome.</p>
          </div>
          <div className="flex flex-col gap-7 mt-10 relative z-10">
            {[
              { label: 'Location', val: 'Toronto, Ontario, Canada' },
              { label: 'Email', val: 'hello@nalevelempire.ca' },
              { label: 'Phone', val: '+1 (416) 000-0000' },
              { label: 'Business Hours', val: 'Mon – Fri, 9am – 6pm EST' },
            ].map((d) => (
              <div key={d.label}>
                <div className="text-[10px] font-bold tracking-[3px] uppercase mb-1.5" style={{ color: 'rgba(44,44,46,0.55)', fontFamily: "'Syne', sans-serif" }}>{d.label}</div>
                <div className="text-base font-medium" style={{ color: '#2C2C2E' }}>{d.val}</div>
              </div>
            ))}
            <div>
              <div className="text-[10px] font-bold tracking-[3px] uppercase mb-3" style={{ color: 'rgba(44,44,46,0.55)', fontFamily: "'Syne', sans-serif" }}>Follow Our Work</div>
              <div className="flex gap-3">
                {['YT','IG','LI','FB'].map((s) => (
                  <a key={s} href="#" className="w-10 h-10 flex items-center justify-center text-xs font-bold no-underline transition-all cursor-pointer" style={{ border: '1px solid rgba(44,44,46,0.25)', color: '#2C2C2E', fontFamily: "'Syne', sans-serif" }}
                    onMouseEnter={(e)=>{(e.currentTarget as HTMLAnchorElement).style.background='rgba(44,44,46,0.12)';}}
                    onMouseLeave={(e)=>{(e.currentTarget as HTMLAnchorElement).style.background='transparent';}}
                  >{s}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
