import { useState, useEffect, useCallback, useRef } from 'react'
import { Star, ChevronLeft, ChevronRight, X, Pause, Play, BadgeCheck } from 'lucide-react'
import { getImgUrl, handleImageError, DEFAULT_FALLBACK_IMAGE } from '../utils/image'

const DEFAULT_AVATAR = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#e4d5c5" rx="50"/><circle cx="50" cy="38" r="18" fill="#d4c4b5"/><path d="M20 80c0-18 13-32 30-32s30 14 30 32" fill="#d4c4b5"/></svg>'
)

function parseImageList(images) {
  if (!images) return []
  if (Array.isArray(images)) {
    return images.filter(Boolean)
  }
  if (typeof images === 'string') {
    try {
      if (images.trim().startsWith('[')) {
        const parsed = JSON.parse(images)
        return Array.isArray(parsed) ? parsed.filter(Boolean) : []
      }
      return images.trim() ? [images.trim()] : []
    } catch {
      return images.trim() ? [images.trim()] : []
    }
  }
  return []
}

export default function TestimonialsSection({ testimonials = [], onNavigate }) {
  // Filter out any hidden reviews or fake demo reviews
  const activeReviews = testimonials.filter(t => {
    if (t.status && t.status !== 'approved') return false
    const text = String(t.text || '').toLowerCase()
    if (text.includes('120-person annual corporate offsite')) return false
    return true
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const sliderRef = useRef(null)

  const count = activeReviews.length

  const nextReview = useCallback(() => {
    if (count <= 1) return
    setCurrentIndex((prev) => (prev + 1) % count)
  }, [count])

  const prevReview = useCallback(() => {
    if (count <= 1) return
    setCurrentIndex((prev) => (prev - 1 + count) % count)
  }, [count])

  // Continuous auto-rotation every 4.5 seconds when not paused
  useEffect(() => {
    if (isPaused || count <= 1 || lightbox) return
    const timer = setInterval(() => {
      nextReview()
    }, 4500)
    return () => clearInterval(timer)
  }, [isPaused, count, lightbox, nextReview])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
    setSlideIndex(0)
  }, [])

  const prevSlide = useCallback(() => {
    setSlideIndex((prev) => (prev - 1 + lightbox.length) % lightbox.length)
  }, [lightbox])

  const nextSlide = useCallback(() => {
    setSlideIndex((prev) => (prev + 1) % lightbox.length)
  }, [lightbox])

  useEffect(() => {
    if (!lightbox) return
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox, closeLightbox, prevSlide, nextSlide])

  if (activeReviews.length === 0) {
    return (
      <section className="py-14 sm:py-20 bg-[#FAF9F5] border-y border-stone-200/70" aria-label="Guest Experiences">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="editorial-mark text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3 block">
            Guest Experiences
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-stone-900 tracking-tight mb-3">
            What our travellers say
          </h2>
          <div className="text-center text-stone-400 text-sm italic font-light">
            Traveller stories will appear here once verified guests share their experiences.
          </div>
        </div>
      </section>
    )
  }

  // Calculate visible slice for 1 line (show 3 on large screens, 2 on tablet, 1 on mobile)
  // or a smooth carousel window
  return (
    <section
      className="py-14 sm:py-20 bg-[#FAF9F5] border-y border-stone-200/70 select-none overflow-hidden"
      aria-label="Guest Experiences"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Controls in 1 clean row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4 animate-fade-in-up">
          <div>
            <span className="editorial-mark text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-2 block">
              Guest Experiences
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-stone-900 tracking-tight">
              What our travellers say
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
              Verified stories from travellers who embarked on our handcrafted luxury journeys.
            </p>
          </div>

          {/* Controls & Wall Link */}
          <div className="flex items-center gap-4 self-end md:self-auto">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('gallery')}
                className="text-xs font-bold text-amber-700 hover:text-amber-600 transition-colors cursor-pointer mr-2 underline decoration-amber-300 underline-offset-4"
              >
                View Full Wall ({count}) &rarr;
              </button>
            )}
            {count > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-stone-400 tracking-wider">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={prevReview}
                  aria-label="Previous review"
                  className="w-9 h-9 rounded-full bg-white border border-stone-200 shadow-xs hover:border-amber-500 hover:text-amber-700 text-stone-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextReview}
                  aria-label="Next review"
                  className="w-9 h-9 rounded-full bg-white border border-stone-200 shadow-xs hover:border-amber-500 hover:text-amber-700 text-stone-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 1 Line Horizontal Carousel Container */}
        <div className="relative overflow-hidden" ref={sliderRef}>
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`
            }}
          >
            {activeReviews.map((t, idx) => {
              const imageList = parseImageList(t.images)
              const avatarSrc = t.avatar ? getImgUrl(t.avatar, DEFAULT_AVATAR) : DEFAULT_AVATAR

              return (
                <div
                  key={t.id || idx}
                  className="w-full shrink-0 px-2 sm:px-3"
                >
                  <figure className="bg-white border border-stone-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-sm transition-all duration-300 max-w-3xl mx-auto flex flex-col justify-between min-h-[260px]">
                    <div>
                      {/* Top Star Rating & Verified Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-1 text-amber-500" aria-label={`${t.rating || 5} out of 5 stars`}>
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" aria-hidden="true" />
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                          <BadgeCheck className="w-3 h-3 text-emerald-600" />
                          Verified Journey
                        </span>
                      </div>

                      {/* Review Content */}
                      <blockquote className="text-sm sm:text-base text-stone-800 leading-relaxed font-light italic mb-6">
                        &ldquo;{t.text}&rdquo;
                      </blockquote>

                      {/* Photo Gallery thumbnails */}
                      {imageList.length > 0 && (
                        <div className="flex gap-2 mb-6" role="group" aria-label="Trip photos">
                          {imageList.slice(0, 4).map((url, imgIdx) => (
                            <button
                              key={imgIdx}
                              type="button"
                              onClick={() => { setLightbox(imageList); setSlideIndex(imgIdx) }}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-amber-500"
                              aria-label={`View photo ${imgIdx + 1} from ${t.name || 'guest'}'s trip`}
                            >
                              <img
                                src={getImgUrl(url, DEFAULT_FALLBACK_IMAGE)}
                                alt={`Photo from ${t.name || 'guest'}'s review`}
                                onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            </button>
                          ))}
                          {imageList.length > 4 && (
                            <button
                              type="button"
                              onClick={() => { setLightbox(imageList); setSlideIndex(0) }}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-600 cursor-pointer hover:bg-stone-200 transition-colors shrink-0"
                              aria-label={`View all ${imageList.length} photos`}
                            >
                              +{imageList.length - 4}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Reviewer Details */}
                    <figcaption className="flex items-center gap-3 pt-4 border-t border-stone-100 mt-auto">
                      <img
                        src={avatarSrc}
                        alt={`${t.name || 'Guest'} avatar`}
                        onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
                        className="w-11 h-11 rounded-full object-cover border border-stone-200/80 shrink-0"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-stone-900 leading-tight truncate">
                            {t.name}
                          </h3>
                          {t.location && (
                            <span className="text-xs text-stone-400 font-normal shrink-0">
                              {t.location}
                            </span>
                          )}
                        </div>
                        {t.package && (
                          <span className="text-[11px] text-amber-800 font-medium bg-amber-500/10 px-2 py-0.5 rounded mt-1 inline-block truncate max-w-full">
                            {t.package}
                          </span>
                        )}
                      </div>
                    </figcaption>
                  </figure>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Pagination Dots */}
        {count > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {activeReviews.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === i ? 'w-6 bg-amber-600' : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-stone-950/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-stone-300 p-2 cursor-pointer rounded-full bg-white/10"
            aria-label="Close photo preview"
          >
            <X className="w-6 h-6" />
          </button>
          {lightbox.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevSlide() }}
                className="absolute left-4 text-white hover:text-stone-300 p-2 cursor-pointer rounded-full bg-white/10"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextSlide() }}
                className="absolute right-4 text-white hover:text-stone-300 p-2 cursor-pointer rounded-full bg-white/10"
                aria-label="Next photo"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
          <img
            src={getImgUrl(lightbox[slideIndex], DEFAULT_FALLBACK_IMAGE)}
            alt={`Photo ${slideIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
