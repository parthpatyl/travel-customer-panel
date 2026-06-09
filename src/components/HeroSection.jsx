export default function HeroSection({ onExplore, onBook }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury tropical beach destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-[#FDFCF7]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20">
        {/* Headline */}
        <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
          Craft Your Perfect
          <span className="block text-amber-300 mt-1">Journey</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up delay-200 text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
          Discover handcrafted travel packages to the world's most extraordinary destinations.
          From ancient temples in Kyoto to overwater villas in the Maldives your dream escape awaits.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onExplore}
            className="px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-amber-600/25 active:scale-[0.97] transition-all duration-300 flex items-center gap-2 animate-pulse-glow"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Explore Destinations
          </button>
          <button
            onClick={onBook}
            className="px-8 py-3.5 bg-white hover:bg-stone-100 text-stone-900 rounded-2xl text-sm font-bold active:scale-[0.97] transition-all duration-300 shadow-sm"
          >
            Book Your Trip
          </button>
        </div>

        {/* Floating Stats */}
        <div className="animate-fade-in-up delay-500 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto">
          {[
            { value: '500+', label: 'Trips Planned' },
            { value: '98%', label: 'Satisfaction' },
            { value: '50+', label: 'Destinations' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-white">{stat.value}</span>
              <p className="text-[10px] sm:text-xs text-white/60 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
          <div className="w-1 h-2.5 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
