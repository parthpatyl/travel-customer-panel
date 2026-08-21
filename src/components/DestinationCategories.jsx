import { useState, useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const REGION_FALLBACKS = {
  europe: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
  asia: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80',
  africa: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80',
  'north-america': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=400&q=80',
  'south-america': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=400&q=80',
  'middle-east': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80',
  australia: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=400&q=80'
}

const DESTINATION_CATEGORIES = [
  { id: 'europe', name: 'Europe', region: 'Europe', image: `${API_URL}/assets/unsplash-paris.jpg`, fallback: REGION_FALLBACKS.europe },
  { id: 'asia', name: 'Asia', region: 'Asia', image: `${API_URL}/assets/unsplash-bali.jpg`, fallback: REGION_FALLBACKS.asia },
  { id: 'africa', name: 'Africa', region: 'Africa', image: `${API_URL}/assets/unsplash-dubai.jpg`, fallback: REGION_FALLBACKS.africa },
  { id: 'north-america', name: 'North America', region: 'North America', image: `${API_URL}/assets/unsplash-us.jpg`, fallback: REGION_FALLBACKS['north-america'] },
  { id: 'south-america', name: 'South America', region: 'South America', image: `${API_URL}/assets/unsplash-australia.jpg`, fallback: REGION_FALLBACKS['south-america'] },
  { id: 'middle-east', name: 'Middle East', region: 'Middle East', image: `${API_URL}/assets/unsplash-maldives.jpg`, fallback: REGION_FALLBACKS['middle-east'] },
  { id: 'australia', name: 'Australia', region: 'Australia', image: `${API_URL}/assets/unsplash-thailand.jpg`, fallback: REGION_FALLBACKS.australia },
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

  return (
    <section className="relative z-10 py-12 sm:py-16 bg-[#FDFCF7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header (Responsive Alignment: Left on Mobile, Center on MD+) ── */}
        <div className="text-left md:text-center flex flex-col items-start md:items-center max-w-2xl mx-auto mb-8 sm:mb-10 animate-fade-in-up">
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

        {/* ── Scrollable Strip (Responsive Alignment: justify-start on Mobile to prevent clipping, justify-center on Desktop) ── */}
        <div className="relative">
          {/* Fade masks */}
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 w-12 z-10 bg-gradient-to-r from-[#FDFCF7] to-transparent transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
          />
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-[#FDFCF7] to-transparent transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
          />

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex justify-start lg:justify-center gap-5 sm:gap-7 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 -mb-3 pt-1 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {DESTINATION_CATEGORIES.map((dest, index) => {
              const count = loading ? undefined : (tourCounts[dest.region] ?? 0)
              return (
                <button
                  key={dest.id}
                  onClick={() => onExplore(dest.region)}
                  aria-label={`Explore ${dest.name} destinations`}
                  className="group flex flex-col items-center gap-2.5 snap-start shrink-0 focus:outline-none animate-fade-in-up min-w-[90px] sm:min-w-[106px]"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* ── Circular image wrapper (prevents ring clipping / crescents) ── */}
                  <div className="p-[3px] rounded-full border-2 border-transparent group-hover:border-[#1A1A2E] transition-all duration-300">
                    <div className="relative w-[80px] h-[80px] sm:w-[96px] sm:h-[96px] rounded-full overflow-hidden bg-stone-100 shadow-md shadow-stone-200/60 ring-1 ring-stone-200/80 transition-all duration-400">
                      <img
                        src={dest.image}
                        alt={`${dest.name} travel destinations`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = dest.fallback
                        }}
                      />
                      <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-400 rounded-full" />

                      {/* Tour count badge — revealed on hover */}
                      {count !== undefined && count > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 pt-5 pb-1 bg-gradient-to-t from-[#1A1A2E]/70 via-[#1A1A2E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center">
                          <span className="text-[10px] font-mono font-semibold text-white tabular-nums tracking-wider">
                            {count} {count === 1 ? 'tour' : 'tours'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Label ── */}
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#1A1A2E] transition-colors duration-300 leading-snug">
                      {dest.name}
                    </p>
                    {count === undefined ? (
                      <p className="text-[10px] font-mono text-stone-300 mt-0.5 tabular-nums tracking-wider">
                        Loading…
                      </p>
                    ) : count > 0 ? (
                      <p className="text-[10px] font-mono text-stone-400 group-hover:text-stone-500 transition-colors duration-300 mt-0.5 tabular-nums tracking-wider">
                        {count} {count === 1 ? 'tour' : 'tours'}
                      </p>
                    ) : (
                      <p className="text-[10px] font-mono text-stone-300 mt-0.5 tabular-nums tracking-wider italic">
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
        <div className="mt-8 sm:mt-10 flex justify-center">
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
