import { useState, useMemo } from 'react'
import { Star, MapPin, Camera, Filter, Search, PlusCircle, ChevronLeft, ChevronRight, X, Sparkles, Quote } from 'lucide-react'
import SubmitStoryModal from './SubmitStoryModal'
import { API_URL, getImgUrl, handleImageError, DEFAULT_FALLBACK_IMAGE, DEFAULT_HERO_IMAGE } from '../utils/image'

const DEFAULT_AVATAR = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#e4d5c5" rx="50"/><circle cx="50" cy="38" r="18" fill="#d4c4b5"/><path d="M20 80c0-18 13-32 30-32s30 14 30 32" fill="#d4c4b5"/></svg>'
)

function parseImageList(images) {
  if (!images) return []
  if (Array.isArray(images)) return images.filter(Boolean)
  if (typeof images === 'string') {
    try {
      if (images.trim().startsWith('[')) {
        const parsed = JSON.parse(images)
        return Array.isArray(parsed) ? parsed.filter(Boolean) : []
      }
      return images.trim() ? [images.trim()] : []
    } catch {
      return images.trim() ? [images.trim()] : []
    }
  }
  return []
}

const ROLE_BADGES = {
  'Customer': { label: 'Traveler', bg: 'bg-amber-500/10 text-amber-700 border-amber-300' },
  'Tour Leader': { label: 'Tour Leader', bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' },
  'Travel Specialist': { label: 'Travel Specialist', bg: 'bg-indigo-500/10 text-indigo-700 border-indigo-300' },
  'Local Guide': { label: 'Local Guide', bg: 'bg-sky-500/10 text-sky-700 border-sky-300' }
}

export default function TripStoriesPage({ testimonials = [], packages = [], onStorySubmitted }) {
  const [selectedRole, setSelectedRole] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPackage, setSelectedPackage] = useState('All')
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [expandedStoryId, setExpandedStoryId] = useState(null)

  // Lightbox Modal state
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
    title: ''
  })

  // Filter testimonials
  const filteredStories = useMemo(() => {
    return testimonials.filter(item => {
      // Only display consumer/trip stories (exclude corporate B2B reviews)
      if (item.type === 'corporate') return false

      // Role filter
      if (selectedRole !== 'All') {
        const itemRole = item.role || 'Customer'
        if (selectedRole === 'Traveler' && itemRole !== 'Customer') return false
        if (selectedRole !== 'Traveler' && itemRole !== selectedRole) return false
      }
      // Package filter
      if (selectedPackage !== 'All' && item.package !== selectedPackage) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const nameMatch = item.name?.toLowerCase().includes(q)
        const textMatch = item.text?.toLowerCase().includes(q)
        const pkgMatch = item.package?.toLowerCase().includes(q)
        const locMatch = item.location?.toLowerCase().includes(q)
        if (!nameMatch && !textMatch && !pkgMatch && !locMatch) return false
      }
      return true
    })
  }, [testimonials, selectedRole, selectedPackage, searchQuery])

  const openLightbox = (images, index, storyTitle) => {
    const formattedImages = images.map(img => getImgUrl(img, DEFAULT_FALLBACK_IMAGE))
    setLightbox({
      isOpen: true,
      images: formattedImages,
      currentIndex: index,
      title: storyTitle
    })
  }

  const closeLightbox = () => {
    setLightbox({ isOpen: false, images: [], currentIndex: 0, title: '' })
  }

  const nextLightboxImage = () => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }))
  }

  const prevLightboxImage = () => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }))
  }

  return (
    <div className="min-h-screen bg-[#FDFCF7]">
      {/* Hero Banner Section */}
      <section className="relative bg-stone-900 text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getImgUrl('/assets/unsplash-app-hero.jpg', DEFAULT_HERO_IMAGE)}
            alt="Trip Stories & Gallery background"
            className="w-full h-full object-cover opacity-25"
            onError={(e) => handleImageError(e, DEFAULT_HERO_IMAGE)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-stone-950/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Traveler & Team Community
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15]">
            Trip Stories & Photo Gallery
          </h1>

          <p className="text-stone-300 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed">
            Real experiences, authentic reviews, and stunning photography captured by our travelers, tour leaders, and local guides across the globe.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full font-semibold text-sm shadow-xl shadow-amber-950/40 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              Share Your Story & Photos
            </button>
          </div>
        </div>
      </section>

      {/* Main Content & Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200/80 space-y-4 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                id="stories-search-input"
                aria-label="Search stories by destination, guide, or traveler name"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories by destination, guide, or traveler name..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none"
              />
            </div>

            {/* Destination Package Select Filter */}
            <div className="w-full md:w-64">
              <select
                id="stories-package-select"
                aria-label="Filter stories by package"
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none text-stone-700 cursor-pointer"
              >
                <option value="All">All Trip Packages</option>
                {packages.map(pkg => (
                  <option key={pkg.id || pkg.name} value={pkg.name}>{pkg.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Role Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter Role:
            </span>
            {['All', 'Traveler', 'Tour Leader', 'Travel Specialist', 'Local Guide'].map((roleOpt) => (
              <button
                key={roleOpt}
                onClick={() => setSelectedRole(roleOpt)}
                aria-label={`Filter by ${roleOpt} role`}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  selectedRole === roleOpt
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {roleOpt === 'All' ? 'All Stories' : roleOpt}
              </button>
            ))}
          </div>
        </div>

        {/* Affect UI Style Trust & Social Proof Header Banner */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2 font-display text-lg font-bold text-white">4.9 / 5.0</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-white tracking-tight">
              Loved by 350+ discerning luxury travelers
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light max-w-xl">
              Authentic stories, verified impressions, and unscripted memories from guests who explored the world with Kraft Your Trip.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
            {/* Stacked traveler avatars */}
            <div className="flex -space-x-3 overflow-hidden p-1">
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-stone-900 object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=75" alt="" />
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-stone-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=75" alt="" />
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-stone-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=75" alt="" />
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-stone-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=75" alt="" />
              <div className="h-10 w-10 rounded-full ring-2 ring-stone-900 bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                +340
              </div>
            </div>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-amber-950/40 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              Share Your Journey
            </button>
          </div>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Stories Masonry Wall Grid */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-sm p-8 space-y-4">
            <Camera className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-display text-xl text-stone-800">No stories found</h3>
            <p className="text-sm text-stone-500 max-w-sm mx-auto">
              Try adjusting your search query or role filters, or be the first to share a story!
            </p>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-6 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-full shadow hover:bg-amber-500 transition-colors"
            >
              Share A Trip Story
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
            {filteredStories.map((story) => {
              const roleInfo = ROLE_BADGES[story.role] || ROLE_BADGES['Customer']
              const imageList = parseImageList(story.images)
              const isLongText = story.text && story.text.length > 200
              const isExpanded = expandedStoryId === story.id

              return (
                <div
                  key={story.id}
                  className="break-inside-avoid mb-6 bg-white rounded-3xl border border-stone-200/90 hover:border-amber-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group p-6"
                >
                  <div className="space-y-4">
                    {/* Header: User Info & Verified Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {story.avatar ? (
                          <img
                            src={getImgUrl(story.avatar, DEFAULT_AVATAR)}
                            alt={story.name || 'Traveler'}
                            onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
                            className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/20 shadow-xs"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-semibold flex items-center justify-center text-sm border border-amber-200">
                            {story.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}

                        <div>
                          <h4 className="font-display text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors leading-tight">
                            {story.name}
                          </h4>
                          {story.location && (
                            <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                              {story.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Verified Journey Pill */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded-full border border-emerald-200/60 shrink-0">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                        Verified
                      </span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1" aria-label={`${story.rating || 5} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            (story.rating || 5) >= star
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-200'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>

                    {/* Review Quote Body */}
                    <div className="relative text-stone-700 text-xs sm:text-[13px] leading-relaxed font-light">
                      <Quote className="w-4 h-4 text-amber-300/40 absolute -top-1 -left-1 -z-0" aria-hidden="true" />
                      <p className="relative z-10 whitespace-pre-line italic">
                        &ldquo;{isExpanded || !isLongText ? story.text : `${story.text.slice(0, 200)}...`}&rdquo;
                      </p>
                      {isLongText && (
                        <button
                          type="button"
                          onClick={() => setExpandedStoryId(isExpanded ? null : story.id)}
                          className="mt-1.5 text-[11px] font-bold text-amber-700 hover:underline inline-block cursor-pointer"
                        >
                          {isExpanded ? 'Show less' : 'Read full review'}
                        </button>
                      )}
                    </div>

                    {/* Photo Gallery Thumbnails */}
                    {imageList.length > 0 && (
                      <div className="pt-2">
                        <div className={`grid gap-2 ${imageList.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                          {imageList.slice(0, 2).map((imgItem, idx) => {
                            const fullImgUrl = getImgUrl(imgItem, DEFAULT_FALLBACK_IMAGE)
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => openLightbox(imageList, idx, `${story.name} — ${story.package || 'Trip Photo'}`)}
                                className="relative aspect-[4/3] rounded-xl overflow-hidden group/img focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs border border-stone-200/60"
                              >
                                <img
                                  src={fullImgUrl}
                                  alt={`Trip photo ${idx + 1}`}
                                  onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-stone-900/10 group-hover/img:bg-stone-900/25 transition-colors" />
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Destination Tag & Role */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    {story.package ? (
                      <span className="text-[11px] font-semibold text-amber-900 bg-amber-50/80 px-2.5 py-0.5 rounded-lg border border-amber-200/50 truncate max-w-[170px]" title={story.package}>
                        {story.package}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-stone-500 bg-stone-50 px-2 py-0.5 rounded-lg">
                        Custom Expedition
                      </span>
                    )}

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleInfo.bg} shrink-0`}>
                      {roleInfo.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Lightbox Viewer Modal */}
      {lightbox.isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 text-stone-300 hover:text-white bg-stone-800/60 rounded-full transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {lightbox.images.length > 1 && (
            <>
              <button
                onClick={prevLightboxImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-stone-300 hover:text-white bg-stone-800/60 rounded-full transition-colors z-50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextLightboxImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-stone-300 hover:text-white bg-stone-800/60 rounded-full transition-colors z-50"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[85vh] relative flex flex-col items-center justify-center">
            <img
              src={lightbox.images[lightbox.currentIndex]}
              alt="Trip high-res view"
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-4 text-center text-white">
              <p className="text-sm font-medium text-stone-300">{lightbox.title}'s Trip Gallery</p>
              <p className="text-xs text-stone-400 mt-0.5">
                Image {lightbox.currentIndex + 1} of {lightbox.images.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Story Modal */}
      <SubmitStoryModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        packages={packages}
        onSuccess={(newStory) => {
          if (onStorySubmitted) onStorySubmitted(newStory)
        }}
      />
    </div>
  )
}
