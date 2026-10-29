import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, MapPin, Users, ArrowRight, Calendar, X } from 'lucide-react'
import { formatINR } from '../utils/currency'
import { SmartMarkdown } from '../utils/markdownUtils'
import { handleImageError, DEFAULT_FALLBACK_IMAGE } from '../utils/image'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const imgUrl = (url) => url?.startsWith('http') ? url : `${API_URL}${url || ''}`

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function getStatusColor(status) {
  switch (status) {
    case 'scheduled': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'confirmed': return 'bg-sky-100 text-sky-700 border-sky-200'
    case 'departed': return 'bg-stone-100 text-stone-500 border-stone-200'
    case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200'
    default: return 'bg-stone-100 text-stone-500 border-stone-200'
  }
}

import { fallbackGroupDepartures } from '../data/fallbackData'
import defaultPackages from '../data/packages'

export default function UpcomingTrips({ onBook, onViewPackage }) {
  const [departures, setDepartures] = useState(fallbackGroupDepartures)
  const [packages, setPackages] = useState(defaultPackages)
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDepartureItinerary, setSelectedDepartureItinerary] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedDepartureItinerary) {
        setSelectedDepartureItinerary(null)
      }
    }
    if (selectedDepartureItinerary) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedDepartureItinerary])

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        const [depRes, pkgRes] = await Promise.all([
          fetch(`${API_URL}/api/group-departures`),
          fetch(`${API_URL}/api/packages`),
        ])
        if (mounted && depRes.ok) {
          const depData = await depRes.json()
          if (Array.isArray(depData) && depData.length > 0) {
            setDepartures(depData)
          }
        }
        if (mounted && pkgRes.ok) {
          const pkgData = await pkgRes.json()
          if (Array.isArray(pkgData) && pkgData.length > 0) {
            setPackages(pkgData)
          }
        }
      } catch (err) {
        console.warn('Failed to load group departures:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [])

  const filtered = departures.filter(d => {
    if (statusFilter === 'all') return d.status !== 'cancelled'
    return d.status?.toLowerCase() === statusFilter.toLowerCase()
  })

  const upcomingCount = departures.filter(d => d.status === 'scheduled' || d.status === 'confirmed').length
  const packagesCount = new Set(
    departures
      .filter(d => d.status === 'scheduled' || d.status === 'confirmed')
      .map(d => d.packageId)
      .filter(Boolean)
  ).size

  const handleBookDeparture = (dep) => {
    if (!dep.packageId) {
      alert('Package data missing. Please refresh and try again.');
      return;
    }
    const pkg = packages.find(p => p.id === dep.packageId)
    if (pkg) {
      onBook({
        ...pkg,
        departureId: dep.id,
        departureDate: dep.departureDate ? dep.departureDate.split('T')[0] : '',
        returnDate: dep.returnDate ? dep.returnDate.split('T')[0] : '',
        priceModifier: dep.priceModifier || 0
      })
    } else {
      // Fallback with safe defaults
      onBook({
        id: dep.packageId,
        name: dep.packageName || 'Group Tour',
        duration: dep.packageDuration || '',
        region: dep.packageRegion || '',
        price: dep.packageBasePrice || 0,
        departureId: dep.id,
        departureDate: dep.departureDate ? dep.departureDate.split('T')[0] : '',
        returnDate: dep.returnDate ? dep.returnDate.split('T')[0] : '',
        priceModifier: dep.priceModifier || 0
      })
    }
  }

  return (
    <section className="py-10 sm:py-14 bg-[#FDFCF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Stats Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-stone-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-2 block">
              Upcoming Trips
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Scheduled Departures
            </h1>
            <p className="text-sm text-stone-500 mt-2 max-w-xl">
              Join a scheduled departure and explore the world with like-minded travellers. Fixed dates, shared experiences.
            </p>
          </div>

          {/* Right-Aligned Stats Counter Pills (Image 2) */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-xs">
              <CalendarDays className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="block text-[11px] text-stone-500 font-medium">Upcoming Departures</span>
                <span className="text-base sm:text-lg font-bold text-stone-900 tabular-nums">{upcomingCount}</span>
              </div>
            </div>
            <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-xs">
              <Users className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="block text-[11px] text-stone-500 font-medium">Packages Available</span>
                <span className="text-base sm:text-lg font-bold text-stone-900 tabular-nums">{packagesCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Trips' },
              { key: 'scheduled', label: 'Scheduled' },
              { key: 'confirmed', label: 'Confirmed' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border capitalize cursor-pointer shadow-xs ${
                  statusFilter === tab.key
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-stone-400 text-sm">Loading departures...</div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <CalendarDays className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 text-sm">No departures found for this filter.</p>
          </div>
        )}

        {/* Departures Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filtered.map((dep, i) => {
            const depTotal = dep.slots?.total ?? dep.slotsTotal ?? 20
            const depBooked = dep.slots?.booked ?? dep.slotsBooked ?? 0
            const spotsLeft = Math.max(0, depTotal - depBooked)
            const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0
            const isFull = spotsLeft <= 0
            const depPkg = packages.find(p => p.id === dep.packageId)
            const activeItinerary = (dep.itinerary && dep.itinerary.length > 0)
              ? dep.itinerary
              : (depPkg?.itinerary || [])

            const packageTitle = dep.packageName || depPkg?.name || dep.title || 'Curated Package'
            const departureBatchTitle = (dep.title && dep.title !== packageTitle) ? dep.title : null
            const highlights = (dep.highlights && dep.highlights.length > 0)
              ? dep.highlights
              : (depPkg?.highlights || [])

            const basePriceNum = Number(dep.packageBasePrice || dep.price || depPkg?.price || depPkg?.basePrice || 0)
            const modifierNum = Number(dep.priceModifier || 0)
            const totalPrice = basePriceNum + modifierNum

            return (
              <article
                key={dep.id}
                className="animate-fade-in-up group bg-white border border-stone-200/90 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-stone-900/[0.06] hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* 1. Card Top Image with Badges */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 shrink-0">
                  <img
                    src={imgUrl(dep.packageCardImage || dep.cardImage || depPkg?.cardImage || '/assets/unsplash-pkg-card.jpg')}
                    alt={packageTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />

                  {/* Top Overlay Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${getStatusColor(dep.status)}`}>
                      {dep.status}
                    </span>
                    {dep.ctaBadge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-900/90 backdrop-blur-md text-amber-300 shadow-xs border border-white/10">
                        {dep.ctaBadge}
                      </span>
                    )}
                  </div>

                  {/* Bottom of Image: Date Range Banner */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 font-medium text-[11px]">
                      <CalendarDays className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        {formatDate(dep.departureDate)}
                        {dep.returnDate && ` — ${formatDate(dep.returnDate)}`}
                      </span>
                    </div>
                    {activeItinerary.length > 0 && (
                      <span className="bg-amber-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        📅 {activeItinerary.length} Days Itinerary
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Card Content Body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Region & Duration */}
                  <div className="flex items-center gap-3 text-xs text-stone-500 font-medium mb-1.5">
                    {(dep.packageRegion || depPkg?.region) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {dep.packageRegion || depPkg?.region}
                      </span>
                    )}
                    {(dep.packageDuration || depPkg?.duration) && (
                      <span>⏱️ {dep.packageDuration || depPkg?.duration}</span>
                    )}
                  </div>

                  {/* Package Title */}
                  <h3 className="font-display text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug line-clamp-2">
                    {packageTitle}
                  </h3>
                  {departureBatchTitle && (
                    <p className="text-xs text-stone-500 font-medium mt-1 line-clamp-1">
                      {departureBatchTitle}
                    </p>
                  )}

                  {/* Highlights Tags */}
                  {highlights && highlights.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 my-3.5">
                      {highlights.slice(0, 3).map((h, idx) => (
                        <span key={idx} className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium border border-stone-200/60">
                          {h}
                        </span>
                      ))}
                      {highlights.length > 3 && (
                        <span className="text-[10px] text-stone-400 font-medium">
                          +{highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* 3. Card Bottom: Price, Spots & Actions */}
                  <div className="mt-auto pt-4 border-t border-stone-100">
                    <div className="flex items-center justify-between mb-3.5">
                      <div>
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                          Total Tour Price
                        </span>
                        <span className="text-lg font-bold text-stone-900 tabular-nums">
                          {totalPrice > 0 ? formatINR(totalPrice) : 'On Request'}
                        </span>
                        {modifierNum !== 0 && (
                          <span className={`block text-[10px] font-semibold ${modifierNum > 0 ? 'text-amber-700' : 'text-emerald-600'}`}>
                            {modifierNum > 0 ? '+' : ''}{formatINR(modifierNum)} modifier
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="block text-[11px] font-medium text-stone-500">
                          {isFull ? (
                            <span className="text-rose-600 font-bold">Sold Out</span>
                          ) : (
                            <span><strong className="text-stone-900">{spotsLeft} / {depTotal} spots</strong></span>
                          )}
                        </span>
                        {isAlmostFull && !isFull && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                            Almost full!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: Itinerary Modal & Book Button */}
                    <div className="grid grid-cols-2 gap-2">
                      {activeItinerary.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (onViewPackage && depPkg) {
                              onViewPackage({
                                ...depPkg,
                                departureId: dep.id,
                                departureDate: dep.departureDate,
                                returnDate: dep.returnDate,
                                priceModifier: dep.priceModifier || 0
                              })
                            } else {
                              setSelectedDepartureItinerary({ dep, itinerary: activeItinerary, pkg: depPkg })
                            }
                          }}
                          className="w-full py-2 px-3 rounded-xl text-xs font-semibold border border-stone-200 hover:border-amber-400 text-stone-700 hover:text-amber-800 bg-white hover:bg-stone-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          Itinerary
                        </button>
                      ) : (
                        <div />
                      )}
                      <button
                        type="button"
                        onClick={() => handleBookDeparture(dep)}
                        disabled={isFull}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
                          isFull
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                            : 'bg-stone-900 hover:bg-amber-600 text-white active:scale-98'
                        } ${activeItinerary.length === 0 ? 'col-span-2' : ''}`}
                      >
                        {isFull ? 'Full' : 'Book'}
                        {!isFull && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* Group Departure Itinerary Timeline Modal mounted to Body Portal */}
      {selectedDepartureItinerary && createPortal(
        <div className="fixed inset-0 z-[100] bg-stone-950/80 backdrop-blur-md overflow-y-auto p-3 sm:p-6 md:p-8 flex items-center justify-center min-h-screen" role="dialog" aria-modal="true">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] sm:max-h-[88vh] flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-stone-900 text-white px-5 py-4 sm:px-6 sm:py-5 shrink-0 relative overflow-hidden">
              {selectedDepartureItinerary.dep.packageCardImage && (
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <img src={imgUrl(selectedDepartureItinerary.dep.packageCardImage)} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative z-10 flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-1.5">
                    {selectedDepartureItinerary.dep.ctaBadge || 'Guaranteed Departure'}
                  </span>
                  <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug break-words">
                    {selectedDepartureItinerary.dep.title || selectedDepartureItinerary.dep.packageName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-stone-300 mt-1.5 font-light">
                    <span className="flex items-center gap-1 text-amber-200 font-medium shrink-0">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {formatDate(selectedDepartureItinerary.dep.departureDate)}
                      {selectedDepartureItinerary.dep.returnDate && ` — ${formatDate(selectedDepartureItinerary.dep.returnDate)}`}
                    </span>
                    {selectedDepartureItinerary.dep.packageDuration && (
                      <span className="shrink-0">• {selectedDepartureItinerary.dep.packageDuration}</span>
                    )}
                    {selectedDepartureItinerary.dep.packageBasePrice && (
                      <span className="font-semibold text-white shrink-0">
                        • {formatINR(selectedDepartureItinerary.dep.packageBasePrice + selectedDepartureItinerary.dep.priceModifier)} / person
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDepartureItinerary(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer shrink-0 mt-0.5"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 min-h-0 custom-scrollbar">
              {/* Flight / Tour notes */}
              {selectedDepartureItinerary.dep.notes && (
                <div className="bg-[#FAF9F5] border border-amber-200/80 rounded-xl p-3.5 sm:p-4 space-y-1">
                  <h4 className="text-[11px] sm:text-xs font-bold text-stone-800 uppercase tracking-wider">Departure Details & Flight Notes</h4>
                  <p className="text-xs text-stone-600 leading-relaxed break-words">{selectedDepartureItinerary.dep.notes}</p>
                </div>
              )}

              {/* Day-by-Day Timeline */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                    Day-by-Day Schedule
                  </h3>
                  <span className="text-[11px] sm:text-xs text-stone-500 font-medium">
                    {selectedDepartureItinerary.itinerary?.length || 0} Days Plan
                  </span>
                </div>

                <div className="space-y-3 relative pl-2 sm:pl-3 before:absolute before:top-3 before:bottom-3 before:left-[1.35rem] sm:before:left-[1.6rem] before:w-0.5 before:bg-stone-200">
                  {selectedDepartureItinerary.itinerary.map((dayItem, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 sm:gap-4">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 z-10 shadow-sm ring-4 ring-white">
                        D{dayItem.day}
                      </div>
                      <div className="flex-1 min-w-0 bg-stone-50/90 hover:bg-stone-50 border border-stone-200 rounded-xl p-3 sm:p-4 transition-colors">
                        <h4 className="font-bold text-xs sm:text-sm text-stone-900 mb-1 break-words">{dayItem.title}</h4>
                        <SmartMarkdown content={dayItem.desc} className="text-xs text-stone-600 leading-relaxed font-light break-words" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-stone-100 bg-stone-50/95 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-stone-500 font-medium order-2 sm:order-1">
                {(selectedDepartureItinerary.dep.slots?.total ?? selectedDepartureItinerary.dep.slotsTotal ?? 20) - (selectedDepartureItinerary.dep.slots?.booked ?? selectedDepartureItinerary.dep.slotsBooked ?? 0)} seats remaining
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end order-1 sm:order-2">
                <button
                  type="button"
                  onClick={() => setSelectedDepartureItinerary(null)}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer text-center"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const dep = selectedDepartureItinerary.dep
                    setSelectedDepartureItinerary(null)
                    handleBookDeparture(dep)
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Book This Departure <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
