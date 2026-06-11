import { formatINR } from '../utils/currency'
import { Clock, ArrowRight, Hotel, Compass, User, Car, Plane } from 'lucide-react'

export default function FeaturedPackages({ packages, onViewPackage }) {
  const featured = packages.slice(0, 4)

  return (
    <section className="py-12 sm:py-16 bg-[#FDFCF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-bold uppercase tracking-wider mb-4 border border-amber-500/10">
            Handpicked For You
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-4">
            Curated Luxury Experiences
          </h2>
          <p className="text-sm sm:text-base text-stone-500 max-w-2xl mx-auto">
            From ancient cultural tours to pristine island escapes, each package is meticulously crafted by our expert travel designers.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((pkg, index) => {
            const spotsLeft = pkg.slots.total - pkg.slots.booked
            return (
              <div
                key={pkg.id}
                onClick={() => onViewPackage(pkg)}
                className={`animate-fade-in-up group bg-white border border-stone-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer`}
                style={{ animationDelay: `${index * 100 + 200}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.cardImage}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent" />
                  
                  {/* Region Tag */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-white text-[9px] font-extrabold uppercase text-stone-700 border border-stone-200 shadow-sm rounded-lg">
                    {pkg.region}
                  </span>

                  {/* Availability Badge */}
                  <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase border shadow-sm ${
                    spotsLeft <= 3
                      ? 'bg-rose-500 text-white border-rose-400'
                      : 'bg-emerald-500 text-white border-emerald-400'
                  }`}>
                    {spotsLeft <= 3 ? `${spotsLeft} Left!` : `${spotsLeft} Spots`}
                  </span>

                  {/* Duration */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">{pkg.duration}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-700 transition-colors leading-tight mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-2 mb-3">
                    {pkg.description}
                  </p>

                  {/* Highlights pill list */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pkg.highlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <div>
                      <span className="text-[9px] text-stone-400 font-semibold uppercase block">From</span>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-stone-900">{formatINR(pkg.basePrice)}</span>
                        {/* Icons */}
                        <div className="flex items-center gap-1 text-stone-400">
                          {pkg.inclusionsSelection?.hotel && <Hotel className="w-3.5 h-3.5" title="Hotel Included" />}
                          {pkg.inclusionsSelection?.sightseeing && <Compass className="w-3.5 h-3.5" title="Sightseeing Included" />}
                          {pkg.inclusionsSelection?.guide && <User className="w-3.5 h-3.5" title="Guide Included" />}
                          {pkg.inclusionsSelection?.airportTransfer && <Car className="w-3.5 h-3.5" title="Airport Transfer Included" />}
                          {pkg.inclusionsSelection?.flight && <Plane className="w-3.5 h-3.5" title="Flight Included" />}
                        </div>
                      </div>
                    </div>
                    <span className="text-amber-700 text-xs font-bold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                      Explore
                      <ArrowRight className="w-3.5 h-3.5" />
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
