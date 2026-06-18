import logo from '../assets/logo.png'
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react'

export default function Footer({ onNavigate, settings = {} }) {
  const agencyName = settings.agencyName ?? 'KRAFT YOUR TRIP'
  const agencyAddress = settings.agencyAddress ?? ''
  const agencyPhone = settings.agencyPhone ?? ''
  const agencyEmail = settings.agencyEmail ?? ''

  const handleNav = (page) => {
    onNavigate(page)
  }

  return (
    <footer className="bg-stone-900 text-stone-300 pt-10 pb-6 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-stone-800">
                <img src={logo} alt="KRAFT YOUR TRIP Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight text-white uppercase leading-tight">
                  {agencyName}
                </h3>
                <span className="text-[9px] text-amber-400 font-semibold uppercase tracking-wider">
                  Luxury Travel
                </span>
              </div>
            </button>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
              Handcrafting bespoke luxury travel experiences. We design, organize, and orchestrate once-in-a-lifetime journeys across the globe.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-400 hover:text-white flex items-center justify-center transition-all duration-200" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-400 hover:text-white flex items-center justify-center transition-all duration-200" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-400 hover:text-white flex items-center justify-center transition-all duration-200" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-amber-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('destinations')} className="hover:text-amber-400 transition-colors">
                  Destinations
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-amber-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('booking')} className="hover:text-amber-400 transition-colors">
                  Book A Trip
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{agencyAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${agencyPhone.replace(/[^0-9+]/g, '')}`} className="hover:text-amber-400 transition-colors">{agencyPhone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${agencyEmail}`} className="hover:text-amber-400 transition-colors">{agencyEmail}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Mon – Sat: 9:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Stay Connected */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Subscribe to receive curated itineraries, travel guides, and exclusive offers.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <div className="relative flex-1 min-w-0">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-stone-800 border border-stone-700 text-xs rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-amber-500 text-white w-full placeholder-stone-500"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
              >
                Join
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-5 mt-4 border-t border-stone-850 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-550 gap-3">
          <p>© {new Date().getFullYear()} {agencyName} Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-stone-300">Privacy Policy</a>
            <a href="#" className="hover:text-stone-300">Terms of Service</a>
            <a href="#" className="hover:text-stone-300">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
