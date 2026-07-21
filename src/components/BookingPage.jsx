import { useState, useEffect, useRef } from 'react'
import { formatINR, formatUSD } from '../utils/currency'
import { API_URL, getImgUrl, handleImageError } from '../utils/image'
import { BadgeCheck, User, Mail, Calendar, Users, Compass, MessageSquare, Sparkles, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Building2, Search, Plus, Minus, ArrowRight, X } from 'lucide-react'
import { parsePhoneNumber } from 'libphonenumber-js'
import PhoneInput from './PhoneInput'
import CalendarPopup from './CalendarPopup'
import { getDefaultDialCode } from '../utils/dialCodes'

const BESPOKE_DESTINATIONS_DEFAULTS = [
  { id: 'custom-maldives', name: 'Maldives Overwater Villas', region: 'Indian Ocean', image: '/assets/unsplash-maldives.jpg' },
  { id: 'custom-kyoto', name: 'Kyoto Ancient Temples & Ryokans', region: 'Asia', image: '/assets/unsplash-kyoto.jpg' },
  { id: 'custom-swiss-alps', name: 'Swiss Alps Luxury Chalet', region: 'Europe', image: '/assets/unsplash-swiss-alps.jpg' },
  { id: 'custom-amalfi', name: 'Amalfi Coast Villa & Yachting', region: 'Europe', image: '/assets/unsplash-amalfi.jpg' },
  { id: 'custom-serengeti', name: 'Serengeti Safari & Flying Lodge', region: 'Africa', image: '/assets/unsplash-safari.jpg' }
]

const DIETARY_OPTIONS = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'No Preference']
const SEAT_OPTIONS = ['Window', 'Aisle', 'Middle']
const NAME_REGEX = /^[a-zA-Z\s]+$/

function formatDateDisplay(dateStr) {
  if (!dateStr) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y}`
  }
  return dateStr
}

function parseDateDisplay(str) {
  const cleaned = str.replace(/[^0-9/]/g, '')
  const match = cleaned.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null
  const d = match[1], m = match[2], y = match[3]
  return `${y}-${m}-${d}`
}

function toDateObject(str) {
  if (!str) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const d = new Date(str)
    return isNaN(d.getTime()) ? null : d
  }
  const iso = parseDateDisplay(str)
  if (!iso) return null
  const d = new Date(iso)
  return isNaN(d.getTime()) ? null : d
}

function parseDurationDays(duration) {
  if (!duration) return null
  const str = String(duration)
  const dayMatch = str.match(/(\d+)\s*Days?/i)
  if (dayMatch) return parseInt(dayMatch[1])
  const nightMatch = str.match(/(\d+)\s*Nights?/i)
  if (nightMatch) return parseInt(nightMatch[1]) + 1
  const num = parseInt(str)
  return !isNaN(num) ? num : null
}

function GuestPreferenceCard({ index, data, onChange, errors }) {
  const label = index === 0 ? 'Primary Traveller' : `Guest ${index + 1}`
  return (
    <div className="bg-stone-50/70 border border-stone-200/70 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">{label}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {index > 0 && (
          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
              Guest Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={data?.name || ''}
              onChange={(e) => {
                const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                onChange(index, 'name', filtered)
              }}
              placeholder="e.g. Jane Doe"
              className={`w-full bg-white border ${errors?.[index]?.name ? 'border-rose-400' : 'border-stone-200'} focus:border-amber-500 rounded-lg py-2 px-3 text-xs text-stone-900 placeholder-stone-400 outline-none`}
            />
            {errors?.[index]?.name && <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">{errors[index].name}</span>}
          </div>
        )}
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Dietary Preference</label>
          <select
            value={data?.dietary || 'None'}
            onChange={(e) => onChange(index, 'dietary', e.target.value)}
            className="w-full bg-white border border-stone-200 focus:border-amber-500 rounded-lg py-2 px-3 text-xs text-stone-900 outline-none cursor-pointer"
          >
            {DIETARY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Seat Preference</label>
          <select
            value={data?.seat || 'Window'}
            onChange={(e) => onChange(index, 'seat', e.target.value)}
            className="w-full bg-white border border-stone-200 focus:border-amber-500 rounded-lg py-2 px-3 text-xs text-stone-900 outline-none cursor-pointer"
          >
            {SEAT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Passport No.</label>
          <input
            type="text"
            value={data?.passport || ''}
            onChange={(e) => onChange(index, 'passport', e.target.value)}
            placeholder="Optional"
            className="w-full bg-white border border-stone-200 focus:border-amber-500 rounded-lg py-2 px-3 text-xs text-stone-900 placeholder-stone-400 outline-none"
          />
        </div>
      </div>
    </div>
  )
}

export default function BookingPage({ packages, selectedPackage }) {
  const defaultCode = getDefaultDialCode()
  const dropdownRef = useRef(null)

  const [inquiryType, setInquiryType] = useState(() => {
    if (selectedPackage && (selectedPackage.isCorporate || selectedPackage.id === 'corporate')) {
      return 'corporate'
    }
    return 'leisure'
  })

  const [corporatePackages, setCorporatePackages] = useState([])
  useEffect(() => {
    fetch(`${API_URL}/api/corporate-packages`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setCorporatePackages(data.map(p => ({ ...p, id: String(p.id), name: p.destination }))))
      .catch(err => console.warn('Failed to load corporate packages:', err))
  }, [])

  const [formData, setFormData] = useState(() => {
    const isCorp = selectedPackage && (selectedPackage.isCorporate || selectedPackage.id === 'corporate')
    let packageId = ''
    let customDestination = ''
    let startDate = ''
    let endDate = ''
    let departureId = ''

    if (selectedPackage) {
      if (selectedPackage.id === 'corporate') {
        if (selectedPackage.corporatePackageId) {
          packageId = selectedPackage.corporatePackageId
        } else if (selectedPackage.destination) {
          packageId = 'custom-other'
          customDestination = selectedPackage.destination
        }
      } else {
        packageId = selectedPackage.id
        if (selectedPackage.departureId) {
          departureId = selectedPackage.departureId
          startDate = selectedPackage.departureDate || ''
          endDate = selectedPackage.returnDate || ''
        }
      }
    }

    return {
      name: '',
      email: '',
      phone: '',
      countryCode: defaultCode?.code ?? '+1',
      packageId,
      customDestination,
      startDate,
      endDate,
      departureId,
      guests: isCorp ? '10' : '2',
      notes: '',
      companyName: ''
    }
  })

  const [groupMembers, setGroupMembers] = useState(() =>
    Array.from({ length: 2 }, () => ({
      name: '', email: '', dietary: 'None', seat: 'Window', passport: ''
    }))
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [guestSectionOpen, setGuestSectionOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const [memberErrors, setMemberErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submissionAttempted, setSubmissionAttempted] = useState(false)
  const [toast, setToast] = useState(null)
  const [openCalendar, setOpenCalendar] = useState(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  // Close auto-complete dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const guestCount = parseInt(formData.guests) || (inquiryType === 'corporate' ? 10 : 2)

  // Package lookup
  const selectedPkg = inquiryType === 'corporate'
    ? corporatePackages.find(p => p.id === formData.packageId)
    : (formData.packageId && !formData.packageId.startsWith('custom-')
        ? (packages || []).find(p => p.id === formData.packageId)
        : null)

  const isStandardPackage = selectedPkg && !selectedPkg.isBespoke

  const computedEndDate = (() => {
    if (!selectedPkg || !formData.startDate) return ''
    const days = inquiryType === 'corporate'
      ? parseDurationDays(selectedPkg.nights)
      : parseDurationDays(selectedPkg.duration)
    if (!days) return ''
    const start = toDateObject(formData.startDate)
    if (!start) return ''
    const end = new Date(start)
    end.setDate(end.getDate() + days - 1)
    return end.toISOString().split('T')[0]
  })()

  const isStartDateLocked = !!formData.departureId
  const isEndDateLocked = (
    (inquiryType !== 'corporate' && isStandardPackage && !!computedEndDate) ||
    (inquiryType === 'corporate' && formData.packageId && formData.packageId !== 'custom-other' && !!computedEndDate) ||
    !!formData.departureId
  )

  const effectiveEndDate = isEndDateLocked
    ? (formData.departureId ? formData.endDate : computedEndDate)
    : formData.endDate

  const syncGroupMembers = (count) => {
    setGroupMembers((prev) => {
      const next = [...prev]
      while (next.length < count) {
        next.push({ name: '', email: '', dietary: 'None', seat: 'Window', passport: '' })
      }
      return next.slice(0, count)
    })
  }

  const handleGuestIncrement = () => {
    const newCount = Math.min(25, guestCount + 1)
    setFormData(prev => ({ ...prev, guests: String(newCount) }))
    syncGroupMembers(newCount)
  }

  const handleGuestDecrement = () => {
    const minVal = inquiryType === 'corporate' ? 5 : 1
    const newCount = Math.max(minVal, guestCount - 1)
    setFormData(prev => ({ ...prev, guests: String(newCount) }))
    syncGroupMembers(newCount)
  }

  const handleGroupMemberChange = (index, field, value) => {
    setGroupMembers((prev) => {
      const next = [...prev]
      if (!next[index]) {
        next[index] = { name: '', email: '', dietary: 'None', seat: 'Window', passport: '' }
      }
      next[index] = { ...next[index], [field]: value }
      return next
    })
    if (memberErrors[index]?.[field]) {
      setMemberErrors((prev) => {
        const next = { ...prev }
        if (next[index]) {
          delete next[index][field]
          if (Object.keys(next[index]).length === 0) delete next[index]
        }
        return next
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'name') {
      const filtered = value.replace(/[^a-zA-Z\s]/g, '')
      setFormData((prev) => ({ ...prev, name: filtered }))
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
      newErrors.email = inquiryType === 'corporate' ? 'Work email is required' : 'Email address is required'
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

    if (inquiryType === 'corporate') {
      if (!formData.companyName || !formData.companyName.trim()) {
        newErrors.companyName = 'Company name is required'
      }
    }

    if (!formData.packageId) newErrors.packageId = 'Please select a destination or package'
    if (formData.packageId === 'custom-other' && !formData.customDestination?.trim()) {
      newErrors.customDestination = 'Please enter your custom destination'
    }

    const todayStr = new Date().toISOString().split('T')[0]
    const startISO = formData.startDate
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(startISO)) {
      newErrors.startDate = 'Please enter a valid date'
    } else if (startISO < todayStr) {
      newErrors.startDate = 'Start date cannot be in the past'
    }

    const endISO = isEndDateLocked ? null : formData.endDate
    if (!isEndDateLocked) {
      if (!formData.endDate) {
        newErrors.endDate = 'End date is required'
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(endISO)) {
        newErrors.endDate = 'Please enter a valid date'
      } else if (formData.startDate && endISO < todayStr) {
        newErrors.endDate = 'End date cannot be in the past'
      } else if (formData.startDate && /^\d{4}-\d{2}-\d{2}$/.test(startISO) && endISO < startISO) {
        newErrors.endDate = 'End date cannot be before start date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmissionAttempted(true)
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    if (inquiryType === 'corporate') {
      const selectedCorpPkg = corporatePackages.find(p => p.id === formData.packageId)
      const packageLabel = selectedCorpPkg 
        ? selectedCorpPkg.name 
        : (formData.packageId === 'custom-other' ? `Custom: ${formData.customDestination}` : 'Custom Corporate Itinerary')
      
      const messageBody = `
Enquiry Type: Corporate Retreat / MICE Event
Selected Destination/Package: ${packageLabel}
Estimated Group Size: ${guestCount} attendees
Preferred Dates: ${formatDateDisplay(formData.startDate)} to ${formatDateDisplay(formData.endDate)}
Additional Requirements:
${formData.notes || 'No special requests specified.'}
      `.trim()

      try {
        const response = await fetch(`${API_URL}/api/corporate-leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            mobile: `${formData.countryCode}${formData.phone}`.replace(/[\s()-]/g, ''),
            workEmail: formData.email,
            companyName: formData.companyName,
            message: messageBody
          })
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit inquiry')
        }

        setSubmitted(true)
        setToast({ message: 'Inquiry submitted successfully!', type: 'success' })
      } catch (err) {
        setSubmitError(err.message)
        setToast({ message: err.message, type: 'error' })
      } finally {
        setSubmitting(false)
      }
    } else {
      const members = groupMembers.slice(0, guestCount).map((m, idx) => ({
        name: (idx === 0 ? formData.name : m.name)?.trim() || `Guest ${idx + 1}`,
        email: idx === 0 ? formData.email : (m.email || ''),
        phone: idx === 0 ? formData.phone : (m.phone || ''),
        dietary: m.dietary || 'None',
        seat: m.seat || 'Window',
        passport: m.passport || ''
      }))

      try {
        const response = await fetch(`${API_URL}/api/bookings/inquiry`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: `${formData.countryCode}${formData.phone}`.replace(/[\s()-]/g, ''),
            packageId: formData.packageId,
            customDestination: formData.customDestination,
            startDate: formData.startDate,
            endDate: effectiveEndDate,
            guests: String(guestCount),
            notes: formData.notes,
            groupMembers: members,
            departureId: formData.departureId || null
          })
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit inquiry')
        }

        setSubmitted(true)
        setToast({ message: 'Inquiry submitted successfully!', type: 'success' })
      } catch (err) {
        setSubmitError(err.message)
        setToast({ message: err.message, type: 'error' })
      } finally {
        setSubmitting(false)
      }
    }
  }

  const getSelectedPackageDisplayName = () => {
    if (inquiryType === 'corporate') {
      if (formData.packageId === 'custom-other') {
        return `Custom Corporate Event: ${formData.customDestination || 'Other'}`
      }
      const pkg = corporatePackages.find((p) => p.id === formData.packageId)
      return pkg ? `${pkg.name} (Corporate)` : 'Custom Corporate Trip'
    }
    if (formData.packageId === 'custom-other') {
      return `Custom Trip: ${formData.customDestination || 'Other'}`
    }
    if (formData.packageId && formData.packageId.startsWith('custom-')) {
      const customFound = BESPOKE_DESTINATIONS_DEFAULTS.find(b => b.id === formData.packageId)
      if (customFound) return customFound.name
      const destName = formData.packageId.replace('custom-', '').replace(/-/g, ' ')
      return `Custom Trip to ${destName}`
    }
    const pkg = (packages || []).find((p) => p.id === formData.packageId)
    return pkg ? pkg.name : 'Select a package or destination'
  }

  // Combine options for the auto-complete dropdown
  const getDropdownOptions = () => {
    if (inquiryType === 'corporate') {
      const list = corporatePackages.map(p => ({
        id: p.id,
        name: p.name,
        subtitle: `${p.nights || 'Multi-day'} Corporate Event`,
        badge: 'Corporate',
        image: getImgUrl('/assets/corporate-hero.jpg')
      }))
      list.push({
        id: 'custom-other',
        name: 'Custom Corporate Destination...',
        subtitle: 'Enter your company retreat location',
        badge: 'Custom',
        image: null
      })
      return list.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    const list = []

    // Standard Packages
    ;(packages || []).forEach(p => {
      list.push({
        id: p.id,
        name: p.name,
        subtitle: `${p.duration || 'Flexible'} • ${p.region || 'Worldwide'}`,
        badge: p.isBespoke ? 'Custom' : 'Package',
        image: getImgUrl(p.cardImage || p.heroImage)
      })
    })

    // Custom Bespoke Presets
    BESPOKE_DESTINATIONS_DEFAULTS.forEach(b => {
      if (!list.some(l => l.id === b.id)) {
        list.push({
          id: b.id,
          name: b.name,
          subtitle: `Custom Trip • ${b.region}`,
          badge: 'Custom',
          image: getImgUrl(b.image)
        })
      }
    })

    // Custom Other Option
    list.push({
      id: 'custom-other',
      name: 'Custom / Other Destination...',
      subtitle: 'Type your preferred destination manually',
      badge: 'Custom',
      image: null
    })

    return list.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  if (submitted) {
    return (
      <>
        {toast && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <div className={`px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'} text-white`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </div>
        )}
        <section className="py-20 sm:py-28 bg-[#FDFCF7] min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full mx-auto px-4 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200 shadow-sm">
              <BadgeCheck className="w-8 h-8" strokeWidth={2} />
            </div>

            <h1 className="font-display text-3xl sm:text-4xl text-stone-900 mb-3 tracking-[-0.02em]">
              Inquiry Received
            </h1>
            <p className="text-sm text-stone-600 leading-relaxed font-light mb-7">
              Thank you, <span className="font-semibold text-stone-900">{formData.name}</span>. Your trip inquiry for{' '}
              <span className="font-semibold text-amber-700">{getSelectedPackageDisplayName()}</span> has been submitted.
            </p>

            <div className="bg-white border border-stone-200/80 rounded-2xl p-5 text-left text-xs mb-7 space-y-3 shadow-sm">
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Contact Person</span>
                <span className="font-semibold text-stone-900 truncate">{formData.name}</span>
              </div>
              {inquiryType === 'corporate' && (
                <div className="flex justify-between gap-4">
                  <span className="text-stone-500">Company Name</span>
                  <span className="font-semibold text-stone-900 truncate">{formData.companyName}</span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Destination</span>
                <span className="font-semibold text-stone-900 truncate">{getSelectedPackageDisplayName()}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Guests</span>
                <span className="font-semibold text-stone-900">{guestCount} Guests</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Travel Dates</span>
                <span className="font-semibold text-stone-900">{formatDateDisplay(formData.startDate)} → {formatDateDisplay(formData.endDate)}</span>
              </div>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed italic mb-7 font-light">
              We will review your trip details and email you at <span className="font-semibold text-stone-800 not-italic">{formData.email}</span> shortly.
            </p>

            <button
              onClick={() => {
                setSubmitted(false)
                setSubmissionAttempted(false)
              }}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full text-xs font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Plan Another Trip
            </button>
          </div>
        </section>
      </>
    )
  }

  const dropdownOptions = getDropdownOptions()

  return (
    <div className="min-h-screen bg-[#FDFCF7] py-10 sm:py-16 px-4">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'} text-white`}>
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">
            PLAN YOUR TRIP
          </span>
          <h1 className="font-display text-3xl sm:text-5xl text-stone-900 tracking-[-0.02em] leading-tight">
            Plan Your Trip
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md mx-auto leading-relaxed">
            Fill out a few simple details below and we will help plan your trip.
          </p>

          {/* Segmented Pill Switcher in Normal English */}
          <div className="pt-2 flex items-center justify-center">
            <div className="bg-stone-200/60 p-1 rounded-full flex items-center gap-1 border border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setInquiryType('leisure')
                  setFormData(prev => ({ ...prev, guests: '2' }))
                  syncGroupMembers(2)
                }}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  inquiryType === 'leisure'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Personal Trip
              </button>
              <button
                type="button"
                onClick={() => {
                  setInquiryType('corporate')
                  setFormData(prev => ({ ...prev, guests: '10' }))
                  syncGroupMembers(10)
                }}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  inquiryType === 'corporate'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Business / Company Trip
              </button>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-900/5 space-y-6">

          {/* SECTION 1: Package / Destination Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              1. Select Destination or Package <span className="text-rose-500">*</span>
            </label>

            <div ref={dropdownRef} className="relative">
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-full bg-stone-50 border ${
                  errors.packageId ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200/90'
                } hover:border-stone-300 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-sm`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-stone-900 block truncate">
                      {getSelectedPackageDisplayName()}
                    </span>
                    <span className="text-[10px] text-stone-500 block truncate">
                      {formData.packageId
                        ? 'Click to change destination'
                        : 'Select a package or type a custom destination'}
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-2xl shadow-2xl z-30 overflow-hidden animate-fade-in">
                  {/* Search Filter Input */}
                  <div className="p-3 border-b border-stone-100 bg-stone-50/50 flex items-center gap-2">
                    <Search className="w-4 h-4 text-stone-400 shrink-0" />
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type destination name or country..."
                      className="w-full text-xs bg-transparent outline-none text-stone-800 placeholder-stone-400 font-medium"
                    />
                    {searchQuery && (
                      <button type="button" onClick={() => setSearchQuery('')} className="text-stone-400 hover:text-stone-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Options List */}
                  <div className="max-h-60 overflow-y-auto divide-y divide-stone-50 p-1">
                    {dropdownOptions.length > 0 ? (
                      dropdownOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, packageId: opt.id }))
                            if (errors.packageId) setErrors(prev => ({ ...prev, packageId: null }))
                            setDropdownOpen(false)
                            setSearchQuery('')
                          }}
                          className={`p-2.5 rounded-xl flex items-center justify-between hover:bg-stone-50 cursor-pointer transition-colors ${
                            formData.packageId === opt.id ? 'bg-amber-50/60 border border-amber-200/50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {opt.image ? (
                              <img
                                src={opt.image}
                                alt={opt.name}
                                onError={handleImageError}
                                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-500 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            )}
                            <div className="truncate">
                              <span className="text-xs font-bold text-stone-900 block truncate">{opt.name}</span>
                              <span className="text-[10px] text-stone-500 block truncate">{opt.subtitle}</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md shrink-0 border border-amber-200/40">
                            {opt.badge}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-stone-400">
                        No matching destinations found. Type your destination manually below.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Destination Text Input */}
            {formData.packageId === 'custom-other' && (
              <div className="pt-2 animate-fade-in">
                <input
                  type="text"
                  name="customDestination"
                  value={formData.customDestination || ''}
                  onChange={handleChange}
                  placeholder="Enter custom destination name (e.g. Switzerland, Tokyo)..."
                  className={`w-full bg-stone-50 border ${
                    errors.customDestination ? 'border-rose-400' : 'border-stone-200'
                  } focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-xs text-stone-900 placeholder-stone-400 outline-none`}
                />
                {errors.customDestination && (
                  <span className="text-[10px] text-rose-600 font-semibold mt-1 block">{errors.customDestination}</span>
                )}
              </div>
            )}
            {errors.packageId && (
              <span className="text-[10px] text-rose-600 font-semibold mt-1 block">{errors.packageId}</span>
            )}
          </div>

          {/* SECTION 2: Dates & Guests Bar */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              2. Travel Dates & Number of Guests
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* Date Trigger Bar */}
              <div className="relative">
                <div
                  onClick={() => setOpenCalendar(openCalendar ? null : 'start')}
                  className={`bg-stone-50 border ${
                    errors.startDate || errors.endDate ? 'border-rose-400' : 'border-stone-200'
                  } hover:border-stone-300 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-all shadow-sm`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">
                      <Calendar className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Dates</span>
                      <span className="text-xs font-bold text-stone-900 block">
                        {formData.startDate ? `${formatDateDisplay(formData.startDate)} → ${formatDateDisplay(effectiveEndDate) || 'Flexible'}` : 'Select dates'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Calendar Popup Integration */}
                {openCalendar && (
                  <CalendarPopup
                    value={formData.startDate}
                    onChange={(selectedIso) => {
                      setFormData(prev => ({
                        ...prev,
                        startDate: selectedIso,
                        ...(isEndDateLocked ? {} : { endDate: prev.endDate || selectedIso })
                      }))
                      if (errors.startDate) setErrors(prev => ({ ...prev, startDate: null }))
                      setOpenCalendar(null)
                    }}
                    onClose={() => setOpenCalendar(null)}
                    minDate={new Date().toISOString().split('T')[0]}
                  />
                )}
              </div>

              {/* Guests Stepper Bar */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">
                    <Users className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Guests</span>
                    <span className="text-xs font-bold text-stone-900 block">
                      {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleGuestDecrement}
                    className="w-7 h-7 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-stone-900">{guestCount}</span>
                  <button
                    type="button"
                    onClick={handleGuestIncrement}
                    className="w-7 h-7 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {(errors.startDate || errors.endDate) && (
              <span className="text-[10px] text-rose-600 font-semibold block">
                {errors.startDate || errors.endDate}
              </span>
            )}
          </div>

          {/* SECTION 3: Essential Contact Information */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              3. Your Contact Info
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className={`w-full bg-stone-50/60 border ${
                    errors.name ? 'border-rose-400' : 'border-stone-200'
                  } focus:border-amber-500 rounded-xl py-2.5 px-3 text-xs text-stone-900 placeholder-stone-400 outline-none`}
                />
                {errors.name && <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{errors.name}</span>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  {inquiryType === 'corporate' ? 'Work Email' : 'Email Address'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={inquiryType === 'corporate' ? 'jane@company.com' : 'jane@example.com'}
                  className={`w-full bg-stone-50/60 border ${
                    errors.email ? 'border-rose-400' : 'border-stone-200'
                  } focus:border-amber-500 rounded-xl py-2.5 px-3 text-xs text-stone-900 placeholder-stone-400 outline-none`}
                />
                {errors.email && <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{errors.email}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <PhoneInput
                  countryCode={formData.countryCode}
                  phone={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
              </div>

              {inquiryType === 'corporate' && (
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Acme Corporation"
                    className={`w-full bg-stone-50/60 border ${
                      errors.companyName ? 'border-rose-400' : 'border-stone-200'
                    } focus:border-amber-500 rounded-xl py-2.5 px-3 text-xs text-stone-900 placeholder-stone-400 outline-none`}
                  />
                  {errors.companyName && <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{errors.companyName}</span>}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: Collapsible Optional Preferences */}
          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setGuestSectionOpen(!guestSectionOpen)}
              className="w-full flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-stone-900 py-1 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                Add special requests or notes (Optional)
              </span>
              {guestSectionOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {guestSectionOpen && (
              <div className="pt-4 space-y-4 animate-fade-in">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Special Requests or Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special requests, preferred hotel type, or budget details..."
                    className="w-full bg-stone-50/60 border border-stone-200 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-stone-900 placeholder-stone-400 outline-none"
                  />
                </div>

                {inquiryType !== 'corporate' && (
                  <div className="space-y-3">
                    <span className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                      Guest Preferences ({guestCount})
                    </span>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {Array.from({ length: guestCount }).map((_, i) => (
                        <GuestPreferenceCard
                          key={i}
                          index={i}
                          data={groupMembers[i]}
                          onChange={handleGroupMemberChange}
                          errors={memberErrors}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 5: Submit Bar */}
          <div className="pt-4 space-y-3 border-t border-stone-100">
            {submitError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-lg shadow-stone-900/10 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:bg-stone-400"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Request
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-stone-400 font-light">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" /> Custom Travel Planning
              </span>
              <span>•</span>
              <span>Free Quote</span>
              <span>•</span>
              <span>Fast Response</span>
            </div>
          </div>

        </form>

      </div>
    </div>
  )
}
