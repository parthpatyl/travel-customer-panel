import { useState, useEffect } from 'react'
import { formatINR, formatUSD } from '../utils/currency'
import { BadgeCheck, User, Mail, Calendar, Users, Compass, MessageSquare, Sparkles, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Building2 } from 'lucide-react'
import { parsePhoneNumber } from 'libphonenumber-js'
import PhoneInput from './PhoneInput'
import { getDefaultDialCode } from '../utils/dialCodes'

const BESPOKE_FALLBACKS = []

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

  const [inquiryType, setInquiryType] = useState(() => {
    if (selectedPackage && (selectedPackage.isCorporate || selectedPackage.id === 'corporate')) {
      return 'corporate'
    }
    return 'leisure'
  })

  const [corporatePackages, setCorporatePackages] = useState([])
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    fetch(`${API_URL}/api/corporate-packages`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setCorporatePackages(data))
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
      countryCode: defaultCode?.code ?? '',
      packageId,
      customDestination,
      startDate,
      endDate,
      departureId,
      guests: isCorp ? '10' : '1',
      notes: '',
      companyName: ''
    }
  })

  const [groupMembers, setGroupMembers] = useState(() =>
    Array.from({ length: 1 }, () => ({
      name: '', email: '', dietary: 'None', seat: 'Window', passport: ''
    }))
  )
  const [guestSectionOpen, setGuestSectionOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const [memberErrors, setMemberErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submissionAttempted, setSubmissionAttempted] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  const guestCount = parseInt(formData.guests) || (inquiryType === 'corporate' ? 10 : 1)

  // Derived state: detect standard package and auto-compute end date
  const selectedPkg = inquiryType === 'corporate'
    ? corporatePackages.find(p => p.id === formData.packageId)
    : (formData.packageId && !formData.packageId.startsWith('custom-')
        ? packages.find(p => p.id === formData.packageId)
        : null)
  const isStandardPackage = selectedPkg && !selectedPkg.isBespoke

  const computedEndDate = (() => {
    if (!selectedPkg || !formData.startDate) return ''
    const days = inquiryType === 'corporate'
      ? (selectedPkg.nights ? selectedPkg.nights + 1 : null)
      : parseDurationDays(selectedPkg.duration)
    if (!days) return ''
    const start = toDateObject(formData.startDate)
    if (!start) return ''
    const end = new Date(start)
    end.setDate(end.getDate() + days - 1)
    return end.toISOString().split('T')[0]
  })()

  const isStartDateLocked = !!formData.departureId
  const isEndDateLocked = (inquiryType !== 'corporate' && isStandardPackage && !!computedEndDate) || !!formData.departureId
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
      if (inquiryType !== 'corporate') {
        const count = parseInt(value)
        if (!isNaN(count)) {
          if (count > 25) {
            setToast({ message: 'Maximum of 25 travellers allowed for personal bookings.', type: 'error' })
            setFormData((prev) => ({ ...prev, guests: '25' }))
            syncGroupMembers(25)
            setGuestSectionOpen(true)
            return
          }
          setFormData((prev) => ({ ...prev, guests: value }))
          syncGroupMembers(count)
          if (count > 1) {
            setGuestSectionOpen(true)
          } else {
            setGuestSectionOpen(false)
          }
        } else {
          setFormData((prev) => ({ ...prev, guests: value }))
          syncGroupMembers(1)
          setGuestSectionOpen(false)
        }
      } else {
        setFormData((prev) => ({ ...prev, guests: value }))
      }
    } else if (name === 'startDate' || name === 'endDate') {
      setFormData((prev) => ({ ...prev, [name]: value }))
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }))
      return
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
        if (prev.departureId) {
          next.departureId = ''
          next.startDate = ''
          next.endDate = ''
        }
        // Pre-fill end date when going standard→bespoke so user has a starting point
        if (wasStandard && (!newPkg || newPkg.isBespoke) && prev.startDate && !prev.endDate) {
          const days = parseDurationDays(oldPkg.duration)
          if (days) {
            const start = toDateObject(prev.startDate)
            if (start) {
              const end = new Date(start)
              end.setDate(end.getDate() + days - 1)
              next.endDate = end.toISOString().split('T')[0]
            }
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

    if (!formData.packageId) newErrors.packageId = 'Please select a package or destination'
    if (formData.packageId === 'custom-other' && !formData.customDestination?.trim()) {
      newErrors.customDestination = 'Custom destination name is required'
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

    const newMemberErrors = {}
    if (inquiryType !== 'corporate') {
      const gCount = parseInt(formData.guests) || 1
      if (gCount > 25) {
        newErrors.guests = 'Maximum of 25 travellers allowed for personal bookings'
      }

      // Validate group member names (index 1+ need names)
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
    }

    setErrors(newErrors)
    setMemberErrors(newMemberErrors)
    return Object.keys(newErrors).length === 0 && Object.keys(newMemberErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmissionAttempted(true)
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

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
        setToast({ message: 'Corporate inquiry submitted successfully!', type: 'success' })
      } catch (err) {
        setSubmitError(err.message)
        setToast({ message: err.message, type: 'error' })
      } finally {
        setSubmitting(false)
      }
    } else {
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
        setToast({ message: 'Booking inquiry submitted successfully!', type: 'success' })
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
        return `Custom Corporate Retreat: ${formData.customDestination || 'Other'}`
      }
      const pkg = corporatePackages.find((p) => p.id === formData.packageId)
      return pkg ? `${pkg.name} (Corporate)` : 'Custom Corporate Itinerary'
    }
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
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200">
            <BadgeCheck className="w-8 h-8" strokeWidth={2} />
          </div>

          {inquiryType === 'corporate' ? (
            <>
              <h1 className="font-display text-3xl sm:text-4xl text-stone-900 mb-3 tracking-[-0.02em]">
                Corporate Inquiry Received
              </h1>
              <p className="text-sm text-stone-600 leading-relaxed font-light mb-7">
                Thank you, <span className="font-semibold text-stone-900">{formData.name}</span>. Your MICE retreat inquiry for{' '}
                <span className="font-semibold text-amber-700">{getSelectedPackageDisplayName()}</span> has been successfully logged.
              </p>

              <div className="bg-white border border-stone-200/80 rounded-2xl p-5 text-left text-sm mb-7 space-y-2.5 shadow-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-stone-500">Contact Person</span>
                  <span className="font-semibold text-stone-900 truncate">{formData.name}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-stone-500">Company Name</span>
                  <span className="font-semibold text-stone-900 truncate">{formData.companyName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-stone-500">Destination</span>
                  <span className="font-semibold text-stone-900 truncate">{getSelectedPackageDisplayName()}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-stone-500">Group Size</span>
                  <span className="font-semibold text-stone-900">{guestCount} Attendees</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-stone-500">Target Dates</span>
                  <span className="font-semibold text-stone-900">{formatDateDisplay(formData.startDate)} → {formatDateDisplay(formData.endDate)}</span>
                </div>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed italic mb-7 font-light">
                Our dedicated MICE desk specialist will reach out to you at <span className="font-semibold text-stone-800 not-italic">{formData.email}</span> or{' '}
                <span className="font-semibold text-stone-800 not-italic">{formData.phone}</span> within 12 hours with a preliminary proposal.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl sm:text-4xl text-stone-900 mb-3 tracking-[-0.02em]">
                Inquiry received
              </h1>
              <p className="text-sm text-stone-600 leading-relaxed font-light mb-7">
                Thank you, <span className="font-semibold text-stone-900">{formData.name}</span>. Your booking inquiry for the{' '}
                <span className="font-semibold text-amber-700">{getSelectedPackageDisplayName()}</span> has been logged.
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
                  <span className="font-semibold text-stone-900">{formatDateDisplay(formData.startDate)} → {formatDateDisplay(effectiveEndDate)}</span>
                </div>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed italic mb-7 font-light">
                A luxury travel specialist will reach out to you at <span className="font-semibold text-stone-800 not-italic">{formData.email}</span> or{' '}
                <span className="font-semibold text-stone-800 not-italic">{formData.phone}</span> within 24 hours to begin customizing your itinerary.
              </p>
            </>
          )}

          <button
            onClick={() => {
              setFormData({
                name: '',
                email: '',
                phone: '',
                countryCode: defaultCode?.code ?? '',
                packageId: '',
                customDestination: '',
                startDate: '',
                endDate: '',
                guests: inquiryType === 'corporate' ? '10' : '1',
                notes: '',
                companyName: ''
              })
              setGroupMembers([{ name: '', email: '', dietary: 'None', seat: 'Window', passport: '' }])
              setSubmitted(false)
            }}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full text-sm font-semibold transition-all shadow-sm"
          >
            Submit another inquiry
          </button>
        </div>
      </section>
      </>
    )
  }

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
            {submissionAttempted && (Object.values(errors).some(Boolean) || Object.values(memberErrors).some(e => e && Object.values(e).some(Boolean))) && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 animate-fade-in">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="text-sm text-rose-800 font-medium">
                  <span className="block mb-0.5">Please fix the following errors before submitting:</span>
                  <ul className="list-disc list-inside text-rose-700 font-normal space-y-0.5">
                    {Object.entries(errors).filter(([, v]) => v).map(([field, msg]) => (
                      <li key={field}>{msg}</li>
                    ))}
                    {Object.entries(memberErrors).filter(([, v]) => v && Object.values(v).some(Boolean)).map(([idx, fieldErrs]) =>
                      Object.entries(fieldErrs).filter(([, v]) => v).map(([field, msg]) => (
                        <li key={`g${idx}-${field}`}>Guest {idx}: {msg}</li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Inquiry Type Tabs */}
              <div className="flex bg-[#FAF9F5] p-1.5 rounded-full border border-stone-200/80 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setInquiryType('leisure')
                    setErrors({})
                    setFormData(prev => ({
                      ...prev,
                      guests: '1',
                      packageId: '',
                      customDestination: '',
                      companyName: ''
                    }))
                    syncGroupMembers(1)
                    setGuestSectionOpen(false)
                  }}
                  className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all cursor-pointer ${
                    inquiryType === 'leisure'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Personal Holiday
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInquiryType('corporate')
                    setErrors({})
                    setFormData(prev => ({
                      ...prev,
                      guests: '10',
                      packageId: '',
                      customDestination: '',
                      companyName: ''
                    }))
                    syncGroupMembers(10)
                  }}
                  className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all cursor-pointer ${
                    inquiryType === 'corporate'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Corporate Retreat
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-5">
                {/* Name */}
                <div className="sm:col-span-3">
                  <label htmlFor="bk-name" className="block text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                    {inquiryType === 'corporate' ? 'Contact Person Name' : 'Full Name'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      id="bk-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={inquiryType === 'corporate' ? 'e.g. John Doe' : 'e.g. Sophia Loren'}
                      className={`w-full h-12 bg-[#FAF9F5] border ${errors.name ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                        } rounded-full pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all`}
                    />
                  </div>
                  {errors.name && <span className="text-xs text-rose-600 mt-1.5 block font-semibold">{errors.name}</span>}
                </div>

                {/* Company Name (Corporate Only) */}
                {inquiryType === 'corporate' ? (
                  <div className="sm:col-span-3 animate-fade-in">
                    <label htmlFor="bk-company" className="block text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                      Company Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                      <input
                        id="bk-company"
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Acme Corp"
                        className={`w-full h-12 bg-[#FAF9F5] border ${errors.companyName ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                          } rounded-full pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all`}
                      />
                    </div>
                    {errors.companyName && <span className="text-xs text-rose-600 mt-1.5 block font-semibold">{errors.companyName}</span>}
                  </div>
                ) : null}

                {/* Email */}
                <div className="sm:col-span-3">
                  <label htmlFor="bk-email" className="block text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                    {inquiryType === 'corporate' ? 'Work Email Address' : 'Email Address'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      id="bk-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={inquiryType === 'corporate' ? 'e.g. john@company.com' : 'e.g. sophia@loren.com'}
                      className={`w-full h-12 bg-[#FAF9F5] border ${errors.email ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                        } rounded-full pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all`}
                    />
                  </div>
                  {errors.email && <span className="text-xs text-rose-600 mt-1.5 block font-semibold">{errors.email}</span>}
                </div>

                {/* Phone */}
                <div className="sm:col-span-3">
                  <label htmlFor="bk-phone" className="block text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                    {inquiryType === 'corporate' ? 'Mobile Number' : 'Phone Number'} <span className="text-rose-500">*</span>
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
                    {inquiryType === 'corporate' ? 'Corporate Package' : 'Select Package or Destination'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    {inquiryType === 'corporate' ? (
                      <select
                        id="bk-pkg"
                        name="packageId"
                        value={formData.packageId}
                        onChange={handleChange}
                        className={`w-full h-12 bg-[#FAF9F5] border ${errors.packageId ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                          } rounded-full pl-10 pr-10 text-sm text-stone-900 outline-none transition-all appearance-none cursor-pointer`}
                      >
                        <option value="" disabled>Choose a corporate package</option>
                        {corporatePackages.map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} ({pkg.nights} Nights{pkg.starting_price ? ` - from ${formatINR(pkg.starting_price)}` : ''})
                          </option>
                        ))}
                        <option value="custom-other">Custom Destination / Other</option>
                      </select>
                    ) : (
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
                    )}
                  </div>
                  {errors.packageId && <span className="text-xs text-rose-600 mt-1.5 block font-semibold">{errors.packageId}</span>}
                </div>

                {formData.departureId && (
                  <div className="sm:col-span-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 animate-fade-in">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800 leading-relaxed font-light">
                      <span className="font-semibold block mb-0.5">Upcoming Trip Selected</span>
                      You are booking a slot on the scheduled group departure. The travel dates for this departure are fixed from <span className="font-semibold">{formatDateDisplay(formData.startDate)}</span> to <span className="font-semibold">{formatDateDisplay(formData.endDate)}</span>.
                    </div>
                  </div>
                )}

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
                        placeholder={inquiryType === 'corporate' ? 'e.g. Goa, Switzerland, Vietnam...' : 'e.g. Italy, Switzerland, Bali, Dubai...'}
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
                      min={new Date().toISOString().split('T')[0]}
                      onChange={isStartDateLocked ? undefined : handleChange}
                      disabled={isStartDateLocked}
                      className={`w-full h-12 bg-[#FAF9F5] border ${errors.startDate ? 'border-rose-400' : 'border-stone-200'} ${isStartDateLocked ? 'cursor-not-allowed opacity-60' : 'focus:border-amber-500 focus:ring-2 focus:ring-amber-200 cursor-pointer'
                        } rounded-full pl-10 pr-4 text-sm text-stone-900 outline-none transition-all`}
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
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      onChange={isEndDateLocked ? undefined : handleChange}
                      disabled={isEndDateLocked}
                      className={`w-full h-12 bg-[#FAF9F5] border ${errors.endDate ? 'border-rose-400' : 'border-stone-200'} ${isEndDateLocked ? 'cursor-not-allowed opacity-60' : 'focus:border-amber-500 focus:ring-2 focus:ring-amber-200 cursor-pointer'
                        } rounded-full pl-10 pr-4 text-sm text-stone-900 outline-none transition-all`}
                    />
                  </div>
                  {!isEndDateLocked && errors.endDate && <span className="text-xs text-rose-600 mt-1.5 block font-semibold">{errors.endDate}</span>}
                </div>

                {/* Guests Count */}
                <div className="sm:col-span-2">
                  <label htmlFor="bk-guests" className="block text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                    {inquiryType === 'corporate' ? 'Estimated Attendees' : 'Number of Travellers'}
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      id="bk-guests"
                      type="number"
                      name="guests"
                      min="1"
                      max={inquiryType === 'corporate' ? undefined : '25'}
                      value={formData.guests}
                      onChange={handleChange}
                      placeholder={inquiryType === 'corporate' ? 'e.g. 50' : 'e.g. 1'}
                      className="w-full h-12 bg-[#FAF9F5] border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-full pl-10 pr-4 text-sm text-stone-900 outline-none transition-all"
                    />
                  </div>
                  {errors.guests && <span className="text-xs text-rose-600 mt-1.5 block font-semibold">{errors.guests}</span>}
                </div>
              </div>

              {/* Traveller Details Section — shown when guests > 1 (Leisure only) */}
              {inquiryType !== 'corporate' && guestCount > 1 && (
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
                  {inquiryType === 'corporate' ? 'Special Retreat Requirements / Event Details' : 'Special Requests / Dietary / Preferences'}
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                  <textarea
                    id="bk-notes"
                    name="notes"
                    rows="4"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder={inquiryType === 'corporate' ? 'e.g. Conference facilities, room count, AV production, team building activities...' : 'e.g. Prefer high floor suites, vegetarian meals, airport speedboats...'}
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
                  className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-full text-sm font-semibold shadow-md shadow-amber-900/15 active:scale-[0.98] transition-all duration-300 text-center cursor-pointer"
                >
                  {submitting ? 'Submitting inquiry…' : (inquiryType === 'corporate' ? 'Submit Retreat Inquiry' : `Submit inquiry for ${guestCount} traveller${guestCount > 1 ? 's' : ''}`)}
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
              src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/assets/unsplash-featured.jpg`}
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
    </>
  )
}
