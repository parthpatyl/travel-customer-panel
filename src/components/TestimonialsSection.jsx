import { useState, useEffect, useCallback } from 'react'
import { Star, ChevronLeft, ChevronRight, X } from 'lucide-react'
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

export default function TestimonialsSection({ testimonials = [] }) {
  const [lightbox, setLightbox] = useState(null)
  const [slideIndex, setSlideIndex] = useState(0)

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

  if (testimonials.length === 0) {
    return (
      <section className="py-14 sm:py-20 bg-[#FAF9F5] border-y border-stone-200/70" aria-label="Guest Experiences">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="editorial-mark text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3 block">
              Guest Experiences
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-stone-900 tracking-tight mb-3">
              What our travellers say
            </h2>
          </div>
          <div className="text-center text-stone-400 text-sm italic font-light">
            Traveller stories will appear here once guests share their experiences.
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-14 sm:py-20 bg-[#FAF9F5] border-y border-stone-200/70" aria-label="Guest Experiences">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="editorial-mark text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3 block">
            Guest Experiences
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-stone-900 tracking-tight mb-3">
            What our travellers say
          </h2>
          <p className="text-sm text-stone-500 max-w-xl mx-auto font-light">
            Real stories from travellers who embarked on our handcrafted luxury journeys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, idx) => {
            const imageList = parseImageList(t.images)
            const avatarSrc = t.avatar ? getImgUrl(t.avatar, DEFAULT_AVATAR) : DEFAULT_AVATAR

            return (
              <figure
                key={t.id}
                className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div>
                  <div className="flex gap-0.5 text-amber-500 mb-4" aria-label={`${t.rating || 5} out of 5 stars rating`}>
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                    ))}
                  </div>

                  <blockquote className="text-sm text-stone-700 leading-relaxed italic mb-4 font-light">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>

                  {imageList.length > 0 && (
                    <div className="flex gap-1.5 mb-4" role="group" aria-label="Trip photos">
                      {imageList.slice(0, 3).map((url, imgIdx) => (
                        <button
                          key={imgIdx}
                          type="button"
                          onClick={() => { setLightbox(imageList); setSlideIndex(imgIdx) }}
                          className="w-18 h-18 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0 cursor-pointer hover:opacity-85 transition-opacity group focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
                          aria-label={`View photo ${imgIdx + 1} from ${t.name || 'guest'}'s trip`}
                        >
                          <img
                            src={getImgUrl(url, DEFAULT_FALLBACK_IMAGE)}
                            alt={`Photo ${imgIdx + 1} from ${t.name || 'guest'}'s review`}
                            onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </button>
                      ))}
                      {imageList.length > 3 && (
                        <button
                          type="button"
                          onClick={() => { setLightbox(imageList); setSlideIndex(0) }}
                          className="w-18 h-18 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-500 cursor-pointer hover:bg-stone-200 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
                          aria-label={`View all ${imageList.length} photos from ${t.name || 'guest'}'s trip`}
                        >
                          +{imageList.length - 3}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <figcaption className="flex items-center gap-3 pt-4 border-t border-stone-100">
                  <img
                    src={avatarSrc}
                    alt={`${t.name || 'Guest'} avatar`}
                    onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
                    className="w-12 h-12 rounded-full object-cover border border-stone-200/60 shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-stone-900 leading-tight truncate">
                      {t.name}
                    </h3>
                    {t.location && (
                      <span className="text-xs text-stone-400 font-medium block truncate">
                        {t.location}
                      </span>
                    )}
                    {t.package && (
                      <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded mt-1 inline-block truncate max-w-full">
                        {t.package}
                      </span>
                    )}
                  </div>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-stone-950/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Trip Photo Lightbox"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors cursor-pointer z-10 p-1.5 rounded-full hover:bg-white/10"
              aria-label="Close photo lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative aspect-video bg-stone-900 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 shadow-2xl">
              <img
                src={getImgUrl(lightbox[slideIndex], DEFAULT_FALLBACK_IMAGE)}
                alt={`Photo ${slideIndex + 1} of ${lightbox.length}`}
                onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                className="max-w-full max-h-full object-contain"
              />

              {lightbox.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white backdrop-blur-sm cursor-pointer transition-all border border-white/20 hover:border-white/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white backdrop-blur-sm cursor-pointer transition-all border border-white/20 hover:border-white/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="flex gap-1.5" role="tablist" aria-label="Photo thumbnails navigation">
                {lightbox.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === slideIndex ? 'bg-amber-400 w-6' : 'bg-white/30 hover:bg-white/50 w-2'
                    }`}
                    aria-label={`Go to photo ${idx + 1}`}
                    aria-selected={idx === slideIndex}
                  />
                ))}
              </div>
              <span className="text-white/60 text-xs font-medium tabular-nums ml-2" aria-live="polite">
                {slideIndex + 1} / {lightbox.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}