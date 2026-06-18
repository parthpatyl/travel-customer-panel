import { useState } from 'react'
import { formatINR } from '../utils/currency'
import { BadgeCheck, User, Mail, Phone, Calendar, Users, Compass, MessageSquare } from 'lucide-react'

export default function BookingPage({ packages, selectedPackage }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    packageId: selectedPackage ? selectedPackage.id : '',
    customDestination: '',
    startDate: '',
    endDate: '',
    guests: '2',
    notes: ''
  })

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
    if (!formData.packageId) newErrors.packageId = 'Please select a package or destination'
    if (formData.packageId === 'custom-other' && !formData.customDestination?.trim()) {
      newErrors.customDestination = 'Custom destination name is required'
    }
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/bookings/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit inquiry')
      }

      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const getSelectedPackageDisplayName = () => {
    if (formData.packageId === 'custom-other') {
      return `Custom Itinerary: ${formData.customDestination || 'Other'}`
    }
    if (formData.packageId && formData.packageId.startsWith('custom-')) {
      const destName = formData.packageId.replace('custom-', '').replace(/-/g, ' ')
      const capitalizedDest = destName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      return `Custom Itinerary to ${capitalizedDest}`
    }
    const pkg = packages.find((p) => p.id === formData.packageId)
    return pkg ? pkg.name : 'Custom Tour'
  }

  if (submitted) {
    return (
      <section className="py-24 sm:py-32 bg-[#FDFCF7] min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center animate-fade-in">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/25">
            <BadgeCheck className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mb-4 tracking-tight">
            Inquiry Received
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light mb-8">
            Thank you, <span className="font-bold text-stone-850">{formData.name}</span>. Your booking inquiry for the{' '}
            <span className="font-bold text-amber-705">{getSelectedPackageDisplayName()}</span> has been successfully logged.
          </p>

          {/* Details summary */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 text-left text-xs mb-8 space-y-2.5 shadow-sm">
            <div className="flex justify-between">
              <span className="text-stone-400">Traveler Name</span>
              <span className="font-semibold text-stone-850">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Package/Destination Selected</span>
              <span className="font-semibold text-stone-850">{getSelectedPackageDisplayName()}</span>
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
                customDestination: '',
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
    <section className="py-16 sm:py-20 bg-[#FDFCF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Header Section */}
          <div className="text-center lg:text-left mb-8 animate-fade-in-up">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-bold uppercase tracking-wider mb-4 border border-amber-500/10">
              Booking Inquiry
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-4">
              Request A Bespoke Itinerary
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto lg:mx-0">
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
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Sophia Loren"
                      className={`w-full bg-[#FAF9F5]/40 border ${errors.name ? 'border-rose-450 focus:border-rose-550 focus:ring-rose-550' : 'border-stone-200 focus:border-amber-500 focus:ring-amber-500'
                        } rounded-xl py-2.5 pl-10 pr-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all`}
                    />
                  </div>
                  {errors.name && <span className="text-[10px] text-rose-500 mt-1.5 block font-semibold">{errors.name}</span>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. sophia@loren.com"
                      className={`w-full bg-[#FAF9F5]/40 border ${errors.email ? 'border-rose-450 focus:border-rose-550 focus:ring-rose-550' : 'border-stone-200 focus:border-amber-500 focus:ring-amber-500'
                        } rounded-xl py-2.5 pl-10 pr-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all`}
                    />
                  </div>
                  {errors.email && <span className="text-[10px] text-rose-500 mt-1.5 block font-semibold">{errors.email}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +1 (555) 019-2831"
                      className={`w-full bg-[#FAF9F5]/40 border ${errors.phone ? 'border-rose-450 focus:border-rose-550 focus:ring-rose-550' : 'border-stone-200 focus:border-amber-500 focus:ring-amber-500'
                        } rounded-xl py-2.5 pl-10 pr-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all`}
                    />
                  </div>
                  {errors.phone && <span className="text-[10px] text-rose-500 mt-1.5 block font-semibold">{errors.phone}</span>}
                </div>

                {/* Package/Destination Select */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                    Select Package or Destination <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <select
                      name="packageId"
                      value={formData.packageId}
                      onChange={handleChange}
                      className={`w-full bg-[#FAF9F5]/40 border ${errors.packageId ? 'border-rose-450 focus:border-rose-550 focus:ring-rose-550' : 'border-stone-200 focus:border-amber-500 focus:ring-amber-500'
                        } rounded-xl py-2.5 pl-10 pr-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all`}
                    >
                      <option value="" disabled> Choose a package or destination</option>

                      <optgroup label="Company Provided Packages">
                        {packages.map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} ({pkg.duration} - from {formatINR(pkg.basePrice)})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Bespoke Destinations">
                        <option value="custom-europe">Europe (Bespoke Itinerary)</option>
                        <option value="custom-asia">Asia (Bespoke Itinerary)</option>
                        <option value="custom-japan-china">Japan & China (Bespoke Itinerary)</option>
                        <option value="custom-america">America (Bespoke Itinerary)</option>
                        <option value="custom-africa">Africa (Bespoke Itinerary)</option>
                        <option value="custom-south-east-asia">South East Asia (Bespoke Itinerary)</option>
                        <option value="custom-maldives">Maldives (Bespoke Itinerary)</option>
                        <option value="custom-jammu-kashmir">Jammu & Kashmir (Bespoke Itinerary)</option>
                        <option value="custom-kerala">Kerala (Bespoke Itinerary)</option>
                        <option value="custom-andaman">Andaman (Bespoke Itinerary)</option>
                        <option value="custom-leh-ladakh">Leh Ladakh (Bespoke Itinerary)</option>
                        <option value="custom-north-east">North East (Bespoke Itinerary)</option>
                        <option value="custom-other">Other Destination (Bespoke Itinerary)</option>
                      </optgroup>
                    </select>
                  </div>
                  {errors.packageId && <span className="text-[10px] text-rose-500 mt-1.5 block font-semibold">{errors.packageId}</span>}
                </div>
              </div>

              {/* Custom Destination input text field if Other Destination is chosen */}
              {formData.packageId === 'custom-other' && (
                <div className="mt-6 animate-fade-in-up">
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                    Please Specify Destination / Country Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      type="text"
                      name="customDestination"
                      value={formData.customDestination || ''}
                      onChange={handleChange}
                      placeholder="e.g. Italy, Switzerland, Bali, Dubai..."
                      className={`w-full bg-[#FAF9F5]/40 border ${errors.customDestination ? 'border-rose-450 focus:border-rose-550 focus:ring-rose-550' : 'border-stone-200 focus:border-amber-500 focus:ring-amber-500'
                        } rounded-xl py-2.5 pl-10 pr-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all`}
                    />
                  </div>
                  {errors.customDestination && <span className="text-[10px] text-rose-500 mt-1.5 block font-semibold">{errors.customDestination}</span>}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Start Date */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`w-full bg-[#FAF9F5]/40 border ${errors.startDate ? 'border-rose-450 focus:border-rose-550' : 'border-stone-200 focus:border-amber-500'
                        } rounded-xl py-2.5 pl-10 pr-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all`}
                    />
                  </div>
                  {errors.startDate && <span className="text-[10px] text-rose-500 mt-1.5 block font-semibold">{errors.startDate}</span>}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`w-full bg-[#FAF9F5]/40 border ${errors.endDate ? 'border-rose-450 focus:border-rose-550' : 'border-stone-200 focus:border-amber-500'
                        } rounded-xl py-2.5 pl-10 pr-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all`}
                    />
                  </div>
                  {errors.endDate && <span className="text-[10px] text-rose-500 mt-1.5 block font-semibold">{errors.endDate}</span>}
                </div>

                {/* Guests Count */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full bg-[#FAF9F5]/40 border border-stone-200 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-stone-850 outline-none focus:ring-1 transition-all"
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
              </div>

              {/* Special Notes / Preferences */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Special Requests / Dietary / Preferences
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                  <textarea
                    name="notes"
                    rows="4"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="e.g. Prefer high floor suites, vegetarian meals, airport speedboats..."
                    className="w-full bg-[#FAF9F5]/40 border border-stone-200 focus:border-amber-500 rounded-xl py-3 pl-10 pr-4 text-xs text-stone-850 placeholder-stone-400 outline-none focus:ring-1 transition-all"
                  />
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4 space-y-4">
                {submitError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-250 text-rose-800 rounded-xl text-xs font-semibold leading-relaxed">
                    {submitError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-300 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/25 active:scale-[0.98] transition-all duration-300 text-center"
                >
                  {submitting ? 'Submitting Inquiry...' : 'Submit Travel Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <aside className="hidden lg:block space-y-6 sticky top-24">
          {/* Help Card */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 space-y-4 shadow-sm animate-fade-in-up delay-200">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Need Help?</h3>
            <p className="text-xs text-stone-500 leading-relaxed font-light">
              Call us at <a href="tel:+15550192831" className="font-semibold text-amber-750 hover:underline text-nowrap">+1 (555) 019-2831</a> or email <a href="mailto:concierge@kraftyourtrip.com" className="font-semibold text-amber-750 hover:underline">concierge@kraftyourtrip.com</a>
            </p>
          </div>

          {/* Process Card */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 space-y-5 shadow-sm animate-fade-in-up delay-300">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Our Custom Process</h3>
            <div className="space-y-4">
              {[
                { title: 'Submit Inquiry', desc: 'Share your travel preferences, dates, and group details with us.', icon: Compass },
                { title: 'Consultation', desc: 'Our travel designer schedules a brief call to refine your bespoke itinerary.', icon: Users },
                { title: 'Finalize & Book', desc: 'Review your personalized proposal, adjust details, and lock in your escape.', icon: BadgeCheck }
              ].map((p, idx) => {
                const Icon = p.icon
                return (
                  <div key={idx} className="flex gap-3.5 items-start">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-750 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-stone-900">{p.title}</h4>
                      <p className="text-[10px] text-stone-550 leading-relaxed font-light">{p.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Aesthetic Image Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm border border-stone-200/80 aspect-[4/3] group animate-fade-in-up delay-400">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80"
              alt="Bespoke travel planning desk"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-400">Tailored Design</span>
              <p className="text-xs font-bold text-white mt-1">Every detail crafted around you.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
