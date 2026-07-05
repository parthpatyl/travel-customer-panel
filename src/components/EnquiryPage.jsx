import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle2, Calendar, Users, MapPin, Phone, Mail, Compass, ShieldAlert, Clock, RefreshCw } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function EnquiryPage({ enquiryId, onBackToHome }) {
  const [enquiry, setEnquiry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEnquiryDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_URL}/api/enquiries/${enquiryId}`)
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.message || 'Failed to load enquiry details')
        }
        setEnquiry(data.data)
      } catch (err) {
        console.error('Error fetching enquiry details:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (enquiryId) {
      fetchEnquiryDetails()
    }
  }, [enquiryId])

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set'
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
      })
    } catch {
      return dateStr
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFCF7] py-20 px-4">
        <RefreshCw className="w-10 h-10 text-amber-600 animate-spin mb-4" />
        <p className="text-stone-500 font-light text-sm">Retrieving your luxury travel enquiry...</p>
      </div>
    )
  }

  if (error || !enquiry) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFCF7] py-20 px-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 border border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl text-stone-900 mb-2 tracking-tight">Could Not Find Enquiry</h2>
        <p className="text-sm text-stone-500 max-w-md text-center mb-8 font-light">
          {error || "We couldn't locate the enquiry with ID " + enquiryId + ". Please verify the URL or link."}
        </p>
        <button
          onClick={onBackToHome}
          className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-sm font-semibold transition-all shadow-sm"
        >
          Return to Home Page
        </button>
      </div>
    )
  }

  return (
    <section className="py-12 sm:py-16 bg-[#FDFCF7] min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back navigation */}
        <button
          onClick={onBackToHome}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-50 text-stone-700 shadow-sm border border-stone-200 rounded-full text-xs font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home Page
        </button>

        {/* Branded Header */}
        <div className="mb-8 animate-fade-in-up">
          <span className="editorial-mark-start text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-2 block">
            Enquiry Status
          </span>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="font-display text-3xl sm:text-4xl text-stone-900 tracking-[-0.02em]">
              Enquiry #{enquiry.id}
            </h1>
            <span className="text-xs text-stone-400 font-light">
              Submitted: {formatDate(enquiry.submittedAt)}
            </span>
          </div>
        </div>

        {/* Status Timeline Progress */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 animate-fade-in-up delay-100">
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-6">
            Customization Progress
          </h3>
          {(() => {
            const statusOrder = ['logged', 'reviewing', 'proposing', 'finalized']
            const currentIdx = statusOrder.indexOf(enquiry.status || 'logged')
            const stages = [
              { key: 'logged', icon: CheckCircle2, label: 'Logged', desc: 'Enquiry received', color: 'emerald' },
              { key: 'reviewing', icon: Clock, label: 'Reviewing', desc: 'Designer assigned', color: 'amber' },
              { key: 'proposing', icon: Compass, label: 'Proposing', desc: 'Drafting itinerary', color: 'purple' },
              { key: 'finalized', icon: CheckCircle2, label: 'Finalized', desc: 'Confirmed bookings', color: 'emerald' },
            ]

            return (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
                <div className="hidden sm:block absolute top-[14px] left-[12%] right-[12%] h-0.5 bg-stone-200 z-0" />
                {stages.map((stage, idx) => {
                  const Icon = stage.icon
                  const isCompleted = idx < currentIdx
                  const isCurrent = idx === currentIdx
                  const isUpcoming = idx > currentIdx
                  const dimmed = isUpcoming ? 'opacity-55' : ''

                  let circleStyle
                  if (isCompleted) {
                    circleStyle = 'bg-emerald-500 text-white shadow-md'
                  } else if (isCurrent) {
                    circleStyle = 'bg-amber-500 text-white shadow-md animate-pulse-glow'
                  } else {
                    circleStyle = 'bg-stone-200 text-stone-500'
                  }

                  return (
                    <div key={stage.key} className={`flex sm:flex-col items-center gap-4 sm:gap-2 text-left sm:text-center z-10 ${dimmed}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${circleStyle}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-[0.05em] sm:mt-1">{stage.label}</h4>
                        <p className="text-[10px] text-stone-500 font-light">{stage.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-200">
          {/* Main Info Card */}
          <div className="md:col-span-2 space-y-6">
            {/* Trip Details */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm">
              <h2 className="font-display text-lg text-stone-900 mb-4 tracking-tight border-b border-stone-100 pb-2">
                Travel Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-[0.1em] block">Destination</span>
                    <span className="text-sm font-semibold text-stone-800">{enquiry.destination}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-[0.1em] block">Travel Date</span>
                    <span className="text-sm font-semibold text-stone-800">{formatDate(enquiry.travelDate)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-[0.1em] block">Group Size</span>
                    <span className="text-sm font-semibold text-stone-800">{enquiry.guests} {enquiry.guests > 1 ? 'Travellers' : 'Traveller'}</span>
                  </div>
                </div>
              </div>

              {enquiry.notes && (
                <div className="mt-6 pt-5 border-t border-stone-100">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-[0.1em] block mb-2">Notes & Requirements</span>
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-150 text-sm text-stone-600 leading-relaxed font-light whitespace-pre-line">
                    {enquiry.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Preferences */}
            {enquiry.preferences && (Object.keys(enquiry.preferences).length > 0) && (
              <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm">
                <h2 className="font-display text-lg text-stone-900 mb-4 tracking-tight border-b border-stone-100 pb-2">
                  Preferences
                </h2>
                <div className="space-y-4">
                  {enquiry.preferences.accommodations && (
                    <div className="flex justify-between items-baseline py-1 text-sm border-b border-stone-50">
                      <span className="text-stone-500">Accommodation Class</span>
                      <span className="font-semibold text-stone-800 capitalize">{enquiry.preferences.accommodations}</span>
                    </div>
                  )}

                  {enquiry.preferences.dietary && (
                    <div className="flex justify-between items-baseline py-1 text-sm border-b border-stone-50">
                      <span className="text-stone-500">Dietary Needs</span>
                      <span className="font-semibold text-stone-800">{enquiry.preferences.dietary}</span>
                    </div>
                  )}

                  {enquiry.preferences.activities && enquiry.preferences.activities.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-[0.1em] block mb-2">Planned Activities</span>
                      <div className="flex flex-wrap gap-1.5">
                        {enquiry.preferences.activities.map((act, i) => (
                          <span key={i} className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs rounded-full border border-stone-200 font-light capitalize">
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Details Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-display text-lg text-stone-900 border-b border-stone-100 pb-2 tracking-tight">
                Your Contact Info
              </h2>
              <div className="space-y-3 pt-2">
                <div>
                  <span className="text-[9px] text-stone-400 font-semibold uppercase tracking-[0.1em] block">Full Name</span>
                  <span className="text-sm font-semibold text-stone-800">{enquiry.name}</span>
                </div>

                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-[9px] text-stone-400 font-semibold uppercase tracking-[0.1em] block">Email</span>
                  <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1.5 text-amber-700 hover:text-amber-600 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[200px]">{enquiry.email}</span>
                  </a>
                </div>

                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-[9px] text-stone-400 font-semibold uppercase tracking-[0.1em] block">Phone</span>
                  <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1.5 text-amber-700 hover:text-amber-600 transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{enquiry.phone}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Branded Assistance Card */}
            <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-300">Next Steps</h4>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Our luxury travel planners will design a bespoke itinerary based on your details and send you a preliminary PDF proposal via email within 24 hours.
              </p>
              <p className="text-xs text-stone-400 leading-relaxed italic font-light pt-2 border-t border-stone-800">
                Need immediate help? Call us at +1 (555) 019-2831.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
