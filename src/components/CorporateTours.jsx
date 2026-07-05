import { useState, useEffect } from 'react'
import { Building2, Globe, Users, Shield, ArrowRight, CheckCircle2, Send, Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { formatINR } from '../utils/currency'
import corporateHero from '../assets/corporate-hero.jpg'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const imgUrl = (url) => url ? (url.startsWith('http') ? url : `${API_URL}${url}`) : ''

const TRUST_BENEFITS = [
  { icon: Building2, title: 'Dedicated MICE Desk', text: 'End-to-end planning from venue sourcing to on-ground execution.' },
  { icon: Globe, title: 'Pan-India & Global', text: 'Coverage across 50+ domestic and international corporate destinations.' },
  { icon: Users, title: '1000+ Groups Handled', text: 'Proven track record with Fortune 500 companies and growing SMEs.' },
  { icon: Shield, title: 'Risk-Free Booking', text: 'Flexible cancellation, transparent pricing, and 24/7 support.' },
]

export default function CorporateTours({ onNavigate }) {
  const [packages, setPackages] = useState([])
  const [clients, setClients] = useState([])
  const [corporateTestimonials, setCorporateTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [testiIndex, setTestiIndex] = useState(0)

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${corporateHero})` }} />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-amber-200 mb-6">
              <Building2 className="w-4 h-4" />
              Corporate & MICE Travel
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Elevate Your
              <span className="text-amber-400"> Corporate Events</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
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
      <section id="packages" className="py-16">
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
                <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {pkg.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img src={imgUrl(pkg.image_url)} alt={pkg.destination} className="w-full h-full object-cover" />
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
                    <button
                      onClick={() => handleEnquireClick(pkg)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-500 transition-colors"
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

      {/* Corporate Testimonials Carousel */}
      {corporateTestimonials.length > 0 && (
        <section className="py-16 bg-gray-50 overflow-hidden">
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
