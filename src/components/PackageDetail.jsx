import { useState } from 'react'
import { formatINR } from '../utils/currency'
import { ArrowLeft, Check, CheckCircle2, X, Phone, Mail, Clock, Globe, Flame, MapPin, Hotel, Compass, User, Car, Plane } from 'lucide-react'

export default function PackageDetail({ pkg, onBack, onBook }) {
  const [activeTab, setActiveTab] = useState('itinerary') // tabs: itinerary, inclusions

  const spotsLeft = pkg.slots.total - pkg.slots.booked

  return (
    <section className="bg-[#FDFCF7] pb-24">
      {/* Hero Header */}
      <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        <img
          src={pkg.heroImage}
          alt={pkg.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/30 to-stone-950/80" />
        
        {/* Navigation / Header content */}
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex flex-col justify-end h-full">
          {/* Back button */}
          <button
            onClick={onBack}
            className="self-start mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white text-stone-900 hover:bg-stone-100 shadow-sm border border-stone-200 rounded-xl text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Destinations
          </button>

          {/* Badges */}
          <div className="flex gap-3 items-center mb-4">
            <span className="px-2.5 py-0.5 bg-amber-500 text-white text-[9px] font-extrabold uppercase rounded-lg border border-amber-400/30">
              {pkg.region}
            </span>
            <span className="px-2.5 py-0.5 bg-white text-stone-900 text-[9px] font-bold uppercase rounded-lg border border-stone-200">
              {pkg.duration}
            </span>
            <span className="text-xs text-white/80 font-medium font-mono">ID: {pkg.id}</span>
          </div>

          {/* Name */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {pkg.name}
          </h1>
        </div>
      </div>

      {/* Content Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Description, Highlights, Tabs (Itinerary/Inclusions) */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
            {/* Overview */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-stone-900 mb-4 tracking-tight">Overview</h2>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                {pkg.description}
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="bg-[#FAF9F5]/40 border border-stone-200/60 rounded-2xl p-6 md:p-8">
              <h2 className="text-base font-bold text-stone-900 mb-4 tracking-tight">Trip Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pkg.highlights.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-705 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span className="text-xs text-stone-750 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary Tabs Container */}
            <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="border-b border-stone-100 flex">
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`flex-1 py-4 text-xs font-bold text-center border-b-2 transition-all ${
                    activeTab === 'itinerary'
                      ? 'border-amber-600 text-amber-750'
                      : 'border-transparent text-stone-400 hover:text-stone-750'
                  }`}
                >
                  Itinerary Schedule
                </button>
                <button
                  onClick={() => setActiveTab('inclusions')}
                  className={`flex-1 py-4 text-xs font-bold text-center border-b-2 transition-all ${
                    activeTab === 'inclusions'
                      ? 'border-amber-600 text-amber-750'
                      : 'border-transparent text-stone-400 hover:text-stone-750'
                  }`}
                >
                  Inclusions & Exclusions
                </button>
              </div>

              <div className="p-6 md:p-8">
                {/* Tab content: Itinerary */}
                {activeTab === 'itinerary' && (
                  <div className="relative border-l border-stone-200 pl-6 ml-3 space-y-8">
                    {pkg.itinerary.map((dayItem, idx) => (
                      <div key={idx} className="relative group">
                        {/* Bullet circle */}
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-amber-600 border-4 border-white shadow-sm transition-transform duration-300 group-hover:scale-125" />
                        
                        <div>
                          <span className="text-[10px] text-amber-700 font-extrabold uppercase tracking-wider block mb-1">
                            Day {dayItem.day}
                          </span>
                          <h4 className="text-sm font-bold text-stone-900 mb-2">
                            {dayItem.title}
                          </h4>
                          <p className="text-xs text-stone-550 leading-relaxed font-light">
                            {dayItem.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab content: Inclusions/Exclusions */}
                {activeTab === 'inclusions' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Inclusions */}
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4 border-b border-stone-100 pb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> What's Included
                      </h4>
                      <ul className="space-y-3">
                        {pkg.inclusions.map((inc, i) => (
                          <li key={i} className="flex gap-2.5 items-start text-xs text-stone-600 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Exclusions */}
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4 border-b border-stone-100 pb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> What's Excluded
                      </h4>
                      <ul className="space-y-3">
                        {pkg.exclusions.map((exc, i) => (
                          <li key={i} className="flex gap-2.5 items-start text-xs text-stone-600 leading-relaxed">
                            <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Card */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 animate-fade-in-up delay-100">
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-md space-y-6">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Price Per Person</span>
                <div className="flex items-baseline justify-between gap-1 mt-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-stone-900">{formatINR(pkg.basePrice)}</span>
                    <span className="text-[11px] text-stone-400 font-medium">INR</span>
                  </div>
                  {/* Icons next to the price */}
                  <div className="flex items-center gap-1.5 text-stone-400 bg-stone-50 px-2 py-1 rounded-lg border border-stone-100">
                    {pkg.inclusionsSelection?.hotel && <Hotel className="w-4 h-4 text-stone-600" title="Hotel Included" />}
                    {pkg.inclusionsSelection?.sightseeing && <Compass className="w-4 h-4 text-stone-600" title="Sightseeing Included" />}
                    {pkg.inclusionsSelection?.guide && <User className="w-4 h-4 text-stone-600" title="Guide Included" />}
                    {pkg.inclusionsSelection?.airportTransfer && <Car className="w-4 h-4 text-stone-600" title="Airport Transfer Included" />}
                    {pkg.inclusionsSelection?.flight && <Plane className="w-4 h-4 text-stone-600" title="Flight Included" />}
                  </div>
                </div>
              </div>

              {/* Status info */}
              <div className="space-y-3.5 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    Trip Duration
                  </span>
                  <span className="font-semibold text-stone-850">{pkg.duration}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-stone-400" />
                    Selected Region
                  </span>
                  <span className="font-semibold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded">
                    {pkg.region}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    {spotsLeft <= 3 ? (
                      <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    Availability
                  </span>
                  <span className={`font-semibold ${spotsLeft <= 3 ? 'text-rose-600 font-bold' : 'text-emerald-600'}`}>
                    {spotsLeft} spots remaining
                  </span>
                </div>
              </div>

              {/* Booking CTA Button */}
              <button
                onClick={() => onBook(pkg)}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold shadow-md shadow-amber-600/25 active:scale-[0.98] transition-all duration-300 text-center animate-pulse-glow"
              >
                Inquire For Booking
              </button>

              <p className="text-[10px] text-center text-stone-400 leading-normal">
                Submitting an inquiry is not a final booking. Our travel specialist will contact you within 24 hours.
              </p>
            </div>

            {/* Assistance card */}
            <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Need Assistance?</h4>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Our luxury travel planners are available to tailor this itinerary exactly to your preferences.
              </p>
              <div className="pt-2 flex flex-col gap-2.5 text-xs">
                <a href="tel:+15550192831" className="flex items-center gap-2 text-stone-300 hover:text-amber-400 transition-colors">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  +1 (555) 019-2831
                </a>
                <a href="mailto:concierge@kraftyourtrip.com" className="flex items-center gap-2 text-stone-300 hover:text-amber-400 transition-colors">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  concierge@kraftyourtrip.com
                </a>
                <div className="flex items-start gap-2 text-stone-300">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>456 Sandstone Ave, Suite 100, San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
