import { useState, useEffect, useMemo } from 'react'
import { formatINR, formatUSD } from '../utils/currency'
import { getImgUrl, handleImageError } from '../utils/image'
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
const imgUrl = getImgUrl

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
const REGIONS = ['All', 'Africa', 'Asia', 'Europe', 'India', 'Middle East', 'Australia', 'North America', 'South America']

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

// Tag packages with travel type keywords for card badge display
function inferType(pkg) {
  if (pkg.isBespoke) return 'bespoke'
  const cat = String(pkg.category || '').toLowerCase()
  if (cat && cat !== 'standard') return cat

  const catIds = [
    ...(Array.isArray(pkg.categoryIds) ? pkg.categoryIds : []),
    ...(Array.isArray(pkg.category_ids) ? pkg.category_ids : [])
  ].map(c => String(c).toLowerCase())

  if (catIds.includes('wellness') || catIds.includes('spa')) return 'wellness'
  if (catIds.includes('adventure') || catIds.includes('wildlife')) return 'adventure'
  if (catIds.includes('romantic') || catIds.includes('honeymoon')) return 'romantic'
  if (catIds.includes('family')) return 'family'
  if (catIds.includes('cultural') || catIds.includes('heritage')) return 'cultural'
  if (catIds.includes('business') || catIds.includes('corporate')) return 'business'

  const text = `${pkg.name || ''} ${(pkg.highlights || []).join(' ')} ${pkg.trend || ''} ${pkg.description || ''}`.toLowerCase()
  if (text.includes('wellness') || text.includes('yoga') || text.includes('retreat') || text.includes('meditation') || text.includes('spa')) return 'wellness'
  if (text.includes('family') || text.includes('kids') || text.includes('children')) return 'family'
  if (text.includes('romantic') || text.includes('couple') || text.includes('honeymoon') || text.includes('sunset')) return 'romantic'
  if (text.includes('business') || text.includes('executive') || text.includes('corporate') || text.includes('conference')) return 'business'
  if (text.includes('hiking') || text.includes('trek') || text.includes('alpine') || text.includes('adventure') || text.includes('glacier') || text.includes('safari') || text.includes('scuba')) return 'adventure'
  return 'cultural'
}

function matchesTravelType(pkg, type) {
  if (!type || type === 'all') return true
  if (type === 'bespoke') return Boolean(pkg.isBespoke)

  const catIds = [
    ...(Array.isArray(pkg.categoryIds) ? pkg.categoryIds : []),
    ...(Array.isArray(pkg.category_ids) ? pkg.category_ids : []),
    pkg.category
  ].filter(Boolean).map(c => String(c).toLowerCase().trim())

  if (catIds.includes(type)) return true
  if (type === 'romantic' && (catIds.includes('honeymoon') || catIds.includes('couples'))) return true
  if (type === 'adventure' && (catIds.includes('wildlife') || catIds.includes('trekking') || catIds.includes('nature') || catIds.includes('cruises'))) return true
  if (type === 'wellness' && (catIds.includes('spa') || catIds.includes('ayurveda') || catIds.includes('yoga') || catIds.includes('photography'))) return true
  if (type === 'cultural' && (catIds.includes('heritage') || catIds.includes('historical') || catIds.includes('pilgrimage') || catIds.includes('spiritual') || catIds.includes('standard'))) return true
  if (type === 'business' && (catIds.includes('corporate') || catIds.includes('mice') || catIds.includes('group-tours'))) return true

  const textParts = [
    pkg.name,
    pkg.description,
    pkg.region,
    pkg.trend,
    ...(pkg.highlights || []),
    ...(pkg.inclusions || []),
    ...(Array.isArray(pkg.itinerary) ? pkg.itinerary.map(i => `${i.title || ''} ${i.desc || ''}`) : [])
  ]
  const haystack = textParts.join(' ').toLowerCase()

  if (type === 'wellness') {
    return haystack.includes('wellness') || haystack.includes('yoga') || haystack.includes('retreat') || haystack.includes('meditation') || haystack.includes('spa') || haystack.includes('ayurveda') || haystack.includes('nature') || haystack.includes('scenic')
  }
  if (type === 'family') {
    return haystack.includes('family') || haystack.includes('kids') || haystack.includes('children') || haystack.includes('all ages') || haystack.includes('leisure') || haystack.includes('holiday')
  }
  if (type === 'romantic') {
    return haystack.includes('romantic') || haystack.includes('couple') || haystack.includes('honeymoon') || haystack.includes('sunset') || haystack.includes('candlelight') || haystack.includes('beach') || haystack.includes('lake') || haystack.includes('cruise') || haystack.includes('paradise')
  }
  if (type === 'business') {
    return haystack.includes('business') || haystack.includes('executive') || haystack.includes('corporate') || haystack.includes('conference') || haystack.includes('group')
  }
  if (type === 'adventure') {
    return haystack.includes('adventure') || haystack.includes('hiking') || haystack.includes('trek') || haystack.includes('alpine') || haystack.includes('glacier') || haystack.includes('safari') || haystack.includes('scuba') || haystack.includes('rafting') || haystack.includes('camping') || haystack.includes('caves') || haystack.includes('waterfall') || haystack.includes('mountain') || haystack.includes('valley')
  }
  if (type === 'cultural') {
    return haystack.includes('cultural') || haystack.includes('culture') || haystack.includes('heritage') || haystack.includes('temple') || haystack.includes('monument') || haystack.includes('ancient') || haystack.includes('history') || haystack.includes('historic') || haystack.includes('tradition') || haystack.includes('museum') || haystack.includes('palace') || haystack.includes('shikara') || haystack.includes('old town') || catIds.includes('standard')
  }

  return false
}

function parseDays(duration) {
  if (typeof duration === 'number') return duration
  if (!duration) return 0
  const str = String(duration)
  const match = str.match(/(\d+)\s*(?:Days?|D\b)/i) || str.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 0
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

const DEST_PLACEHOLDERS = [
  'Search destinations, highlights...',
  'Search "Kashmir", "Paris", "Bali"...',
  'Search "Scuba diving", "Safari"...',
  'Search "Honeymoon", "Overwater"...'
]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DestinationsPage({ packages = [], onViewPackage, initialRegion = 'All', initialSearch = '', onBook }) {
  const safeInitialRegion = typeof initialRegion === 'string' ? initialRegion : 'All'
  const safeInitialSearch = typeof initialSearch === 'string' ? initialSearch : ''
  const [searchQuery, setSearchQuery] = useState(safeInitialSearch)
  const [selectedRegion, setSelectedRegion] = useState(safeInitialRegion)
  const [prevInitialRegion, setPrevInitialRegion] = useState(safeInitialRegion)
  const [prevInitialSearch, setPrevInitialSearch] = useState(safeInitialSearch)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDuration, setSelectedDuration] = useState('all')
  const [selectedBudget, setSelectedBudget] = useState('all')
  const [selectedAvail, setSelectedAvail] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [destPlaceholderIdx, setDestPlaceholderIdx] = useState(0)

  useEffect(() => {
    if (isSearchFocused || searchQuery) return
    const interval = setInterval(() => {
      setDestPlaceholderIdx(prev => (prev + 1) % DEST_PLACEHOLDERS.length)
    }, 2600)
    return () => clearInterval(interval)
  }, [isSearchFocused, searchQuery])

  useEffect(() => {
    fetch(`${API_URL}/api/speciality-categories`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setCategories(data))
      .catch(() => {})
  }, [])

  // Sync when parent sends a different initialRegion (e.g. back-nav then new category click)
  if (safeInitialRegion !== prevInitialRegion) {
    setSelectedRegion(safeInitialRegion)
    setPrevInitialRegion(safeInitialRegion)
  }

  // Sync when parent sends a different initialSearch (e.g. clicking a destination from mega-menu)
  if (safeInitialSearch !== prevInitialSearch) {
    setSearchQuery(safeInitialSearch)
    setPrevInitialSearch(safeInitialSearch)
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
    const list = Array.isArray(packages) ? packages : []
    const safeRegion = typeof selectedRegion === 'string' ? selectedRegion : 'All'

    let result = list.filter(pkg => {
      // Region / Destination
      if (safeRegion !== 'All') {
        const lowerReg = safeRegion.toLowerCase()
        const isKnownContinent = REGIONS.some(r => r.toLowerCase() === lowerReg && r !== 'All')
        const destHaystack = [
          pkg.name,
          pkg.description,
          pkg.region,
          pkg.category,
          ...(pkg.highlights || []),
          ...(pkg.inclusions || [])
        ].join(' ').toLowerCase()

        if (isKnownContinent) {
          if (lowerReg === 'india') {
            const isIndia = (pkg.region || '').toLowerCase() === 'india' ||
              /\b(india|kashmir|goa|meghalaya|kerala|rajasthan|ladakh|delhi|mumbai|agra|jaipur|manali|shillong)\b/i.test(destHaystack)
            if (!isIndia) return false
          } else if (lowerReg === 'asia') {
            const isAsia = ['asia', 'india'].includes((pkg.region || '').toLowerCase()) ||
              /\b(asia|india|vietnam|bali|thailand|japan|singapore|malaysia|indonesia|kashmir|goa|meghalaya)\b/i.test(destHaystack)
            if (!isAsia) return false
          } else if (lowerReg === 'europe') {
            const isEurope = (pkg.region || '').toLowerCase() === 'europe' ||
              /\b(europe|swiss|switzerland|alps|france|italy|greece|spain|germany|paris|rome|london|amalfi|santorini)\b/i.test(destHaystack)
            if (!isEurope) return false
          } else {
            if ((pkg.region || '').toLowerCase() !== lowerReg && !destHaystack.includes(lowerReg)) return false
          }
        } else {
          // If safeRegion is a country or compound destination name (e.g. 'Greece' or 'Greece & Turkey')
          const regionTokens = lowerReg.split(/\s*(?:&|\band\b|\/|,)\s*/).map(t => t.trim()).filter(Boolean)
          const matchesRegion = regionTokens.length > 0
            ? regionTokens.some(term => term.length > 1 && destHaystack.includes(term))
            : destHaystack.includes(lowerReg)
          if (!matchesRegion) return false
        }
      }

      // Travel type
      if (selectedType !== 'all' && !matchesTravelType(pkg, selectedType)) return false

      // Duration
      const days = parseDays(pkg.duration)
      if (selectedDuration === '1-5' && (days < 1 || days > 5)) return false
      if (selectedDuration === '6-8' && (days < 6 || days > 8)) return false
      if (selectedDuration === '9+' && days < 9) return false

      // Budget
      const rawPrice = pkg.price != null ? pkg.price : (pkg.basePrice != null ? pkg.basePrice : pkg.base_price)
      const price = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice || 0).replace(/[^0-9.]/g, ''))
      if (pkg.isBespoke) {
        /* bespoke has no fixed price — include in all budget ranges */
      } else if (selectedBudget === 'under-50k' && price >= 50000) return false
      else if (selectedBudget === '50k-1l' && (price < 50000 || price >= 100000)) return false
      else if (selectedBudget === '1lplus' && price < 100000) return false

      // Availability
      const spotsLeft = (pkg.slots?.total ?? pkg.slotsTotal ?? 20) - (pkg.slots?.booked ?? pkg.slotsBooked ?? 0)
      if (selectedAvail === 'available' && spotsLeft === 0) return false
      if (selectedAvail === 'limited' && spotsLeft > 5) return false
      if (selectedAvail === 'open' && spotsLeft <= 5) return false

      // Search
      const q = searchQuery.toLowerCase().trim()
      if (q) {
        const searchTokens = q.split(/\s*(?:&|\band\b|\/|,)\s*/).map(t => t.trim()).filter(Boolean)

        const matchingCatIds = categories
          .filter(c => {
            const cName = (c.name || '').toLowerCase()
            const cKw = (c.keyword || '').toLowerCase()
            return cName.includes(q) || cKw.includes(q) ||
              searchTokens.some(t => t.length > 1 && (cName.includes(t) || cKw.includes(t)))
          })
          .map(c => c.id)

        const isTagged = Array.isArray(pkg.categoryIds) && pkg.categoryIds.some(cid => matchingCatIds.includes(cid))

        const haystack = [
          pkg.name,
          pkg.description,
          pkg.region,
          pkg.category,
          ...(pkg.highlights || []),
          ...(pkg.inclusions || [])
        ].join(' ').toLowerCase()

        const textMatch = haystack.includes(q) ||
          (searchTokens.length > 0 && searchTokens.some(t => t.length > 1 && haystack.includes(t)))

        if (!isTagged && !textMatch) return false
      }

      return true
    })

    const bespokeSortVal = (p) => p.isBespoke ? Infinity : (typeof p.price === 'number' ? p.price : parseFloat(String(p.price || p.basePrice || 0).replace(/,/g, '')))
    if (sortBy === 'price-asc') result = [...result].sort((a, b) => bespokeSortVal(a) - bespokeSortVal(b))
    else if (sortBy === 'price-desc') result = [...result].sort((a, b) => bespokeSortVal(b) - bespokeSortVal(a))
    else if (sortBy === 'dur-asc') result = [...result].sort((a, b) => parseDays(a.duration) - parseDays(b.duration))
    else if (sortBy === 'avail') result = [...result].sort((a, b) => ((b.slots?.total ?? b.slotsTotal ?? 20) - (b.slots?.booked ?? b.slotsBooked ?? 0)) - ((a.slots?.total ?? a.slotsTotal ?? 20) - (a.slots?.booked ?? a.slotsBooked ?? 0)))

    return result
  }, [packages, searchQuery, selectedRegion, selectedType, selectedDuration, selectedBudget, selectedAvail, sortBy, categories])

  return (
    <section className="py-10 sm:py-14 bg-[#FDFCF7]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div className="text-center mb-6 animate-fade-in-up">
          <span className="editorial-mark text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700 mb-2">
            Luxury Catalog
          </span>
          <h1 className="font-display text-2xl sm:text-3xl text-stone-900 tracking-[-0.02em]">
            Handcrafted destinations
          </h1>
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm mb-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>

          {/* Controls row: Search + Sort + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-5 sm:items-center">

            {/* Search */}
            <div className={`relative transition-all duration-300 ease-out ${isSearchFocused || searchQuery ? 'w-full sm:w-80 max-w-md' : 'w-full sm:w-44 max-w-[200px]'}`}>
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder={isSearchFocused ? 'Type to search...' : DEST_PLACEHOLDERS[destPlaceholderIdx]}
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:border-amber-500 rounded-full py-2.5 pl-9 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-amber-200 transition-all duration-300"
              />
            </div>

            {/* Sort + Toggle */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-none sm:w-44">
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

          {/* Region pills row */}
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-stone-100 pt-3 sm:pt-4">
            <div className="flex gap-1.5 flex-wrap">
              {REGIONS.map(r => (
                <Pill key={r} active={selectedRegion === r} onClick={() => setSelectedRegion(r)}>
                  {r === 'All' ? 'All Regions' : r}
                </Pill>
              ))}
              {selectedRegion !== 'All' && !REGIONS.some(r => r.toLowerCase() === selectedRegion.toLowerCase()) && (
                <Pill active={true} onClick={() => setSelectedRegion(selectedRegion)}>
                  {selectedRegion}
                </Pill>
              )}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg, index) => {
              const spotsLeft = (pkg.slots?.total ?? pkg.slotsTotal ?? 20) - (pkg.slots?.booked ?? pkg.slotsBooked ?? 0)
              const travelType = inferType(pkg)
              return (
                <article
                  key={pkg.id}
                  onClick={() => onViewPackage(pkg)}
                  className="animate-fade-in-up group bg-white border border-stone-200/80 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-stone-900/[0.06] hover:-translate-y-0.5 transition-all duration-400 cursor-pointer flex flex-col h-full"
                  style={{ animationDelay: `${index * 40 + 100}ms` }}
                >
                  {/* Card Image */}
                  <div className="relative aspect-[16/9] sm:aspect-[16/9] lg:aspect-[2.2/1] w-full overflow-hidden shrink-0 bg-stone-100">
                    <img
                      src={imgUrl(pkg.cardImage)}
                      onError={handleImageError}
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
                  <div className="p-4 sm:p-4.5 flex flex-col flex-grow">
                    <div>
                      {/* Editorial Eyebrow */}
                      <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.16em] text-amber-700 uppercase mb-1.5">
                        {pkg.region} · {pkg.duration} · {travelType}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug mb-2 font-display tracking-tight">
                        {pkg.name}
                      </h3>

                      <MarkdownInline className="text-xs sm:text-[13px] text-stone-500 leading-relaxed line-clamp-2 mb-3 font-normal">
                        {(pkg.description || '').split('\n')[0]}
                      </MarkdownInline>

                      {/* Refined Highlights Line */}
                      <div className="space-y-0.5 mb-2.5">
                        <span className="text-[10px] sm:text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">Highlights</span>
                        <ul className="space-y-0.5">
                          {pkg.highlights.slice(0, 2).map((h, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs sm:text-[13px] text-stone-600 font-normal leading-snug">
                              <span className="text-amber-500 shrink-0 select-none mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <MarkdownInline className="text-stone-600 font-normal">{h}</MarkdownInline>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {pkg.bestMonth && (
                        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] text-emerald-800 font-semibold bg-emerald-50/60 border border-emerald-100/80 rounded-md px-2 py-0.5 mb-3">
                          <span className="font-medium text-emerald-600">Best Season:</span>
                          <span className="font-bold">{pkg.bestMonth}</span>
                        </div>
                      )}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-end justify-between pt-3.5 mt-auto border-t border-stone-100">
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-0.5">From</span>
                        <span className="text-lg sm:text-xl font-extrabold text-stone-900 tabular-nums leading-none">
                          {pkg.isBespoke ? 'Custom Quote' : formatINR(pkg.price)}
                          {!pkg.isBespoke && pkg.usdPrice != null && (
                            <span className="ml-1.5 text-xs text-stone-400 font-medium tabular-nums">{formatUSD(pkg.usdPrice)}</span>
                          )}
                        </span>
                      </div>
                      <span className="text-stone-800 group-hover:text-amber-700 text-xs font-bold transition-colors flex items-center gap-1.5 pb-0.5">
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
            <h3 className="text-base font-semibold text-stone-900 mb-1.5 font-display">No packages available yet</h3>
            <p className="text-sm text-stone-500 mb-5 font-light">
              {searchQuery
                ? `We don't have packages for "${searchQuery}" yet. Check back soon or request a custom trip.`
                : selectedRegion !== 'All'
                  ? `We don't have packages for ${selectedRegion} yet. Check back soon or request a custom trip.`
                  : "No packages match your current filters."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetAll}
                className="px-5 py-2.5 bg-white border border-stone-300 hover:border-amber-400 text-stone-700 text-sm font-semibold rounded-full transition-all"
              >
                Reset Filters
              </button>
              {onBook && (
                <button
                  onClick={onBook}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-all"
                >
                  Request Custom Quote
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
