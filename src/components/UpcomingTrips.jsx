import { useState, useEffect } from 'react'
import { CalendarDays, MapPin, Users, ArrowRight } from 'lucide-react'
import { formatINR } from '../utils/currency'

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
    if (statusFilter === 'all') return true
    return d.status === statusFilter
  })

  const upcomingCount = departures.filter(d => d.status === 'scheduled' || d.status === 'confirmed').length
  const packagesCount = new Set(
    departures
      .filter(d => d.status === 'scheduled' || d.status === 'confirmed')
      .map(d => d.packageId)
  ).size

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
          <div className="ml-auto flex gap-2">
            {['all', 'scheduled', 'confirmed', 'departed'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border capitalize ${
                  statusFilter === s
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-700'
                }`}
              >
                {s === 'all' ? 'All' : s}
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
            const spotsLeft = dep.slots.total - dep.slots.booked
            const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0
            const isFull = spotsLeft === 0
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
                    </div>
                  </div>

                  {/* Slots & Price */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-stone-400">
                        {isFull ? 'Full' : `${spotsLeft} / ${dep.slots.total} spots`}
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
                    <button
                      onClick={() => {
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
                      }}
                      disabled={isFull}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
