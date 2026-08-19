import { useState } from 'react'
import { X, Star, Trash2, Camera, User, MapPin, Compass, CheckCircle } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const ROLE_OPTIONS = [
  { id: 'Customer', label: 'Traveler / Customer', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'Tour Leader', label: 'Tour Leader', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'Travel Specialist', label: 'Travel Specialist', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { id: 'Local Guide', label: 'Local Guide', color: 'bg-sky-100 text-sky-800 border-sky-300' }
]

export default function SubmitStoryModal({ isOpen, onClose, packages = [], onSuccess }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('Customer')
  const [location, setLocation] = useState('')
  const [selectedPkg, setSelectedPkg] = useState('')
  const [customPkg, setCustomPkg] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState('')
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  // Handle multi-image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (images.length + files.length > 6) {
      setError('You can upload a maximum of 6 photos per story.')
      return
    }

    setError(null)
    setUploading(true)

    const uploadedUrls = []
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('image', file)

        const res = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: formData
        })

        if (!res.ok) {
          throw new Error('Failed to upload one or more images')
        }

        const data = await res.json()
        if (data.imageUrl) {
          uploadedUrls.push(data.imageUrl)
        }
      }
      setImages(prev => [...prev, ...uploadedUrls])
    } catch (err) {
      setError(err.message || 'Error uploading images. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (!text.trim()) {
      setError('Please share your trip story or review.')
      return
    }

    setSubmitting(true)
    setError(null)

    const pkgName = selectedPkg === 'other' ? customPkg : selectedPkg

    try {
      const res = await fetch(`${API_URL}/api/testimonials/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          location: location.trim(),
          role,
          package: pkgName,
          rating,
          text: text.trim(),
          images,
          type: 'consumer'
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit story')
      }

      const newStory = await res.json()
      setSubmitted(true)
      if (onSuccess) onSuccess(newStory)
    } catch (err) {
      setError(err.message || 'Error submitting your story. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setName('')
    setRole('Customer')
    setLocation('')
    setSelectedPkg('')
    setCustomPkg('')
    setRating(5)
    setText('')
    setImages([])
    setError(null)
    setSubmitted(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 text-stone-800 my-8">
        {/* Modal Header */}
        <div className="relative px-6 py-5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Share Experience</span>
            <h3 className="font-display text-xl sm:text-2xl text-white">Add Your Trip Story & Gallery</h3>
          </div>
          <button
            onClick={handleReset}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="font-display text-2xl text-stone-900">Thank You for Sharing!</h4>
            <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Your review and trip photo gallery have been submitted successfully and published to Kraft Your Trip Stories.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-full text-sm transition-all"
              >
                Close & View Stories
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
                {error}
              </div>
            )}

            {/* Submitter Role selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                I am submitting as a:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRole(opt.id)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center ${
                      role === opt.id
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md font-semibold'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Location / City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. London, UK"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Trip Package / Destination */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Trip Package / Destination
              </label>
              <div className="relative">
                <Compass className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 z-10" />
                <select
                  value={selectedPkg}
                  onChange={(e) => setSelectedPkg(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="">-- Select a Trip / Package --</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id || pkg.name} value={pkg.name}>
                      {pkg.name} ({pkg.region})
                    </option>
                  ))}
                  <option value="other">Other / Custom Expedition</option>
                </select>
              </div>

              {selectedPkg === 'other' && (
                <input
                  type="text"
                  value={customPkg}
                  onChange={(e) => setCustomPkg(e.target.value)}
                  placeholder="Enter custom trip name..."
                  className="mt-2 w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none"
                />
              )}
            </div>

            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Overall Rating
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-medium text-stone-500">
                  {hoverRating || rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Story Text */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Trip Story & Review <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your highlights, memorable moments, or itinerary details..."
                className="w-full px-3 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none resize-y"
              />
            </div>

            {/* Photo Gallery Upload */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Trip Photos Gallery (Up to 6 photos)
              </label>

              {/* Upload Drop Area */}
              <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl cursor-pointer bg-stone-50 hover:bg-amber-50/40 transition-all text-center">
                <Camera className="w-8 h-8 text-stone-400 mb-2" />
                <span className="text-sm font-medium text-stone-700">Click to upload trip photos</span>
                <span className="text-xs text-stone-400 mt-0.5">JPG, PNG, WEBP up to 5MB each</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading || images.length >= 6}
                  className="hidden"
                />
              </label>

              {uploading && (
                <p className="text-xs text-amber-600 font-medium mt-2 animate-pulse">Uploading photos...</p>
              )}

              {/* Uploaded Thumbnails Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-3">
                  {images.map((imgUrl, idx) => {
                    const fullSrc = imgUrl.startsWith('http') || imgUrl.startsWith('data:')
                      ? imgUrl
                      : `${API_URL}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`
                    return (
                      <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
                        <img src={fullSrc} alt={`Trip photo ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="px-7 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-full text-sm shadow-md shadow-amber-900/20 transition-all disabled:opacity-50"
              >
                {submitting ? 'Publishing...' : 'Publish Story & Gallery'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
