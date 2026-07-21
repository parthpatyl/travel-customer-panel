import logo from '../assets/logo.png'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useAgencySettings } from '../context/AgencyContext'

export default function Footer({ onNavigate }) {
  const { settings } = useAgencySettings()

  const agencyName = settings.agencyName || 'KRAFT YOUR TRIP'
  const agencyTagline = settings.agencyTagline || 'Handcrafting bespoke luxury travel experiences across the globe.'
  const agencyAddress = settings.agencyAddress || '456 Sandstone Ave, Suite 100, San Francisco, CA'
  const agencyPhone = settings.agencyPhone || '+1 (555) 019-2831'
  const agencyEmail = settings.agencyEmail || 'concierge@kraftyourtrip.com'
  const workingHours = settings.workingHours || 'Mon – Sat: 9 AM – 6 PM'
  const socialLinks = settings.socialLinks || {}

  const handleNav = (page) => {
    if (onNavigate) {
      onNavigate(page)
    }
  }

  const socials = [
    {
      name: 'Instagram',
      href: socialLinks.instagram || 'https://instagram.com',
      svg: (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      )
    },
    {
      name: 'Facebook',
      href: socialLinks.facebook || 'https://facebook.com',
      svg: (
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
      )
    },
    {
      name: 'Twitter',
      href: socialLinks.twitter || 'https://twitter.com',
      svg: (
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      )
    },
    {
      name: 'LinkedIn',
      href: socialLinks.linkedin || 'https://linkedin.com',
      svg: (
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
      )
    },
    {
      name: 'YouTube',
      href: socialLinks.youtube || 'https://youtube.com',
      svg: (
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      )
    }
  ]

  return (
    <footer className="bg-[#0B132B] text-stone-300 pt-12 pb-6 border-t border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Top Brand & Luxury Tagline Section ── */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8 animate-fade-in">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 mb-3 group focus:outline-none"
            aria-label="Home"
          >
            <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-md border border-stone-700/60 transition-transform duration-300 group-hover:scale-105">
              <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-bold tracking-[0.05em] text-white uppercase leading-tight group-hover:text-amber-400 transition-colors">
                {agencyName}
              </h3>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-[0.2em] block">
                Luxury Travel Concierge
              </span>
            </div>
          </button>

          <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed max-w-lg">
            {agencyTagline}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2.5 mt-4">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-amber-600 hover:border-amber-500 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-110"
                aria-label={s.name}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  {s.svg}
                </svg>
              </a>
            ))}
          </div>
          {/* Quick Links Navigation Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-stone-300 mt-5 pt-4 border-t border-white/10">
            <button onClick={() => handleNav('home')} className="hover:text-amber-400 transition-colors">Home</button>
            <span className="text-stone-600">•</span>
            <button onClick={() => handleNav('destinations')} className="hover:text-amber-400 transition-colors">Destinations</button>
            <span className="text-stone-600">•</span>
            <button onClick={() => handleNav('about')} className="hover:text-amber-400 transition-colors">About Us</button>
            <span className="text-stone-600">•</span>
            <button onClick={() => handleNav('luxury')} className="hover:text-amber-400 transition-colors">Luxury Experiences</button>
            <span className="text-stone-600">•</span>
            <button onClick={() => handleNav('corporate')} className="hover:text-amber-400 transition-colors">Corporate Travel</button>
            <span className="text-stone-600">•</span>
            <button onClick={() => handleNav('booking')} className="hover:text-amber-400 transition-colors">Book A Trip</button>
          </div>
        </div>

        {/* ── Compact Unboxed Contact Info Row ── */}
        <div className="border-t border-white/10 py-6 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center sm:text-left">
            {/* Address */}
            <div className="flex items-center sm:items-start justify-center sm:justify-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">Address</span>
                <span className="text-xs text-stone-300 font-normal leading-tight block">{agencyAddress}</span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center sm:items-start justify-center sm:justify-start gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">Phone</span>
                <a
                  href={`tel:${agencyPhone.replace(/[^0-9+]/g, '')}`}
                  className="text-xs text-amber-300 font-medium hover:underline block"
                >
                  {agencyPhone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center sm:items-start justify-center sm:justify-start gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">Email</span>
                <a
                  href={`mailto:${agencyEmail}`}
                  className="text-xs text-amber-300 font-medium hover:underline break-all block"
                >
                  {agencyEmail}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-center sm:items-start justify-center sm:justify-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">Hours</span>
                <span className="text-xs text-stone-300 font-normal block">{workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer Bottom Copyright Strip ── */}
        <div className="pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} {agencyName} Inc. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-stone-300 transition-colors">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
