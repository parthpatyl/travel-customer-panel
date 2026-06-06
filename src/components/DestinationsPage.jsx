import { useState } from 'react'
import { formatINR } from '../utils/currency'

export default function DestinationsPage({ packages, onViewPackage }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')

  const regions = ['All', 'Asia', 'Europe']

  const filteredPackages = packages.filter((pkg) => {
    const matchesRegion = selectedRegion === 'All' || pkg.region === selectedRegion
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.region.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRegion && matchesSearch
  })

  return (
    <section className="py-24 sm:py-32 bg-[#FDFCF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-bold uppercase tracking-wider mb-4 border border-amber-500/10">
            Luxury Catalog
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight mb-4">
            Handcrafted Destinations
          </h1>
          <p className="text-sm sm:text-base text-stone-500 max-w-2xl mx-auto">
            Discover our collection of curated luxury travel experiences designed for the discerning traveler.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up delay-100">
          {/* Region Filter */}
          <div className="flex gap-2 w-full sm:w-auto">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRegion === region
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-[#FAF9F5]/80 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {region === 'All' ? 'All Regions' : region}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4.5 w-4.5 text-stone-455" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9F5]/50 border border-stone-200 focus:border-amber-500 rounded-xl py-2 pl-10 pr-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 focus:ring-amber-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Grid List */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, index) => {
              const spotsLeft = pkg.slots.total - pkg.slots.booked
              return (
                <div
                  key={pkg.id}
                  onClick={() => onViewPackage(pkg)}
                  className="animate-fade-in-up group bg-white border border-stone-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                  style={{ animationDelay: `${index * 50 + 100}ms` }}
                >
                  {/* Card Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={pkg.cardImage}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                    
                    {/* Region Tag */}
                    <span className="absolute top-3.5 left-3.5 px-2.5 py-0.5 bg-white/95 backdrop-blur-sm rounded-lg text-[9px] font-extrabold uppercase text-stone-700 border border-white/50">
                      {pkg.region}
                    </span>

                    {/* Spots Tag */}
                    <span className={`absolute top-3.5 right-3.5 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase border backdrop-blur-sm ${
                      spotsLeft <= 3
                        ? 'bg-rose-500/90 text-white border-rose-400/50'
                        : 'bg-emerald-500/90 text-white border-emerald-400/50'
                    }`}>
                      {spotsLeft <= 3 ? `${spotsLeft} Left!` : `${spotsLeft} Spots`}
                    </span>

                    {/* Duration badge */}
                    <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 text-white/90">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-semibold">{pkg.duration}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-700 transition-colors leading-tight mb-2.5">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed line-clamp-3 mb-5">
                      {pkg.description}
                    </p>

                    {/* Highlights pill list */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {pkg.highlights.slice(0, 3).map((h, i) => (
                        <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md border border-stone-200/30">
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                      <div>
                        <span className="text-[9px] text-stone-400 font-semibold uppercase block">From</span>
                        <span className="text-xl font-black text-stone-900">{formatINR(pkg.basePrice)}</span>
                      </div>
                      <span className="text-amber-750 text-xs font-bold group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-1">
                        Explore Details
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-stone-200/60 rounded-2xl p-8 shadow-sm">
            <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-sm font-bold text-stone-900 mb-1">No Destinations Found</h3>
            <p className="text-xs text-stone-400">We couldn't find any travel packages matching your search criteria.</p>
          </div>
        )}
      </div>
    </section>
  )
}
