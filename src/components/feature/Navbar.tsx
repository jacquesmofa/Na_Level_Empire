import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LOGO_URL = 'https://storage.readdy-site.link/project_files/a6f92c14-7869-4e48-89ff-7dde7f897296/626ccacd-57a0-4ea7-ae02-5aed5fa85ca1_Na-Level-logo-01---Copy.png?v=76848457b4d48250ef042e9eee5aabed';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Media Hub', path: '/media' },
  { label: 'News', path: '/news' },
  { label: 'Social Impact', path: '/impact' },
  { label: 'Careers', path: '/careers' },
  { label: 'About', path: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-500 ${
          scrolled
            ? 'bg-[#2C2C2E]/97 backdrop-blur-2xl border-b border-[#C8922A]/30 shadow-[0_4px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent backdrop-blur-sm border-b border-white/5'
        }`}
        style={{ height: '76px' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group flex-shrink-0">
          <div className="h-11 w-auto flex items-center justify-center">
            <img
              src={LOGO_URL}
              alt="Na Level Empire Media"
              className="h-10 w-auto object-contain"
              style={{ maxWidth: '180px' }}
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-7 list-none m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`relative text-[11px] font-bold tracking-[2px] uppercase no-underline transition-colors duration-200 pb-1 ${
                  location.pathname === link.path
                    ? 'text-[#C8922A]'
                    : 'text-[#FDFCF0]/70 hover:text-[#FDFCF0]'
                }`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-px bg-[#C8922A] transition-transform duration-300 origin-left ${
                    location.pathname === link.path ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          to="/contact"
          className="hidden lg:block text-[11px] font-bold tracking-[2px] uppercase bg-[#C8922A] text-[#2C2C2E] px-6 py-3 no-underline transition-all duration-300 hover:bg-[#FDFCF0] hover:text-[#2C2C2E] hover:-translate-y-0.5 whitespace-nowrap shadow-[0_0_20px_rgba(200,146,42,0.3)]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Get a Quote
        </Link>

        {/* Hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-none p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-[#FDFCF0] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#FDFCF0] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#FDFCF0] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-[#2C2C2E] z-40 flex flex-col items-center justify-center gap-6 transition-all duration-400 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="mb-6">
          <img src={LOGO_URL} alt="Na Level Empire Media" className="h-14 w-auto object-contain" />
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-5xl tracking-[3px] no-underline transition-colors duration-200 ${
              location.pathname === link.path ? 'text-[#C8922A]' : 'text-[#FDFCF0]/60 hover:text-[#FDFCF0]'
            }`}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {link.label}
          </Link>
        ))}
        <Link
          to="/contact"
          className="mt-4 text-2xl tracking-[3px] no-underline bg-[#C8922A] text-[#2C2C2E] px-8 py-3 font-bold"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Get a Quote
        </Link>
      </div>
    </>
  );
}
