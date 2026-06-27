import { useState } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// `region` must match the region values used in packages.js (or 'All' to show everything)
const DESTINATION_CATEGORIES = [
  {
    id: 'europe',
    name: 'Europe',
    tours: 3,
    region: 'Europe',
    image: `${API_URL}/assets/unsplash-paris.jpg`,
    alt: 'European landmark',
  },
  {
    id: 'asia',
    name: 'Asia',
    tours: 4,
    region: 'Asia',
    image: `${API_URL}/assets/unsplash-bali.jpg`,
    alt: 'Asia temple',
  },
  {
    id: 'japan-china',
    name: 'Japan & China',
    tours: 22,
    region: 'All',
    image: `${API_URL}/assets/unsplash-tokyo.jpg`,
    alt: 'Japan landmark',
  },
  {
    id: 'america',
    name: 'America',
    tours: 42,
    region: 'North America',
    image: `${API_URL}/assets/unsplash-us.jpg`,
    alt: 'American landscape',
  },
  {
    id: 'africa',
    name: 'Africa',
    tours: 11,
    region: 'Africa',
    image: `${API_URL}/assets/unsplash-dubai.jpg`,
    alt: 'African landscape',
  },
  {
    id: 'south-east-asia',
    name: 'South East Asia',
    tours: 49,
    region: 'Asia',
    image: `${API_URL}/assets/unsplash-iceland.jpg`,
    alt: 'South East Asia',
  },
  {
    id: 'maldives',
    name: 'Maldives',
    tours: 2,
    region: 'Asia',
    image: `${API_URL}/assets/unsplash-maldives.jpg`,
    alt: 'Maldives overwater villas',
  },
  {
    id: 'jammu-kashmir',
    name: 'Jammu & Kashmir',
    tours: 15,
    region: 'All',
    image: `${API_URL}/assets/unsplash-kashmir.png`,
    alt: 'Kashmir valley',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    tours: 20,
    region: 'All',
    image: `${API_URL}/assets/unsplash-japan.jpg`,
    alt: 'Kerala backwaters',
  },
  {
    id: 'andaman',
    name: 'Andaman',
    tours: 4,
    region: 'All',
    image: `${API_URL}/assets/unsplash-australia.jpg`,
    alt: 'Andaman beach',
  },
  {
    id: 'leh-ladakh',
    name: 'Leh Ladakh',
    tours: 19,
    region: 'All',
    image: `${API_URL}/assets/unsplash-thailand.jpg`,
    alt: 'Leh Ladakh mountains',
  },
  {
    id: 'north-east',
    name: 'North East',
    tours: 19,
    region: 'All',
    image: `${API_URL}/assets/unsplash-egypt.jpg`,
    alt: 'North East India landscape',
  },
]

export default function DestinationCategories({ onExplore }) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5
  const totalPages = Math.ceil(DESTINATION_CATEGORIES.length / itemsPerPage)

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  const visibleCategories = DESTINATION_CATEGORIES.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  return (
    <section className="relative z-10 pt-12 pb-10 sm:pt-16 sm:pb-14 bg-[#FDFCF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 animate-fade-in-up gap-4">
          <div className="min-w-0">
            <span className="editorial-mark-start text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700 mb-1.5">
              Browse by Region
            </span>
            <h2 className="font-display text-xl sm:text-2xl text-stone-900 tracking-tight">
              Explore destinations
            </h2>
            <p className="text-xs text-stone-500 mt-1 font-light max-w-md">
              Handpicked destinations across the globe for every kind of traveller.
            </p>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="dest-cat-prev"
              onClick={handlePrev}
              disabled={currentPage === 0}
              aria-label="Previous destinations"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border ${currentPage === 0
                ? 'bg-stone-50 text-stone-300 border-stone-200 cursor-not-allowed'
                : 'bg-white hover:bg-amber-50 text-stone-600 hover:text-amber-700 border-stone-200 hover:border-amber-300 shadow-sm'
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="dest-cat-next"
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              aria-label="Next destinations"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border ${currentPage === totalPages - 1
                ? 'bg-stone-50 text-stone-300 border-stone-200 cursor-not-allowed'
                : 'bg-white hover:bg-amber-50 text-stone-600 hover:text-amber-700 border-stone-200 hover:border-amber-300 shadow-sm'
                }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-4 min-h-[160px] sm:min-h-[180px]">
          {visibleCategories.map((dest, index) => (
            <button
              key={`${dest.id}-${currentPage}`}
              id={`dest-cat-${dest.id}`}
              onClick={() => onExplore(dest.region)}
              title={`Explore ${dest.name} — ${dest.tours} tours`}
              className="group flex flex-col items-center justify-start gap-2 animate-fade-in-up focus:outline-none"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Circular Image */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-stone-200 group-hover:border-amber-400 group-hover:shadow-lg group-hover:shadow-amber-200/40 transition-all duration-300 group-hover:scale-105 bg-stone-100 shrink-0">
                <img
                  src={dest.image}
                  alt={dest.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/10 transition-colors duration-300 rounded-full" />
              </div>

              {/* Label */}
              <div className="text-center">
                <p className="text-[14px] sm:text-[15px] font-semibold text-stone-800 group-hover:text-amber-700 transition-colors duration-200 leading-tight">
                  {dest.name}
                </p>
                <p className="text-[11px] sm:text-xs text-stone-400 mt-1 font-medium tabular-nums">
                  {dest.tours} tours
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Explore All CTA */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            id="dest-cat-explore-all"
            onClick={() => onExplore('All')}
            className="text-[13px] font-semibold text-amber-700 flex items-center gap-1.5 hover:text-amber-600 transition-colors"
          >
            View all destinations
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
