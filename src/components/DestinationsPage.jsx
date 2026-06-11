import { useState, useMemo, useEffect } from 'react'
import { formatINR } from '../utils/currency'
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Clock,
  ArrowRight,
  X,
  SearchX,
  Landmark,
  Compass,
  Sparkles,
  Heart,
  Users,
  Briefcase,
  Hotel,
  User,
  Car,
  Plane
} from 'lucide-react'

// Map travel types to Lucide Icons
const TYPE_ICONS = {
  cultural: Landmark,
  adventure: Compass,
  wellness: Sparkles,
  romantic: Heart,
  family: Users,
  business: Briefcase
}

// ─── Filter Config ────────────────────────────────────────────────────────────
const REGIONS = ['All', 'Asia', 'Europe']

const TRAVEL_TYPES = [
  { label: 'All Types', value: 'all' },
  { label: 'Cultural', value: 'cultural' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Wellness', value: 'wellness' },
  { label: 'Romantic', value: 'romantic' },
  { label: 'Family', value: 'family' },
  { label: 'Business', value: 'business' },
]

const DURATIONS = [
  { label: 'Any Duration', value: 'all' },
  { label: '1–5 Days', value: '1-5' },
  { label: '6–8 Days', value: '6-8' },
  { label: '9+ Days', value: '9+' },
]

const BUDGET_RANGES = [
  { label: 'Any Budget', value: 'all' },
  { label: 'Under ₹5L', value: 'under-5' },
  { label: '₹5L – ₹10L', value: '5-10' },
  { label: '₹10L+', value: '10plus' },
]

const SORT_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Duration: Shortest', value: 'dur-asc' },
  { label: 'Availability', value: 'avail' },
]

// Tag packages with travel type keywords
function inferType(pkg) {
  const text = (pkg.name + ' ' + (pkg.highlights || []).join(' ')).toLowerCase()
  if (text.includes('wellness') || text.includes('yoga') || text.includes('retreat') || text.includes('meditation')) return 'wellness'
  if (text.includes('family') || text.includes('kids') || text.includes('children')) return 'family'
  if (text.includes('romantic') || text.includes('couple') || text.includes('honeymoon') || text.includes('sunset')) return 'romantic'
  if (text.includes('business') || text.includes('executive') || text.includes('corporate')) return 'business'
  if (text.includes('hiking') || text.includes('trek') || text.includes('alpine') || text.includes('adventure')) return 'adventure'
  return 'cultural'
}

function parseDays(duration) {
  const match = duration.match(/(\d+)/)
  return match ? parseInt(match[1]) : 0
}


// ─── Pill Button ─────────────────────────────────────────────────────────────
function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap border ${
        active
          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
          : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-700'
      }`}
    >
      {children}
    </button>
  )
}

// ─── Select Dropdown ──────────────────────────────────────────────────────────
function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[130px]">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-stone-200 hover:border-amber-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 rounded-xl py-2 pl-3 pr-8 text-xs font-semibold text-stone-700 outline-none transition-all duration-200 cursor-pointer"
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-stone-400">
          <ChevronDown />
        </span>
      </div>
    </div>
  )
}

// ─── Active filter badge ──────────────────────────────────────────────────────
function FilterBadge({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
      {label}
      <button onClick={onRemove} className="text-amber-500 hover:text-amber-700 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DestinationsPage({ packages, onViewPackage, initialRegion = 'All' }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState(initialRegion)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDuration, setSelectedDuration] = useState('all')
  const [selectedBudget, setSelectedBudget] = useState('all')
  const [selectedAvail, setSelectedAvail] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [showFilters, setShowFilters] = useState(false)

  // Sync when parent sends a different initialRegion (e.g. back-nav then new category click)
  useEffect(() => {
    setSelectedRegion(initialRegion)
  }, [initialRegion])

  // Compute active filter count (excluding sort & search)
  const activeFiltersCount = [
    selectedRegion !== 'All',
    selectedType !== 'all',
    selectedDuration !== 'all',
    selectedBudget !== 'all',
    selectedAvail !== 'all',
  ].filter(Boolean).length

  const resetAll = () => {
    setSearchQuery('')
    setSelectedRegion('All')
    setSelectedType('all')
    setSelectedDuration('all')
    setSelectedBudget('all')
    setSelectedAvail('all')
    setSortBy('default')
  }

  const filteredPackages = useMemo(() => {
    let result = packages.filter(pkg => {
      // Region
      if (selectedRegion !== 'All' && pkg.region !== selectedRegion) return false

      // Travel type
      if (selectedType !== 'all' && inferType(pkg) !== selectedType) return false

      // Duration
      const days = parseDays(pkg.duration)
      if (selectedDuration === '1-5' && days > 5) return false
      if (selectedDuration === '6-8' && (days < 6 || days > 8)) return false
      if (selectedDuration === '9+' && days < 9) return false

      // Budget (price in USD shown, scaled to INR labels roughly)
      const price = pkg.basePrice
      if (selectedBudget === 'under-5' && price >= 5000) return false
      if (selectedBudget === '5-10' && (price < 5000 || price >= 10000)) return false
      if (selectedBudget === '10plus' && price < 10000) return false

      // Availability
      const spotsLeft = pkg.slots.total - pkg.slots.booked
      if (selectedAvail === 'available' && spotsLeft === 0) return false
      if (selectedAvail === 'limited' && spotsLeft > 5) return false
      if (selectedAvail === 'open' && spotsLeft <= 5) return false

      // Search
      const q = searchQuery.toLowerCase()
      if (q) {
        const haystack = [pkg.name, pkg.description, pkg.region, ...(pkg.highlights || [])].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }

      return true
    })

    // Sort
    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.basePrice - b.basePrice)
    else if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.basePrice - a.basePrice)
    else if (sortBy === 'dur-asc') result = [...result].sort((a, b) => parseDays(a.duration) - parseDays(b.duration))
    else if (sortBy === 'avail') result = [...result].sort((a, b) => (b.slots.total - b.slots.booked) - (a.slots.total - a.slots.booked))

    return result
  }, [packages, searchQuery, selectedRegion, selectedType, selectedDuration, selectedBudget, selectedAvail, sortBy])

  return (
    <section className="py-16 sm:py-20 bg-[#FDFCF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div className="text-center mb-8 animate-fade-in-up">
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

        {/* ── Filter Bar ── */}
        <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>

          {/* Top row: Search + Region Pills + Sort + Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 sm:p-5">

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search destinations, highlights..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:border-amber-500 rounded-xl py-2.5 pl-9 pr-4 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-1 focus:ring-amber-400 transition-all duration-300"
              />
            </div>

            {/* Region Quick Pills */}
            <div className="flex gap-1.5 flex-wrap">
              {REGIONS.map(r => (
                <Pill key={r} active={selectedRegion === r} onClick={() => setSelectedRegion(r)}>
                  {r === 'All' ? 'All Regions' : r}
                </Pill>
              ))}
            </div>

            {/* Sort Select */}
            <div className="relative min-w-[160px]">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full appearance-none bg-stone-50 border border-stone-200 hover:border-amber-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 rounded-xl py-2.5 pl-3 pr-8 text-xs font-semibold text-stone-700 outline-none transition-all cursor-pointer"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-stone-400">
                <ChevronDown />
              </span>
            </div>

            {/* Toggle More Filters */}
            <button
              onClick={() => setShowFilters(p => !p)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 whitespace-nowrap ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white text-amber-700 text-[9px] font-extrabold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filter Panel */}
          {showFilters && (
            <div className="border-t border-stone-100 px-4 sm:px-5 py-4 flex flex-col sm:flex-row flex-wrap items-start gap-5">

              {/* Travel Type */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">Travel Type</span>
                <div className="flex gap-1.5 flex-wrap">
                  {TRAVEL_TYPES.map(t => (
                    <Pill key={t.value} active={selectedType === t.value} onClick={() => setSelectedType(t.value)}>
                      {t.label}
                    </Pill>
                  ))}
                </div>
              </div>

              {/* Duration + Budget + Availability */}
              <div className="flex flex-wrap gap-4">
                <FilterSelect
                  label="Duration"
                  value={selectedDuration}
                  onChange={setSelectedDuration}
                  options={DURATIONS}
                />
                <FilterSelect
                  label="Budget"
                  value={selectedBudget}
                  onChange={setSelectedBudget}
                  options={BUDGET_RANGES}
                />
                <FilterSelect
                  label="Availability"
                  value={selectedAvail}
                  onChange={setSelectedAvail}
                  options={[
                    { label: 'Any Availability', value: 'all' },
                    { label: 'Open Spots', value: 'available' },
                    { label: 'Limited (≤5)', value: 'limited' },
                    { label: 'Plenty of Room', value: 'open' },
                  ]}
                />
              </div>

              {/* Reset */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetAll}
                  className="self-end ml-auto text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1.5 border border-rose-200 hover:border-rose-400 px-3 py-2 rounded-xl bg-rose-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset All
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Active Filter Badges ── */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 animate-fade-in">
            {selectedRegion !== 'All' && (
              <FilterBadge label={`Region: ${selectedRegion}`} onRemove={() => setSelectedRegion('All')} />
            )}
            {selectedType !== 'all' && (
              <FilterBadge
                label={`Type: ${TRAVEL_TYPES.find(t => t.value === selectedType)?.label}`}
                onRemove={() => setSelectedType('all')}
              />
            )}
            {selectedDuration !== 'all' && (
              <FilterBadge
                label={`Duration: ${DURATIONS.find(d => d.value === selectedDuration)?.label}`}
                onRemove={() => setSelectedDuration('all')}
              />
            )}
            {selectedBudget !== 'all' && (
              <FilterBadge
                label={`Budget: ${BUDGET_RANGES.find(b => b.value === selectedBudget)?.label}`}
                onRemove={() => setSelectedBudget('all')}
              />
            )}
            {selectedAvail !== 'all' && (
              <FilterBadge label="Availability filtered" onRemove={() => setSelectedAvail('all')} />
            )}
          </div>
        )}

        {/* ── Results Count ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-stone-500 font-medium">
            Showing <span className="font-bold text-stone-800">{filteredPackages.length}</span> of{' '}
            <span className="font-bold text-stone-800">{packages.length}</span> packages
          </p>
          {filteredPackages.length !== packages.length && (
            <button onClick={resetAll} className="text-xs text-amber-600 hover:text-amber-800 font-bold transition-colors">
              Clear filters
            </button>
          )}
        </div>

        {/* ── Package Grid ── */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, index) => {
              const spotsLeft = pkg.slots.total - pkg.slots.booked
              const travelType = inferType(pkg)
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
                    <span className="absolute top-3.5 left-3.5 px-2.5 py-0.5 bg-white text-[9px] font-extrabold uppercase text-stone-700 border border-stone-200 shadow-sm rounded-lg">
                      {pkg.region}
                    </span>

                    {/* Spots Tag */}
                    <span className={`absolute top-3.5 right-3.5 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase border shadow-sm ${
                      spotsLeft <= 3
                        ? 'bg-rose-500 text-white border-rose-400'
                        : 'bg-emerald-500 text-white border-emerald-400'
                    }`}>
                      {spotsLeft <= 3 ? `${spotsLeft} Left!` : `${spotsLeft} Spots`}
                    </span>

                    {/* Duration badge */}
                    <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 text-white/90">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">{pkg.duration}</span>
                    </div>

                    {/* Type badge */}
                    <div className="absolute bottom-3.5 right-3.5 capitalize px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-xs text-white text-[9px] font-bold border border-white/10 flex items-center gap-1.5">
                      {(() => {
                        const IconComponent = TYPE_ICONS[travelType] || Landmark
                        return <IconComponent className="w-2.5 h-2.5 text-amber-300" />
                      })()}
                      {travelType}
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
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-black text-stone-900">{formatINR(pkg.basePrice)}</span>
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
                      <span className="text-amber-700 text-xs font-bold group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-1">
                        Explore Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-stone-200/60 rounded-2xl p-8 shadow-sm">
            <SearchX className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-stone-900 mb-1">No Destinations Found</h3>
            <p className="text-xs text-stone-400 mb-4">We couldn't find any travel packages matching your filters.</p>
            <button
              onClick={resetAll}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
