import { useState } from 'react'
import { formatINR, formatUSD } from '../utils/currency'
import { BadgeCheck, User, Mail, Calendar, Users, Compass, MessageSquare, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { parsePhoneNumber } from 'libphonenumber-js'
import PhoneInput from './PhoneInput'
import { getDefaultDialCode } from '../utils/dialCodes'

const BESPOKE_FALLBACKS = [
  { id: 'custom-europe', name: 'Europe' },
  { id: 'custom-asia', name: 'Asia' },
  { id: 'custom-japan-china', name: 'Japan & China' },
  { id: 'custom-america', name: 'America' },
  { id: 'custom-africa', name: 'Africa' },
  { id: 'custom-south-east-asia', name: 'South East Asia' },
  { id: 'custom-maldives', name: 'Maldives' },
  { id: 'custom-jammu-kashmir', name: 'Jammu & Kashmir' },
  { id: 'custom-kerala', name: 'Kerala' },
  { id: 'custom-andaman', name: 'Andaman' },
  { id: 'custom-leh-ladakh', name: 'Leh Ladakh' },
  { id: 'custom-north-east', name: 'North East' },
  { id: 'custom-other', name: 'Other Destination' },
]

const DIETARY_OPTIONS = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'No Preference']
const SEAT_OPTIONS = ['Window', 'Aisle', 'Middle']
const NAME_REGEX = /^[a-zA-Z\s]+$/

function parseDurationDays(duration) {
  if (!duration) return null
  const match = String(duration).match(/(\d+)\s*Days?/i)
  return match ? parseInt(match[1]) : null
}

function GuestCard({ index, data, onChange, errors }) {
  const label = index === 0 ? 'Primary Contact (you)' : `Guest ${index + 1}`
  return (
    <div className="bg-[#FAF9F5] border border-stone-200/80 rounded-2xl p-5 space-y-4">
      <h4 className="text-xs font-bold text-stone-700 uppercase tracking-[0.12em]">{label}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-[0.15em] mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={data?.name || ''}
            onChange={(e) => {
              const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '')
              onChange(index, 'name', filtered)
            }}
            placeholder="e.g. Jane Doe"
            className={`w-full bg-white border ${errors?.[index]?.name ? 'border-rose-400' : 'border-stone-200'} focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all`}
          />
          {errors?.[index]?.name && <span className="text-xs text-rose-600 mt-1 block font-semibold">{errors[index].name}</span>}
        </div>
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-[0.15em] mb-1.5">Email</label>
          <input
            type="email"
            value={data?.email || ''}
            onChange={(e) => onChange(index, 'email', e.target.value)}
            placeholder="e.g. jane@example.com"
            className="w-full bg-white border border-stone-200 focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-[0.15em] mb-1.5">Dietary Preference</label>
          <select
            value={data?.dietary || 'None'}
            onChange={(e) => onChange(index, 'dietary', e.target.value)}
            className="w-full bg-white border border-stone-200 focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-sm text-stone-900 outline-none transition-all appearance-none cursor-pointer"
          >
            {DIETARY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-[0.15em] mb-1.5">Seat Preference</label>
          <select
            value={data?.seat || 'Window'}
            onChange={(e) => onChange(index, 'seat', e.target.value)}
            className="w-full bg-white border border-stone-200 focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-sm text-stone-900 outline-none transition-all appearance-none cursor-pointer"
          >
            {SEAT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-[0.15em] mb-1.5">Passport No.</label>
          <input
            type="text"
            value={data?.passport || ''}
            onChange={(e) => onChange(index, 'passport', e.target.value)}
            placeholder="Optional"
            className="w-full bg-white border border-stone-200 focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  )
}

export default function BookingPage({ packages, selectedPackage }) {
  const standardPackages = (packages || []).filter(p => !p.isBespoke)
  const bespokePackages = (packages || []).filter(p => p.isBespoke)
  const defaultCode = getDefaultDialCode()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: defaultCode?.code ?? '',
    packageId: selectedPackage ? selectedPackage.id : '',
    customDestination: '',
    startDate: '',
    endDate: '',
    guests: '2',
    notes: ''
  })

  const [groupMembers, setGroupMembers] = useState(() =>
    Array.from({ length: 2 }, () => ({
      name: '', email: '', dietary: 'None', seat: 'Window', passport: ''
    }))
  )
  const [guestSectionOpen, setGuestSectionOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const [memberErrors, setMemberErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showExactGuests, setShowExactGuests] = useState(false)
  const [exactGuestCount, setExactGuestCount] = useState(6)

  const guestCount = showExactGuests ? exactGuestCount : (parseInt(formData.guests) || 1)

  // Derived state: detect standard package and auto-compute end date
  const selectedPkg = formData.packageId && !formData.packageId.startsWith('custom-')
    ? packages.find(p => p.id === formData.packageId)
    : null
  const isStandardPackage = selectedPkg && !selectedPkg.isBespoke

  const computedEndDate = (() => {
    if (!isStandardPackage || !formData.startDate) return ''
    const days = parseDurationDays(selectedPkg.duration)
    if (!days) return ''
    const start = new Date(formData.startDate)
    const end = new Date(start)
    end.setDate(end.getDate() + days - 1)
    return end.toISOString().split('T')[0]
  })()

  const isEndDateLocked = isStandardPackage && !!computedEndDate
  const effectiveEndDate = isEndDateLocked ? computedEndDate : formData.endDate

  const syncGroupMembers = (count) => {
    setGroupMembers((prev) => {
      const next = [...prev]
      while (next.length < count) {
        next.push({ name: '', email: '', dietary: 'None', seat: 'Window', passport: '' })
      }
      return next.slice(0, count)
    })
  }



  const handleMemberChange = (index, field, value) => {
    setGroupMembers((prev) => {
      const next = [...prev]
      next[index] = { ...(next[index] || {}), [field]: value }
      return next
    })
    if (memberErrors[index]?.[field]) {
      setMemberErrors((prev) => {
        const next = { ...prev }
        if (next[index]) {
          const updated = { ...next[index] }
          delete updated[field]
          next[index] = updated
          if (Object.keys(next[index]).length === 0) delete next[index]
        }
        return next
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'name') {
      setFormData((prev) => ({ ...prev, name: value.replace(/[^a-zA-Z\s]/g, '') }))
      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
      return
    }
    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, phone: value }))
      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
      return
    }
    if (name === 'countryCode') {
      setFormData((prev) => ({ ...prev, countryCode: value }))
      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
      return
    }
    if (name === 'guests') {
      if (value === '6+') {
        setShowExactGuests(true)
        setFormData((prev) => ({ ...prev, guests: '6' }))
      } else {
        setShowExactGuests(false)
        const count = parseInt(value) || 1
        setFormData((prev) => ({ ...prev, guests: value }))
        syncGroupMembers(count)
        if (count > 1) setGuestSectionOpen(true)
      }
    } else if (name === 'packageId') {
      setFormData((prev) => {
        // If switching FROM a standard package where endDate was derived, keep the computed value
        const oldPkg = prev.packageId && !prev.packageId.startsWith('custom-')
          ? packages.find(p => p.id === prev.packageId)
          : null
        const wasStandard = oldPkg && !oldPkg.isBespoke
        const isCustom = value.startsWith('custom-')
        const newPkg = !isCustom ? packages.find(p => p.id === value) : null
        const next = { ...prev, packageId: value }
        // Pre-fill end date when going standard→bespoke so user has a starting point
        if (wasStandard && (!newPkg || newPkg.isBespoke) && prev.startDate && !prev.endDate) {
          const days = parseDurationDays(oldPkg.duration)
          if (days) {
            const start = new Date(prev.startDate)
            const end = new Date(start)
            end.setDate(end.getDate() + days - 1)
            next.endDate = end.toISOString().split('T')[0]
          }
        }
        return next
      })
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}

    const nameVal = formData.name.trim()
    if (!nameVal) {
      newErrors.name = 'Full name is required'
    } else if (!NAME_REGEX.test(nameVal)) {
      newErrors.name = 'Name should only contain letters and spaces'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!formData.countryCode) {
      newErrors.phone = 'Please select a country code'
    } else {
      const full = `${formData.countryCode}${formData.phone}`
      try {
        const parsed = parsePhoneNumber(full)
        if (!parsed?.isValid()) {
          newErrors.phone = `Invalid phone number${parsed?.country ? ` for ${parsed.country}` : ''}`
        }
      } catch {
        newErrors.phone = 'Invalid phone number format'
      }
    }

    if (!formData.packageId) newErrors.packageId = 'Please select a package or destination'
    if (formData.packageId === 'custom-other' && !formData.customDestination?.trim()) {
      newErrors.customDestination = 'Custom destination name is required'
    }

    const todayStr = new Date().toISOString().split('T')[0]
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    } else if (formData.startDate < todayStr) {
      newErrors.startDate = 'Start date cannot be in the past'
    }

    if (!isEndDateLocked) {
      if (!formData.endDate) {
        newErrors.endDate = 'End date is required'
      } else if (formData.startDate && formData.endDate < formData.startDate) {
        newErrors.endDate = 'End date cannot be before start date'
      }
    }

    // Validate group member names (index 1+ need names)
    const newMemberErrors = {}
    for (let i = 1; i < guestCount; i++) {
      const member = groupMembers[i]
      const memberName = member?.name?.trim()
      if (!memberName) {
        if (!newMemberErrors[i]) newMemberErrors[i] = {}
        newMemberErrors[i].name = 'Guest name is required'
      } else if (!NAME_REGEX.test(memberName)) {
        if (!newMemberErrors[i]) newMemberErrors[i] = {}
        newMemberErrors[i].name = 'Name should only contain letters and spaces'
      }
    }

    setErrors(newErrors)
    setMemberErrors(newMemberErrors)
    return Object.keys(newErrors).length === 0 && Object.keys(newMemberErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    // Build groupMembers for the API
    const members = groupMembers.map((m, idx) => {
      const base = {
        name: (idx === 0 ? formData.name : m.name)?.trim() || `Guest ${idx + 1}`,
        email: idx === 0 ? formData.email : (m.email || ''),
        phone: idx === 0 ? formData.phone : (m.phone || ''),
        dietary: m.dietary || 'None',
        seat: m.seat || 'Window',
        passport: m.passport || ''
      }
      return base
    })

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/bookings/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: `${formData.countryCode}${formData.phone}`,
          packageId: formData.packageId,
          customDestination: formData.customDestination,
          startDate: formData.startDate,
          endDate: effectiveEndDate,
          guests: String(guestCount),
          notes: formData.notes,
          groupMembers: members
        })
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

  const getGroupSummary = () => {
    const names = groupMembers.slice(0, guestCount).map((m, i) => {
      if (i === 0) return formData.name?.trim() || 'You'
      return m?.name?.trim() || `Guest ${i + 1}`
    })
    return names.join(', ')
  }

  if (submitted) {
    return (
      <section className="py-20 sm:py-28 bg-[#FDFCF7] min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200">
            <BadgeCheck className="w-8 h-8" strokeWidth={2} />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-stone-900 mb-3 tracking-[-0.02em]">
            Inquiry received
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed font-light mb-7">
            Thank you, <span className="font-semibold text-stone-900">{formData.name}</span>. Your booking inquiry for the{' '}
            <span className="font-semibold text-amber-700">{getSelectedPackageDisplayName()}</span> has been successfully logged.
          </p>

          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 text-left text-sm mb-7 space-y-2.5 shadow-sm">
            <div className="flex justify-between gap-4">
              <span className="text-stone-500">Traveller Name</span>
              <span className="font-semibold text-stone-900 truncate">{formData.name}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-stone-500">Package / Destination</span>
              <span className="font-semibold text-stone-900 truncate">{getSelectedPackageDisplayName()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-stone-500">Group Size</span>
              <span className="font-semibold text-stone-900">{guestCount} Travellers</span>
            </div>
            {guestCount > 1 && (
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Travellers</span>
                <span className="font-semibold text-stone-900 text-right truncate max-w-[200px]">{getGroupSummary()}</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-stone-500">Target Dates</span>
              <span className="font-semibold text-stone-900">{formData.startDate} → {effectiveEndDate}</span>
            </div>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed italic mb-7 font-light">
            A luxury travel specialist will reach out to you at <span className="font-semibold text-stone-800 not-italic">{formData.email}</span> or{' '}
            <span className="font-semibold text-stone-800 not-italic">{formData.phone}</span> within 24 hours to begin customizing your itinerary.
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
              setGroupMembers([])
              setShowExactGuests(false)
              setExactGuestCount(6)
              setSubmitted(false)
            }}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full text-sm font-semibold transition-all shadow-sm"
          >
            Submit another inquiry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-14 sm:py-20 bg-[#FDFCF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-7 animate-fade-in-up">
            <span className="editorial-mark-start text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">
              Booking Inquiry
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-stone-900 tracking-[-0.02em] mb-3">
              Request a bespoke itinerary
            </h1>
            <p className="text-sm text-stone-500 max-w-xl font-light">
              Provide your preferences below. Our luxury travel designers will create a tailored package proposal.
            </p>
          </div>

          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm animate-fade-in-up delay-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-5">
                {/* Name */}
                <div className="sm:col-span-3">
                  <label htmlFor="bk-name" className="block text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      id="bk-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Sophia Loren"
                      className={`w-full h-12 bg-[#FAF9F5] border ${errors.name ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                        } rounded-full pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all`}
                    />
                  </div>
                  {errors.name && <span className="text-xs text-rose-600 mt-1.5 block font-semibold">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="sm:col-span-3">
                  <label htmlFor="bk-email" className="block text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      id="bk-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. sophia@loren.com"
                      className={`w-full h-12 bg-[#FAF9F5] border ${errors.email ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                        } rounded-full pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all`}
                    />
                  </div>
                  {errors.email && <span className="text-xs text-rose-600 mt-1.5 block font-semibold">{errors.email}</span>}
                </div>

                {/* Phone */}
                <div className="sm:col-span-3">
                  <label htmlFor="bk-phone" className="block text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <PhoneInput
                    countryCode={formData.countryCode}
                    phone={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                  />
                  {errors.phone && <span className="text-xs text-rose-600 mt-1.5 block font-semibold">{errors.phone}</span>}
                </div>

                {/* Package/Destination Select */}
                <div className="sm:col-span-3">
                  <label htmlFor="bk-pkg" className="block text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                    Select Package or Destination <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <select
                      id="bk-pkg"
                      name="packageId"
                      value={formData.packageId}
                      onChange={handleChange}
                      className={`w-full h-12 bg-[#FAF9F5] border ${errors.packageId ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                        } rounded-full pl-10 pr-10 text-sm text-stone-900 outline-none transition-all appearance-none cursor-pointer`}
                    >
                      <option value="" disabled>Choose a package or destination</option>

                      <optgroup label="Company Provided Packages">
                        {standardPackages.map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} ({pkg.duration} - from {formatINR(pkg.price)}{pkg.usdPrice != null ? ` / ${formatUSD(pkg.usdPrice)}` : ''})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Bespoke Destinations">
                        {bespokePackages.length > 0 ? (
                          bespokePackages.map((pkg) => (
                            <option key={pkg.id} value={pkg.id}>
                              {pkg.name} (Bespoke Itinerary)
                            </option>
                          ))
                        ) : (
                          BESPOKE_FALLBACKS.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} (Bespoke Itinerary)
                            </option>
                          ))
                        )}
                      </optgroup>
                    </select>
                  </div>
                  {errors.packageId && <span className="text-xs text-rose-600 mt-1.5 block font-semibold">{errors.packageId}</span>}
                </div>

                {/* Custom Destination input text field if Other Destination is chosen */}
                {formData.packageId === 'custom-other' && (
                  <div className="sm:col-span-6 animate-fade-in">
                    <label htmlFor="bk-custom" className="block text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                      Please specify destination / country <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                      <input
                        id="bk-custom"
                        type="text"
                        name="customDestination"
                        value={formData.customDestination || ''}
                        onChange={handleChange}
                        placeholder="e.g. Italy, Switzerland, Bali, Dubai..."
                        className={`w-full h-12 bg-[#FAF9F5] border ${errors.customDestination ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                          } rounded-full pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all`}
                      />
                    </div>
                    {errors.customDestination && <span className="text-xs text-rose-600 mt-1.5 block font-semibold">{errors.customDestination}</span>}
                  </div>
                )}

                {/* Start Date */}
                <div className="sm:col-span-2">
                  <label htmlFor="bk-start" className="block text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      id="bk-start"
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`w-full h-12 bg-[#FAF9F5] border ${errors.startDate ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                        } rounded-full pl-10 pr-3 text-sm text-stone-900 outline-none transition-all`}
                    />
                  </div>
                  {errors.startDate && <span className="text-xs text-rose-600 mt-1.5 block font-semibold">{errors.startDate}</span>}
                </div>

                {/* End Date */}
                <div className="sm:col-span-2">
                  <label htmlFor="bk-end" className="block text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      id="bk-end"
                      type="date"
                      name="endDate"
                      value={effectiveEndDate}
                      onChange={isEndDateLocked ? undefined : handleChange}
                      disabled={isEndDateLocked}
                      className={`w-full h-12 bg-[#FAF9F5] border ${errors.endDate ? 'border-rose-400' : 'border-stone-200'} ${isEndDateLocked ? 'cursor-not-allowed opacity-60' : 'focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                        } rounded-full pl-10 pr-3 text-sm text-stone-900 outline-none transition-all`}
                    />
                  </div>
                  {!isEndDateLocked && errors.endDate && <span className="text-xs text-rose-600 mt-1.5 block font-semibold">{errors.endDate}</span>}
                </div>

                {/* Guests Count */}
                <div className="sm:col-span-2">
                  <label htmlFor="bk-guests" className="block text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                    Number of Travellers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    {!showExactGuests ? (
                      <select
                        id="bk-guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full h-12 bg-[#FAF9F5] border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-full pl-10 pr-4 text-sm text-stone-900 outline-none transition-all appearance-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5].map(n => (
                          <option key={n} value={String(n)}>{n} Traveller{n > 1 ? 's' : ''}</option>
                        ))}
                        <option value="6+">6+ Travellers</option>
                      </select>
                    ) : (
                      <input
                        type="number"
                        min="6"
                        max="99"
                        value={exactGuestCount}
                        onChange={(e) => {
                          const val = Math.max(6, Math.min(99, parseInt(e.target.value) || 6))
                          setExactGuestCount(val)
                          syncGroupMembers(val)
                          setGuestSectionOpen(true)
                        }}
                        className="w-full h-12 bg-[#FAF9F5] border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-full pl-10 pr-4 text-sm text-stone-900 outline-none transition-all"
                      />
                    )}
                  </div>
                  {showExactGuests && (
                    <button
                      type="button"
                      onClick={() => setShowExactGuests(false)}
                      className="text-[10px] text-amber-700 hover:text-amber-600 font-semibold mt-1"
                    >
                      ← Pick from list
                    </button>
                  )}
                </div>
              </div>

              {/* Traveller Details Section — shown when guests > 1 */}
              {guestCount > 1 && (
                <div className="border-t border-stone-200/60 pt-6 animate-fade-in">
                  <button
                    type="button"
                    onClick={() => setGuestSectionOpen((v) => !v)}
                    className="flex items-center justify-between w-full text-left mb-4"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-stone-700 uppercase tracking-[0.15em]">
                        Traveller Details
                      </h3>
                      <p className="text-[11px] text-stone-400 font-light mt-0.5">
                        Tell us about your group ({guestCount} travellers)
                      </p>
                    </div>
                    {guestSectionOpen ? (
                      <ChevronUp className="w-4 h-4 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400" />
                    )}
                  </button>

                  {guestSectionOpen && (
                    <div className="space-y-4">
                      {/* Guest 1 — Primary (read-only, auto-filled from main form) */}
                      <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5 space-y-2">
                        <h4 className="text-xs font-bold text-amber-800 uppercase tracking-[0.12em] flex items-center gap-1.5">
                          <BadgeCheck className="w-3.5 h-3.5" />
                          Guest 1 — Primary Contact
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-stone-700">
                          <div><span className="text-stone-400 text-[10px] block">Name</span>{formData.name || '—'}</div>
                          <div><span className="text-stone-400 text-[10px] block">Email</span>{formData.email || '—'}</div>
                          <div><span className="text-stone-400 text-[10px] block">Phone</span>{formData.countryCode ? `${formData.countryCode} ${formData.phone}` : formData.phone || '—'}</div>
                        </div>
                      </div>

                      {/* Guests 2..N — editable cards */}
                      {groupMembers.slice(1).map((member, idx) => {
                        const actualIndex = idx + 1
                        return (
                          <GuestCard
                            key={actualIndex}
                            index={actualIndex}
                            data={member}
                            onChange={handleMemberChange}
                            errors={memberErrors}
                          />
                        )
                      })}

                      {guestCount > 6 && (
                        <p className="text-[11px] text-stone-400 text-center italic">
                          All {guestCount} travellers listed. Scroll up if needed.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Special Notes / Preferences */}
              <div>
                <label htmlFor="bk-notes" className="block text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                  Special Requests / Dietary / Preferences
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                  <textarea
                    id="bk-notes"
                    name="notes"
                    rows="4"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="e.g. Prefer high floor suites, vegetarian meals, airport speedboats..."
                    className="w-full bg-[#FAF9F5] border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-2xl py-3 pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-3 space-y-3">
                {submitError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium leading-relaxed">
                    {submitError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-full text-sm font-semibold shadow-md shadow-amber-900/15 active:scale-[0.98] transition-all duration-300 text-center"
                >
                  {submitting ? 'Submitting inquiry…' : `Submit inquiry for ${guestCount} traveller${guestCount > 1 ? 's' : ''}`}
                </button>
              </div>
            </form>
          </div>
        </div>

        <aside className="hidden lg:block space-y-5 sticky top-24">
          {/* Help Card */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 space-y-3 shadow-sm animate-fade-in-up delay-200">
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-[0.15em]">Need help?</h3>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              Call us at <a href="tel:+15550192831" className="font-semibold text-amber-700 hover:underline">+1 (555) 019-2831</a> or email <a href="mailto:concierge@kraftyourtrip.com" className="font-semibold text-amber-700 hover:underline break-all">concierge@kraftyourtrip.com</a>
            </p>
          </div>

          {/* Process Card */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 space-y-5 shadow-sm animate-fade-in-up delay-300">
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-[0.15em]">Our custom process</h3>
            <div className="space-y-4">
              {[
                { title: 'Submit inquiry', desc: 'Share your travel preferences, dates, and group details with us.', icon: Compass },
                { title: 'Consultation', desc: 'Our travel designer schedules a brief call to refine your bespoke itinerary.', icon: Users },
                { title: 'Finalize & book', desc: 'Review your personalized proposal, adjust details, and lock in your escape.', icon: BadgeCheck }
              ].map((p, idx) => {
                const Icon = p.icon
                return (
                  <div key={idx} className="flex gap-3.5 items-start">
                    <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-semibold text-stone-900">{p.title}</h4>
                      <p className="text-xs text-stone-500 leading-relaxed font-light">{p.desc}</p>
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
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Tailored Design
              </span>
              <p className="font-display text-base text-white mt-1.5 leading-snug">Every detail crafted around you.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
