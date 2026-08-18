import { Phone, AlertCircle } from 'lucide-react'
import { DIAL_CODES, getDefaultDialCode } from '../utils/dialCodes'

function detectFromNumber(raw) {
  if (!raw.startsWith('+') || raw.length < 4) return null
  for (const d of DIAL_CODES) {
    if (raw.startsWith(d.code)) return d
  }
  return null
}

export default function PhoneInput({ countryCode, phone, onChange, error }) {
  const defaultCode = getDefaultDialCode()
  const currentCode = countryCode || defaultCode?.code || '+1'

  const getPlaceholder = (code) => {
    switch (code) {
      case '+91': return 'e.g. 98765 43210'
      case '+1': return 'e.g. (555) 019-2831'
      case '+44': return 'e.g. 7911 123456'
      case '+61': return 'e.g. 412 345 678'
      case '+971': return 'e.g. 50 123 4567'
      case '+65': return 'e.g. 8123 4567'
      case '+33': return 'e.g. 6 12 34 56 78'
      case '+49': return 'e.g. 151 12345678'
      default: return 'Phone number (digits only)'
    }
  }

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/[^0-9+]/g, '')

    if (raw.startsWith('+') && raw.length >= 4) {
      const detected = detectFromNumber(raw)
      if (detected && detected.code !== countryCode) {
        onChange({ target: { name: 'countryCode', value: detected.code } })
      }
      if (detected) {
        const stripped = raw.slice(detected.code.length).replace(/\D/g, '')
        onChange({ target: { name: 'phone', value: stripped } })
        return
      }
    }

    const digits = raw.replace(/^0+/, '').replace(/\D/g, '')
    onChange({ target: { name: 'phone', value: digits } })
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2.5">
        <div className={`relative w-[4.5rem] h-12 rounded-full border ${error ? 'border-rose-400 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-200 bg-rose-50/20' : 'border-stone-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 bg-[#FAF9F5]'} shrink-0 transition-all`}>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-stone-900 pointer-events-none">
            {currentCode}
          </span>
          <select
            id="bk-country"
            name="countryCode"
            value={currentCode}
            onChange={(e) => onChange({ target: { name: 'countryCode', value: e.target.value } })}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-sm"
          >
            {countryCode === '' && (
              <option value="" disabled>Select country</option>
            )}
            {DIAL_CODES.map(d => (
              <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
            ))}
          </select>
        </div>
        <div className="relative flex-1">
          <Phone className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${error ? 'text-rose-400' : 'text-stone-400'} pointer-events-none`} />
          <input
            id="bk-phone"
            type="tel"
            name="phone"
            value={phone}
            onChange={handlePhoneChange}
            placeholder={getPlaceholder(currentCode)}
            className={`w-full h-12 ${error ? 'bg-rose-50/20 border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' : 'bg-[#FAF9F5] border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
              } border rounded-full pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all`}
          />
        </div>
      </div>
      {error && (
        <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-1 pl-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </span>
      )}
    </div>
  )
}
