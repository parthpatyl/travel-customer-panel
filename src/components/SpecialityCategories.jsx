import { useState, useEffect, useMemo } from 'react'
import {
  Compass,
  Sparkles,
  Heart,
  Binoculars,
  Utensils,
  Ship,
  Camera,
  Users,
  ArrowRight,
  Sparkle
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const ICON_MAP = {
  Compass,
  Sparkles,
  Heart,
  Binoculars,
  Utensils,
  Ship,
  Camera,
  Users,
}

const DEFAULT_CATEGORIES = [
  {
    id: 'adventure',
    name: 'Adventure',
    subtitle: 'Thrilling treks & expeditions',
    keyword: 'Adventure',
    iconName: 'Compass',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    accentColor: 'text-blue-400 group-hover:text-blue-300',
    defaultCount: 24,
  },
  {
    id: 'wellness',
    name: 'Wellness',
    subtitle: 'Rejuvenate mind & body',
    keyword: 'Wellness',
    iconName: 'Sparkles',
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50',
    accentColor: 'text-teal-400 group-hover:text-teal-300',
    defaultCount: 18,
  },
  {
    id: 'honeymoon',
    name: 'Honeymoon',
    subtitle: 'Romantic getaways',
    keyword: 'Honeymoon',
    iconName: 'Heart',
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-50',
    accentColor: 'text-rose-400 group-hover:text-rose-300',
    defaultCount: 31,
  },
  {
    id: 'wildlife',
    name: 'Wildlife',
    subtitle: 'Safari & nature tours',
    keyword: 'Wildlife',
    iconName: 'Binoculars',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    accentColor: 'text-emerald-400 group-hover:text-emerald-300',
    defaultCount: 15,
  },
  {
    id: 'culinary',
    name: 'Culinary',
    subtitle: 'Taste the world',
    keyword: 'Culinary',
    iconName: 'Utensils',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    accentColor: 'text-amber-400 group-hover:text-amber-300',
    defaultCount: 22,
  },
  {
    id: 'cruises',
    name: 'Cruises',
    subtitle: 'Sail the seas in style',
    keyword: 'Cruise',
    iconName: 'Ship',
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-50',
    accentColor: 'text-sky-400 group-hover:text-sky-300',
    defaultCount: 9,
  },
  {
    id: 'photography',
    name: 'Photography',
    subtitle: 'Capture stunning moments',
    keyword: 'Photography',
    iconName: 'Camera',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    accentColor: 'text-purple-400 group-hover:text-purple-300',
    defaultCount: 11,
  },
  {
    id: 'group-tours',
    name: 'Group Tours',
    subtitle: 'Travel with like-minded people',
    keyword: 'Group',
    iconName: 'Users',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    accentColor: 'text-indigo-400 group-hover:text-indigo-300',
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
              iconName: dbCat.iconName || defCat?.iconName || 'Compass',
              iconColor: dbCat.iconColor || defCat?.iconColor || 'text-amber-600',
              iconBg: dbCat.iconBg || defCat?.iconBg || 'bg-amber-50',
              accentColor: dbCat.accentColor || defCat?.accentColor || 'text-amber-500 group-hover:text-amber-400',
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
  }, [packages, categories])

  return (
    <section className="relative py-16 sm:py-20 bg-[#FDFCF7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Header Badge & Title ── */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/5 border border-stone-900/10 text-stone-800 text-xs font-semibold tracking-wide mb-4 shadow-xs">
            <Sparkle className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Unique Experiences</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
            Speciality{' '}
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
              Tour Categories
            </span>
          </h2>

          <p className="text-sm sm:text-base text-stone-500 mt-3 font-light leading-relaxed">
            Beyond ordinary travel — choose your unique adventure style.
          </p>
        </div>

        {/* ── Card Grid Layout ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {categories.filter((cat) => cat.isActive !== false).map((cat, idx) => {
            const Icon = ICON_MAP[cat.iconName] || Compass
            const count = categoryCounts[cat.id]

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory?.(cat.name, cat.keyword || cat.name)}
                className="group relative bg-[#132238] border border-stone-800/80 hover:border-amber-500/40 rounded-2xl p-6 sm:p-7 flex flex-col items-center text-center shadow-lg hover:shadow-2xl hover:shadow-stone-950/20 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Ambient glow effect on card hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* White Squircle Icon Box */}
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-stone-950/20 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1">
                  <Icon className={`w-7 h-7 ${cat.iconColor || 'text-amber-600'}`} />
                </div>

                {/* Category Title */}
                <h3 className="font-display text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </h3>

                {/* Subtitle */}
                <p className="text-xs text-stone-400 font-light mt-1.5 mb-6 line-clamp-2 leading-relaxed">
                  {cat.subtitle}
                </p>

                {/* Footer Count & Link */}
                <div className="mt-auto pt-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${cat.accentColor || 'text-amber-400'} transition-colors`}>
                    <span>{count} Tours</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
