import { useState, useEffect, useMemo } from 'react'
import { ArrowRight, Sparkle } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const DEFAULT_CATEGORIES = [
  {
    id: 'adventure',
    name: 'Adventure',
    subtitle: 'Thrilling treks & expeditions',
    keyword: 'Adventure',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    accentColor: 'text-amber-400 group-hover:text-amber-300',
    defaultCount: 24,
  },
  {
    id: 'wellness',
    name: 'Wellness',
    subtitle: 'Rejuvenate mind & body',
    keyword: 'Wellness',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    accentColor: 'text-amber-400 group-hover:text-amber-300',
    defaultCount: 18,
  },
  {
    id: 'honeymoon',
    name: 'Honeymoon',
    subtitle: 'Romantic getaways & escapes',
    keyword: 'Honeymoon',
    imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80',
    accentColor: 'text-amber-400 group-hover:text-amber-300',
    defaultCount: 31,
  },
  {
    id: 'wildlife',
    name: 'Wildlife',
    subtitle: 'Safari & nature tours',
    keyword: 'Wildlife',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    accentColor: 'text-amber-400 group-hover:text-amber-300',
    defaultCount: 15,
  },
  {
    id: 'culinary',
    name: 'Culinary',
    subtitle: 'Taste authentic world flavors',
    keyword: 'Culinary',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    accentColor: 'text-amber-400 group-hover:text-amber-300',
    defaultCount: 22,
  },
  {
    id: 'cruises',
    name: 'Cruises',
    subtitle: 'Sail the seas in private luxury',
    keyword: 'Cruise',
    imageUrl: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80',
    accentColor: 'text-amber-400 group-hover:text-amber-300',
    defaultCount: 9,
  },
  {
    id: 'photography',
    name: 'Photography',
    subtitle: 'Capture cinematic landscapes',
    keyword: 'Photography',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    accentColor: 'text-amber-400 group-hover:text-amber-300',
    defaultCount: 11,
  },
  {
    id: 'group-tours',
    name: 'Group Tours',
    subtitle: 'Travel with like-minded people',
    keyword: 'Group',
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80',
    accentColor: 'text-amber-400 group-hover:text-amber-300',
    defaultCount: 27,
  },
]

export default function SpecialityCategories({ packages = [], onSelectCategory }) {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)

  // Fetch dynamic categories from backend if available
  useEffect(() => {
    fetch(`${API_URL}/api/speciality-categories`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const merged = data.map((dbCat) => {
            const defCat = DEFAULT_CATEGORIES.find((c) => c.id === dbCat.id)
            return {
              ...dbCat,
              imageUrl: dbCat.imageUrl || defCat?.imageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
              accentColor: dbCat.accentColor || defCat?.accentColor || 'text-amber-400 group-hover:text-amber-300',
              subtitle: dbCat.subtitle || defCat?.subtitle || `Explore handpicked ${dbCat.name.toLowerCase()} tours.`,
            }
          })
          setCategories(merged)
        }
      })
      .catch(() => {
        // use default static list on error
      })
  }, [])

  // Compute dynamic tour counts matching each category explicitly from packages list
  const categoryCounts = useMemo(() => {
    const counts = {}
    categories.forEach((cat) => {
      if (!packages || packages.length === 0) {
        counts[cat.id] = 0
        return
      }

      const matches = packages.filter((pkg) => {
        return Array.isArray(pkg.categoryIds) && pkg.categoryIds.includes(cat.id)
      })

      counts[cat.id] = matches.length
    })
    return counts
  }, [categories, packages])

  return (
    <section className="relative z-10 py-14 sm:py-20 bg-[#FDFCF7] border-t border-stone-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header (Centered) ── */}
        <div className="text-center flex flex-col items-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/5 border border-stone-900/10 text-stone-800 text-[11px] font-semibold tracking-wide mb-3 shadow-xs">
            <Sparkle className="w-3 h-3 text-amber-600 fill-amber-500" />
            <span>Unique Experiences</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
            Speciality{' '}
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
              Tour Categories
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-stone-500 mt-2 font-light leading-relaxed">
            Beyond ordinary travel — choose your unique adventure style.
          </p>
        </div>

        {/* ── Responsive Card Grid Layout with Photographic Backgrounds ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
          {categories.filter((cat) => cat.isActive !== false).map((cat, idx) => {
            const count = categoryCounts[cat.id]
            const imgUrl = cat.imageUrl?.startsWith('http') ? cat.imageUrl : (cat.imageUrl ? `${API_URL}${cat.imageUrl}` : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80')

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory?.(cat.name, cat.keyword || cat.name, cat.id)}
                className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden border border-stone-800/80 shadow-md hover:shadow-2xl hover:shadow-stone-950/40 transition-all duration-500 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-end p-4 sm:p-5"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Full-card photographic background */}
                <img
                  src={imgUrl}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
                  }}
                />

                {/* Dark Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-stone-950/20 group-hover:from-stone-950 group-hover:via-stone-950/40 transition-colors duration-500 pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col">
                  {/* Category Title */}
                  <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors drop-shadow-sm">
                    {cat.name}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-[11px] sm:text-xs text-stone-300/90 font-light mt-1 mb-3 line-clamp-2 leading-snug">
                    {cat.subtitle}
                  </p>

                  {/* Footer Count & Link */}
                  <div className="pt-1 flex items-center justify-between border-t border-white/10">
                    <span className="text-[11px] sm:text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1">
                      <span>{count} Tours</span>
                      <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
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
