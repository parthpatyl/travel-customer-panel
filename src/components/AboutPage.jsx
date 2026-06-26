import { Sparkles, Compass, Sliders, PhoneCall } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      title: 'Bespoke Curation',
      desc: 'No two journeys are the same. Our luxury travel designers create custom-tailored itineraries to meet your exact desires.',
      icon: Sparkles
    },
    {
      title: 'Expert Local Guides',
      desc: 'Gain exclusive access and deep cultural connection through our network of elite professional guides and historians.',
      icon: Compass
    },
    {
      title: 'Seamless Coordination',
      desc: 'From VIP fast-track airport customs to private jet and helicopter charters, we coordinate every detail flawlessly.',
      icon: Sliders
    },
    {
      title: '24/7 Concierge Support',
      desc: 'Travel with absolute confidence. Our operations team and local field agents are on call around the clock to support you.',
      icon: PhoneCall
    }
  ]

  return (
    <section className="bg-[#FDFCF7]">
      {/* Banner */}
      <div className="relative py-20 sm:py-28 bg-stone-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1920&q=80"
            alt="Scenic mountain peaks banner"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/20 to-stone-900/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-amber-200 text-xs font-semibold uppercase tracking-[0.2em] mb-4 border border-white/15">
            Our Story
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-[-0.02em]">
            Curating bespoke travel
          </h1>
          <p className="text-sm sm:text-base text-white/85 max-w-2xl mx-auto leading-relaxed mt-5 font-light">
            Founded on the belief that travel should be art, KRAFT YOUR TRIP transforms ordinary vacations into masterfully tailored luxury itineraries.
          </p>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <span className="editorial-mark-start text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Our Philosophy
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-stone-900 tracking-[-0.02em] leading-[1.1]">
              Bespoke travel, curated down to the finest detail.
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
              We understand that the true luxury of travel isn't just the 5-star accommodations or private transport — it's the luxury of peace of mind, of deep local experiences, and of memories created without friction.
            </p>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
              Whether it is exploring Kyoto's historic shrines in traditional dress, trekking the alpine trails facing the Matterhorn, or floating in a private overwater bungalow in the Maldives, our specialists spend months designing, testing, and perfecting each detail to guarantee a perfect trip.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-square animate-fade-in-up delay-100">
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
              alt="Travel design roadmap"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-[#FAF9F5] border-y border-stone-200/70 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="editorial-mark text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">
              The KRAFT Standard
            </span>
            <h3 className="font-display text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Why discerning travellers choose us
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <article
                  key={i}
                  className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
                >
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-stone-900 mb-2 font-display tracking-tight">{v.title}</h4>
                  <p className="text-sm text-stone-600 leading-relaxed font-light flex-grow">{v.desc}</p>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 max-w-5xl mx-auto">
          {[
            { count: '500+', label: 'Tailored Journeys', desc: 'Curating bespoke travel itineraries since 2018.' },
            { count: '98%', label: 'Guest Satisfaction', desc: 'Based on feedback surveys from returned travellers.' },
            { count: '50+', label: 'Global Destinations', desc: 'Partnering with premium accommodations across continents.' }
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <span className="font-display text-5xl sm:text-6xl text-amber-700 block tracking-tight">
                {stat.count}
              </span>
              <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-[0.15em]">{stat.label}</h4>
              <p className="text-sm text-stone-500 font-light leading-relaxed max-w-[20ch] mx-auto">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
