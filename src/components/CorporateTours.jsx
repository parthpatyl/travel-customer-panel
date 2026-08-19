import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Building2, ArrowRight, CheckCircle2, Quote, ChevronLeft, ChevronRight, Star, Calendar, FileText, X } from 'lucide-react'
import { formatINR } from '../utils/currency'
import { SmartMarkdown } from '../utils/markdownUtils'
import PackageBrochureModal from './PackageBrochureModal'
import corporateHero from '../assets/corporate-hero.jpg'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const imgUrl = (url) => url ? (url.startsWith('http') ? url : `${API_URL}${url}`) : ''

export default function CorporateTours({ onNavigate }) {
  const [packages, setPackages] = useState([])
  const [clients, setClients] = useState([])
  const [corporateTestimonials, setCorporateTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [testiIndex, setTestiIndex] = useState(0)
  const [selectedItineraryPkg, setSelectedItineraryPkg] = useState(null)
  const [brochurePkg, setBrochurePkg] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedItineraryPkg) setSelectedItineraryPkg(null)
      }
    }
    if (selectedItineraryPkg) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedItineraryPkg])

  useEffect(() => {
    const load = async () => {
      try {
        const [pkgRes, clientRes, testiRes] = await Promise.all([
          fetch(`${API_URL}/api/corporate-packages`),
          fetch(`${API_URL}/api/corporate-clients`),
          fetch(`${API_URL}/api/testimonials?type=corporate`),
        ])
        if (pkgRes.ok) setPackages(await pkgRes.json())
        if (clientRes.ok) setClients(await clientRes.json())
        if (testiRes.ok) setCorporateTestimonials(await testiRes.json())
      } catch (err) {
        console.warn('Failed to load corporate data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    if (corporateTestimonials.length < 2) return
    const interval = setInterval(() => {
      setTestiIndex(i => (i + 1) % corporateTestimonials.length)
    }, 5500)
    return () => clearInterval(interval)
  }, [corporateTestimonials.length])

  // Clamp carousel index if data shrinks
  const clampedTestiIndex = corporateTestimonials.length > 0
    ? Math.min(testiIndex, corporateTestimonials.length - 1)
    : 0

  const filteredPackages = filter === 'all'
    ? packages
    : packages.filter(p => p.category === filter)

  const handleEnquireClick = (pkg) => {
    if (onNavigate) {
      onNavigate('booking', {
        id: 'corporate',
        isCorporate: true,
        destination: pkg?.destination || '',
        corporatePackageId: pkg?.id || ''
      })
    }
  }

  const openBrochure = (pkg) => {
    setBrochurePkg({
      id: pkg.id,
      name: pkg.destination,
      duration: pkg.nights,
      region: pkg.category === 'india' ? 'India' : 'International',
      basePrice: pkg.starting_price,
      price: pkg.starting_price,
      description: pkg.description,
      itinerary: pkg.itinerary || [],
      highlights: pkg.highlights || [],
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      heroImage: pkg.image_url ? imgUrl(pkg.image_url) : undefined,
      cardImage: pkg.image_url ? imgUrl(pkg.image_url) : undefined,
      termsAndConditions: pkg.terms_and_conditions || pkg.termsAndConditions || ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${corporateHero})` }} />
        <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-10 lg:py-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-amber-200 mb-4">
              <Building2 className="w-4 h-4" />
              Corporate & MICE Travel
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Elevate Your
              <span className="text-amber-400"> Corporate Events</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 leading-relaxed">
              From board retreats to large-scale conferences — we design end-to-end corporate travel
              experiences that inspire teams and impress stakeholders.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#enquire"
                onClick={(e) => { e.preventDefault(); handleEnquireClick() }}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Enquire Now <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#packages"
                onClick={(e) => { e.preventDefault(); document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                View Packages
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section id="packages" className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Corporate Packages</h2>
            <div className="flex gap-2 mt-4 sm:mt-0">
              {['all', 'india', 'international'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 hover:bg-gray-100'
                    }`}
                >
                  {f === 'all' ? 'All' : f === 'india' ? 'India' : 'International'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No packages in this category yet.</p>
              <p className="text-sm mt-1">Contact us for a custom quote.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    {pkg.image_url && (
                      <div className="h-48 overflow-hidden relative">
                        <img src={imgUrl(pkg.image_url)} alt={pkg.destination} className="w-full h-full object-cover" />
                        {pkg.itinerary && pkg.itinerary.length > 0 && (
                          <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-sm">
                            <Calendar className="w-3 h-3 text-amber-400" />
                            {pkg.itinerary.length} Days Itinerary
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-6">
                      <span className={`inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 ${pkg.category === 'india' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {pkg.category === 'india' ? 'India' : 'International'}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{pkg.destination}</h3>
                      <p className="text-sm text-slate-500 mb-1">{pkg.nights}</p>
                      {pkg.starting_price && (
                        <p className="text-amber-600 font-semibold mb-3">
                          From {formatINR(pkg.starting_price)} / person
                        </p>
                      )}
                      {pkg.description && (
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{pkg.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-gray-50 gap-2">
                    <button
                      onClick={() => setSelectedItineraryPkg(pkg)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-600 bg-stone-100 hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      View Itinerary
                    </button>
                    <button
                      onClick={() => handleEnquireClick(pkg)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors cursor-pointer"
                    >
                      Enquire Now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Itinerary Schedule Details Modal mounted to Body Portal */}
      {selectedItineraryPkg && createPortal(
        <div className="fixed inset-0 z-[100] bg-stone-950/80 backdrop-blur-md overflow-y-auto p-3 sm:p-6 md:p-8 flex items-center justify-center min-h-screen" role="dialog" aria-modal="true">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] sm:max-h-[88vh] flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Top Header with Image & Title */}
            <div className="relative bg-stone-900 text-white px-5 py-4 sm:px-6 sm:py-5 shrink-0 overflow-hidden">
              {selectedItineraryPkg.image_url && (
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <img src={imgUrl(selectedItineraryPkg.image_url)} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative z-10 flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-1.5">
                    {selectedItineraryPkg.category === 'india' ? 'Domestic India MICE' : 'International MICE Tour'}
                  </span>
                  <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug break-words">
                    {selectedItineraryPkg.destination}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-stone-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-light">
                    <span className="shrink-0">{selectedItineraryPkg.nights}</span>
                    {selectedItineraryPkg.starting_price && (
                      <span className="shrink-0">• Starting from {formatINR(selectedItineraryPkg.starting_price)} / person</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItineraryPkg(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer shrink-0 mt-0.5"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Itinerary Timeline Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 min-h-0 custom-scrollbar">
              {/* Trip Overview */}
              {selectedItineraryPkg.description && (
                <div className="space-y-1 bg-stone-50 p-3.5 sm:p-4 rounded-xl border border-stone-200/80">
                  <h3 className="text-[11px] sm:text-xs font-bold text-stone-800 uppercase tracking-wider">Overview</h3>
                  <p className="text-xs text-stone-600 leading-relaxed break-words">{selectedItineraryPkg.description}</p>
                </div>
              )}

              {/* Day-by-Day Itinerary Timeline */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                    Day-by-Day Itinerary Schedule
                  </h3>
                  <span className="text-[11px] sm:text-xs text-stone-500 font-medium">
                    {selectedItineraryPkg.itinerary?.length || 0} Scheduled Days
                  </span>
                </div>

                {(!selectedItineraryPkg.itinerary || selectedItineraryPkg.itinerary.length === 0) ? (
                  <div className="text-center py-8 bg-amber-50/40 border border-dashed border-amber-200/80 rounded-xl px-4">
                    <p className="text-xs text-stone-600 font-medium">Standard corporate itinerary customized based on group size and flight schedule.</p>
                    <p className="text-[11px] text-stone-500 mt-1">Contact our MICE concierge for the complete day-by-day blueprint.</p>
                  </div>
                ) : (
                  <div className="space-y-3 relative pl-2 sm:pl-3 before:absolute before:top-3 before:bottom-3 before:left-[1.35rem] sm:before:left-[1.6rem] before:w-0.5 before:bg-stone-200">
                    {selectedItineraryPkg.itinerary.map((dayItem, idx) => (
                      <div key={idx} className="relative flex items-start gap-3 sm:gap-4">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 z-10 shadow-sm ring-4 ring-white">
                          D{dayItem.day}
                        </div>
                        <div className="flex-1 min-w-0 bg-stone-50/90 hover:bg-stone-50 border border-stone-200 rounded-xl p-3 sm:p-4 transition-colors">
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900 mb-1 break-words">{dayItem.title}</h4>
                          <SmartMarkdown content={dayItem.desc} className="text-xs text-stone-600 leading-relaxed font-light break-words" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Sticky Footer Actions */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-stone-100 bg-stone-50/95 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => openBrochure(selectedItineraryPkg)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 border border-stone-300 bg-white hover:bg-stone-100 px-4 py-2 rounded-xl transition-all cursor-pointer order-2 sm:order-1"
              >
                <FileText className="w-3.5 h-3.5 text-stone-500" />
                Download Brochure (PDF)
              </button>
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end order-1 sm:order-2">
                <button
                  type="button"
                  onClick={() => setSelectedItineraryPkg(null)}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer text-center"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const pkg = selectedItineraryPkg
                    setSelectedItineraryPkg(null)
                    handleEnquireClick(pkg)
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Enquire for this Trip <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Brochure Modal for Corporate Package */}
      {brochurePkg && (
        <PackageBrochureModal
          pkg={brochurePkg}
          isOpen={!!brochurePkg}
          onClose={() => setBrochurePkg(null)}
        />
      )}

      {/* Corporate Testimonials Carousel */}
      {corporateTestimonials.length > 0 && (
        <section className="py-8 bg-gray-50 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-3">What Our Clients Say</h2>
            <p className="text-slate-500 text-center mb-10">Trusted by corporate leaders across industries</p>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${clampedTestiIndex * 100}%)` }}
                >
                  {corporateTestimonials.map((t) => (
                    <div key={t.id} className="min-w-full p-8 sm:p-10 flex flex-col items-center text-center">
                      <Quote className="w-10 h-10 text-amber-200 mb-4 shrink-0" />
                      <p className="text-lg sm:text-xl text-slate-700 leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                      <div className="flex gap-0.5 mb-3">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        {t.avatar && (
                          <img src={imgUrl(t.avatar)} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">{t.name}</p>
                          <p className="text-sm text-slate-500">
                            {t.company}{t.company && t.location ? ', ' : ''}{t.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {corporateTestimonials.length > 1 && (
                <>
                  <button
                    onClick={() => setTestiIndex(i => (i - 1 + corporateTestimonials.length) % corporateTestimonials.length)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-slate-600 hover:text-amber-600 hover:border-amber-300 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setTestiIndex(i => (i + 1) % corporateTestimonials.length)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-slate-600 hover:text-amber-600 hover:border-amber-300 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="flex justify-center gap-2 mt-6">
                    {corporateTestimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setTestiIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${i === clampedTestiIndex ? 'bg-amber-500 w-6' : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Client Logo Wall */}
      {clients.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-3">Trusted By</h2>
            <p className="text-slate-500 text-center mb-10">Leading companies that partner with us for corporate travel</p>
            <div className="flex flex-wrap justify-center items-center gap-10">
              {clients.map((client) => (
                <div key={client.id} className="flex flex-col items-center gap-2">
                  {client.logo_url ? (
                    <img src={imgUrl(client.logo_url)} alt={client.name} className="h-12 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />
                  ) : (
                    <div className="w-24 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400 font-medium">
                      {client.name}
                    </div>
                  )}
                  {client.industry && <span className="text-xs text-gray-400">{client.industry}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Copy Block */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            End-to-End MICE Management
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            From venue selection and room blocks to airport transfers, team-building activities, and gala dinners —
            our dedicated MICE desk handles every detail so you can focus on your agenda.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              { title: 'Conferences & Summits', items: ['Venue sourcing & negotiation', 'AV & production management', 'Delegate registration & travel'] },
              { title: 'Incentive Travel', items: ['Curated experiences & activities', 'Luxury accommodation', 'Team-building programs'] },
              { title: 'Meetings & Retreats', items: ['Board meetings & offsites', 'Wellness & adventure add-ons', 'Post-event reporting'] },
            ].map((col) => (
              <div key={col.title} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-3">{col.title}</h3>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
