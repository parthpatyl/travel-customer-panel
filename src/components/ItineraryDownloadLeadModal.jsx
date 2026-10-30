import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, FileText, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import PhoneInput from './PhoneInput'
import { validateEmail, validatePhone, validateName } from '../utils/validation'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function ItineraryDownloadLeadModal({ isOpen, onClose, onSuccess, pkg }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Pre-fill from previous session if available
  useEffect(() => {
    if (!isOpen) return
    try {
      const saved = sessionStorage.getItem('kraft_guest_contact')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.name) setName(parsed.name)
        if (parsed.email) setEmail(parsed.email)
        if (parsed.phone) setPhone(parsed.phone)
        if (parsed.countryCode) setCountryCode(parsed.countryCode)
      }
    } catch {
      // ignore
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !pkg) return null

  const validate = () => {
    const errs = {}
    const nameCheck = validateName(name)
    if (!nameCheck.isValid) errs.name = nameCheck.error

    const emailCheck = validateEmail(email)
    if (!emailCheck.isValid) errs.email = emailCheck.error

    const phoneCheck = validatePhone(phone, countryCode)
    if (!phoneCheck.isValid) errs.phone = phoneCheck.error

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!validate()) return

    setIsSubmitting(true)
    const formattedPhone = `${countryCode}${phone.replace(/\D/g, '')}`
    const destName = pkg.name || pkg.destination || 'Custom Tour'

    const leadPayload = {
      name: name.trim(),
      email: email.trim(),
      phone: formattedPhone,
      destination: destName,
      travelDate: new Date().toISOString().split('T')[0],
      guests: 1,
      notes: `[Itinerary Download] Brochure downloaded for ${destName}`,
      leadSource: 'Itinerary Download',
      preferences: {
        leadType: 'Itinerary Download',
        packageId: pkg.id || null
      }
    }

    try {
      // Primary: submit to enquiries API
      const res = await fetch(`${API_URL}/api/enquiries/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      })

      if (!res.ok) {
        // Fallback: try bookings inquiry endpoint with leadSource if enquiries endpoint fails
        try {
          await fetch(`${API_URL}/api/bookings/inquiry`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: name.trim(),
              email: email.trim(),
              phone: formattedPhone,
              packageId: pkg.id || 'custom-other',
              customDestination: destName,
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
              guests: '1',
              notes: `[Itinerary Download] Brochure downloaded for ${destName}`,
              leadSource: 'Itinerary Download',
              specialRequests: '[Itinerary Download]'
            })
          })
        } catch {
          // Proceed anyway so download is not blocked
        }
      }
    } catch {
      // Graceful offline fallback: allow guest to view itinerary even if backend is offline
    } finally {
      // Save contact details to session storage
      try {
        sessionStorage.setItem('kraft_lead_captured', 'true')
        sessionStorage.setItem('kraft_guest_contact', JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          countryCode,
          phone
        }))
      } catch {
        // ignore
      }

      setIsSubmitting(false)
      onSuccess()
    }
  }

  const modal = (
    <div
      className="fixed inset-0 z-[120] bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="itinerary-lead-modal-title"
    >
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-stone-200 my-auto animate-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="bg-stone-900 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2">
                <FileText className="w-3 h-3 text-amber-400" />
                Free Itinerary PDF
              </span>
              <h2 id="itinerary-lead-modal-title" className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                Download Day-by-Day Itinerary
              </h2>
              <p className="text-xs text-stone-300 font-light mt-1.5 leading-relaxed">
                Enter your details to instantly unlock the complete, printable itinerary brochure for{' '}
                <strong className="text-amber-300 font-semibold">{pkg.name || pkg.destination}</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer shrink-0 mt-0.5"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lead Capture Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-7 space-y-4">
          {submitError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Guest Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-amber-600">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors(prev => ({ ...prev, name: null }))
              }}
              placeholder="e.g. John Doe"
              className={`w-full bg-[#FAF9F5] border ${errors.name ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200' : 'border-stone-200 focus:border-amber-500'} rounded-xl py-2.5 px-3.5 text-xs text-stone-900 placeholder-stone-400 outline-none transition-all`}
            />
            {errors.name && (
              <p className="text-[10px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-amber-600">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors(prev => ({ ...prev, email: null }))
              }}
              placeholder="e.g. john@example.com"
              className={`w-full bg-[#FAF9F5] border ${errors.email ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200' : 'border-stone-200 focus:border-amber-500'} rounded-xl py-2.5 px-3.5 text-xs text-stone-900 placeholder-stone-400 outline-none transition-all`}
            />
            {errors.email && (
              <p className="text-[10px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Phone Number <span className="text-amber-600">*</span>
            </label>
            <PhoneInput
              countryCode={countryCode}
              phone={phone}
              onChange={(e) => {
                if (e.target.name === 'countryCode') setCountryCode(e.target.value)
                if (e.target.name === 'phone') {
                  setPhone(e.target.value)
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: null }))
                }
              }}
              error={errors.phone}
            />
            {errors.phone && (
              <p className="text-[10px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.phone}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              data-testid="lead-submit-btn"
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-300 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Unlocking Itinerary...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Itinerary (PDF)</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-center text-stone-400 leading-normal">
            We respect your privacy. No spam. Our bespoke luxury specialist will only contact you if you request personal trip planning.
          </p>
        </form>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
