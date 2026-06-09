import { useRef } from 'react'

// All images from Unsplash — free to use under the Unsplash License
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
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10 animate-fade-in-up">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-bold uppercase tracking-wider mb-3 border border-amber-500/10">
              Browse by Region
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Explore Destinations
            </h2>
            <p className="text-sm text-stone-500 mt-1.5 font-light">
              Handpicked destinations across the globe for every kind of traveller.
            </p>
          </div>

          {/* Scroll Controls */}
          <div className="hidden sm:flex items-center gap-2 mb-1">
            <button
              id="dest-cat-scroll-left"
              onClick={() => scroll('left')}
              aria-label="Scroll categories left"
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-700 flex items-center justify-center transition-colors duration-200 border border-stone-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              id="dest-cat-scroll-right"
              onClick={() => scroll('right')}
              aria-label="Scroll categories right"
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-700 flex items-center justify-center transition-colors duration-200 border border-stone-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Category Strip */}
        <div className="relative">
          {/* Fade-out edge on right */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            id="dest-cat-scroll-container"
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {DESTINATION_CATEGORIES.map((dest, index) => (
              <button
                key={dest.id}
                id={`dest-cat-${dest.id}`}
                onClick={() => onExplore(dest.region)}
                title={`Explore ${dest.name} — ${dest.tours} tours`}
                className="group flex-shrink-0 flex flex-col items-center gap-3 w-[100px] animate-fade-in-up focus:outline-none"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Circular Image */}
                <div className="relative w-[80px] h-[80px] sm:w-[88px] sm:h-[88px] rounded-full overflow-hidden border-2 border-amber-100 group-hover:border-amber-400 group-hover:shadow-lg group-hover:shadow-amber-200/60 transition-all duration-300 group-hover:scale-105">
                  <img
                    src={dest.image}
                    alt={dest.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/10 transition-colors duration-300 rounded-full" />
                </div>

                {/* Label */}
                <div className="text-center">
                  <p className="text-[11px] sm:text-xs font-bold text-stone-800 group-hover:text-amber-700 transition-colors duration-200 leading-tight line-clamp-2 text-center">
                    {dest.name}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5 font-medium">
                    {dest.tours} tours
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 flex justify-center sm:hidden">
          <button
            id="dest-cat-explore-all"
            onClick={onExplore}
            className="text-xs font-bold text-amber-700 flex items-center gap-1.5 hover:text-amber-600 transition-colors"
          >
            View all destinations
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
