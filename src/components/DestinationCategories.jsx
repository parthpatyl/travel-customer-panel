import { useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

// `region` must match the region values used in packages.js (or 'All' to show everything)
const DESTINATION_CATEGORIES = [
  {
    id: 'europe',
    name: 'Europe',
    tours: 3,
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80',
    alt: 'European landmark',
  },
  {
    id: 'asia',
    name: 'Asia',
    tours: 4,
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=400&q=80',
    alt: 'Asia temple',
  },
  {
    id: 'japan-china',
    name: 'Japan & China',
    tours: 22,
    region: 'All',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
    alt: 'Japan landmark',
  },
  {
    id: 'america',
    name: 'America',
    tours: 42,
    region: 'All',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80',
    alt: 'American landscape',
  },
  {
    id: 'africa',
    name: 'Africa',
    tours: 11,
    region: 'All',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=400&q=80',
    alt: 'African landscape',
  },
  {
    id: 'south-east-asia',
    name: 'South East Asia',
    tours: 49,
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
    alt: 'South East Asia',
  },
  {
    id: 'maldives',
    name: 'Maldives',
    tours: 2,
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&q=80',
    alt: 'Maldives overwater villas',
  },
  {
    id: 'jammu-kashmir',
    name: 'Jammu & Kashmir',
    tours: 15,
    region: 'All',
    image: 'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=400&q=80',
    alt: 'Kashmir valley',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    tours: 20,
    region: 'All',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80',
    alt: 'Kerala backwaters',
  },
  {
    id: 'andaman',
    name: 'Andaman',
    tours: 4,
    region: 'All',
    image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=400&q=80',
    alt: 'Andaman beach',
  },
  {
    id: 'leh-ladakh',
    name: 'Leh Ladakh',
    tours: 19,
    region: 'All',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80',
    alt: 'Leh Ladakh mountains',
  },
  {
    id: 'north-east',
    name: 'North East',
    tours: 19,
    region: 'All',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80',
    alt: 'North East India landscape',
  },
]

export default function DestinationCategories({ onExplore }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="relative z-10 pt-12 pb-10 sm:pt-16 sm:pb-14 bg-[#FDFCF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 animate-fade-in-up gap-4">
          <div className="min-w-0">
            <span className="editorial-mark-start text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-2">
              Browse by Region
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-stone-900 tracking-tight">
              Explore destinations
            </h2>
            <p className="text-sm text-stone-500 mt-1.5 font-light max-w-md">
              Handpicked destinations across the globe for every kind of traveller.
            </p>
          </div>

          {/* Scroll Controls */}
          <div className="hidden sm:flex items-center gap-2 mb-1 shrink-0">
            <button
              id="dest-cat-scroll-left"
              onClick={() => scroll('left')}
              aria-label="Scroll categories left"
              className="w-10 h-10 rounded-full bg-white hover:bg-amber-50 text-stone-600 hover:text-amber-700 flex items-center justify-center transition-all duration-200 border border-stone-200 hover:border-amber-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="dest-cat-scroll-right"
              onClick={() => scroll('right')}
              aria-label="Scroll categories right"
              className="w-10 h-10 rounded-full bg-white hover:bg-amber-50 text-stone-600 hover:text-amber-700 flex items-center justify-center transition-all duration-200 border border-stone-200 hover:border-amber-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Category Strip */}
        <div className="relative">
          {/* Fade-out edge on right */}
          <div className="absolute right-0 top-0 bottom-2 w-12 sm:w-20 bg-gradient-to-l from-[#FDFCF7] to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            id="dest-cat-scroll-container"
            className="flex gap-5 sm:gap-6 overflow-x-auto pb-2 scroll-smooth hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {DESTINATION_CATEGORIES.map((dest, index) => (
              <button
                key={dest.id}
                id={`dest-cat-${dest.id}`}
                onClick={() => onExplore(dest.region)}
                title={`Explore ${dest.name} — ${dest.tours} tours`}
                className="group flex-shrink-0 flex flex-col items-center gap-2.5 w-[88px] sm:w-[100px] animate-fade-in-up focus:outline-none"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Circular Image */}
                <div className="relative w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full overflow-hidden border border-stone-200 group-hover:border-amber-400 group-hover:shadow-lg group-hover:shadow-amber-200/40 transition-all duration-300 group-hover:scale-105 bg-stone-100">
                  <img
                    src={dest.image}
                    alt={dest.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/10 transition-colors duration-300 rounded-full" />
                </div>

                {/* Label */}
                <div className="text-center">
                  <p className="text-xs sm:text-xs font-semibold text-stone-800 group-hover:text-amber-700 transition-colors duration-200 leading-tight">
                    {dest.name}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5 font-medium tabular-nums">
                    {dest.tours} tours
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-5 flex justify-center sm:hidden">
          <button
            id="dest-cat-explore-all"
            onClick={onExplore}
            className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 hover:text-amber-600 transition-colors"
          >
            View all destinations
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  )
}
