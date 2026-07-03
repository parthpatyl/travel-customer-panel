import { useState, useEffect } from 'react'
import { ArrowRight, Sparkles, Search } from 'lucide-react'
import { formatINR, formatUSD } from '../utils/currency'
import Markdown from 'react-markdown'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const imgUrl = (url) => url?.startsWith('http') ? url : `${API_URL}${url || ''}`

const MarkdownInline = ({ children, className }) => (
  <Markdown
    components={{
      p: ({ children }) => <span className={className}>{children}</span>,
      strong: ({ children }) => <strong className="font-extrabold">{children}</strong>,
    }}
  >
    {children}
  </Markdown>
)

const REGIONS = ['All', 'Europe', 'Asia', 'North America', 'Africa']

export default function LuxuryExperiences({ onViewPackage, onBook }) {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [region, setRegion] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchLuxury = async () => {
      try {
        const res = await fetch(`${API_URL}/api/packages?category=luxury`)
        if (res.ok) {
          const data = await res.json()
          setPackages(data)
        }
      } catch (err) {
        console.warn('Failed to load luxury packages:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLuxury()
  }, [])

  const filtered = packages.filter(p => {
    if (region !== 'All' && p.region !== region) return false
    if (search) {
      const q = search.toLowerCase()
      const haystack = [p.name, p.description, p.region, ...(p.highlights || [])].join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  return (
    <section className="py-10 sm:py-14 bg-[#FDFCF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-2 block">
            Curated Excellence
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Luxury Experiences
          </h1>
          <p className="text-sm text-stone-500 mt-2 max-w-xl">
            Handpicked premium journeys designed for discerning travellers who seek the extraordinary.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-stone-200">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search luxury experiences..."
              className="w-full pl-9 pr-3 py-2 rounded-full bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all"
            />
          </div>
          {REGIONS.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                region === r
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-stone-400 text-sm">Loading luxury experiences...</div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 text-sm">No luxury packages found for this filter.</p>
            <button onClick={() => { setRegion('All'); setSearch('') }} className="mt-3 text-amber-700 text-sm font-semibold hover:underline">
              Reset filters
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pkg, i) => {
            const spotsLeft = pkg.slots.total - pkg.slots.booked
            return (
              <article
                key={pkg.id}
                onClick={() => onViewPackage(pkg)}
                className="animate-fade-in-up group bg-white border border-stone-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-stone-900/[0.06] hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col h-full"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0 bg-stone-100">
                  <img
                    src={imgUrl(pkg.cardImage)}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/30 via-transparent to-transparent" />
                  {pkg.ctaBadge && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-amber-700/90 text-white text-xs font-semibold uppercase tracking-wider">
                      {pkg.ctaBadge}
                    </span>
                  )}
                  {spotsLeft <= 3 && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider">
                      Only {spotsLeft} left
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div>
                    <div className="text-xs font-semibold tracking-[0.15em] text-amber-700 uppercase mb-2">
                      {pkg.region} · {pkg.duration}
                    </div>
                    <h3 className="text-[15px] font-semibold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug mb-2 font-display tracking-tight">
                      {pkg.name}
                    </h3>
                    <MarkdownInline className="text-sm text-stone-500 leading-relaxed line-clamp-2 mb-4 font-light">
                      {(pkg.description || '').split('\n')[0]}
                    </MarkdownInline>
                    {pkg.bestMonth && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mb-1">
                        <span>Best season:</span>
                        <span className="font-semibold">{pkg.bestMonth}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-stone-100">
                    <div>
                      <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider block">From</span>
                      <span className="text-lg font-semibold text-stone-900 tabular-nums">{formatINR(pkg.price)}</span>
                      {pkg.usdPrice != null && <span className="ml-2 text-xs text-stone-400 font-medium">{formatUSD(pkg.usdPrice)}</span>}
                    </div>
                    <span className="text-stone-700 group-hover:text-amber-700 text-xs font-semibold transition-colors flex items-center gap-1.5">
                      Explore
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Custom CTA */}
        <div className="mt-12 text-center py-10 px-6 rounded-2xl bg-stone-900 text-white">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <h2 className="font-display text-xl sm:text-2xl tracking-tight mb-2">Don't see what you're looking for?</h2>
          <p className="text-sm text-stone-300 max-w-md mx-auto mb-5">
            Our luxury travel specialists can craft a bespoke itinerary tailored exactly to your preferences.
          </p>
          <button
            onClick={() => onBook(null)}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full text-sm font-semibold transition-all"
          >
            Request Custom Luxury Quote
          </button>
        </div>
      </div>
    </section>
  )
}
