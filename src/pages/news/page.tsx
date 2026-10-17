import { useState } from 'react';
import { newsItems } from '@/mocks/nlem';

export default function News() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    try {
      const body = new URLSearchParams({ name, email });
      await fetch('https://readdy.ai/api/form/d7btm76he76khnho4qn0', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const featured = newsItems[0];
  const rest = newsItems.slice(1);

  return (
    <main className="min-h-screen pt-[76px]" style={{ background: '#2C2C2E', color: '#FDFCF0' }}>
      {/* Header */}
      <div
        className="px-6 md:px-20 pt-20 pb-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2C2C2E 0%, #1e1e20 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(200,146,42,0.07) 0%, transparent 60%)' }} />
        <div
          className="flex items-center gap-3 mb-4 text-[#C8922A] text-[11px] font-bold tracking-[4px] uppercase relative z-10"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <span className="w-8 h-px bg-[#C8922A]" />Latest Updates
        </div>
        <h1
          className="leading-[0.95] relative z-10"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 6vw, 88px)', color: '#FDFCF0' }}
        >
          NEWS &amp; <em className="not-italic" style={{ color: '#C8922A' }}>STORIES</em>
        </h1>
      </div>

      <div className="px-6 md:px-20 py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <div>
          {/* Featured */}
          <div
            className="group grid grid-cols-1 md:grid-cols-2 cursor-pointer hover:-translate-y-1 transition-transform duration-300 mb-4 overflow-hidden rounded-sm"
            style={{ background: '#1e1e20', border: '1px solid rgba(200,146,42,0.12)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
          >
            <div className="overflow-hidden min-h-[220px] md:min-h-[280px]">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                style={{ minHeight: '220px' }}
              />
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                <span
                  className="inline-block text-[#2C2C2E] text-[10px] font-bold tracking-[2px] uppercase px-3 py-1.5 mb-4"
                  style={{ background: '#C8922A', fontFamily: "'Syne', sans-serif" }}
                >
                  {featured.tag}
                </span>
                <div className="text-[#FDFCF0] text-xl font-bold leading-[1.3] mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>{featured.title}</div>
                <div className="text-[#FDFCF0]/55 text-sm leading-[1.65]">{featured.excerpt}</div>
              </div>
              <div className="text-[#C8922A] text-xs tracking-[1px] mt-5">{featured.date} &bull; 4 min read</div>
            </div>
          </div>

          {/* List */}
          <div className="flex flex-col gap-2">
            {rest.map((n) => (
              <div
                key={n.id}
                className="group p-6 grid grid-cols-[100px_1fr] gap-5 cursor-pointer transition-all duration-200 overflow-hidden rounded-sm"
                style={{ background: '#1e1e20', borderLeft: '3px solid transparent', border: '1px solid rgba(200,146,42,0.08)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = '#C8922A'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'transparent'; }}
              >
                <div className="overflow-hidden rounded-sm" style={{ aspectRatio: '1' }}>
                  <img
                    src={n.image}
                    alt={n.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-[#C8922A] text-[10px] font-bold tracking-[2px] uppercase mb-1.5" style={{ fontFamily: "'Syne', sans-serif" }}>{n.tag}</div>
                  <div className="text-[#FDFCF0] text-sm font-semibold leading-[1.4]" style={{ fontFamily: "'Syne', sans-serif" }}>{n.title}</div>
                  <div className="text-[#FDFCF0]/40 text-xs mt-2">{n.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          <div
            className="p-7 rounded-sm"
            style={{ background: '#1e1e20', border: '1px solid rgba(200,146,42,0.12)' }}
          >
            <div
              className="text-[#FDFCF0] text-[13px] font-bold tracking-[2px] uppercase border-b pb-4 mb-5"
              style={{ fontFamily: "'Syne', sans-serif", borderColor: 'rgba(200,146,42,0.15)' }}
            >
              Categories
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-1">
              {[['Company News', 8], ['Project Highlights', 14], ['Social Impact', 6], ['Industry Insights', 5], ['Community Stories', 9], ['Events & Appearances', 4]].map(([cat, count]) => (
                <li
                  key={cat as string}
                  className="flex justify-between items-center py-2.5 text-[#FDFCF0]/55 text-sm cursor-pointer hover:text-[#C8922A] transition-colors duration-200"
                  style={{ borderBottom: '1px solid rgba(200,146,42,0.06)' }}
                >
                  <span>{cat}</span>
                  <span
                    className="text-[#2C2C2E] text-[11px] px-2 py-0.5 font-bold"
                    style={{ background: '#C8922A' }}
                  >
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="p-7 rounded-sm"
            style={{ background: '#1e1e20', border: '1px solid rgba(200,146,42,0.12)' }}
          >
            <div
              className="text-[#FDFCF0] text-[13px] font-bold tracking-[2px] uppercase border-b pb-4 mb-5"
              style={{ fontFamily: "'Syne', sans-serif", borderColor: 'rgba(200,146,42,0.15)' }}
            >
              Newsletter
            </div>
            <p className="text-[#FDFCF0]/55 text-sm leading-[1.65] mb-4">Get project updates, community stories, and industry news — straight to your inbox.</p>
            {submitted ? (
              <div className="text-[#C8922A] text-sm font-semibold py-3">Thanks for subscribing!</div>
            ) : (
              <form data-readdy-form onSubmit={handleNewsletter} className="flex flex-col gap-3">
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border text-[#FDFCF0] px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#FDFCF0]/30"
                  style={{ background: 'rgba(253,252,240,0.05)', borderColor: 'rgba(200,146,42,0.2)', fontFamily: "'DM Sans', sans-serif" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#C8922A'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(200,146,42,0.2)'; }}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border text-[#FDFCF0] px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#FDFCF0]/30"
                  style={{ background: 'rgba(253,252,240,0.05)', borderColor: 'rgba(200,146,42,0.2)', fontFamily: "'DM Sans', sans-serif" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#C8922A'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(200,146,42,0.2)'; }}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-[#2C2C2E] text-[12px] font-bold tracking-[2px] uppercase py-3 cursor-pointer transition-all duration-300 border-none disabled:opacity-60 hover:-translate-y-0.5"
                  style={{ background: '#C8922A', fontFamily: "'Syne', sans-serif", boxShadow: '0 4px 16px rgba(200,146,42,0.3)' }}
                >
                  {submitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>

          <div
            className="p-7 rounded-sm"
            style={{ background: '#1e1e20', border: '1px solid rgba(200,146,42,0.12)' }}
          >
            <div
              className="text-[#FDFCF0] text-[13px] font-bold tracking-[2px] uppercase border-b pb-4 mb-5"
              style={{ fontFamily: "'Syne', sans-serif", borderColor: 'rgba(200,146,42,0.15)' }}
            >
              Follow Us
            </div>
            <div className="flex gap-2 flex-wrap mt-1">
              {['YT', 'IG', 'LI', 'FB', 'TW'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center text-xs font-bold no-underline transition-all cursor-pointer"
                  style={{ border: '1px solid rgba(200,146,42,0.3)', color: '#C8922A', fontFamily: "'Syne', sans-serif" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(200,146,42,0.12)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
