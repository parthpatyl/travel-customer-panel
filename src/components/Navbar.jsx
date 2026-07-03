import { useState } from 'react'
import logo from '../assets/logo.png'
import { Menu, X, CalendarDays, Sparkles } from 'lucide-react'
import MegaNavBar from './MegaNavBar'

export default function Navbar({ activePage, onNavigate, settings = {} }) {
  const agencyName = settings.agencyName || 'KRAFT YOUR TRIP'
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = (page, pkg = null, region = 'All', search = '') => {
    onNavigate(page, pkg, region, search)
    setMobileOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-30 bg-[#FDFCF7]/90 backdrop-blur-lg border-b border-stone-200/70">
        {/* ── Desktop (lg+) single row ── */}
        <div className="hidden lg:block max-w-none px-6 xl:px-12 mx-auto">
          <div className="flex items-center justify-between h-[76px] gap-1">
            {/* Logo + Brand */}
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-1.5 group focus:outline-none shrink-0"
              aria-label="Kraft Your Trip home"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-sm border border-stone-200/60 bg-white">
                <img src={logo} alt="KRAFT YOUR TRIP Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-sm font-bold tracking-[0.04em] text-stone-900 uppercase group-hover:text-amber-700 transition-colors leading-none">
                  {agencyName}
                </span>
                <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-[0.18em] leading-none mt-0.5">
                  Luxury Travel
                </span>
              </div>
            </button>

            {/* MegaNavBar + Book CTA */}
            <div className="flex items-center gap-1.5">
              <MegaNavBar activePage={activePage} onNavigate={handleNav} compact />
              <button
                onClick={() => handleNav('booking')}
                className="shrink-0 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-500  text-white rounded-full text-sm font-semibold flex items-center gap-1 shadow-md shadow-amber-200"
              >
                <CalendarDays className="w-5 h-5" />
                <span>Book Your Trip</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile & Tablet (< lg) ── */}
        <div className="lg:hidden max-w-none px-6 xl:px-12 mx-auto">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 focus:outline-none shrink-0"
              aria-label="Kraft Your Trip home"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-sm border border-stone-200/60 bg-white">
                <img src={logo} alt="KRAFT YOUR TRIP Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <span className="text-base font-bold tracking-[0.04em] text-stone-900 uppercase leading-none">
                {agencyName}
              </span>
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleNav('booking')}
                className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 transition-all"
                aria-label="Book your trip"
              >
                <CalendarDays className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div
        className={`mobile-nav-backdrop ${mobileOpen ? 'open' : ''} lg:hidden`}
        onClick={() => setMobileOpen(false)}
      />
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''} lg:hidden w-80 max-w-[85vw] bg-[#FDFCF7] border-l border-stone-200 shadow-2xl flex flex-col`}>
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-200/50 bg-white">
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <div>
                <span className="block text-sm font-bold text-stone-900 uppercase leading-none">
                  {agencyName}
                </span>
                <span className="block text-[10px] text-amber-700 font-semibold uppercase tracking-[0.18em] leading-none mt-0.5">
                  Luxury Travel
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Nav */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <NavBtn active={activePage === 'home'} onClick={() => handleNav('home')} label="Home" />
          <NavBtn active={activePage === 'destinations'} onClick={() => handleNav('destinations')} label="Destinations" />
          <NavBtn active={activePage === 'about'} onClick={() => handleNav('about')} label="About Us" />
          <div className="border-t border-stone-100 my-2" />
          <NavBtn active={activePage === 'luxury'} onClick={() => handleNav('luxury')} label="Luxury Experiences" icon={Sparkles} />
          <div className="border-t border-stone-100 my-2" />
          <MegaNavBar activePage={activePage} onNavigate={handleNav} isMobile />
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-stone-200 shrink-0">
          <button
            onClick={() => handleNav('booking')}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-200"
          >
            <CalendarDays className="w-5 h-5" />
            Plan Your Journey
          </button>
        </div>
      </div>
    </>
  )
}

function NavBtn({ active, onClick, label, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${active
          ? 'text-amber-700 bg-amber-50'
          : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
        }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  )
}
