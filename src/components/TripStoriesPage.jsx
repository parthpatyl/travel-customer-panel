import { useState, useMemo } from 'react'
import { Star, MapPin, Camera, Filter, Search, PlusCircle, ChevronLeft, ChevronRight, X, Sparkles, Quote } from 'lucide-react'
import SubmitStoryModal from './SubmitStoryModal'
import { API_URL, getImgUrl, handleImageError, DEFAULT_FALLBACK_IMAGE } from '../utils/image'

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
            src={`${API_URL}/assets/unsplash-app-hero.jpg`}
            alt="Trip Stories & Gallery background"
            className="w-full h-full object-cover opacity-25"
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

        {/* Stories Grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredStories.map((story) => {
              const roleInfo = ROLE_BADGES[story.role] || ROLE_BADGES['Customer']
              const imageList = parseImageList(story.images)
              const isLongText = story.text && story.text.length > 220
              const isExpanded = expandedStoryId === story.id

              return (
                <div
                  key={story.id}
                  className="bg-white rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6 space-y-4">
                    {/* Header: User Info & Role Tag */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {story.avatar ? (
                          <img
                            src={getImgUrl(story.avatar, DEFAULT_AVATAR)}
                            alt={story.name || 'Traveler'}
                            onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
                            className="w-11 h-11 rounded-full object-cover border-2 border-amber-500/20 shadow-sm"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-800 font-semibold flex items-center justify-center text-base border border-amber-200">
                            {story.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}

                        <div>
                          <h4 className="font-display text-base font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
                            {story.name}
                          </h4>
                          {story.location && (
                            <span className="text-xs text-stone-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-amber-600" />
                              {story.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Submitter Role Badge */}
                      <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${roleInfo.bg}`}>
                        {roleInfo.label}
                      </span>
                    </div>

                    {/* Rating & Package Tag */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
                      <div className="flex items-center gap-1" aria-label={`${story.rating || 5} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              (story.rating || 5) >= star
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-200'
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>

                      {story.package && (
                        <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60 truncate max-w-[160px]">
                          {story.package}
                        </span>
                      )}
                    </div>

                    {/* Review Text */}
                    <div className="relative text-stone-700 text-sm leading-relaxed font-normal">
                      <Quote className="w-5 h-5 text-amber-300/40 absolute -top-1 -left-2 -z-0" aria-hidden="true" />
                      <p className="relative z-10 whitespace-pre-line">
                        {isExpanded || !isLongText ? story.text : `${story.text.slice(0, 220)}...`}
                      </p>
                      {isLongText && (
                        <button
                          type="button"
                          onClick={() => setExpandedStoryId(isExpanded ? null : story.id)}
                          className="mt-1 text-xs font-semibold text-amber-700 hover:underline inline-block cursor-pointer"
                        >
                          {isExpanded ? 'Show less' : 'Read full story'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Photo Gallery Strip */}
                  {imageList.length > 0 && (
                    <div className="px-6 pb-6 pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5" /> Trip Gallery ({imageList.length})
                        </span>
                      </div>

                      {/* Image Thumbnail Grid */}
                      <div className={`grid gap-2 ${imageList.length === 1 ? 'grid-cols-1' : (imageList.length === 2 ? 'grid-cols-2' : 'grid-cols-3')}`}>
                        {imageList.slice(0, 3).map((imgItem, idx) => {
                          const src = getImgUrl(imgItem, DEFAULT_FALLBACK_IMAGE)
                          const isLastThum = idx === 2 && imageList.length > 3

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => openLightbox(imageList, idx, story.name)}
                              className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 cursor-pointer group/img text-left focus:outline-none focus:ring-2 focus:ring-amber-500"
                              aria-label={`View photo ${idx + 1} from ${story.name}'s trip gallery`}
                            >
                              <img
                                src={src}
                                alt={`${story.name} photo ${idx + 1}`}
                                onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                              {isLastThum && (
                                <div className="absolute inset-0 bg-stone-900/70 text-white flex items-center justify-center font-semibold text-xs backdrop-blur-[1px]">
                                  +{imageList.length - 3} photos
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
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
