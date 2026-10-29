import { useState, useEffect } from 'react'
import { formatINR, formatUSD } from '../utils/currency'
import { API_URL, getImgUrl, handleImageError } from '../utils/image'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Markdown from 'react-markdown'

const imgUrl = getImgUrl

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


export default function FeaturedPackages({ packages = [], onViewPackage, settings = {}, onNavigate }) {
  // Show 2 full rows (8 packages) on featured homepage grid
  const featured = packages.slice(0, 8)
  const offers = settings.specialOffers || []

  // Handle clicking on an offer banner or CTA button
  const handleOfferClick = (offer) => {
    const target = offer.linkUrl || offer.targetUrl || offer.targetPage || 'destinations'
    if (!target) return

    // External URL
    if (target.startsWith('http://') || target.startsWith('https://')) {
      window.open(target, '_blank', 'noopener,noreferrer')
      return
    }

    // Direct Package target: package:id, /package/id, or package id
    let targetPkgId = null
    if (target.startsWith('package:')) {
      targetPkgId = target.replace('package:', '').trim()
    } else if (target.startsWith('/package/')) {
      targetPkgId = target.replace('/package/', '').trim()
    } else if (packages.some(p => p.id === target)) {
      targetPkgId = target
    }

    if (targetPkgId) {
      const pkg = packages.find(p => p.id === targetPkgId)
      if (pkg) {
        if (onViewPackage) {
          onViewPackage(pkg)
        } else if (onNavigate) {
          onNavigate('detail', pkg)
        }
        return
      }
    }

    // Named internal page routes
    const cleanPage = target.replace(/^\//, '').toLowerCase().trim()
    if (cleanPage === 'booking' || cleanPage === 'book') {
      onNavigate && onNavigate('booking')
    } else if (cleanPage === 'about' || cleanPage === 'about-us') {
      onNavigate && onNavigate('about')
    } else if (cleanPage === 'destinations' || cleanPage === 'packages') {
      onNavigate && onNavigate('destinations')
    } else if (cleanPage === 'enquiry' || cleanPage === 'contact') {
      onNavigate && onNavigate('enquiry')
    } else {
      onNavigate && onNavigate(cleanPage || 'destinations')
    }
  }

  // Define fallbacks if agency has no offers configured
  const defaultOffers = [
    {
      id: 'default-1',
      title: 'Craft Your Bespoke Journey',
      subtitle: 'Tell us your dream destinations and let our expert planners design a tailor-made luxury itinerary just for you.',
      imageUrl: `${API_URL}/assets/unsplash-featured.jpg`,
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
    if (e && e.stopPropagation) e.stopPropagation()
    setCurrentSlide((prev) => (prev + 1) % activeOffers.length)
  }

  const prevSlide = (e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    setCurrentSlide((prev) => (prev - 1 + activeOffers.length) % activeOffers.length)
  }

  return (
    <section className="py-14 sm:py-20 bg-[#FDFCF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-7">
          <div>
            <span className="editorial-mark-start text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-2">
              Featured Journeys
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-stone-900 tracking-tight">
              Handpicked this season
            </h2>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('destinations')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-600 transition-colors flex items-center gap-1.5 group"
          >
            View all packages
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Slideshow Banner */}
        <div
          className="max-w-[1400px] h-[220px] sm:h-[300px] lg:h-[340px] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-stone-900/5 mb-12 relative group bg-stone-900 animate-fade-in border border-stone-200/60"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {activeOffers.map((offer, index) => {
            const isActive = index === currentSlide
            return (
              <div
                key={offer.id}
                onClick={() => handleOfferClick(offer)}
                className={`absolute inset-0 cursor-pointer transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10 visible' : 'opacity-0 z-0 pointer-events-none invisible'}`}
                role="button"
                tabIndex={isActive ? 0 : -1}
                aria-label={`View offer: ${offer.title}`}
              >
                {/* Background Image with hover zoom and error fallback */}
                <img
                  src={imgUrl(offer.imageUrl)}
                  alt={offer.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = '/assets/unsplash-maldives.jpg'
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/45 to-transparent" />

                {/* Content */}
                <div className="absolute inset-y-0 left-0 pl-7 pr-6 sm:pl-14 flex flex-col justify-center max-w-xl text-left z-20">
                  <span className="inline-block w-fit px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-sm text-amber-200 text-xs font-semibold uppercase tracking-[0.18em] mb-3 border border-amber-300/30">
                    {offers.length > 0 ? 'Special Offer' : 'Exclusive Opportunity'}
                  </span>
                  <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl text-white leading-[1.05] tracking-[-0.02em] mb-3">
                    {offer.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-200/90 font-light leading-relaxed mb-5 line-clamp-2 max-w-sm sm:max-w-md">
                    {offer.subtitle}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOfferClick(offer)
                    }}
                    className="px-5 py-2.5 bg-white hover:bg-amber-50 text-stone-900 rounded-full text-xs sm:text-xs font-semibold transition-all duration-300 w-fit active:scale-95 shadow-sm group-hover:shadow-md cursor-pointer"
                  >
                    {offer.buttonText || 'Explore Offer'}
                    <ArrowRight className="w-3.5 h-3.5 inline ml-1.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            )
          })}

          {/* Navigation Controls */}
          {activeOffers.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-stone-900/50 hover:bg-stone-900/80 sm:bg-white/15 sm:hover:bg-white/30 text-white backdrop-blur-md cursor-pointer z-30 transition-all active:scale-95 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 duration-300 border border-white/20 shadow-md"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-stone-900/50 hover:bg-stone-900/80 sm:bg-white/15 sm:hover:bg-white/30 text-white backdrop-blur-md cursor-pointer z-30 transition-all active:scale-95 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 duration-300 border border-white/20 shadow-md"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30 bg-stone-900/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {activeOffers.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      if (e && e.stopPropagation) e.stopPropagation()
                      setCurrentSlide(idx)
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentSlide
                        ? 'bg-amber-300 w-6'
                        : 'bg-white/40 hover:bg-white/75 w-2'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {featured.map((pkg, index) => {
            const spotsLeft = (pkg.slots?.total ?? pkg.slotsTotal ?? 20) - (pkg.slots?.booked ?? pkg.slotsBooked ?? 0)
            return (
              <article
                key={pkg.id}
                onClick={() => onViewPackage(pkg)}
                className="animate-fade-in-up group bg-white border border-stone-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-stone-900/[0.06] hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col h-full"
                style={{ animationDelay: `${index * 80 + 200}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0 bg-stone-100">
                  <img
                    src={imgUrl(pkg.cardImage)}
                    onError={handleImageError}
                    alt={pkg.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/30 via-transparent to-transparent" />

                  {/* Absolute Badge Overlay */}
                  {pkg.ctaBadge && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-stone-900/85 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                      {pkg.ctaBadge}
                    </span>
                  )}
                  {spotsLeft <= 3 && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider">
                      Only {spotsLeft} left
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-grow">
                  <div>
                    {/* Editorial Eyebrow */}
                    <div className="text-[11px] font-bold tracking-[0.16em] text-amber-700 uppercase mb-1.5">
                      {pkg.region} · {pkg.duration}
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug mb-2 font-display tracking-tight">
                      {pkg.name}
                    </h3>

                    <MarkdownInline className="text-[13px] text-stone-500 font-normal leading-relaxed line-clamp-2 mb-3.5">
                      {(pkg.description || '').split('\n')[0]}
                    </MarkdownInline>

                    {pkg.bestMonth && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mb-1">
                        <span>Best season:</span>
                        <span className="font-semibold">{pkg.bestMonth}</span>
                      </div>
                    )}
                  </div>

                  {/* Price & CTA Footer */}
                  <div className="flex items-end justify-between pt-3.5 mt-auto border-t border-stone-100">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-0.5">FROM</span>
                      <span className="text-xl font-extrabold text-stone-900 tabular-nums leading-none">{formatINR(pkg.price)}</span>
                      {pkg.usdPrice != null && <span className="ml-1.5 text-xs text-stone-400 font-medium tabular-nums">{formatUSD(pkg.usdPrice)}</span>}
                    </div>
                    <span className="text-stone-800 group-hover:text-amber-700 text-xs font-bold transition-colors flex items-center gap-1.5 pb-0.5">
                      Explore
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
