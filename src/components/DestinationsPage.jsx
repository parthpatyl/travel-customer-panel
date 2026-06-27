import { useState, useMemo } from 'react'
import { formatINR, formatUSD } from '../utils/currency'
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  ArrowRight,
  X,
  SearchX
} from 'lucide-react'
import Markdown from 'react-markdown'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const imgUrl = (url) => url?.startsWith('http') ? url : `${API_URL}${url || ''}`

const MarkdownInline = ({ children, className }) => (
  <Markdown
    components={{
      p: ({ children }) => <span className={className}>{children}</span>,
      strong: ({ children }) => <strong className="font-extrabold">{children}</strong>,
    }}
  >
    {children}
  </Markdown>
)

// ─── Filter Config ────────────────────────────────────────────────────────────
const REGIONS = ['All', 'Africa', 'Asia', 'Australia', 'Europe', 'North America', 'South America']

const TRAVEL_TYPES = [
  { label: 'All Types', value: 'all' },
  { label: 'Cultural', value: 'cultural' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Wellness', value: 'wellness' },
  { label: 'Romantic', value: 'romantic' },
  { label: 'Family', value: 'family' },
  { label: 'Business', value: 'business' },
  { label: 'Bespoke', value: 'bespoke' },
]

const DURATIONS = [
  { label: 'Any Duration', value: 'all' },
  { label: '1–5 Days', value: '1-5' },
  { label: '6–8 Days', value: '6-8' },
  { label: '9+ Days', value: '9+' },
]

const BUDGET_RANGES = [
  { label: 'Any Budget', value: 'all' },
  { label: 'Under ₹50K', value: 'under-50k' },
  { label: '₹50K – ₹1L', value: '50k-1l' },
  { label: '₹1L+', value: '1lplus' },
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
  if (pkg.isBespoke) return 'bespoke'
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
      className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border ${active
        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
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
    <div className="flex flex-col gap-1.5 min-w-[150px] flex-1">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-stone-200 hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-xl py-2.5 pl-3 pr-9 text-sm font-medium text-stone-700 outline-none transition-all duration-200 cursor-pointer"
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-stone-400">
          <ChevronDown className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  )
}

// ─── Active filter badge ──────────────────────────────────────────────────────
function FilterBadge({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
      {label}
      <button onClick={onRemove} className="text-amber-500 hover:text-amber-700 transition-colors" aria-label={`Remove ${label} filter`}>
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DestinationsPage({ packages, onViewPackage, initialRegion = 'All' }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState(initialRegion)
  const [prevInitialRegion, setPrevInitialRegion] = useState(initialRegion)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDuration, setSelectedDuration] = useState('all')
  const [selectedBudget, setSelectedBudget] = useState('all')
  const [selectedAvail, setSelectedAvail] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [showFilters, setShowFilters] = useState(false)

  // Sync when parent sends a different initialRegion (e.g. back-nav then new category click)
  if (initialRegion !== prevInitialRegion) {
    setSelectedRegion(initialRegion)
    setPrevInitialRegion(initialRegion)
  }

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

      const price = pkg.price
      if (pkg.isBespoke) {
        /* bespoke has no fixed price — include in all budget ranges */
      } else if (selectedBudget === 'under-50k' && price >= 50000) return false
      else if (selectedBudget === '50k-1l' && (price < 50000 || price >= 100000)) return false
      else if (selectedBudget === '1lplus' && price < 100000) return false

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

    const bespokeSortVal = (p) => p.isBespoke ? Infinity : p.price
    if (sortBy === 'price-asc') result = [...result].sort((a, b) => bespokeSortVal(a) - bespokeSortVal(b))
    else if (sortBy === 'price-desc') result = [...result].sort((a, b) => bespokeSortVal(b) - bespokeSortVal(a))
    else if (sortBy === 'dur-asc') result = [...result].sort((a, b) => parseDays(a.duration) - parseDays(b.duration))
    else if (sortBy === 'avail') result = [...result].sort((a, b) => (b.slots.total - b.slots.booked) - (a.slots.total - a.slots.booked))

    return result
  }, [packages, searchQuery, selectedRegion, selectedType, selectedDuration, selectedBudget, selectedAvail, sortBy])

  return (
    <section className="py-10 sm:py-14 bg-[#FDFCF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div className="text-center mb-6 animate-fade-in-up">
          <span className="editorial-mark text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700 mb-2">
            Luxury Catalog
          </span>
          <h1 className="font-display text-2xl sm:text-3xl text-stone-900 tracking-[-0.02em] mb-2">
            Handcrafted destinations
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mx-auto font-light">
            Discover our collection of curated luxury travel experiences designed for the discerning traveller.
          </p>
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm mb-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>

          {/* Top row: Search + Region Pills + Sort + Toggle */}
          <div className="flex flex-col gap-3 p-4 sm:p-5 lg:flex-row lg:items-center">

            {/* Search */}
            <div className="relative w-full lg:flex-1 lg:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search destinations, highlights..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:border-amber-500 rounded-full py-2.5 pl-9 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-amber-200 transition-all"
              />
            </div>

            {/* Divider on larger screens */}
            <div className="hidden lg:block w-px h-8 bg-stone-200" />

            {/* Region Quick Pills */}
            <div className="flex gap-1.5 flex-wrap">
              {REGIONS.map(r => (
                <Pill key={r} active={selectedRegion === r} onClick={() => setSelectedRegion(r)}>
                  {r === 'All' ? 'All Regions' : r}
                </Pill>
              ))}
            </div>

            {/* Sort + Toggle row on mobile, inline on desktop */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 lg:flex-none lg:w-44">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-stone-50 border border-stone-200 hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-full py-2.5 pl-3.5 pr-9 text-sm font-medium text-stone-700 outline-none transition-all cursor-pointer"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-stone-400">
                  <ChevronDown className="w-3.5 h-3.5" />
                </span>
              </div>

              <button
                onClick={() => setShowFilters(p => !p)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 whitespace-nowrap shrink-0 ${showFilters || activeFiltersCount > 0
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-700'
                  }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expanded Filter Panel */}
          {showFilters && (
            <div className="border-t border-stone-100 px-4 sm:px-5 py-5 space-y-5">

              {/* Travel Type */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 block mb-2.5">Travel Type</span>
                <div className="flex gap-1.5 flex-wrap">
                  {TRAVEL_TYPES.map(t => (
                    <Pill key={t.value} active={selectedType === t.value} onClick={() => setSelectedType(t.value)}>
                      {t.label}
                    </Pill>
                  ))}
                </div>
              </div>

              {/* Duration + Budget + Availability */}
              <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
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
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetAll}
                    className="self-end text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-1.5 border border-rose-200 hover:border-rose-300 px-3.5 py-2.5 rounded-full bg-rose-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Active Filter Badges ── */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5 animate-fade-in">
            {selectedRegion !== 'All' && (
              <FilterBadge label={`Continent: ${selectedRegion}`} onRemove={() => setSelectedRegion('All')} />
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
          <p className="text-sm text-stone-500 font-medium">
            Showing <span className="font-semibold text-stone-900 tabular-nums">{filteredPackages.length}</span> of{' '}
            <span className="font-semibold text-stone-900 tabular-nums">{packages.length}</span> packages
          </p>
          {filteredPackages.length !== packages.length && (
            <button onClick={resetAll} className="text-sm text-amber-700 hover:text-amber-600 font-semibold transition-colors">
              Clear filters
            </button>
          )}
        </div>

        {/* ── Package Grid ── */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-4 lg:gap-3">
            {filteredPackages.map((pkg, index) => {
              const spotsLeft = pkg.slots.total - pkg.slots.booked
              const travelType = inferType(pkg)
              return (
                <article
                  key={pkg.id}
                  onClick={() => onViewPackage(pkg)}
                  className="animate-fade-in-up group bg-white border border-stone-200/80 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-stone-900/[0.06] hover:-translate-y-0.5 transition-all duration-400 cursor-pointer flex flex-col h-full"
                  style={{ animationDelay: `${index * 40 + 100}ms` }}
                >
                  {/* Card Image */}
                  <div className="relative aspect-[4/3] sm:aspect-[4/3] lg:aspect-[3/2] w-full overflow-hidden shrink-0 bg-stone-100">
                    <img
                      src={imgUrl(pkg.cardImage)}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/30 via-transparent to-transparent" />

                    {/* Absolute Badge Overlay */}
                    {pkg.ctaBadge && (
                      <span className="absolute top-3 sm:top-2.5 left-3 sm:left-2.5 px-2.5 sm:px-2 py-1 sm:py-0.5 rounded-full bg-stone-900/85 text-white text-xs sm:text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                        {pkg.ctaBadge}
                      </span>
                    )}
                    {pkg.isBespoke && (
                      <span className="absolute top-3 sm:top-2.5 left-3 sm:left-2.5 px-2.5 sm:px-2 py-1 sm:py-0.5 rounded-full bg-amber-600 text-white text-xs sm:text-[10px] font-bold uppercase tracking-wider">
                        Bespoke
                      </span>
                    )}
                    {spotsLeft <= 3 && (
                      <span className="absolute top-3 sm:top-2.5 right-3 sm:right-2.5 px-2.5 sm:px-2 py-1 sm:py-0.5 rounded-full bg-rose-600 text-white text-xs sm:text-[10px] font-bold uppercase tracking-wider">
                        Only {spotsLeft} left
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div>
                      {/* Editorial Eyebrow */}
                      <div className="text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] text-amber-700 uppercase mb-2">
                        {pkg.region} · {pkg.duration} · {travelType}
                      </div>

                      <h3 className="text-base sm:text-lg font-semibold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug mb-3 font-display tracking-tight">
                        {pkg.name}
                      </h3>

                      <MarkdownInline className="text-sm text-stone-500 leading-relaxed line-clamp-2 mb-4 font-light">
                        {(pkg.description || '').split('\n')[0]}
                      </MarkdownInline>

                      {/* Refined Highlights Line */}
                      <div className="space-y-0.5 mb-3">
                        <span className="text-[10px] sm:text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">Highlights</span>
                        <ul className="space-y-0.5">
                          {pkg.highlights.slice(0, 3).map((h, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs sm:text-[13px] text-stone-600 font-normal leading-snug">
                              <span className="text-amber-500 shrink-0 select-none mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <MarkdownInline className="text-stone-600 font-normal">{h}</MarkdownInline>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {pkg.bestMonth && (
                        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] text-emerald-800 font-semibold bg-emerald-50/60 border border-emerald-100/80 rounded-md px-2 py-0.5 mb-4">
                          <span className="font-medium text-emerald-600">Best Season:</span>
                          <span className="font-bold">{pkg.bestMonth}</span>
                        </div>
                      )}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-stone-100">
                      <div>
                        <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">From</span>
                        <span className="text-base sm:text-lg font-semibold text-stone-900 tabular-nums">
                          {pkg.isBespoke ? 'Custom Quote' : formatINR(pkg.price)}
                          {!pkg.isBespoke && pkg.usdPrice != null && (
                            <span className="ml-1.5 text-xs text-stone-400 font-medium">{formatUSD(pkg.usdPrice)}</span>
                          )}
                        </span>
                      </div>
                      <span className="text-stone-700 group-hover:text-amber-700 text-xs font-semibold transition-colors flex items-center gap-1.5">
                        Explore
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-dashed border-stone-300 rounded-2xl">
            <SearchX className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-stone-900 mb-1.5 font-display">No destinations found</h3>
            <p className="text-sm text-stone-500 mb-5 font-light">We couldn't find any travel packages matching your filters.</p>
            <button
              onClick={resetAll}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
