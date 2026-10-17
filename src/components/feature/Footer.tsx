import { Link } from 'react-router-dom';

const LOGO_URL = 'https://storage.readdy-site.link/project_files/a6f92c14-7869-4e48-89ff-7dde7f897296/626ccacd-57a0-4ea7-ae02-5aed5fa85ca1_Na-Level-logo-01---Copy.png?v=76848457b4d48250ef042e9eee5aabed';

const pages = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Media Hub', path: '/media' },
  { label: 'News', path: '/news' },
  { label: 'Social Impact', path: '/impact' },
  { label: 'Careers', path: '/careers' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const services = [
  'Video Production', 'Live Streaming', 'Event Management',
  'Sound Engineering', 'Lighting Design', 'Documentary',
  'Equipment Rental', 'Post-Production',
];

const legal = [
  'Privacy Policy', 'Terms of Service', 'B Corp Commitment',
  'Social Impact Report', 'Annual Report',
];

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(180deg, #2C2C2E 0%, #1a1a1c 100%)' }} className="border-t border-[#C8922A]/20">
      {/* Gold accent line */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #C8922A, transparent)' }} />

      <div className="px-6 md:px-20 pt-16 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center no-underline mb-5">
            <img src={LOGO_URL} alt="Na Level Empire Media" className="h-12 w-auto object-contain" />
          </Link>
          <p className="text-[#FDFCF0]/55 text-sm leading-relaxed mt-4 max-w-xs">
            Toronto&apos;s audiovisual production social enterprise — where cinematic quality meets genuine community impact.
          </p>
          <div className="flex gap-3 mt-6">
            {['YT', 'IG', 'LI', 'FB'].map((s) => (
              <a
                key={s}
                href="#"
                className="w-10 h-10 border border-[#C8922A]/30 flex items-center justify-center text-[#C8922A] text-xs font-bold no-underline transition-all duration-200 hover:border-[#C8922A] hover:bg-[#C8922A]/10 cursor-pointer"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Pages */}
        <div>
          <div className="text-[#C8922A] text-[11px] font-bold tracking-[3px] uppercase mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>Pages</div>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            {pages.map((p) => (
              <li key={p.path}>
                <Link
                  to={p.path}
                  className="text-[#FDFCF0]/55 text-sm no-underline transition-colors duration-200 hover:text-[#C8922A] cursor-pointer"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <div className="text-[#C8922A] text-[11px] font-bold tracking-[3px] uppercase mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>Services</div>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            {services.map((s) => (
              <li key={s} className="text-[#FDFCF0]/55 text-sm hover:text-[#FDFCF0] transition-colors duration-200 cursor-pointer">{s}</li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <div className="text-[#C8922A] text-[11px] font-bold tracking-[3px] uppercase mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>Legal &amp; Org</div>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            {legal.map((l) => (
              <li key={l} className="text-[#FDFCF0]/55 text-sm cursor-pointer hover:text-[#C8922A] transition-colors duration-200">{l}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#C8922A]/10 px-6 md:px-20 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-[#FDFCF0]/40 text-xs">
          &copy; 2026 <span className="text-[#C8922A] font-semibold">Na Level Empire Media</span>. Incorporated in Ontario, Canada. All rights reserved.
        </p>
        <p className="text-[#FDFCF0]/40 text-xs">
          Built with purpose in <span className="text-[#C8922A] font-semibold">Toronto</span>
        </p>
      </div>
    </footer>
  );
}
