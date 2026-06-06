import testimonials from '../data/testimonials'

export default function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-24 bg-[#FAF9F5]/40 border-y border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14 animate-fade-in-up">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-bold uppercase tracking-wider mb-4 border border-amber-500/10">
            Guest Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-sm sm:text-base text-stone-500 max-w-2xl mx-auto">
            Real stories from travelers who embarked on our handcrafted luxury journeys.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div>
                {/* Rating stars */}
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed italic mb-6">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200/60"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 leading-tight">
                    {t.name}
                  </h4>
                  <span className="text-[10px] text-stone-400 font-medium block">
                    {t.location}
                  </span>
                  <span className="text-[9px] text-amber-700 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded mt-1 inline-block">
                    {t.package}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
