import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, MapPin, Users, ArrowRight, Calendar, X, Check, FileText } from 'lucide-react'
import { formatINR } from '../utils/currency'
import { SmartMarkdown } from '../utils/markdownUtils'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const imgUrl = (url) => url?.startsWith('http') ? url : `${API_URL}${url || ''}`

function formatDate(dateStr) {
  const d = new Date(dateStr)
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

export default function UpcomingTrips({ onBook }) {
  const [departures, setDepartures] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
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
    const fetchData = async () => {
      try {
        const [depRes, pkgRes] = await Promise.all([
          fetch(`${API_URL}/api/group-departures`),
          fetch(`${API_URL}/api/packages`),
        ])
        if (depRes.ok) {
          const depData = await depRes.json()
          setDepartures(depData)
        }
        if (pkgRes.ok) {
          const pkgData = await pkgRes.json()
          setPackages(pkgData)
        }
      } catch (err) {
        console.warn('Failed to load group departures:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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
  ).size

  const handleBookDeparture = (dep) => {
    const pkg = packages.find(p => p.id === dep.packageId)
    onBook(pkg ? {
      ...pkg,
      departureId: dep.id,
      departureDate: dep.departureDate ? dep.departureDate.split('T')[0] : '',
      returnDate: dep.returnDate ? dep.returnDate.split('T')[0] : '',
      priceModifier: dep.priceModifier || 0
    } : {
      id: dep.packageId,
      name: dep.packageName,
      duration: dep.packageDuration,
      region: dep.packageRegion,
      price: dep.packageBasePrice,
      departureId: dep.id,
      departureDate: dep.departureDate ? dep.departureDate.split('T')[0] : '',
      returnDate: dep.returnDate ? dep.returnDate.split('T')[0] : '',
      priceModifier: dep.priceModifier || 0
    })
  }

  return (
    <section className="py-10 sm:py-14 bg-[#FDFCF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
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

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-stone-200">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-amber-600" />
            <div>
              <span className="block text-xs text-stone-500 font-medium">Upcoming Departures</span>
              <span className="text-lg font-bold text-stone-900">{upcomingCount}</span>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <Users className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="block text-xs text-stone-500 font-medium">Packages Available</span>
              <span className="text-lg font-bold text-stone-900">{packagesCount}</span>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Trips' },
              { key: 'scheduled', label: 'Scheduled' },
              { key: 'confirmed', label: 'Confirmed' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border capitalize cursor-pointer ${
                  statusFilter === tab.key
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-700'
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

        {/* Departures List */}
        <div className="space-y-4">
          {filtered.map((dep, i) => {
            const depTotal = dep.slots?.total ?? dep.slotsTotal ?? 20
            const depBooked = dep.slots?.booked ?? dep.slotsBooked ?? 0
            const spotsLeft = depTotal - depBooked
            const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0
            const isFull = spotsLeft <= 0
            const depPkg = packages.find(p => p.id === dep.packageId)
            const activeItinerary = (dep.itinerary && dep.itinerary.length > 0)
              ? dep.itinerary
              : (depPkg?.itinerary || [])

            return (
              <div
                key={dep.id}
                className="animate-fade-in-up bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-lg hover:shadow-stone-900/[0.04] transition-all duration-300"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Package Image */}
                  <div className="w-full sm:w-24 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                    {dep.packageCardImage && (
                      <img
                        src={imgUrl(dep.packageCardImage)}
                        alt={dep.packageName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-stone-900 truncate">
                        {dep.packageName || dep.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${getStatusColor(dep.status)}`}>
                        {dep.status}
                      </span>
                      {dep.title && dep.packageName && (
                        <span className="text-xs text-stone-400 hidden sm:inline">· {dep.title}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {formatDate(dep.departureDate)}
                        {dep.returnDate && ` — ${formatDate(dep.returnDate)}`}
                      </span>
                      {dep.packageRegion && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {dep.packageRegion}
                        </span>
                      )}
                      {dep.packageDuration && (
                        <span>{dep.packageDuration}</span>
                      )}
                      {activeItinerary.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.2 rounded border border-amber-200/60">
                          📅 {activeItinerary.length} Days Itinerary
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Slots & Price & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-stone-400">
                        {isFull ? 'Full' : `${spotsLeft} / ${depTotal} spots`}
                      </span>
                      {isAlmostFull && !isFull && (
                        <span className="block text-[10px] text-rose-600 font-semibold">Almost full!</span>
                      )}
                    </div>
                    {dep.packageBasePrice && (
                      <div className="text-right">
                        <span className="text-sm font-semibold text-stone-900 tabular-nums">
                          {formatINR(dep.packageBasePrice + dep.priceModifier)}
                        </span>
                        {dep.priceModifier !== 0 && (
                          <span className={`block text-[10px] font-medium ${dep.priceModifier > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {dep.priceModifier > 0 ? '+' : ''}{formatINR(dep.priceModifier)}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {activeItinerary.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedDepartureItinerary({ dep, itinerary: activeItinerary, pkg: depPkg })}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold border border-stone-200 hover:border-amber-400 text-stone-600 hover:text-amber-700 bg-stone-50 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Calendar className="w-3 h-3 text-amber-600" />
                          Itinerary
                        </button>
                      )}
                      <button
                        onClick={() => handleBookDeparture(dep)}
                        disabled={isFull}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                          isFull
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                            : 'bg-stone-900 hover:bg-amber-700 text-white'
                        }`}
                      >
                        {isFull ? 'Full' : 'Book'}
                        {!isFull && <ArrowRight className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
                      {formatDate(selectedDepartureItinerary.dep.departureDate)} — {formatDate(selectedDepartureItinerary.dep.returnDate)}
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
                {selectedDepartureItinerary.dep.slots.total - selectedDepartureItinerary.dep.slots.booked} seats remaining
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
