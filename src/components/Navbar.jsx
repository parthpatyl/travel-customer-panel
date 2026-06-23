import { useState } from 'react'
import logo from '../assets/logo.png'
import { Menu, X, CalendarDays, Sparkles } from 'lucide-react'

export default function Navbar({ activePage, onNavigate, settings = {} }) {
  const agencyName = settings.agencyName || 'KRAFT YOUR TRIP'
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
      <nav className="fixed top-0 left-0 right-0 z-30 bg-[#FDFCF7]/85 backdrop-blur-lg border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 group focus:outline-none shrink-0"
              aria-label="Kraft Your Trip home"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-sm border border-stone-200/60 bg-white">
                <img src={logo} alt="KRAFT YOUR TRIP Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <div className="flex flex-col items-start leading-none">
                <h1 className="text-[15px] sm:text-base font-bold tracking-[0.04em] text-stone-900 uppercase group-hover:text-amber-700 transition-colors leading-none">
                  {agencyName}
                </h1>
                <span className="text-[10px] sm:text-xs text-amber-700 font-semibold uppercase tracking-[0.18em] leading-none mt-1">
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activePage === link.id
                      ? 'text-amber-700 bg-amber-50'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNav('booking')}
                className="ml-3 px-5 py-2.5 bg-stone-900 hover:bg-amber-700 text-white rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <CalendarDays className="w-4 h-4" />
                Book Your Trip
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-all flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div
        className={`mobile-nav-backdrop ${mobileOpen ? 'open' : ''} md:hidden`}
        onClick={() => setMobileOpen(false)}
      />
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''} md:hidden w-80 max-w-[85vw] bg-[#FDFCF7] border-l border-stone-200 shadow-2xl`}>
        <div className="p-6 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-stone-200/50 bg-white">
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <div>
                <span className="block text-sm font-bold text-stone-900 uppercase tracking-tight leading-none">
                  {agencyName}
                </span>
                <span className="block text-[10px] text-amber-700 font-semibold uppercase tracking-[0.18em] leading-none mt-1">
                  Luxury Travel
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-1">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activePage === link.id
                  ? 'text-amber-700 bg-amber-50'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-stone-200 mt-3">
            <button
              onClick={() => handleNav('booking')}
              className="w-full py-3 bg-stone-900 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Plan Your Journey
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
