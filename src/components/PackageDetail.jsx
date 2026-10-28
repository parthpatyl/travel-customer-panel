import { useState, useEffect } from 'react'
import { formatINR, formatUSD } from '../utils/currency'
import { API_URL, getImgUrl, handleImageError, DEFAULT_HERO_IMAGE } from '../utils/image'
import {
  ArrowLeft, Check, CheckCircle2, X, Phone, Mail, Clock, Globe, Flame,
  MapPin, Hotel, Compass, User, Car, Plane, Ship, Printer, Share2,
  Copy, CheckCheck, Send, Calendar, Users, MessageSquare, Sparkles
} from 'lucide-react'
import { SmartMarkdown, SmartMarkdownInline, flattenBulletedItems } from '../utils/markdownUtils'
import PackageBrochureModal from './PackageBrochureModal'
import PhoneInput from './PhoneInput'

const imgUrl = (url) => getImgUrl(url, DEFAULT_HERO_IMAGE)

export default function PackageDetail({ pkg, onBook, settings = {}, onBack }) {
  const [activeTab, setActiveTab] = useState('itinerary') // tabs: itinerary, inclusions
  const [weather, setWeather] = useState(null)
  const [groupDepartures, setGroupDepartures] = useState([])
  const [isBrochureOpen, setIsBrochureOpen] = useState(false)
  const [shareToast, setShareToast] = useState(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  // Embedded Book Now Form States
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [phone, setPhone] = useState('')
  const [travelDate, setTravelDate] = useState(pkg?.departureDate || '')
  const [guestCount, setGuestCount] = useState(2)
  const [selectedDeparture, setSelectedDeparture] = useState(null)
  const [notes, setNotes] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inquirySuccess, setInquirySuccess] = useState(null)

  const agencyPhone = (settings.agencyPhone && !settings.agencyPhone.includes('(555)')) ? settings.agencyPhone : '+91 7046704693'
  const agencyEmail = settings.agencyEmail || 'contact@kraftyourtrip.com'

  const totalSlots = pkg?.slots?.total ?? pkg?.slotsTotal ?? 20
  const bookedSlots = pkg?.slots?.booked ?? pkg?.slotsBooked ?? 0
  const spotsLeft = totalSlots - bookedSlots

  // Ensure document title updates for Meta/SEO
  useEffect(() => {
    document.title = 'Kraft Your Trip | Package Details'
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', 'Kraft Your Trip | Package Details')
    let twTitle = document.querySelector('meta[name="twitter:title"], meta[property="twitter:title"]')
    if (twTitle) twTitle.setAttribute('content', 'Kraft Your Trip | Package Details')

    return () => {
      document.title = 'Kraft Your Trip | Luxury Travel Experiences'
      if (ogTitle) ogTitle.setAttribute('content', 'Kraft Your Trip | Luxury Travel Experiences')
    }
  }, [])

  useEffect(() => {
    const fetchGroupDepartures = async () => {
      try {
        const res = await fetch(`${API_URL}/api/group-departures?packageId=${pkg.id}`)
        if (res.ok) {
          const data = await res.json()
          const filtered = data.filter(d => d.status === 'scheduled' || d.status === 'confirmed')
          setGroupDepartures(filtered)
        }
      } catch (err) {
        console.warn('Failed to fetch group departures:', err)
      }
    }
    if (pkg?.id) fetchGroupDepartures()
  }, [pkg?.id])

  // Handle Share Trip
  const handleShare = async () => {
    const currentUrl = window.location.href
    const shareData = {
      title: `${pkg.name} — Kraft Your Trip`,
      text: `Discover ${pkg.name} (${pkg.duration}, ${pkg.region}) handcrafted by Kraft Your Trip luxury travel experts.`,
      url: currentUrl
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // User cancelled or fallback to copy
      }
    }

    // Fallback: Copy to clipboard and show modal/toast
    try {
      await navigator.clipboard.writeText(currentUrl)
      setShareToast('Trip link copied to clipboard! Ready to share on WhatsApp or Meta ads.')
      setTimeout(() => setShareToast(null), 4000)
    } catch {
      setIsShareModalOpen(true)
    }
  }

  // Handle embedded Booking Form Submit
  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    const errors = {}

    if (!fullName.trim()) errors.fullName = 'Full name is required'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Valid email is required'
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      errors.phone = 'Valid phone number is required'
    }
    if (!travelDate) {
      errors.travelDate = 'Please select a preferred travel date'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})
    setIsSubmitting(true)

    const fullPhone = phone.startsWith('+') ? phone : `${countryCode}${phone.replace(/^0+/, '')}`
    const basePrice = pkg.price || pkg.basePrice || 0
    const departurePriceModifier = selectedDeparture?.priceModifier || 0
    const perPersonPrice = basePrice + departurePriceModifier
    const calculatedAmount = perPersonPrice * guestCount

    const payload = {
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: fullPhone,
      packageId: pkg.id,
      packageName: pkg.name,
      destination: pkg.name,
      departureId: selectedDeparture?.id || pkg.departureId || null,
      travelDate,
      startDate: travelDate,
      guests: guestCount,
      estimatedAmount: calculatedAmount,
      notes: notes.trim()
    }

    try {
      const res = await fetch(`${API_URL}/api/bookings/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok) {
        setInquirySuccess({
          bookingId: data.booking?.id || `ENQ-${Date.now().toString(36).toUpperCase()}`,
          message: data.message || 'Your luxury booking inquiry has been confirmed with our concierge desk!'
        })
      } else {
        setFormErrors({ submit: data.error || data.message || 'Failed to submit inquiry. Please try again.' })
      }
    } catch {
      setFormErrors({ submit: 'Network connection issue. Please check your connection or contact us via WhatsApp.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetch(`${API_URL}/api/weather`)
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          // Country keyword lookup — maps city/destination keywords to country cache keys
          const KEYWORD_TO_COUNTRY = {
            // India
            'india': 'India', 'delhi': 'India', 'jaipur': 'India', 'udaipur': 'India',
            'jodhpur': 'India', 'coorg': 'India', 'agra': 'India', 'kerala': 'India',
            'kashmir': 'India', 'ladakh': 'India', 'andaman': 'India', 'guwahati': 'India',
            'golden triangle': 'India', 'taj mahal': 'India', 'mumbai': 'India',
            'rajasthan': 'India', 'goa': 'India', 'himachal': 'India', 'manali': 'India',
            'darjeeling': 'India', 'varanasi': 'India', 'rishikesh': 'India',
            // Thailand
            'thailand': 'Thailand', 'bangkok': 'Thailand', 'phuket': 'Thailand', 'chiang mai': 'Thailand',
            // Japan
            'japan': 'Japan', 'tokyo': 'Japan', 'kyoto': 'Japan', 'osaka': 'Japan',
            // China
            'china': 'China', 'beijing': 'China', 'shanghai': 'China', 'great wall': 'China',
            // Indonesia
            'indonesia': 'Indonesia', 'bali': 'Indonesia', 'jakarta': 'Indonesia',
            // Maldives
            'maldives': 'Maldives', 'malé': 'Maldives',
            // Sri Lanka
            'sri lanka': 'Sri Lanka', 'colombo': 'Sri Lanka',
            // Nepal
            'nepal': 'Nepal', 'kathmandu': 'Nepal', 'everest': 'Nepal',
            // Bhutan
            'bhutan': 'Bhutan', 'thimphu': 'Bhutan', 'paro': 'Bhutan',
            // Cambodia
            'cambodia': 'Cambodia', 'angkor': 'Cambodia', 'siem reap': 'Cambodia', 'phnom penh': 'Cambodia',
            // Myanmar
            'myanmar': 'Myanmar', 'yangon': 'Myanmar', 'bagan': 'Myanmar',
            // Philippines
            'philippines': 'Philippines', 'manila': 'Philippines', 'boracay': 'Philippines', 'palawan': 'Philippines',
            // South Korea
            'south korea': 'South Korea', 'korea': 'South Korea', 'seoul': 'South Korea', 'busan': 'South Korea',
            // France
            'france': 'France', 'paris': 'France', 'provence': 'France', 'nice': 'France',
            // Switzerland
            'switzerland': 'Switzerland', 'swiss': 'Switzerland', 'alps': 'Switzerland', 'zurich': 'Switzerland', 'bern': 'Switzerland',
            // Italy
            'italy': 'Italy', 'rome': 'Italy', 'venice': 'Italy', 'tuscany': 'Italy', 'florence': 'Italy', 'amalfi': 'Italy',
            // Greece
            'greece': 'Greece', 'santorini': 'Greece', 'athens': 'Greece', 'mykonos': 'Greece',
            // Spain
            'spain': 'Spain', 'barcelona': 'Spain', 'madrid': 'Spain', 'ibiza': 'Spain',
            // Portugal
            'portugal': 'Portugal', 'lisbon': 'Portugal', 'porto': 'Portugal',
            // UK
            'london': 'United Kingdom', 'england': 'United Kingdom', 'scotland': 'United Kingdom',
            // Germany
            'germany': 'Germany', 'berlin': 'Germany', 'munich': 'Germany',
            // Austria
            'austria': 'Austria', 'vienna': 'Austria', 'salzburg': 'Austria',
            // Netherlands
            'netherlands': 'Netherlands', 'amsterdam': 'Netherlands',
            // Norway
            'norway': 'Norway', 'oslo': 'Norway', 'fjord': 'Norway', 'northern lights': 'Norway',
            // Iceland
            'iceland': 'Iceland', 'reykjavik': 'Iceland',
            // Croatia
            'croatia': 'Croatia', 'dubrovnik': 'Croatia', 'split': 'Croatia',
            // Czech Republic
            'czech': 'Czech Republic', 'prague': 'Czech Republic',
            // USA
            'new york': 'USA', 'california': 'USA', 'hawaii': 'USA', 'usa': 'USA', 'las vegas': 'USA',
            // Canada
            'canada': 'Canada', 'toronto': 'Canada', 'vancouver': 'Canada', 'banff': 'Canada',
            // Mexico
            'mexico': 'Mexico', 'cancun': 'Mexico', 'tulum': 'Mexico',
            // Brazil
            'brazil': 'Brazil', 'rio': 'Brazil',
            // Peru
            'peru': 'Peru', 'cusco': 'Peru', 'machu picchu': 'Peru', 'lima': 'Peru',
            // Argentina
            'argentina': 'Argentina', 'buenos aires': 'Argentina', 'patagonia': 'Argentina',
            // Colombia
            'colombia': 'Colombia', 'bogota': 'Colombia', 'cartagena': 'Colombia',
            // UAE
            'dubai': 'UAE', 'abu dhabi': 'UAE', 'uae': 'UAE',
            // Oman
            'oman': 'Oman', 'muscat': 'Oman',
            // Jordan
            'jordan': 'Jordan', 'petra': 'Jordan', 'amman': 'Jordan', 'dead sea': 'Jordan',
            // Kenya
            'kenya': 'Kenya', 'nairobi': 'Kenya', 'safari': 'Kenya', 'masai mara': 'Kenya',
            // South Africa
            'south africa': 'South Africa', 'cape town': 'South Africa', 'kruger': 'South Africa',
            // Tanzania
            'tanzania': 'Tanzania', 'kilimanjaro': 'Tanzania', 'serengeti': 'Tanzania', 'zanzibar': 'Tanzania',
            // Egypt
            'egypt': 'Egypt', 'cairo': 'Egypt', 'pyramid': 'Egypt', 'luxor': 'Egypt',
            // Morocco
            'morocco': 'Morocco', 'marrakech': 'Morocco', 'casablanca': 'Morocco', 'fes': 'Morocco',
            // Australia
            'australia': 'Australia', 'sydney': 'Australia', 'melbourne': 'Australia', 'barrier reef': 'Australia',
            // New Zealand
            'new zealand': 'New Zealand', 'auckland': 'New Zealand', 'queenstown': 'New Zealand',
            // Fiji
            'fiji': 'Fiji', 'suva': 'Fiji',
            // Singapore
            'singapore': 'Singapore',
            // Malaysia
            'malaysia': 'Malaysia', 'kuala lumpur': 'Malaysia', 'langkawi': 'Malaysia',
            // Vietnam
            'vietnam': 'Vietnam', 'hanoi': 'Vietnam', 'ho chi minh': 'Vietnam', 'ha long': 'Vietnam',
            // Turkey
            'turkey': 'Turkey', 'istanbul': 'Turkey', 'cappadocia': 'Turkey',
            // Russia
            'russia': 'Russia', 'moscow': 'Russia', 'st petersburg': 'Russia',
          };

          // Region-to-country fallback (for broad regions like "Asia", "Europe" etc.)
          const REGION_FALLBACK = {
            'Asia': 'India',
            'Europe': 'France',
            'Africa': 'Kenya',
            'Middle East': 'UAE',
            'Australia': 'Australia',
            'North America': 'USA',
            'South America': 'Brazil',
            'South East Asia': 'Thailand',
          };

          const searchText = `${pkg.name} ${pkg.description} ${pkg.id}`.toLowerCase();

          // Scan for the most specific keyword match
          let matched = null;
          // Sort keywords longest-first so "south africa" matches before "africa"
          const sortedKeywords = Object.keys(KEYWORD_TO_COUNTRY).sort((a, b) => b.length - a.length);
          for (const kw of sortedKeywords) {
            if (searchText.includes(kw)) {
              matched = KEYWORD_TO_COUNTRY[kw];
              break;
            }
          }

          // Fallback: map the broad region to a default country
          if (!matched) {
            matched = REGION_FALLBACK[pkg.region] || null;
          }

          const weatherData = matched ? d.data[matched] || null : null;
          if (weatherData) weatherData._country = matched;
          setWeather(weatherData);
        }
      })
      .catch(() => { })
  }, [pkg.region, pkg.name, pkg.description, pkg.id])

  return (
    <section className="bg-[#FDFCF7] pb-24">
      {/* Hero Header */}
      <div className="relative h-[47vh] md:h-[55vh] overflow-hidden">
        <img
          src={imgUrl(pkg.heroImage)}
          onError={(e) => handleImageError(e, DEFAULT_HERO_IMAGE)}
          alt={pkg.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/45 via-stone-900/20 to-stone-950/85" />

        {/* Navigation / Header content */}
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col justify-end h-full">
          {/* Back, Share & Download buttons */}
          <div className="self-start mb-5 flex flex-wrap items-center gap-2.5">
            <button
              onClick={onBack || (() => window.history.back())}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm text-stone-900 hover:bg-white shadow-sm border border-white/40 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Destinations
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white shadow-sm rounded-full text-xs font-semibold transition-all cursor-pointer"
              title="Share unique URL on Meta, WhatsApp, or copy link"
            >
              <Share2 className="w-4 h-4" />
              Share Trip
            </button>
            <button
              onClick={() => setIsBrochureOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900/90 hover:bg-stone-900 text-amber-300 border border-amber-500/40 backdrop-blur-sm shadow-sm rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              Download Itinerary (PDF)
            </button>
          </div>
          {/* Name */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-[-0.02em] leading-[1.05]">
            {pkg.name}
          </h1>
          {/* Badges */}
          <div className="flex gap-2 flex-wrap items-center mt-4">
            <span className="px-2.5 py-1 bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-[0.15em] rounded-full">
              {pkg.region}
            </span>
            <span className="px-2.5 py-1 bg-white/95 text-stone-900 text-xs font-bold uppercase tracking-[0.15em] rounded-full">
              {pkg.duration}
            </span>
            {pkg.isBespoke && (
              <span className="px-2.5 py-1 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full border border-stone-700">
                Bespoke
              </span>
            )}
            {pkg.ctaBadge && (
              <span className="px-2.5 py-1 bg-rose-500 text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full animate-pulse">
                {pkg.ctaBadge}
              </span>
            )}
            {pkg.bestMonth && (
              <span className="px-2.5 py-1 bg-sky-500/90 text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full">
                Best in {pkg.bestMonth}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Description, Highlights, Tabs (Itinerary/Inclusions) */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-up">
            {/* Overview */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="font-display text-xl text-stone-900 mb-3 tracking-tight">Overview</h2>
              <SmartMarkdown content={pkg.description} className="text-sm text-stone-600 leading-relaxed font-light" />
            </div>

            {/* Highlights Grid */}
            <div className="bg-[#FAF9F5] border border-stone-200/70 rounded-2xl p-6 md:p-8">
              <h2 className="font-display text-xl text-stone-900 mb-4 tracking-tight">Trip Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {flattenBulletedItems(pkg.highlights).map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    <SmartMarkdownInline className="text-sm text-stone-700 font-light leading-relaxed">{item}</SmartMarkdownInline>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary Tabs Container */}
            <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="border-b border-stone-100 flex">
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`flex-1 py-4 text-sm font-semibold text-center transition-all border-b-2 ${
                    activeTab === 'itinerary'
                      ? 'border-amber-600 text-amber-700'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Itinerary Schedule
                </button>
                <button
                  onClick={() => setActiveTab('inclusions')}
                  className={`flex-1 py-4 text-sm font-semibold text-center transition-all border-b-2 ${
                    activeTab === 'inclusions'
                      ? 'border-amber-600 text-amber-700'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Inclusions & Exclusions
                </button>
              </div>

              <div className="p-6 md:p-8">
                {/* Tab content: Itinerary */}
                {activeTab === 'itinerary' && (
                  <div className="relative border-l-2 border-stone-200 pl-6 ml-3 space-y-7">
                    {pkg.itinerary.map((dayItem, idx) => (
                      <div key={idx} className="relative group">
                        {/* Bullet circle */}
                        <div className="absolute -left-[34px] top-1.5 w-4 h-4 rounded-full bg-amber-600 border-4 border-white shadow-sm transition-transform duration-300 group-hover:scale-125" />

                        <div>
                          <span className="text-xs text-amber-700 font-bold uppercase tracking-[0.18em] block mb-1">
                            Day {dayItem.day}
                          </span>
                          <h4 className="font-display text-base text-stone-900 mb-1.5">
                            {dayItem.title}
                          </h4>
                          <SmartMarkdown content={dayItem.desc} className="text-sm text-stone-600 leading-relaxed font-light" />
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
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-[0.15em] mb-4 border-b border-stone-100 pb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> What's Included
                      </h4>
                      <ul className="space-y-3">
                        {flattenBulletedItems(pkg.inclusions).map((inc, i) => (
                          <li key={i} className="flex gap-2.5 items-start text-sm text-stone-700 leading-relaxed font-light">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <SmartMarkdownInline>{inc}</SmartMarkdownInline>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Exclusions */}
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-[0.15em] mb-4 border-b border-stone-100 pb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> What's Excluded
                      </h4>
                      <ul className="space-y-3">
                        {flattenBulletedItems(pkg.exclusions).map((exc, i) => (
                          <li key={i} className="flex gap-2.5 items-start text-sm text-stone-700 leading-relaxed font-light">
                            <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <SmartMarkdownInline>{exc}</SmartMarkdownInline>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Terms & Conditions */}
                    {pkg.termsAndConditions && (
                      <div className="md:col-span-2 pt-4 border-t border-stone-100 space-y-2">
                        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-[0.15em] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Terms & Conditions
                        </h4>
                        <div className="p-4 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-stone-700 leading-relaxed">
                          <SmartMarkdown content={pkg.termsAndConditions} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Card */}
          <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-24 animate-fade-in-up delay-100">
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-md space-y-5">
              {pkg.isBespoke ? (
                <div>
                  <span className="text-xs text-stone-500 font-semibold uppercase tracking-[0.15em] block">Pricing</span>
                  <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                    <span className="font-display text-lg text-amber-800 block">Custom Quote</span>
                    <p className="text-xs text-amber-700 mt-1 font-light">Tailored to your preferences</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-500 bg-stone-50 px-2.5 py-1.5 rounded-full border border-stone-200 mt-3 w-fit">
                    {pkg.inclusionsSelection?.hotel && <Hotel className="w-4 h-4 text-stone-600" title="Hotel Included" />}
                    {pkg.inclusionsSelection?.sightseeing && <Compass className="w-4 h-4 text-stone-600" title="Sightseeing Included" />}
                    {pkg.inclusionsSelection?.guide && <User className="w-4 h-4 text-stone-600" title="Guide Included" />}
                    {pkg.inclusionsSelection?.airportTransfer && <Car className="w-4 h-4 text-stone-600" title="Airport Transfer Included" />}
                    {pkg.inclusionsSelection?.flight && <Plane className="w-4 h-4 text-stone-600" title="Flight Included" />}
                    {pkg.inclusionsSelection?.cruise && <Ship className="w-4 h-4 text-stone-600" title="Cruise Included" />}
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-xs text-stone-500 font-semibold uppercase tracking-[0.15em] block">Price Per Person</span>
                  <div className="flex items-baseline justify-between gap-1 mt-1.5">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-3xl text-stone-900 tabular-nums">{formatINR(pkg.price)}</span>
                        <span className="text-xs text-stone-400 font-medium">INR</span>
                        {pkg.usdPrice != null && <span className="text-sm text-stone-400 font-medium ml-1">{formatUSD(pkg.usdPrice)}</span>}
                      </div>
                      <span className="text-[11px] font-bold text-red-600 tracking-wider uppercase block mt-0.5">T&C apply</span>
                    </div>
                    {/* Icons next to the price */}
                    <div className="flex items-center gap-1.5 text-stone-500 bg-stone-50 px-2 py-1 rounded-full border border-stone-200">
                      {pkg.inclusionsSelection?.hotel && <Hotel className="w-4 h-4 text-stone-600" title="Hotel Included" />}
                      {pkg.inclusionsSelection?.sightseeing && <Compass className="w-4 h-4 text-stone-600" title="Sightseeing Included" />}
                      {pkg.inclusionsSelection?.guide && <User className="w-4 h-4 text-stone-600" title="Guide Included" />}
                      {pkg.inclusionsSelection?.airportTransfer && <Car className="w-4 h-4 text-stone-600" title="Airport Transfer Included" />}
                      {pkg.inclusionsSelection?.flight && <Plane className="w-4 h-4 text-stone-600" title="Flight Included" />}
                      {pkg.inclusionsSelection?.cruise && <Ship className="w-4 h-4 text-stone-600" title="Cruise Included" />}
                    </div>
                  </div>
                </div>
              )}

              {/* Tax breakdown — only for non-bespoke */}
              {!pkg.isBespoke && pkg.taxRate > 0 && (
                <div className="pt-3 border-t border-stone-100 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Subtotal</span>
                    <span className="text-stone-700 font-medium tabular-nums">
                      {formatINR(pkg.price)}
                      {pkg.usdPrice != null && <span className="ml-1.5 text-xs text-stone-400">{formatUSD(pkg.usdPrice)}</span>}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">GST @ {pkg.taxRate}%</span>
                    <span className="text-stone-700 font-medium tabular-nums">
                      {formatINR(pkg.price * pkg.taxRate / 100)}
                      {pkg.usdPrice != null && <span className="ml-1.5 text-[10px] text-stone-400">{formatUSD(pkg.usdPrice * pkg.taxRate / 100)}</span>}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-dashed border-stone-200">
                    <span className="text-stone-800">Total (per person)</span>
                    <span className="text-amber-700 tabular-nums">
                      {formatINR(pkg.price * (1 + pkg.taxRate / 100))}
                      {pkg.usdPrice != null && <span className="ml-1.5 text-xs text-stone-500">{formatUSD(pkg.usdPrice * (1 + pkg.taxRate / 100))}</span>}
                    </span>
                  </div>
                </div>
              )}

              {/* Status info */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    Trip Duration
                  </span>
                  <span className="font-semibold text-stone-800">{pkg.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-stone-400" />
                    Region
                  </span>
                  <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-xs">
                    {pkg.region}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    {pkg.isBespoke || (pkg.slots?.total ?? pkg.slotsTotal ?? 20) >= 999 ? (
                      spotsLeft > 0 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-rose-500" />
                      )
                    ) : (
                      spotsLeft <= 3 ? (
                        <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      )
                    )}
                    Availability
                  </span>
                  <span className={`font-semibold ${spotsLeft <= (pkg.isBespoke || (pkg.slots?.total ?? pkg.slotsTotal ?? 20) >= 999 ? 0 : 3) ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {pkg.isBespoke || (pkg.slots?.total ?? pkg.slotsTotal ?? 20) >= 999 ? (
                      spotsLeft > 0 ? 'Available' : 'Unavailable'
                    ) : (
                      `${spotsLeft} spots remaining`
                    )}
                  </span>
                </div>
              </div>

              {groupDepartures.length > 0 && (
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <span className="text-xs text-stone-500 font-semibold uppercase tracking-[0.15em] block">
                    Upcoming Group Departures
                  </span>
                  <div className="space-y-2">
                    {groupDepartures.map((dep) => {
                      const depTotal = dep.slots?.total ?? dep.slotsTotal ?? 20
                      const depBooked = dep.slots?.booked ?? dep.slotsBooked ?? 0
                      const depSpotsLeft = depTotal - depBooked
                      const isFull = depSpotsLeft <= 0
                      return (
                        <div key={dep.id} className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200/70 rounded-xl text-xs">
                          <div>
                            <span className="font-semibold text-stone-800 block">
                              {new Date(dep.departureDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                            </span>
                            <span className="text-[10px] text-stone-500 block">
                              {isFull ? 'Sold Out' : `${depSpotsLeft} spots left`}
                            </span>
                          </div>
                          <button
                            disabled={isFull}
                            onClick={() => {
                              onBook({
                                ...pkg,
                                departureId: dep.id,
                                departureDate: dep.departureDate ? dep.departureDate.split('T')[0] : '',
                                returnDate: dep.returnDate ? dep.returnDate.split('T')[0] : '',
                                priceModifier: dep.priceModifier || 0
                              })
                            }}
                            className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                              isFull
                                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                : 'bg-stone-900 hover:bg-amber-700 text-white cursor-pointer'
                            }`}
                          >
                            {isFull ? 'Full' : 'Join Group'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-center py-1">
                    <span className="text-[10px] text-stone-400 italic font-light">— OR —</span>
                  </div>
                </div>
              )}

              {/* Embedded Booking & Custom Quote Form */}
              {inquirySuccess ? (
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-6 text-center space-y-4 animate-fade-in">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-stone-900">Inquiry Received!</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {inquirySuccess.message}
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs font-mono text-emerald-800">
                    Booking ID: <span className="font-bold">{inquirySuccess.bookingId}</span>
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={`https://api.whatsapp.com/send?phone=${agencyPhone.replace(/\D/g, '')}&text=${encodeURIComponent(`Hi Kraft Your Trip! I just submitted an inquiry for ${pkg.name} (Ref: ${inquirySuccess.bookingId}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat with Curator on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setInquirySuccess(null)}
                      className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-semibold transition-all cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4 pt-3 border-t border-stone-100">
                  <div>
                    <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider block mb-1">
                      Reserve This Journey
                    </span>
                    <p className="text-xs text-stone-500 font-light">
                      Instant inquiry sent directly to our travel curator. No advance payment required.
                    </p>
                  </div>

                  {formErrors.submit && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                      {formErrors.submit}
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 focus:border-amber-600 rounded-xl text-xs text-stone-900 outline-none transition-all"
                      required
                    />
                    {formErrors.fullName && <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="eleanor@luxurytravel.com"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 focus:border-amber-600 rounded-xl text-xs text-stone-900 outline-none transition-all"
                      required
                    />
                    {formErrors.email && <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Mobile Phone *
                    </label>
                    <PhoneInput
                      countryCode={countryCode}
                      phone={phone}
                      onChange={(e) => {
                        if (e.target.name === 'countryCode') setCountryCode(e.target.value)
                        else setPhone(e.target.value)
                      }}
                      error={formErrors.phone}
                    />
                  </div>

                  {/* Travel Date & Guests */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                        Travel Date *
                      </label>
                      <input
                        type="date"
                        value={travelDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-amber-600 rounded-xl text-xs text-stone-800 outline-none"
                        required
                      />
                      {formErrors.travelDate && <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.travelDate}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                        Guests
                      </label>
                      <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                          className="w-8 py-2 text-stone-600 hover:bg-stone-200 text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center text-xs font-bold text-stone-900">
                          {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                          className="w-8 py-2 text-stone-600 hover:bg-stone-200 text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Special Requests / Notes <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Flights from Mumbai, luxury room tier, dietary preferences..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-amber-600 rounded-xl text-xs text-stone-800 outline-none resize-none"
                    />
                  </div>

                  {/* Live Estimated Total */}
                  {!pkg.isBespoke && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-stone-600 font-medium">Estimated Total ({guestCount} {guestCount === 1 ? 'guest' : 'guests'}):</span>
                      <span className="font-display font-bold text-amber-900 text-sm">
                        {formatINR((pkg.price + (selectedDeparture?.priceModifier || 0)) * guestCount * (1 + (pkg.taxRate || 0) / 100))}
                      </span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md shadow-amber-900/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <span>Submitting Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{pkg.isBespoke ? 'Request Custom Quote' : 'Book Now / Submit Inquiry'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Action Buttons: Share & Download PDF */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200"
                  title="Share on Meta, WhatsApp, or copy link"
                >
                  <Share2 className="w-3.5 h-3.5 text-stone-600" />
                  <span>Share Trip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBrochureOpen(true)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-700" />
                  <span>Download PDF</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-stone-500 leading-relaxed font-light">
                Submitting an inquiry is not an automatic charge. Our travel specialist will review and contact you within 24 hours.
              </p>
            </div>

            {/* Weather Widget */}
            {weather && weather.months && (
              <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                  <span aria-hidden>🌤️</span> Monthly Weather — {weather._country || weather.city}
                </h4>
                <div className="grid grid-cols-4 gap-1.5">
                  {weather.months.map((m) => {
                    const currentMonth = new Date().toLocaleString('en', { month: 'short' })
                    const isCurrentMonth = m.month === currentMonth
                    const isBestMonth = pkg.bestMonth && pkg.bestMonth.substring(0, 3) === m.month
                    return (
                      <div
                        key={m.month}
                        className={`text-center py-2 px-1 rounded-lg text-xs border transition-all ${
                          isBestMonth
                            ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-200'
                            : isCurrentMonth
                              ? 'bg-sky-50 border-sky-200'
                              : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <span className={`block font-semibold mb-0.5 ${isBestMonth ? 'text-amber-700' : 'text-stone-700'}`}>{m.month}</span>
                        <span className="block text-stone-900 font-bold tabular-nums">{m.avgHigh}°</span>
                        <span className="block text-stone-400 tabular-nums">{m.avgLow}°</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-stone-500 mt-2 text-center font-light">Avg. highs & lows (°C) · historical data</p>
              </div>
            )}

            {/* Assistance card */}
            <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-300">Need Assistance?</h4>
              <p className="text-sm text-stone-300 leading-relaxed font-light">
                Our luxury travel planners are available to tailor this itinerary exactly to your preferences.
              </p>
              <div className="pt-2 flex flex-col gap-2.5 text-sm">
                <a href={`tel:${agencyPhone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 text-stone-300 hover:text-amber-300 transition-colors">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  {agencyPhone}
                </a>
                <a href={`mailto:${agencyEmail}`} className="flex items-center gap-2 text-stone-300 hover:text-amber-300 transition-colors">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  {agencyEmail}
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

      {/* Brochure Modal for Printing / Download */}
      <PackageBrochureModal
        pkg={pkg}
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
        settings={settings}
      />

      {/* Share Toast Banner */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-stone-700 animate-fade-in-up">
          <CheckCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{shareToast}</span>
        </div>
      )}

      {/* Share Modal for Desktop Fallback */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-stone-900">Share This Luxury Journey</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-500">
              Share the unique URL for <strong className="text-stone-800">{pkg.name}</strong> with clients or run Meta (Instagram/Facebook) ads.
            </p>
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl p-2.5">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="flex-1 bg-transparent text-xs text-stone-700 outline-none truncate"
              />
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(window.location.href)
                  setShareToast('Link copied to clipboard!')
                  setIsShareModalOpen(false)
                  setTimeout(() => setShareToast(null), 3000)
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shrink-0"
              >
                Copy Link
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Take a look at ${pkg.name}: ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-emerald-200"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-blue-200"
              >
                <Share2 className="w-4 h-4 text-blue-600" />
                Facebook
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
