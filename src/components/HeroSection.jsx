import { Compass, CalendarRange, Map, Sparkles, Globe } from 'lucide-react'

export default function HeroSection({ onExplore, onBook }) {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden py-12">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury tropical beach destination"
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/30 to-[#FDFCF7]" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/40 via-transparent to-stone-900/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-12">
        {/* Headline */}
        <h1 className="animate-fade-in-up delay-100 text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
          Craft Your Perfect <span className="text-amber-300">Journey</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up delay-200 text-sm sm:text-base lg:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-6 font-light">
          Discover handcrafted travel packages to the world's most extraordinary destinations. From ancient temples in Kyoto to overwater villas in the Maldives your dream escape awaits.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button
            onClick={() => onExplore()}
            className="px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-amber-600/25 active:scale-[0.97] transition-all duration-300 flex items-center gap-2 animate-pulse-glow"
          >
            <Compass className="w-5 h-5" />
            Explore Destinations
          </button>
          <button
            onClick={onBook}
            className="px-8 py-3.5 bg-white hover:bg-stone-100 text-stone-900 rounded-2xl text-sm font-bold active:scale-[0.97] transition-all duration-300 shadow-sm flex items-center gap-2"
          >
            <CalendarRange className="w-5 h-5 text-amber-600" />
            Book Your Trip
          </button>
        </div>

        {/* Floating Stats */}
        <div className="animate-fade-in-up delay-500 grid grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto border-t border-white/10 pt-5 mt-5">
          {[
            { value: '500+', label: 'Trips Planned', icon: Map },
            { value: '98%', label: 'Satisfaction', icon: Sparkles },
            { value: '50+', label: 'Destinations', icon: Globe },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="text-center flex flex-col items-center">
                <Icon className="w-6 h-6 text-amber-300 mb-2.5 animate-bounce-slow" />
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">{stat.value}</span>
                <p className="text-xs sm:text-sm text-white/70 font-semibold mt-1.5 uppercase tracking-wider">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
