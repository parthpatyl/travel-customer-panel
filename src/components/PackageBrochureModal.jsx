import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Printer, X, Check, CheckCircle2, Phone, Mail, MapPin, Hotel, Compass, User, Car, Plane, Ship } from 'lucide-react'
import Markdown from 'react-markdown'
import { formatINR, formatUSD } from '../utils/currency'
import { getImgUrl, handleImageError, DEFAULT_HERO_IMAGE } from '../utils/image'

const imgUrl = (url) => getImgUrl(url, DEFAULT_HERO_IMAGE)

const mdComponents = {
  strong: ({ children }) => <strong className="font-extrabold">{children}</strong>,
}

function MarkdownInline({ children, className }) {
  if (!children) return null
  return (
    <Markdown
      components={{
        p: ({ children }) => <span className={className}>{children}</span>,
        strong: ({ children }) => <strong className="font-extrabold">{children}</strong>,
      }}
    >
      {children}
    </Markdown>
  )
}

export default function PackageBrochureModal({ pkg, isOpen, onClose, settings = {} }) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const beforePrint = () => {
      document.body.classList.add('is-printing')
    }
    const afterPrint = () => {
      document.body.classList.remove('is-printing')
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('beforeprint', beforePrint)
    window.addEventListener('afterprint', afterPrint)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('beforeprint', beforePrint)
      window.removeEventListener('afterprint', afterPrint)
      document.body.classList.remove('is-printing')
    }
  }, [isOpen, onClose])

  if (!isOpen || !pkg) return null

  const handlePrint = () => {
    document.body.classList.add('is-printing')
    window.print()
    setTimeout(() => {
      document.body.classList.remove('is-printing')
    }, 1000)
  }

  const agencyName = settings.agencyName || 'KRAFT YOUR TRIP'
  const agencyPhone = settings.agencyPhone || '+1 (555) 019-2831'
  const agencyEmail = settings.agencyEmail || 'concierge@kraftyourtrip.com'
  const agencyAddress = settings.agencyAddress || '456 Sandstone Ave, Suite 100, San Francisco, CA'

  const modalContent = (
    <div className="print-portal-root">
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6">
        <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
          {/* Action Header bar (Hidden when printing) */}
          <div className="no-print bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                <Printer className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-white">Package Brochure Preview</h3>
                <p className="text-xs text-stone-400 font-light">Print or save as PDF via your browser's print dialog</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Download PDF / Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
                title="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Content Area */}
          <div className="print-area overflow-y-auto px-5 py-4 sm:px-7 sm:py-5 space-y-4 text-stone-800 bg-white" id="package-printable-area">
            {/* Print Header / Agency Branding */}
            <div className="border-b-2 border-amber-600/30 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h1 className="font-display text-lg sm:text-xl text-stone-900 tracking-wider font-extrabold uppercase">
                  {agencyName}
                </h1>
                <p className="text-xs text-amber-700 font-semibold tracking-[0.2em] uppercase mt-0.5">
                  Bespoke & Luxury Travel Experiences
                </p>
              </div>
              <div className="text-xs text-stone-600 space-y-1 sm:text-right font-light">
                <div className="flex items-center gap-1.5 sm:justify-end">
                  <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{agencyPhone}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:justify-end">
                  <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{agencyEmail}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:justify-end">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{agencyAddress}</span>
                </div>
              </div>
            </div>

            {/* Package Title Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-stone-900 text-white min-h-[100px] flex flex-col justify-end p-4">
              {pkg.heroImage && (
                <img
                  src={imgUrl(pkg.heroImage)}
                  onError={(e) => handleImageError(e, DEFAULT_HERO_IMAGE)}
                  alt={pkg.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent" />
              
              <div className="relative z-10 space-y-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="px-2.5 py-0.5 bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                    {pkg.region}
                  </span>
                  <span className="px-2.5 py-0.5 bg-white/90 text-stone-900 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                    {pkg.duration}
                  </span>
                  {pkg.isBespoke && (
                    <span className="px-2.5 py-0.5 bg-stone-800 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                      Bespoke Custom
                    </span>
                  )}
                  {pkg.bestMonth && (
                    <span className="px-2.5 py-0.5 bg-sky-500/90 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                      Best in {pkg.bestMonth}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {pkg.name}
                </h2>
              </div>
            </div>

            {/* Key Facts & Pricing Info */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl print-break-inside-avoid min-w-0">
              <div className="sm:col-span-4 space-y-1 min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block">Pricing Details</span>
                {pkg.isBespoke ? (
                  <span className="font-display text-lg font-bold text-amber-800">Custom Quote</span>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-display text-xl font-bold text-stone-900">{formatINR(pkg.price)}</span>
                      <span className="text-xs text-stone-500 font-medium">INR / person</span>
                      {pkg.usdPrice != null && <span className="text-xs text-stone-400">({formatUSD(pkg.usdPrice)})</span>}
                    </div>
                    <span className="text-[10px] font-bold text-red-600 tracking-wider uppercase block mt-0.5">T&C apply</span>
                  </div>
                )}
              </div>

              <div className="sm:col-span-3 space-y-1 min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block">Duration & Region</span>
                <p className="text-sm font-semibold text-stone-800">{pkg.duration} · {pkg.region}</p>
              </div>

              <div className="sm:col-span-5 space-y-1 min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block">Included Amenities</span>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-stone-700 pt-0.5 min-w-0 overflow-hidden">
                  {pkg.inclusionsSelection?.hotel && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium shrink-0" title="Hotel">
                      <Hotel className="w-3.5 h-3.5 text-amber-700 shrink-0" /> Hotel
                    </span>
                  )}
                  {pkg.inclusionsSelection?.sightseeing && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium shrink-0" title="Sightseeing">
                      <Compass className="w-3.5 h-3.5 text-amber-700 shrink-0" /> Tours
                    </span>
                  )}
                  {pkg.inclusionsSelection?.guide && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium shrink-0" title="Guide">
                      <User className="w-3.5 h-3.5 text-amber-700 shrink-0" /> Guide
                    </span>
                  )}
                  {pkg.inclusionsSelection?.airportTransfer && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium shrink-0" title="Transfers">
                      <Car className="w-3.5 h-3.5 text-amber-700 shrink-0" /> Transfer
                    </span>
                  )}
                  {pkg.inclusionsSelection?.flight && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium shrink-0" title="Flight">
                      <Plane className="w-3.5 h-3.5 text-amber-700 shrink-0" /> Flight
                    </span>
                  )}
                  {pkg.inclusionsSelection?.cruise && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium shrink-0" title="Cruise">
                      <Ship className="w-3.5 h-3.5 text-amber-700 shrink-0" /> Cruise
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Overview */}
            {pkg.description && (
              <div className="space-y-2 print-break-inside-avoid">
                <h3 className="font-display text-base font-bold text-stone-900 border-b border-stone-200 pb-1">
                  Trip Overview
                </h3>
                <div className="text-sm text-stone-600 leading-relaxed font-light whitespace-pre-line">
                  <Markdown components={mdComponents}>{pkg.description}</Markdown>
                </div>
              </div>
            )}

            {/* Terms & Conditions */}
            {(pkg.termsAndConditions || pkg.terms_and_conditions) && (
              <div className="space-y-2 print-break-inside-avoid">
                <h3 className="font-display text-base font-bold text-stone-900 border-b border-stone-200 pb-1">
                  Terms & Conditions
                </h3>
                <div className="text-xs text-stone-600 leading-relaxed font-light bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <Markdown components={mdComponents}>{pkg.termsAndConditions || pkg.terms_and_conditions}</Markdown>
                </div>
              </div>
            )}

            {/* Highlights */}
            {pkg.highlights && pkg.highlights.length > 0 && (
              <div className="space-y-3 print-break-inside-avoid">
                <h3 className="font-display text-base font-bold text-stone-900 border-b border-stone-200 pb-1">
                  Trip Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {pkg.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </span>
                      <MarkdownInline className="leading-snug">{item}</MarkdownInline>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Day-by-Day Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-stone-900 border-b border-stone-200 pb-1">
                  Day-by-Day Itinerary
                </h3>
                <div className="space-y-2">
                  {pkg.itinerary.map((dayItem, idx) => (
                    <div key={idx} className="p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl space-y-1 print-break-inside-avoid">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-600 text-white font-bold text-[10px] uppercase tracking-wider rounded">
                          Day {dayItem.day}
                        </span>
                        <h4 className="font-display text-sm font-bold text-stone-900">
                          {dayItem.title}
                        </h4>
                      </div>
                      <div className="text-xs text-stone-600 leading-relaxed font-light whitespace-pre-line pl-1">
                        <Markdown components={mdComponents}>{dayItem.desc}</Markdown>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print-break-inside-avoid">
              {pkg.inclusions && pkg.inclusions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" /> What's Included
                  </h4>
                  <ul className="space-y-1.5">
                    {pkg.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <MarkdownInline>{inc}</MarkdownInline>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.exclusions && pkg.exclusions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-rose-500 rounded-full" /> What's Excluded
                  </h4>
                  <ul className="space-y-1.5">
                    {pkg.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                        <span className="w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✕</span>
                        <MarkdownInline>{exc}</MarkdownInline>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer Contact & Booking Note */}
            <div className="pt-3 border-t-2 border-stone-200 text-center space-y-2 print-break-inside-avoid">
              <p className="text-xs font-semibold text-stone-800">
                For bookings, custom modifications & inquiries, contact {agencyName}
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-stone-600 font-light">
                <span>📞 {agencyPhone}</span>
                <span>✉️ {agencyEmail}</span>
                <span>📍 {agencyAddress}</span>
              </div>
              <p className="text-[10px] text-stone-400 italic pt-2">
                Generated on {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} · Prices and availability subject to confirmation upon booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
