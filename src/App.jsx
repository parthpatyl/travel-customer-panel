import { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturedPackages from './components/FeaturedPackages'
import TestimonialsSection from './components/TestimonialsSection'
import Footer from './components/Footer'
import DestinationsPage from './components/DestinationsPage'
import DestinationCategories from './components/DestinationCategories'
import PackageDetail from './components/PackageDetail'
import AboutPage from './components/AboutPage'
import BookingPage from './components/BookingPage'
import LuxuryExperiences from './components/LuxuryExperiences'
import CorporateTours from './components/CorporateTours'
import UpcomingTrips from './components/UpcomingTrips'
import EnquiryPage from './components/EnquiryPage'
import SpecialityCategories from './components/SpecialityCategories'
import GiftCardsPage from './components/GiftCardsPage'
import TripStoriesPage from './components/TripStoriesPage'
import staticPackages from './data/packages'
import { fallbackTestimonials } from './data/fallbackData'
import { updatePageMeta } from './utils/meta'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getInitialRoute() {
  const path = window.location.pathname.toLowerCase()
  const hash = window.location.hash.replace('#', '').toLowerCase()
  const searchParams = new URLSearchParams(window.location.search)

  // 1. Direct package deep links (/package/:id or #/package/:id or ?pkg=:id)
  const pkgMatch = path.match(/^\/package\/([\w-]+)/i) || hash.match(/^\/?package\/([\w-]+)/i)
  if (pkgMatch) {
    return { page: 'detail', pkgId: pkgMatch[1], enquiryId: null, region: 'All' }
  }
  const queryPkg = searchParams.get('pkg') || searchParams.get('package')
  if (queryPkg) {
    return { page: 'detail', pkgId: queryPkg, enquiryId: null, region: 'All' }
  }

  // 2. Enquiry link (/enquiry/:id or hash enquiry=...)
  const enqMatch = path.match(/^\/enquiry\/([\w-]+)/i)
  if (enqMatch) {
    return { page: 'enquiry', pkgId: null, enquiryId: enqMatch[1], region: 'All' }
  }
  if (hash.startsWith('enquiry=')) {
    return { page: 'booking', pkgId: null, enquiryId: hash.replace('enquiry=', ''), region: 'All' }
  }

  // 3. Destination filter links (/destination/:region)
  const destMatch = path.match(/^\/destination\/([\w-]+)/i)
  if (destMatch) {
    const regName = decodeURIComponent(destMatch[1])
    return { page: 'destinations', pkgId: null, enquiryId: null, region: regName.charAt(0).toUpperCase() + regName.slice(1) }
  }

  // 4. Standard path routes
  if (path === '/reviews' || path === '/gallery' || hash === 'reviews' || hash === 'gallery') {
    return { page: 'gallery', pkgId: null, enquiryId: null, region: 'All' }
  }
  if (path === '/destinations' || hash === 'destinations') {
    return { page: 'destinations', pkgId: null, enquiryId: null, region: 'All' }
  }
  if (path === '/about' || hash === 'about') {
    return { page: 'about', pkgId: null, enquiryId: null, region: 'All' }
  }
  if (path === '/luxury' || hash === 'luxury') {
    return { page: 'luxury', pkgId: null, enquiryId: null, region: 'All' }
  }
  if (path === '/corporate' || hash === 'corporate') {
    return { page: 'corporate', pkgId: null, enquiryId: null, region: 'All' }
  }
  if (path === '/group-tours' || hash === 'group-tours') {
    return { page: 'group-tours', pkgId: null, enquiryId: null, region: 'All' }
  }
  if (path === '/booking' || hash === 'booking') {
    return { page: 'booking', pkgId: null, enquiryId: null, region: 'All' }
  }

  const validPages = ['home', 'destinations', 'about', 'luxury', 'booking', 'group-tours', 'corporate', 'giftcards', 'gallery']
  return { page: validPages.includes(hash) ? hash : 'home', pkgId: null, enquiryId: null, region: 'All' }
}

function App() {
  const initialRoute = getInitialRoute()
  const [activePage, setActivePage] = useState(initialRoute.page)
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(initialRoute.enquiryId)
  const [initialRegion, setInitialRegion] = useState(initialRoute.region || 'All')

  const [packages, setPackages] = useState(() => {
    try {
      const cached = localStorage.getItem('kraft_customer_packages')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // ignore
    }
    return staticPackages
  })

  const [selectedPackage, setSelectedPackage] = useState(() => {
    if (initialRoute.pkgId) {
      return staticPackages.find(p => p.id?.toLowerCase() === initialRoute.pkgId?.toLowerCase()) || null
    }
    return null
  })
  const [testimonials, setTestimonials] = useState(() => {
    try {
      const cached = localStorage.getItem('kraft_customer_testimonials')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // ignore
    }
    return fallbackTestimonials
  })
  const [initialSearch, setInitialSearch] = useState('')
  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem('kraft_customer_stats')
      if (cached) return JSON.parse(cached)
    } catch {
      // ignore
    }
    return {
      tripsCrafted: '10+',
      satisfaction: '52%',
      destinations: '40+'
    }
  })
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('kraft_customer_settings')
      if (cached) return JSON.parse(cached)
    } catch {
      // ignore
    }
    return {
      agencyName: 'KRAFT YOUR TRIP',
      agencyAddress: 'Mumbai, Maharashtra, India',
      agencyPhone: '+91 7046704693',
      agencyEmail: 'contact@kraftyourtrip.com'
    }
  })

  // Load dynamic data from backend API with localStorage caching
  useEffect(() => {
    const loadDynamicData = async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const pkgRes = await fetch(`${API_URL}/api/packages`)
        if (pkgRes.ok) {
          const pkgData = await pkgRes.json()
          if (Array.isArray(pkgData) && pkgData.length > 0) {
            setPackages(pkgData)
            try { localStorage.setItem('kraft_customer_packages', JSON.stringify(pkgData)) } catch {}
          }
        }

        const testRes = await fetch(`${API_URL}/api/testimonials?status=approved`)
        if (testRes.ok) {
          const testData = await testRes.json()
          if (Array.isArray(testData) && testData.length > 0) {
            setTestimonials(testData)
            try { localStorage.setItem('kraft_customer_testimonials', JSON.stringify(testData)) } catch {}
          }
        }

        const settingsRes = await fetch(`${API_URL}/api/settings`)
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          setSettings(settingsData)
          try { localStorage.setItem('kraft_customer_settings', JSON.stringify(settingsData)) } catch {}
        }

        const statsRes = await fetch(`${API_URL}/api/stats`)
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
          try { localStorage.setItem('kraft_customer_stats', JSON.stringify(statsData)) } catch {}
        }
      } catch (err) {
        console.warn('Backend API connection failed, using cached/static fallbacks:', err)
      }
    }
    loadDynamicData()
  }, [])

  // Helper for CMS Section Visibility toggles
  const isSectionVisible = (secKey) => {
    return settings?.sectionVisibility?.[secKey] !== false
  }

  // Push a history entry and update state together with clean unique URLs
  const navigate = useCallback((page, pkg = null, region = 'All', search = '', enquiryId = null) => {
    let newPath = '/'
    if (page === 'enquiry' && enquiryId) {
      newPath = `/enquiry/${enquiryId}`
    } else if (page === 'detail' && pkg?.id) {
      newPath = `/package/${pkg.id}`
    } else if (page === 'destinations') {
      newPath = region && region !== 'All' ? `/destination/${encodeURIComponent(region.toLowerCase())}` : '/destinations'
    } else if (page === 'gallery' || page === 'reviews') {
      newPath = '/reviews'
    } else if (page === 'about') {
      newPath = '/about'
    } else if (page === 'corporate') {
      newPath = '/corporate'
    } else if (page === 'group-tours') {
      newPath = '/group-tours'
    } else if (page === 'booking') {
      newPath = '/booking'
    } else if (page === 'luxury') {
      newPath = '/luxury'
    }

    try {
      window.history.pushState({
        page,
        pkgId: pkg?.id ?? null,
        departureId: pkg?.departureId ?? null,
        departureDate: pkg?.departureDate ?? null,
        returnDate: pkg?.returnDate ?? null,
        priceModifier: pkg?.priceModifier ?? 0,
        region,
        search,
        enquiryId
      }, '', newPath)
    } catch {
      // ignore
    }

    setActivePage(page)
    setSelectedPackage(pkg)
    setInitialRegion(region)
    setInitialSearch(search)
    setSelectedEnquiryId(enquiryId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Handle browser back / forward
  useEffect(() => {
    const onPop = (e) => {
      const state = e.state ?? { page: 'home', pkgId: null, departureId: null, departureDate: null, returnDate: null, priceModifier: 0, region: 'All', search: '' }
      let { page, pkgId, departureId, departureDate, returnDate, priceModifier, region, search, enquiryId } = state

      const currPath = window.location.pathname.toLowerCase()
      const pMatch = currPath.match(/^\/package\/([\w-]+)/i)
      if (pMatch) {
        page = 'detail'
        pkgId = pMatch[1]
      } else if (currPath === '/reviews' || currPath === '/gallery') {
        page = 'gallery'
      } else if (currPath === '/destinations') {
        page = 'destinations'
      } else if (currPath === '/about') {
        page = 'about'
      }

      const basePkg = pkgId ? packages.find(p => p.id?.toLowerCase() === pkgId?.toLowerCase()) ?? null : null
      const pkg = basePkg
        ? {
            ...basePkg,
            departureId: departureId ?? null,
            departureDate: departureDate ?? null,
            returnDate: returnDate ?? null,
            priceModifier: priceModifier ?? 0
          }
        : null
      setActivePage(page)
      setSelectedPackage(pkg)
      setInitialRegion(region || 'All')
      setInitialSearch(search ?? '')
      setSelectedEnquiryId(enquiryId ?? null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [packages])

  // Update dynamic document.title and Open Graph meta tags per section
  useEffect(() => {
    updatePageMeta(activePage)
  }, [activePage])

  const handleViewPackage = (pkg) => navigate('detail', pkg)
  const handleExplore = (region = 'All') => navigate('destinations', null, region)
  const handleBook = (pkg = null) => navigate('booking', pkg)

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-stone-900 font-sans flex flex-col justify-between antialiased">
      {/* Header Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={(page, pkg, region, search) => navigate(page, pkg, region, search)}
        settings={settings}
      />

      {/* Main Content Pages */}
      <main className="flex-grow pt-[56px] lg:pt-[106px]">
        {activePage === 'home' && (
          <div className="animate-fade-in">
            {/* Hero Banner */}
            {isSectionVisible('hero') && (
              <HeroSection
                onExplore={handleExplore}
                onBook={() => handleBook(null)}
                stats={stats}
                heroSettings={settings.heroSection}
              />
            )}

            {/* Destination Categories Strip */}
            {isSectionVisible('categories') && (
              <DestinationCategories onExplore={handleExplore} />
            )}

            {/* Featured Luxury Packages (2 Full Rows) */}
            {isSectionVisible('featured') && (
              <FeaturedPackages
                packages={packages}
                onViewPackage={handleViewPackage}
                settings={settings}
                onNavigate={(page, pkg, region, search) => navigate(page, pkg, region, search)}
              />
            )}

            {/* Upcoming Group Departures */}
            {isSectionVisible('groupTours') && (
              <UpcomingTrips onBook={handleBook} onViewPackage={handleViewPackage} />
            )}

            {/* Customer Testimonials Grid */}
            {isSectionVisible('testimonials') && (
              <TestimonialsSection testimonials={testimonials} onNavigate={(page) => navigate(page)} />
            )}

            {/* Speciality Tour Categories Grid (Positioned after reviews) */}
            {isSectionVisible('speciality') && (
              <SpecialityCategories
                packages={packages}
                onSelectCategory={(name, keyword, catId) => {
                  if (catId === 'group-tours' || (name && name.toLowerCase().includes('group'))) {
                    navigate('group-tours')
                  } else {
                    navigate('destinations', null, 'All', keyword)
                  }
                }}
              />
            )}

            {/* Final home CTA section */}
            {isSectionVisible('cta') && (
              <section className="py-20 sm:py-24 text-center relative overflow-hidden bg-stone-900 text-white">
                <div className="absolute inset-0">
                  <img
                    src={
                      settings.ctaSection?.bgImage
                        ? (settings.ctaSection.bgImage.startsWith('http') || settings.ctaSection.bgImage.startsWith('data:')
                            ? settings.ctaSection.bgImage
                            : `${API_URL}${settings.ctaSection.bgImage.startsWith('/') ? '' : '/'}${settings.ctaSection.bgImage}`)
                        : `${API_URL}/assets/unsplash-app-hero.jpg`
                    }
                    alt="CTA background image"
                    className="w-full h-full object-cover opacity-40"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/unsplash-app-hero.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-950/50 via-transparent to-stone-950/50" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-5">
                  <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                    {settings.ctaSection?.badgeText || 'Your Next Chapter'}
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white tracking-[-0.02em] leading-[1.1]">
                    {settings.ctaSection?.heading || 'Ready to start planning your escape?'}
                  </h2>
                  <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed font-light whitespace-pre-line">
                    {settings.ctaSection?.description || 'Get in touch with our expert luxury travel specialists. We will customize every detail of your itinerary to build your perfect journey.'}
                  </p>
                  <div className="pt-3">
                    <button
                      onClick={() => handleBook(null)}
                      className="px-7 py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full text-sm font-semibold shadow-lg shadow-amber-900/30 transition-all duration-300 active:scale-[0.98] cursor-pointer"
                    >
                      {settings.ctaSection?.buttonText || 'Request custom quote'}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {activePage === 'destinations' && (
          <DestinationsPage
            packages={packages}
            onViewPackage={handleViewPackage}
            initialRegion={initialRegion}
            initialSearch={initialSearch}
            onBook={() => navigate('booking')}
          />
        )}

        {activePage === 'about' && <AboutPage onBook={handleBook} />}

        {activePage === 'luxury' && (
          <LuxuryExperiences onViewPackage={handleViewPackage} onBook={handleBook} />
        )}

        {activePage === 'corporate' && (
          <CorporateTours onNavigate={(page, pkg, region, search) => navigate(page, pkg, region, search)} />
        )}

        {activePage === 'group-tours' && (
          <UpcomingTrips onBook={handleBook} onViewPackage={handleViewPackage} />
        )}

        {activePage === 'booking' && (
          <BookingPage
            key={selectedPackage ? `${selectedPackage.id}-${selectedPackage.departureId || ''}` : 'booking-custom'}
            packages={packages}
            selectedPackage={selectedPackage}
          />
        )}

        {activePage === 'detail' && selectedPackage && (
          <PackageDetail
            pkg={selectedPackage}
            onBack={handleExplore}
            onBook={handleBook}
            settings={settings}
          />
        )}

        {activePage === 'enquiry' && selectedEnquiryId && (
          <EnquiryPage
            enquiryId={selectedEnquiryId}
            onBackToHome={() => navigate('home')}
          />
        )}

        {activePage === 'giftcards' && (
          <GiftCardsPage onNavigate={(page, pkg, region, search) => navigate(page, pkg, region, search)} />
        )}

        {activePage === 'gallery' && (
          <TripStoriesPage
            testimonials={testimonials}
            packages={packages}
            onStorySubmitted={(newStory) => setTestimonials(prev => [newStory, ...prev])}
          />
        )}
      </main>

      {/* Footer Branding & Links */}
      <Footer onNavigate={(page) => navigate(page)} settings={settings} />
    </div>
  )
}

export default App
