import testimonials from '../data/testimonials'
import { Star } from 'lucide-react'

export default function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-16 bg-[#FAF9F5]/40 border-y border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 animate-fade-in-up">
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
                <div className="flex gap-0.5 text-amber-500 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
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
