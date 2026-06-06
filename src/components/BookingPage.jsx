import { useState } from 'react'
import { formatINR } from '../utils/currency'

export default function BookingPage({ packages, selectedPackage }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    packageId: selectedPackage ? selectedPackage.id : '',
    startDate: '',
    endDate: '',
    guests: '2',
    notes: ''
  })

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Full name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.packageId) newErrors.packageId = 'Please select a package'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      // Simulate submission success
      setSubmitted(true)
    }
  }

  const chosenPackage = packages.find((p) => p.id === formData.packageId)

  if (submitted) {
    return (
      <section className="py-24 sm:py-32 bg-[#FDFCF7] min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center animate-fade-in">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/25">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mb-4 tracking-tight">
            Inquiry Received
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light mb-8">
            Thank you, <span className="font-bold text-stone-850">{formData.name}</span>. Your booking inquiry for the{' '}
            <span className="font-bold text-amber-705">{chosenPackage?.name || 'Custom Tour'}</span> has been successfully logged.
          </p>

          {/* Details summary */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 text-left text-xs mb-8 space-y-2.5 shadow-sm">
            <div className="flex justify-between">
              <span className="text-stone-400">Traveler Name</span>
              <span className="font-semibold text-stone-850">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Package Selected</span>
              <span className="font-semibold text-stone-850">{chosenPackage?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Total Group Size</span>
              <span className="font-semibold text-stone-850">{formData.guests} Guest(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Target Dates</span>
              <span className="font-semibold text-stone-850">{formData.startDate} to {formData.endDate}</span>
            </div>
          </div>

          <p className="text-xs text-stone-550 leading-relaxed italic mb-8">
            A luxury travel specialist will reach out to you at <span className="font-bold text-stone-850">{formData.email}</span> or{' '}
            <span className="font-bold text-stone-850">{formData.phone}</span> within 24 hours to begin customizing your itinerary.
          </p>

          <button
            onClick={() => {
              setFormData({
                name: '',
                email: '',
                phone: '',
                packageId: '',
                startDate: '',
                endDate: '',
                guests: '2',
                notes: ''
              })
              setSubmitted(false)
            }}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Submit Another Inquiry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 sm:py-32 bg-[#FDFCF7] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-bold uppercase tracking-wider mb-4 border border-amber-500/10">
            Booking Inquiry
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-4">
            Request A Bespoke Itinerary
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto">
            Provide your preferences below. Our luxury travel designers will create a tailored package proposal.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-10 shadow-sm animate-fade-in-up delay-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sophia Loren"
                  className={`w-full bg-[#FAF9F5]/40 border ${
                    errors.name ? 'border-rose-450 focus:border-rose-550 focus:ring-rose-550' : 'border-stone-200 focus:border-amber-500 focus:ring-amber-500'
                  } rounded-xl py-2.5 px-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all`}
                />
                {errors.name && <span className="text-[10px] text-rose-500 mt-1.5 block font-semibold">{errors.name}</span>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. sophia@loren.com"
                  className={`w-full bg-[#FAF9F5]/40 border ${
                    errors.email ? 'border-rose-450 focus:border-rose-550 focus:ring-rose-550' : 'border-stone-200 focus:border-amber-500 focus:ring-amber-500'
                  } rounded-xl py-2.5 px-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all`}
                />
                {errors.email && <span className="text-[10px] text-rose-500 mt-1.5 block font-semibold">{errors.email}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 (555) 019-2831"
                  className={`w-full bg-[#FAF9F5]/40 border ${
                    errors.phone ? 'border-rose-450 focus:border-rose-550 focus:ring-rose-550' : 'border-stone-200 focus:border-amber-500 focus:ring-amber-500'
                  } rounded-xl py-2.5 px-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all`}
                />
                {errors.phone && <span className="text-[10px] text-rose-500 mt-1.5 block font-semibold">{errors.phone}</span>}
              </div>

              {/* Package Select */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Select Package <span className="text-rose-500">*</span>
                </label>
                <select
                  name="packageId"
                  value={formData.packageId}
                  onChange={handleChange}
                  className={`w-full bg-[#FAF9F5]/40 border ${
                    errors.packageId ? 'border-rose-450 focus:border-rose-550 focus:ring-rose-550' : 'border-stone-200 focus:border-amber-500 focus:ring-amber-500'
                  } rounded-xl py-2.5 px-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all`}
                >
                  <option value="" disabled>-- Choose a package --</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.duration} - from {formatINR(pkg.basePrice)})
                    </option>
                  ))}
                </select>
                {errors.packageId && <span className="text-[10px] text-rose-500 mt-1.5 block font-semibold">{errors.packageId}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Start Date */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Start Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full bg-[#FAF9F5]/40 border ${
                    errors.startDate ? 'border-rose-450 focus:border-rose-550' : 'border-stone-200 focus:border-amber-500'
                  } rounded-xl py-2.5 px-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all`}
                />
                {errors.startDate && <span className="text-[10px] text-rose-500 mt-1.5 block font-semibold">{errors.startDate}</span>}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  End Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full bg-[#FAF9F5]/40 border ${
                    errors.endDate ? 'border-rose-450 focus:border-rose-550' : 'border-stone-200 focus:border-amber-500'
                  } rounded-xl py-2.5 px-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all`}
                />
                {errors.endDate && <span className="text-[10px] text-rose-500 mt-1.5 block font-semibold">{errors.endDate}</span>}
              </div>

              {/* Guests Count */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Number of Guests
                </label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full bg-[#FAF9F5]/40 border border-stone-200 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-stone-850 outline-none focus:ring-1 transition-all"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6+ Guests</option>
                </select>
              </div>
            </div>

            {/* Special Notes / Preferences */}
            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                Special Requests / Dietary / Preferences
              </label>
              <textarea
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Prefer high floor suites, vegetarian meals, airport speedboats..."
                className="w-full bg-[#FAF9F5]/40 border border-stone-200 focus:border-amber-500 rounded-xl py-3 px-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all"
              />
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/25 active:scale-[0.98] transition-all duration-300 text-center"
              >
                Submit Travel Inquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
