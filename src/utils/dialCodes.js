import { getCountries, getCountryCallingCode } from 'libphonenumber-js'
import { detectCountryFromTimezone } from './detectCountry'

const names = new Intl.DisplayNames(['en'], { type: 'region' })

const seen = new Set()
export const DIAL_CODES = getCountries()
  .map(c => ({ country: c, code: `+${getCountryCallingCode(c)}`, name: names.of(c) }))
  .filter(d => {
    if (seen.has(d.code)) return false
    seen.add(d.code)
    return true
  })
  .sort((a, b) => b.code.length - a.code.length)

export function getDefaultDialCode() {
  const country = detectCountryFromTimezone()
  if (country) return DIAL_CODES.find(d => d.country === country) ?? null
  return null
}
