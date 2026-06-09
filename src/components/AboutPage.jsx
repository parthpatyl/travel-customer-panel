export default function AboutPage() {
  const values = [
    {
      title: 'Bespoke Curation',
      desc: 'No two journeys are the same. Our luxury travel designers create custom-tailored itineraries to meet your exact desires.',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    },
    {
      title: 'Expert Local Guides',
      desc: 'Gain exclusive access and deep cultural connection through our network of elite professional guides and historians.',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    },
    {
      title: 'Seamless Coordination',
      desc: 'From VIP fast-track airport customs to private jet and helicopter charters, we coordinate every detail flawlessly.',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
    },
    {
      title: '24/7 Concierge Support',
      desc: 'Travel with absolute confidence. Our operations team and local field agents are on call around the clock to support you.',
      icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
    }
  ]

  return (
    <section className="bg-[#FDFCF7]">
      {/* Banner */}
      <div className="relative py-28 sm:py-36 bg-stone-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1920&q=80"
            alt="Scenic mountain peaks banner"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FDFCF7]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-stone-800 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-4 border border-stone-700">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Curating Bespoke Travel
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed mt-4 font-light">
            Founded on the belief that travel should be art, KRAFT YOUR TRIP transforms ordinary vacations into masterfully tailored luxury itineraries.
          </p>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <span className="text-[10px] text-amber-700 font-extrabold uppercase tracking-wider">Our Philosophy</span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">
              Bespoke travel, curated down to the finest detail.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              We understand that the true luxury of travel isn't just the 5-star accommodations or private transport—it's the luxury of peace of mind, of deep local experiences, and of memories created without friction.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Whether it is exploring Kyoto's historic shrines in traditional dress, trekking the alpine trails facing the Matterhorn, or floating in a private overwater bungalow in the Maldives, our specialists spend months designing, testing, and perfecting each detail to guarantee a perfect trip.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video lg:aspect-square animate-fade-in-up delay-100">
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
              alt="Travel design roadmap"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-[#FAF9F5]/40 border-y border-stone-200/50 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-bold uppercase tracking-wider mb-4 border border-amber-500/10">
              The KRAFT Standard
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Why Discerning Travelers Choose Us
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={v.icon} />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-stone-900 mb-2">{v.title}</h4>
                <p className="text-xs text-stone-550 leading-relaxed font-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-3xl mx-auto">
          {[
            { count: '500+', label: 'Tailored Journeys Completed', desc: 'Curating bespoke travel itineraries since 2018.' },
            { count: '98%', label: 'Guest Satisfaction Rating', desc: 'Based on feedback surveys from returned luxury travelers.' },
            { count: '50+', label: 'Exotic Global Locations', desc: 'Partnering with premium accommodations across all continents.' }
          ].map((stat, i) => (
            <div key={i} className="space-y-2 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <span className="text-4xl sm:text-5xl font-black text-amber-750 block">{stat.count}</span>
              <h4 className="text-xs font-bold text-stone-900">{stat.label}</h4>
              <p className="text-[11px] text-stone-400 font-light leading-normal">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
