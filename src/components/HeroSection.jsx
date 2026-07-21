import { Compass, CalendarRange, Sparkles, Globe, MapPin, Award, Heart } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const getImgUrl = (url) => {
  if (!url) return '/photo-1506929562872-bb421503ef21.jpeg'
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url
  if (url.startsWith('/assets/')) return `${API_URL}${url}`
  return url
}

const iconMap = {
  Compass,
  Sparkles,
  Globe,
  MapPin,
  Award,
  Heart,
  CalendarRange
}

export default function HeroSection({ onExplore, onBook, stats, heroSettings }) {
  const bgImage = getImgUrl(heroSettings?.bgImage || '/photo-1506929562872-bb421503ef21.jpeg')
  const titleMain = heroSettings?.titleMain ?? 'Kraft your perfect'
  const titleItalic = heroSettings?.titleItalic ?? 'journey.'
  const description = heroSettings?.description ?? "Handcrafted travel to the world's most extraordinary places \nfrom ancient temples in Kyoto to overwater villas in the Maldives. Your escape, designed end-to-end."
  const btnPrimaryText = heroSettings?.btnPrimaryText || 'Explore Packages'
  const btnSecondaryText = heroSettings?.btnSecondaryText || 'Plan a Custom Trip'

  const defaultStats = [
    { value: '10+', label: 'Trips Crafted', icon: 'Compass' },
    { value: '52%', label: 'Satisfaction', icon: 'Sparkles' },
    { value: '40+', label: 'Destinations', icon: 'Globe' }
  ]

  const displayStats = (heroSettings?.stats && heroSettings.stats.length > 0)
    ? heroSettings.stats
    : defaultStats

  return (
    <section className="relative min-h-[75vh] sm:min-h-[88vh] flex items-end justify-center overflow-hidden pt-20 pb-12 sm:pt-32 sm:pb-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Luxury tropical beach destination"
          className="w-full h-full object-cover scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/75 via-stone-950/45 to-stone-950/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/45 via-transparent to-stone-950/35" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center w-full">

        {/* Headline — display serif */}
        <h1 className="animate-fade-in-up delay-100 font-display text-4xl sm:text-5xl lg:text-7xl text-white leading-[1.05] tracking-[-0.02em] mb-6">
          {titleMain}{' '}
          <span className="block italic text-grey-400 mt-1">{titleItalic}</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up delay-200 text-sm sm:text-base lg:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed mb-10 font-light whitespace-pre-line">
          {description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 max-w-md mx-auto sm:max-w-none">
          <button
            onClick={() => onExplore?.()}
            className="w-full sm:w-auto px-7 py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full text-sm font-semibold active:scale-[0.97] transition-all duration-300 shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2"
          >
            {btnPrimaryText}
          </button>
          <button
            onClick={onBook}
            className="w-full sm:w-auto px-7 py-3.5 bg-white/95 hover:bg-white text-stone-900 rounded-full text-sm font-semibold active:scale-[0.97] transition-all duration-300 shadow-sm flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <CalendarRange className="w-4 h-4 text-amber-600" />
            {btnSecondaryText}
          </button>
        </div>

        {/* Floating Stats — clear of the categories strip below */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto pt-7 border-t border-white/15">
          {displayStats.map((stat, i) => {
            const IconComponent = iconMap[stat.icon] || Compass
            return (
              <div key={i} className="text-center flex flex-col items-center">
                <IconComponent className="w-5 h-5 text-amber-300 mb-2.5" />
                <span className="text-2xl sm:text-3xl lg:text-4xl font-display text-white tracking-tight">
                  {stat.value}
                </span>
                <p className="text-xs sm:text-xs text-white/70 font-medium mt-1 uppercase tracking-[0.15em]">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
