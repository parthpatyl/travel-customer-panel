import { useState, useEffect, useRef } from 'react'
import logo from '../assets/logo.png'
import { Menu, X, CalendarDays, Search, PhoneCall, ChevronDown, Compass, MapPin, ArrowRight, Sparkles, User } from 'lucide-react'
import MegaNavBar from './MegaNavBar'
import { useAgencySettings } from '../context/AgencyContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const POPULAR_SEARCHES = ['Kashmir', 'Bali', 'Greece', 'Safari', 'Switzerland', 'Kerala', 'Dubai', 'Tuscany']

export default function Navbar({ activePage, onNavigate, settings = {} }) {
  const { settings: contextSettings } = useAgencySettings()
  const agencyName = settings.agencyName || contextSettings.agencyName || 'KRAFT YOUR TRIP'
  const agencyPhone = settings.agencyPhone || contextSettings.agencyPhone || '7046704693'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [packages, setPackages] = useState([])
  const [categories, setCategories] = useState([])
  const searchRef = useRef(null)

  useEffect(() => {
    // Fetch live packages and categories for live search
    Promise.all([
      fetch(`${API_URL}/api/packages`).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/api/speciality-categories`).then(r => r.ok ? r.json() : [])
    ]).then(([pkgData, catData]) => {
      if (Array.isArray(pkgData)) setPackages(pkgData)
      if (Array.isArray(catData)) setCategories(catData)
    }).catch(() => {})
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNav = (page, pkg = null, region = 'All', search = '') => {
    onNavigate(page, pkg, region, search)
    setMobileOpen(false)
    setSearchOpen(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      handleNav('destinations', null, 'All', searchQuery.trim())
    }
  }

  const handleSelectPackage = (pkg) => {
    handleNav('detail', pkg)
  }

  const handleSelectSearchTag = (tag) => {
    setSearchQuery(tag)
    handleNav('destinations', null, 'All', tag)
  }

  // Filter matching packages and categories as user types
  const q = searchQuery.toLowerCase().trim()
  const matchingPackages = q ? packages.filter(p => {
    const haystack = [p.name, p.description, p.region, ...(p.highlights || []), ...(p.inclusions || [])].join(' ').toLowerCase()
    return haystack.includes(q)
  }).slice(0, 4) : []

  const matchingCategories = q ? categories.filter(c => {
    return c.name.toLowerCase().includes(q) || (c.keyword && c.keyword.toLowerCase().includes(q))
  }).slice(0, 3) : []

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0B1426] border-b border-stone-800 shadow-xl">
        {/* ── Desktop (lg+) 2-Row Layout ── */}
        <div className="hidden lg:block max-w-none px-6 xl:px-12 mx-auto">
          {/* Row 1: Brand Logo + Pill Search Bar + Support Call + Country */}
          <div className="flex items-center justify-between h-[60px] gap-6 border-b border-white/10">
            {/* Logo + Brand */}
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 group focus:outline-none shrink-0"
              aria-label="Kraft Your Trip home"
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center shadow-md border border-stone-700 bg-white">
                <img src={logo} alt="KRAFT YOUR TRIP Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-sm font-bold tracking-[0.05em] text-white uppercase group-hover:text-amber-400 transition-colors leading-none">
                  {agencyName}
                </span>
                <span className="text-[9px] text-amber-400 font-semibold uppercase tracking-[0.2em] leading-none mt-1">
                  Luxury Travel Concierge
                </span>
              </div>
            </button>

            {/* Pill Search Bar with Live Autocomplete Dropdown (Center) */}
            <div ref={searchRef} className="flex-1 max-w-xl relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-stone-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setSearchOpen(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setSearchOpen(true)
                    }}
                    placeholder='Search "Eiffel Tower", "Kashmir", "Dubai", "Safari"...'
                    className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/15 focus:border-amber-400 rounded-full py-2 pl-11 pr-9 text-xs sm:text-sm text-white placeholder-stone-400 outline-none transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('')
                        setSearchOpen(false)
                      }}
                      className="absolute right-3 text-stone-400 hover:text-white p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>

              {/* ── Live Autocomplete Dropdown ── */}
              {searchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-2xl shadow-2xl shadow-stone-950/30 overflow-hidden z-50 animate-slide-down">
                  {/* Empty state: Popular Searches */}
                  {!q && (
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-400 uppercase tracking-wider mb-2.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Popular Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_SEARCHES.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleSelectSearchTag(tag)}
                            className="px-3 py-1 rounded-full bg-stone-100 hover:bg-amber-50 hover:text-amber-700 text-stone-700 text-xs font-medium transition-colors border border-stone-200/60"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Query results */}
                  {q && (
                    <div className="divide-y divide-stone-100 max-h-[70vh] overflow-y-auto">
                      {/* Category / Region Matches */}
                      {matchingCategories.length > 0 && (
                        <div className="p-3 bg-stone-50/50">
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider px-2 block mb-1">
                            Speciality Categories
                          </span>
                          {matchingCategories.map(cat => (
                            <button
                              key={cat.id}
                              onClick={() => handleSelectSearchTag(cat.name)}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-white text-stone-800 text-xs font-semibold flex items-center justify-between transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Compass className="w-4 h-4 text-amber-600" />
                                <span>{cat.name} Tours</span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Matching Packages */}
                      {matchingPackages.length > 0 ? (
                        <div className="p-3">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 block mb-1.5">
                            Matching Packages ({matchingPackages.length})
                          </span>
                          <div className="space-y-1">
                            {matchingPackages.map(pkg => (
                              <button
                                key={pkg.id}
                                onClick={() => handleSelectPackage(pkg)}
                                className="w-full text-left p-2.5 rounded-xl hover:bg-amber-50/60 transition-colors flex items-center justify-between group"
                              >
                                <div className="flex items-center gap-3 min-w-0 pr-2">
                                  <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                                    <img
                                      src={pkg.cardImage || pkg.heroImage}
                                      alt={pkg.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' }}
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-stone-900 truncate group-hover:text-amber-700 transition-colors">
                                      {pkg.name}
                                    </h4>
                                    <span className="text-[11px] text-stone-500 font-light flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-stone-400" />
                                      {pkg.region} • {pkg.duration}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-amber-700 shrink-0">
                                  ₹{pkg.price ? pkg.price.toLocaleString('en-IN') : 'Custom'}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        matchingCategories.length === 0 && (
                          <div className="p-6 text-center text-xs text-stone-500">
                            No exact matches for &quot;{searchQuery}&quot;. Press Enter to search catalog.
                          </div>
                        )
                      )}

                      {/* Footer: View all results */}
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full py-2.5 bg-stone-50 hover:bg-amber-50 text-center text-xs font-bold text-stone-700 hover:text-amber-700 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>View all matching results on Destinations page</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Support Call & Country Selector (Right) */}
            <div className="flex items-center gap-4 shrink-0">
              {/* Toll-Free / Support Button */}
              <a
                href={`tel:${agencyPhone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-stone-200 hover:text-white transition-all text-xs font-semibold"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>{agencyPhone}</span>
              </a>

              {/* Login / Account Button */}
              <button
                onClick={() => handleNav('booking')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold border border-white/10 cursor-pointer transition-colors"
                aria-label="Login or account"
              >
                <User className="w-3.5 h-3.5 text-stone-300" />
                <span>Login</span>
              </button>
            </div>
          </div>

          {/* Row 2: Navigation Mega Menus + Book Your Trip CTA */}
          <div className="flex items-center justify-between h-[46px]">
            <MegaNavBar activePage={activePage} onNavigate={handleNav} compact />

            <button
              onClick={() => handleNav('booking')}
              className="shrink-0 px-4 py-1.5 bg-white hover:bg-stone-100 text-stone-900 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md shadow-black/30 transition-all hover:scale-105 border border-stone-200/20"
            >
              <CalendarDays className="w-3.5 h-3.5 text-stone-900" />
              <span>Book Your Trip</span>
            </button>
          </div>
        </div>

        {/* ── Mobile & Tablet (< lg) ── */}
        <div className="lg:hidden max-w-none px-4 mx-auto">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2 focus:outline-none shrink-0"
              aria-label="Kraft Your Trip home"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center border border-stone-700 bg-white">
                <img src={logo} alt="KRAFT YOUR TRIP Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <span className="text-sm font-bold tracking-[0.04em] text-white uppercase leading-none">
                {agencyName}
              </span>
            </button>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleNav('booking')}
                className="p-2 rounded-xl text-amber-400 hover:bg-white/10 transition-all"
                aria-label="Book your trip"
              >
                <CalendarDays className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-xl text-stone-200 hover:bg-white/10 transition-all"
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
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''} lg:hidden w-80 max-w-[85vw] bg-[#0B1426] border-l border-stone-800 shadow-2xl flex flex-col text-stone-200`}>
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-stone-700 bg-white">
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white uppercase leading-none">
                  {agencyName}
                </span>
                <span className="block text-[10px] text-amber-400 font-semibold uppercase tracking-[0.18em] leading-none mt-1">
                  Luxury Travel
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Nav */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <MegaNavBar activePage={activePage} onNavigate={handleNav} isMobile />
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            onClick={() => handleNav('booking')}
            className="w-full py-3 bg-white hover:bg-stone-100 text-stone-900 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-black/20"
          >
            <CalendarDays className="w-5 h-5 text-stone-900" />
            Book Your Trip
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
