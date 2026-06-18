import { useState, useEffect } from 'react'
import { formatINR } from '../utils/currency'
import { Clock, ArrowRight, Hotel, Compass, User, Car, Plane, ChevronLeft, ChevronRight } from 'lucide-react'

export default function FeaturedPackages({ packages, onViewPackage, settings = {}, onNavigate }) {
  const featured = packages.slice(0, 4)
  const offers = settings.specialOffers || []

  // Define fallbacks if agency has no offers configured
  const defaultOffers = [
    {
      id: 'default-1',
      title: 'Craft Your Bespoke Journey',
      subtitle: 'Tell us your dream destinations and let our expert planners design a tailor-made luxury itinerary just for you.',
      imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
      buttonText: 'Request Custom Quote',
      targetPage: 'booking'
    }
  ]

  const activeOffers = offers.length > 0 ? offers : defaultOffers

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Autoplay functionality
  useEffect(() => {
    if (isPaused || activeOffers.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeOffers.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused, activeOffers.length])

  const nextSlide = (e) => {
    e.stopPropagation()
    setCurrentSlide((prev) => (prev + 1) % activeOffers.length)
  }

  const prevSlide = (e) => {
    e.stopPropagation()
    setCurrentSlide((prev) => (prev - 1 + activeOffers.length) % activeOffers.length)
  }

  return (
    <section className="py-12 sm:py-16 bg-[#FDFCF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Slideshow Banner (300px by 1200px equivalent responsive) */}
        <div
          className="max-w-[1400px] h-[200px] sm:h-[300px] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-stone-200/50 mb-12 relative group bg-stone-900 animate-fade-in"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {activeOffers.map((offer, index) => {
            const isActive = index === currentSlide
            return (
              <div
                key={offer.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
              >
                {/* Background Image */}
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-y-0 left-0 pl-8 pr-6 sm:pl-16 flex flex-col justify-center max-w-lg text-left z-20">
                  <span className="inline-block w-fit px-2.5 py-0.5 rounded-md bg-amber-500 text-stone-950 text-[9px] font-black uppercase tracking-wider mb-2">
                    {offers.length > 0 ? 'Special Offer' : 'Exclusive Opportunity'}
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black text-white leading-tight mb-2 tracking-tight uppercase">
                    {offer.title}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-stone-200 font-light leading-relaxed mb-4 sm:mb-6 line-clamp-2 max-w-sm sm:max-w-md">
                    {offer.subtitle}
                  </p>
                  <button
                    onClick={() => onNavigate && onNavigate(offer.targetPage || 'destinations')}
                    className="px-4 py-2 sm:px-6 sm:py-2.5 bg-amber-600 hover:bg-amber-550 text-white rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 w-fit active:scale-95 shadow-md shadow-amber-600/20"
                  >
                    {offer.buttonText || 'Learn More'}
                  </button>
                </div>
              </div>
            )
          })}

          {/* Navigation Controls */}
          {activeOffers.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                onClick={prevSlide}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm cursor-pointer z-35 transition-all active:scale-95 opacity-0 group-hover:opacity-100 duration-300 border border-white/10"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={nextSlide}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm cursor-pointer z-35 transition-all active:scale-95 opacity-0 group-hover:opacity-100 duration-300 border border-white/10"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-35">
                {activeOffers.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentSlide(idx)
                    }}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all cursor-pointer ${idx === currentSlide ? 'bg-amber-500 w-4 sm:w-5' : 'bg-white/40 hover:bg-white/70'
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((pkg, index) => {
            const spotsLeft = pkg.slots.total - pkg.slots.booked
            return (
              <div
                key={pkg.id}
                onClick={() => onViewPackage(pkg)}
                className={`animate-fade-in-up group bg-white border border-stone-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer`}
                style={{ animationDelay: `${index * 100 + 200}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.cardImage}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent" />

                  {/* Region Tag */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-white text-[9px] font-extrabold uppercase text-stone-700 border border-stone-200 shadow-sm rounded-lg">
                    {pkg.region}
                  </span>

                  {/* Availability Badge */}
                  <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase border shadow-sm ${spotsLeft <= 3
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-emerald-500 text-white border-emerald-400'
                    }`}>
                    {spotsLeft <= 3 ? `${spotsLeft} Left!` : `${spotsLeft} Spots`}
                  </span>

                  {/* Duration */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">{pkg.duration}</span>
                  </div>

                  {/* CTA Badge */}
                  {pkg.ctaBadge && (
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg text-[9px] font-extrabold bg-amber-500 text-white border border-amber-400 shadow-sm">
                      {pkg.ctaBadge}
                    </span>
                  )}
                </div>

                {/* Best Month pill */}
                {pkg.bestMonth && (
                  <div className="px-5 pt-3">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      📅 Best in {pkg.bestMonth}
                    </span>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-700 transition-colors leading-tight mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-2 mb-3">
                    {pkg.description}
                  </p>

                  {/* Highlights pill list */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pkg.highlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <div>
                      <span className="text-[9px] text-stone-400 font-semibold uppercase block">From</span>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-stone-900">{formatINR(pkg.basePrice)}</span>
                        {/* Icons */}
                        <div className="flex items-center gap-1 text-stone-400">
                          {pkg.inclusionsSelection?.hotel && <Hotel className="w-3.5 h-3.5" title="Hotel Included" />}
                          {pkg.inclusionsSelection?.sightseeing && <Compass className="w-3.5 h-3.5" title="Sightseeing Included" />}
                          {pkg.inclusionsSelection?.guide && <User className="w-3.5 h-3.5" title="Guide Included" />}
                          {pkg.inclusionsSelection?.airportTransfer && <Car className="w-3.5 h-3.5" title="Airport Transfer Included" />}
                          {pkg.inclusionsSelection?.flight && <Plane className="w-3.5 h-3.5" title="Flight Included" />}
                        </div>
                      </div>
                    </div>
                    <span className="text-amber-700 text-xs font-bold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                      Explore
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
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
