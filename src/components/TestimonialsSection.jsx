import { Star } from 'lucide-react'

export default function TestimonialsSection({ testimonials = [] }) {
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
        {/* Section Header */}
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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, idx) => (
            <figure
              key={t.id}
              className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div>
                {/* Rating stars */}
                <div className="flex gap-0.5 text-amber-500 mb-4" aria-label={`${t.rating} star rating`}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                <blockquote className="text-sm text-stone-700 leading-relaxed italic mb-6 font-light">
                  "{t.text}"
                </blockquote>
              </div>

              <figcaption className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200/60"
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
    </section>
  )
}
