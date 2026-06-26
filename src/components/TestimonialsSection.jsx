import { useState, useEffect, useCallback } from 'react'
import { Star, ChevronLeft, ChevronRight, X } from 'lucide-react'

const DEFAULT_AVATAR = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#e4d5c5" rx="50"/><circle cx="50" cy="38" r="18" fill="#d4c4b5"/><path d="M20 80c0-18 13-32 30-32s30 14 30 32" fill="#d4c4b5"/></svg>'
)

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
      <section className="py-14 sm:py-20 bg-[#FAF9F5] border-y border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="editorial-mark text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">
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
    <section className="py-14 sm:py-20 bg-[#FAF9F5] border-y border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="editorial-mark text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">
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
          {testimonials.map((t, idx) => (
            <figure
              key={t.id}
              className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div>
                <div className="flex gap-0.5 text-amber-500 mb-4" aria-label={`${t.rating} star rating`}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                <blockquote className="text-sm text-stone-700 leading-relaxed italic mb-4 font-light">
                  &ldquo;{t.text}&rdquo;
                </blockquote>

                {t.images && t.images.length > 0 && (
                  <div className="flex gap-1.5 mb-4">
                    {t.images.slice(0, 3).map((url, imgIdx) => (
                      <button
                        key={imgIdx}
                        type="button"
                        onClick={() => { setLightbox(t.images); setSlideIndex(imgIdx) }}
                        className="w-18 h-18 rounded-xs overflow-hidden bg-stone-100 border border-stone-200 shrink-0 cursor-pointer hover:opacity-80 transition-opacity group"
                      >
                        <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </button>
                    ))}
                    {t.images.length > 3 && (
                      <button
                        type="button"
                        onClick={() => { setLightbox(t.images); setSlideIndex(0) }}
                        className="w-16 h-16 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-500 cursor-pointer hover:bg-stone-200 transition-colors shrink-0"
                      >
                        +{t.images.length - 3}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <figcaption className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <img
                  src={t.avatar || DEFAULT_AVATAR}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-stone-200/60 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-stone-900 leading-tight">
                    {t.name}
                  </h4>
                  <span className="text-xs text-stone-400 font-medium block">
                    {t.location}
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                    {t.package}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-stone-950/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors cursor-pointer z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video bg-stone-900 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={lightbox[slideIndex]}
                alt={`Photo ${slideIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {lightbox.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm cursor-pointer transition-all border border-white/20 hover:border-white/40 active:scale-95"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm cursor-pointer transition-all border border-white/20 hover:border-white/40 active:scale-95"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="flex gap-1.5">
                {lightbox.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === slideIndex ? 'bg-amber-300 w-5' : 'bg-white/30 hover:bg-white/50 w-1.5'
                      }`}
                    aria-label={`Go to photo ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="text-white/50 text-xs font-medium tabular-nums ml-2">
                {slideIndex + 1} / {lightbox.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}