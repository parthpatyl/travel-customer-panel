import { useState } from 'react'
import { Gift, Sparkles, Send, CheckCircle2, ArrowRight, Compass } from 'lucide-react'

export default function GiftCardsPage({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <div className="min-h-[80vh] bg-[#FDFCF7] text-stone-900 flex flex-col justify-between pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full text-center space-y-8 my-auto py-12">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold uppercase tracking-[0.2em] shadow-sm animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Coming Soon</span>
        </div>

        {/* Main Header */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-stone-900 tracking-[-0.03em] font-extrabold leading-tight">
            Kraft Travel <span className="italic font-serif text-amber-700">Gift Cards</span>
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-light">
            Give the gift of wanderlust and unforgettable luxury journeys. Our signature travel vouchers will be launching soon with exclusive bonus credits and bespoke trip customization.
          </p>
        </div>

        {/* Visual Mockup Card */}
        <div className="relative max-w-lg mx-auto p-8 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-white shadow-2xl border border-amber-500/20 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col justify-between h-56 text-left">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400 block mb-1">Voucher Preview</span>
                <h3 className="font-display text-xl font-bold tracking-wider text-white">KRAFT YOUR TRIP</h3>
                <p className="text-[11px] text-stone-400">LUXURY CONCIERGE EXPERIENCE</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                <Gift className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-stone-400 font-mono tracking-widest block uppercase">Voucher ID • XXXX-XXXX-2026</span>
              <div className="flex justify-between items-end pt-2 border-t border-stone-800">
                <div>
                  <span className="text-[9px] text-stone-400 uppercase tracking-wider block">Complimentary Credit</span>
                  <span className="text-xl font-extrabold text-amber-400">$500 – $5,000 USD</span>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full">
                  COMING SOON
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Early Access Notification Form */}
        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="text-left space-y-1">
            <h4 className="text-sm font-bold text-stone-900">Be first in line for early access</h4>
            <p className="text-xs text-stone-500">Subscribe to receive launch notification & a $100 early-bird bonus voucher credit.</p>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! We’ll notify you as soon as Gift Cards launch.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-stone-50 border border-stone-200 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Notify Me</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Alternative Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('destinations')}
            className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Explore Destinations</span>
          </button>
          <button
            onClick={() => onNavigate('booking')}
            className="px-6 py-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Plan Custom Trip</span>
            <ArrowRight className="w-4 h-4 text-amber-700" />
          </button>
        </div>
      </div>
    </div>
  )
}
