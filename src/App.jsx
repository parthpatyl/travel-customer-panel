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
import packages from './data/packages'
import DevSwitcher from './components/DevSwitcher'

function App() {
  const [activePage, setActivePage] = useState('home')
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [initialRegion, setInitialRegion] = useState('All')

  // Push a history entry and update state together
  const navigate = useCallback((page, pkg = null, region = 'All') => {
    window.history.pushState({ page, pkgId: pkg?.id ?? null, region }, '')
    setActivePage(page)
    setSelectedPackage(pkg)
    setInitialRegion(region)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Handle browser back / forward
  useEffect(() => {
    // Seed the initial history entry so back works from the first page
    window.history.replaceState({ page: 'home', pkgId: null, region: 'All' }, '')

    const onPop = (e) => {
      const state = e.state ?? { page: 'home', pkgId: null, region: 'All' }
      const { page, pkgId, region } = state
      const pkg = pkgId ? packages.find(p => p.id === pkgId) ?? null : null
      setActivePage(page)
      setSelectedPackage(pkg)
      setInitialRegion(region ?? 'All')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleViewPackage = (pkg) => navigate('detail', pkg)
  const handleExplore = (region = 'All') => navigate('destinations', null, region)
  const handleBook = (pkg = null) => navigate('booking', pkg)

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-stone-850 font-sans flex flex-col justify-between antialiased">
      {/* Header Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={(page) => navigate(page)}
      />

      {/* Main Content Pages */}
      <main className="flex-grow">
        {activePage === 'home' && (
          <div className="animate-fade-in">
            {/* Hero Banner */}
            <HeroSection
              onExplore={handleExplore}
              onBook={() => handleBook(null)}
            />

            {/* Destination Categories Strip */}
            <DestinationCategories onExplore={handleExplore} />

            {/* Featured Luxury Packages */}
            <FeaturedPackages
              packages={packages}
              onViewPackage={handleViewPackage}
            />

            {/* Customer Testimonials Grid */}
            <TestimonialsSection />

            {/* Final home CTA section */}
            <section className="py-20 text-center relative overflow-hidden bg-stone-900 text-white">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80"
                  alt="CTA background image"
                  className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 to-transparent" />
              </div>

              <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-6">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  Ready to Start Planning Your Next Escape?
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed font-light">
                  Get in touch with our expert luxury travel specialists. We will customize every detail of your itinerary to build your perfect journey.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => handleBook(null)}
                    className="px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-amber-600/20 transition-all duration-300 active:scale-[0.98]"
                  >
                    Request Custom Quote
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
          />
        )}

        {activePage === 'about' && <AboutPage onBook={handleBook} />}

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
      </main>

      {/* Footer Branding & Links */}
      <Footer onNavigate={(page) => navigate(page)} />
      <DevSwitcher />
    </div>
  )
}

export default App
