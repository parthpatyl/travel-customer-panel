import { Compass, CalendarRange, Sparkles, Globe } from 'lucide-react'

export default function HeroSection({ onExplore, onBook }) {
  return (
    <section className="relative min-h-[75vh] sm:min-h-[88vh] flex items-end justify-center overflow-hidden pt-20 pb-12 sm:pt-32 sm:pb-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/photo-1506929562872-bb421503ef21.jpeg"
          alt="Luxury tropical beach destination"
          className="w-full h-full object-cover scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/75 via-stone-950/45 to-stone-950/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/45 via-transparent to-stone-950/35" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center w-full">
        {/* Editorial eyebrow */}
        <div className="animate-fade-in-up delay-100 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-[0.2em] mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
          Bespoke travel since 2018
        </div>

        {/* Headline — display serif */}
        <h1 className="animate-fade-in-up delay-100 font-display text-4xl sm:text-5xl lg:text-7xl text-white leading-[1.05] tracking-[-0.02em] mb-6">
          Kraft your perfect
          <span className="block italic text-grey-400 mt-1">journey.</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up delay-200 text-sm sm:text-base lg:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
          Handcrafted travel to the world's most extraordinary places <br /> from ancient temples in Kyoto to overwater villas in the Maldives. Your escape, designed end-to-end.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14">
          <button
            onClick={() => onExplore()}
            className="w-full sm:w-auto px-7 py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full text-sm font-semibold shadow-lg shadow-amber-900/20 active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            Explore Destinations
          </button>
          <button
            onClick={onBook}
            className="w-full sm:w-auto px-7 py-3.5 bg-white/95 hover:bg-white text-stone-900 rounded-full text-sm font-semibold active:scale-[0.97] transition-all duration-300 shadow-sm flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <CalendarRange className="w-4 h-4 text-amber-600" />
            Plan a Custom Trip
          </button>
        </div>

        {/* Floating Stats — clear of the categories strip below */}
        <div className=" grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto pt-7 border-t border-white/15">
          {[
            { value: '500+', label: 'Trips Crafted', icon: Compass },
            { value: '98%', label: 'Satisfaction', icon: Sparkles },
            { value: '50+', label: 'Destinations', icon: Globe },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="text-center flex flex-col items-center">
                <Icon className="w-5 h-5 text-amber-300 mb-2.5" />
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
