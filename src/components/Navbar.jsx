import { useState } from 'react'
import logo from '../assets/logo.png'

export default function Navbar({ activePage, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'about', label: 'About Us' },
  ]

  const handleNav = (id) => {
    onNavigate(id)
    setMobileOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-stone-100/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-sm border border-stone-200/60 bg-white">
                <img src={logo} alt="KRAFT YOUR TRIP Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight text-stone-900 uppercase leading-tight group-hover:text-amber-700 transition-colors">
                  KRAFT YOUR TRIP
                </h1>
                <span className="text-[9px] text-amber-700 font-semibold uppercase tracking-wider">
                  Luxury Travel
                </span>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${activePage === link.id
                    ? 'text-amber-800 bg-amber-500/15'
                    : 'text-stone-800 hover:text-stone-950 hover:bg-stone-200/50'
                    }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNav('booking')}
                className="ml-3 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold shadow-sm active:scale-[0.97] transition-all duration-300"
              >
                Book Your Trip
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-all"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div
        className={`mobile-nav-backdrop ${mobileOpen ? 'open' : ''} md:hidden`}
        onClick={() => setMobileOpen(false)}
      />
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''} md:hidden w-72 bg-white border-l border-stone-100 shadow-2xl`}>
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-stone-200/50 bg-white">
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <span className="text-sm font-black text-stone-900 uppercase">KRAFT YOUR TRIP</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4 space-y-1">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activePage === link.id
                ? 'text-amber-800 bg-amber-500/15'
                : 'text-stone-800 hover:text-stone-950 hover:bg-stone-100/50'
                }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-stone-100/30 mt-3">
            <button
              onClick={() => handleNav('booking')}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold shadow-sm transition-all text-center"
            >
              Book Your Trip
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
