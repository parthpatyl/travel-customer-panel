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
import staticPackages from './data/packages'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [activePage, setActivePage] = useState('home')
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null)
  const [initialRegion, setInitialRegion] = useState('All')

  const [packages, setPackages] = useState(staticPackages)
  const [testimonials, setTestimonials] = useState([])
  const [initialSearch, setInitialSearch] = useState('')
  const [stats, setStats] = useState({
    tripsCrafted: '500+',
    satisfaction: '98%',
    destinations: '50+'
  })
  const [settings, setSettings] = useState({
    agencyName: 'KRAFT YOUR TRIP',
    agencyAddress: '456 Sandstone Ave, Suite 100, San Francisco, CA',
    agencyPhone: '+1 (555) 019-2831',
    agencyEmail: 'concierge@kraftyourtrip.com'
  })

  // Load dynamic data from backend API & check deep links
  useEffect(() => {
    const loadDynamicData = async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const pkgRes = await fetch(`${API_URL}/api/packages`)
        if (pkgRes.ok) {
          const pkgData = await pkgRes.json()
          setPackages(pkgData)
        }

        const testRes = await fetch(`${API_URL}/api/testimonials`)
        if (testRes.ok) {
          const testData = await testRes.json()
          setTestimonials(testData)
        }

        const settingsRes = await fetch(`${API_URL}/api/settings`)
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          setSettings(settingsData)
        }

        const statsRes = await fetch(`${API_URL}/api/stats`)
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }
      } catch (err) {
        console.warn('Backend API connection failed, using static fallbacks:', err)
      }
    }
    loadDynamicData()

    // Handle initial deep links (e.g. /enquiry/ENQ-XXXX)
    const path = window.location.pathname;
    const match = path.match(/^\/enquiry\/([\w-]+)$/);
    if (match) {
      const enquiryId = match[1];
      setActivePage('enquiry');
      setSelectedEnquiryId(enquiryId);
      window.history.replaceState({ page: 'enquiry', pkgId: null, region: 'All', search: '', enquiryId }, '')
    }
  }, [])

  // Push a history entry and update state together
  const navigate = useCallback((page, pkg = null, region = 'All', search = '', enquiryId = null) => {
    // Update path in window location when navigating
    const newPath = page === 'enquiry' && enquiryId ? `/enquiry/${enquiryId}` : '/';
    window.history.pushState({ page, pkgId: pkg?.id ?? null, region, search, enquiryId }, '', newPath)
    setActivePage(page)
    setSelectedPackage(pkg)
    setInitialRegion(region)
    setInitialSearch(search)
    setSelectedEnquiryId(enquiryId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Handle browser back / forward
  useEffect(() => {
    // If starting on an enquiry page, ensure history state matches
    const path = window.location.pathname;
    const match = path.match(/^\/enquiry\/([\w-]+)$/);
    if (match) {
      window.history.replaceState({ page: 'enquiry', pkgId: null, region: 'All', search: '', enquiryId: match[1] }, '')
    } else {
      window.history.replaceState({ page: 'home', pkgId: null, region: 'All', search: '' }, '')
    }

    const onPop = (e) => {
      const state = e.state ?? { page: 'home', pkgId: null, region: 'All', search: '' }
      const { page, pkgId, region, search, enquiryId } = state
      const pkg = pkgId ? packages.find(p => p.id === pkgId) ?? null : null
      setActivePage(page)
      setSelectedPackage(pkg)
      setInitialRegion(region)
      setInitialSearch(search ?? '')
      setSelectedEnquiryId(enquiryId ?? null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [packages])


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
            <HeroSection
              onExplore={handleExplore}
              onBook={() => handleBook(null)}
              stats={stats}
              heroSettings={settings.heroSection}
            />

            {/* Destination Categories Strip */}
            <DestinationCategories onExplore={handleExplore} />

            {/* Speciality Tour Categories Grid */}
            <SpecialityCategories
              packages={packages}
              onSelectCategory={(name, keyword) => navigate('destinations', null, 'All', keyword)}
            />

            {/* Featured Luxury Packages */}
            <FeaturedPackages
              packages={packages}
              onViewPackage={handleViewPackage}
              settings={settings}
              onNavigate={(page, pkg, region, search) => navigate(page, pkg, region, search)}
            />

            {/* Upcoming Group Departures */}
            <UpcomingTrips onBook={handleBook} />

            {/* Customer Testimonials Grid */}
            <TestimonialsSection testimonials={testimonials} />

            {/* Final home CTA section */}
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
                    className="px-7 py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full text-sm font-semibold shadow-lg shadow-amber-900/30 transition-all duration-300 active:scale-[0.98]"
                  >
                    {settings.ctaSection?.buttonText || 'Request custom quote'}
                  </button>
                </div>
              </div>
            </section>
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
          <UpcomingTrips onBook={handleBook} />
        )}

        {activePage === 'booking' && (
          <BookingPage
            packages={packages}
            selectedPackage={selectedPackage}
          />
        )}

        {activePage === 'detail' && selectedPackage && (
          <PackageDetail
            pkg={selectedPackage}
            onBack={handleExplore}
            onBook={handleBook}
          />
        )}

        {activePage === 'enquiry' && selectedEnquiryId && (
          <EnquiryPage
            enquiryId={selectedEnquiryId}
            onBackToHome={() => navigate('home')}
          />
        )}
      </main>

      {/* Footer Branding & Links */}
      <Footer onNavigate={(page) => navigate(page)} settings={settings} />
    </div>
  )
}

export default App
