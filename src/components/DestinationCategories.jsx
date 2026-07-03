import { useState, useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const DESTINATION_CATEGORIES = [
  { id: 'europe', name: 'Europe', region: 'Europe', image: `${API_URL}/assets/unsplash-paris.jpg` },
  { id: 'asia', name: 'Asia', region: 'Asia', image: `${API_URL}/assets/unsplash-bali.jpg` },
  { id: 'africa', name: 'Africa', region: 'Africa', image: `${API_URL}/assets/unsplash-dubai.jpg` },
  { id: 'north-america', name: 'North America', region: 'North America', image: `${API_URL}/assets/unsplash-us.jpg` },
  { id: 'south-america', name: 'South America', region: 'South America', image: `${API_URL}/assets/unsplash-australia.jpg` },
  { id: 'middle-east', name: 'Middle East', region: 'Middle East', image: `${API_URL}/assets/unsplash-maldives.jpg` },
  { id: 'australia', name: 'Australia', region: 'Australia', image: `${API_URL}/assets/unsplash-thailand.jpg` },
]

export default function DestinationCategories({ onExplore }) {
  const [tourCounts, setTourCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollRef = useRef(null)

  useEffect(() => {
    fetch(`${API_URL}/api/destinations`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const map = {}
        data.forEach(d => { map[d.region] = d.tour_count })
        setTourCounts(map)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  const countFor = (region) => tourCounts[region]

  return (
    <section className="relative z-10 py-14 sm:py-18 bg-[#FDFCF7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="flex items-end justify-between mb-10 animate-fade-in-up gap-4">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700 mb-1.5 block">
              Browse by Region
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-stone-900 tracking-tight leading-tight">
              Explore destinations
            </h2>
            <p className="text-sm text-stone-500 mt-1.5 font-light max-w-md leading-relaxed">
              Seven continents. One curator. Each region hand-picked for the discerning traveller.
            </p>
          </div>

          {/* ── Scroll hint indicators ── */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className={`w-2 h-2 rounded-full transition-all duration-500 ${canScrollLeft ? 'bg-amber-600 scale-100' : 'bg-stone-200 scale-75'}`} />
            <span className="w-6 h-px bg-stone-300" />
            <span className={`w-2 h-2 rounded-full transition-all duration-500 ${canScrollRight ? 'bg-amber-600 scale-100' : 'bg-stone-200 scale-75'}`} />
          </div>
        </div>

        {/* ── Scrollable strip ── */}
        <div className="relative">
          {/* Fade masks */}
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[#FDFCF7] to-transparent transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
          />
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[#FDFCF7] to-transparent transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
          />

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {DESTINATION_CATEGORIES.map((dest, index) => {
              const count = loading ? undefined : (tourCounts[dest.region] ?? 0)
              return (
                <button
                  key={dest.id}
                  onClick={() => onExplore(dest.region)}
                  className="group flex flex-col items-center gap-3 snap-start shrink-0 focus:outline-none animate-fade-in-up"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* ── Circular image with midnight hover ring ── */}
                  <div className="relative w-[88px] h-[88px] sm:w-[104px] sm:h-[104px] rounded-full overflow-hidden bg-white shadow-md shadow-stone-200/60 ring-1 ring-stone-200/60 group-hover:ring-2 group-hover:ring-[#1A1A2E] group-hover:ring-offset-[3px] group-hover:ring-offset-[#FDFCF7] transition-all duration-400">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-400 rounded-full" />

                    {/* Tour count badge — revealed on hover */}
                    {count !== undefined && count > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 pt-6 pb-1.5 bg-gradient-to-t from-[#1A1A2E]/70 via-[#1A1A2E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center">
                        <span className="text-[11px] font-mono font-semibold text-white tabular-nums tracking-wider">
                          {count} {count === 1 ? 'tour' : 'tours'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── Label ── */}
                  <div className="text-center -mt-0.5">
                    <p className="text-sm font-semibold text-stone-800 group-hover:text-[#1A1A2E] transition-colors duration-300 leading-tight">
                      {dest.name}
                    </p>
                    {count === undefined ? (
                      <p className="text-[11px] font-mono text-stone-300 mt-0.5 tabular-nums tracking-wider">
                        Loading…
                      </p>
                    ) : count > 0 ? (
                      <p className="text-[11px] font-mono text-stone-400 group-hover:text-stone-500 transition-colors duration-300 mt-0.5 tabular-nums tracking-wider">
                        {count} {count === 1 ? 'tour' : 'tours'}
                      </p>
                    ) : (
                      <p className="text-[11px] font-mono text-stone-300 mt-0.5 tabular-nums tracking-wider italic">
                        Coming soon
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── "View all" CTA ── */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => onExplore('All')}
            className="group text-[13px] font-semibold text-amber-700 flex items-center gap-1.5 hover:text-amber-600 transition-colors"
          >
            View all destinations
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  )
}
