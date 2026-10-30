// Credential & Contact Validation Utilities for Kraft Your Trip

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com',
  'throwawaymail.com', 'yopmail.com', 'trashmail.com', 'sharklasers.com',
  'getairmail.com', 'dispostable.com', 'fake.com', 'temp-mail.org',
  'fakemailgenerator.com', 'inboxkitten.com', 'nada.ltd', 'mohmal.com',
  'emailondeck.com', 'mytemp.email', 'crazymailing.com'
])

const DUMMY_EMAIL_PREFIXES = new Set([
  'test', 'testing', 'admin', 'asdf', 'qwerty', 'dummy'
])

const SEQUENTIAL_ASC = '01234567890123456789'

const COUNTRY_PHONE_RULES = {
  '+91': { name: 'India', min: 10, max: 10, label: 'Indian phone numbers must be exactly 10 digits' },
  '+1': { name: 'US/Canada', min: 10, max: 10, label: 'US/Canada phone numbers must be exactly 10 digits' },
  '+44': { name: 'UK', min: 10, max: 11, label: 'UK phone numbers must be 10 or 11 digits' },
  '+971': { name: 'UAE', min: 9, max: 9, label: 'UAE phone numbers must be exactly 9 digits' },
  '+65': { name: 'Singapore', min: 8, max: 8, label: 'Singapore phone numbers must be exactly 8 digits' },
  '+61': { name: 'Australia', min: 9, max: 9, label: 'Australian phone numbers must be exactly 9 digits' }
}

/**
 * Validates an email address against syntax, RFC compliance, and bogus/disposable domains.
 * @param {string} email
 * @param {object} [options]
 * @param {boolean} [options.requireCorporate] - Requires non-generic corporate domain
 * @returns {{ isValid: boolean, error?: string, normalized?: string }}
 */
export function validateEmail(email, options = {}) {
  const raw = (email || '').trim()
  if (!raw) {
    return {
      isValid: false,
      error: options.requireCorporate
        ? 'Work email is required (e.g. name@company.com)'
        : 'Please enter your email address'
    }
  }

  if (raw.length > 254) {
    return { isValid: false, error: 'Email address is too long' }
  }

  // Strict RFC 5322 regex check
  const rfcRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  if (!rfcRegex.test(raw) || raw.includes('..')) {
    return { isValid: false, error: 'Please provide a valid email address' }
  }

  const [localPart, domainPart] = raw.toLowerCase().split('@')
  if (!domainPart || !domainPart.includes('.')) {
    return { isValid: false, error: 'Please provide a valid email address' }
  }

  const tld = domainPart.split('.').pop()
  if (!tld || tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { isValid: false, error: 'Please provide a valid email address' }
  }

  // Block disposable email providers
  if (DISPOSABLE_EMAIL_DOMAINS.has(domainPart)) {
    return { isValid: false, error: 'Disposable and temporary email addresses are not accepted' }
  }

  // Block obvious dummy emails like test@test.com
  if (DUMMY_EMAIL_PREFIXES.has(localPart) && (domainPart === 'test.com' || domainPart === 'dummy.com' || domainPart === 'fake.com')) {
    return { isValid: false, error: 'Please provide a genuine personal or work email address' }
  }

  return { isValid: true, normalized: raw.toLowerCase() }
}

/**
 * Validates a phone number against international E.164 rules, dial codes, and bogus patterns.
 * @param {string} phone - Digits or raw string
 * @param {string} [countryCode='+91'] - e.g. '+91', '+1', '+44'
 * @returns {{ isValid: boolean, error?: string, formatted?: string, cleanDigits?: string }}
 */
export function validatePhone(phone, countryCode = '+91') {
  const raw = (phone || '').toString().trim()
  if (!raw) {
    return { isValid: false, error: 'Please enter your phone number' }
  }

  const allDigits = raw.replace(/\D/g, '')
  if (!allDigits) {
    return { isValid: false, error: 'Phone number must contain digits' }
  }

  // Determine effective country code and local digits
  let cc = (countryCode || '+91').toString().trim()
  if (!cc.startsWith('+')) cc = `+${cc}`
  let localDigits = allDigits

  if (raw.startsWith('+')) {
    // Check known codes first ordered by length descending
    const knownCodes = Object.keys(COUNTRY_PHONE_RULES).sort((a, b) => b.length - a.length)
    for (const code of knownCodes) {
      if (raw.startsWith(code)) {
        cc = code
        localDigits = raw.slice(code.length).replace(/\D/g, '')
        break
      }
    }
  } else if (allDigits.length > 10 && cc && allDigits.startsWith(cc.replace('+', ''))) {
    // Number already includes country code prefix without '+'
    localDigits = allDigits.slice(cc.replace('+', '').length)
  }

  // Check for repeated identical digits (e.g. 0000000000, 1111111111, 9999999999)
  if (/^(\d)\1+$/.test(localDigits)) {
    return { isValid: false, error: 'Phone number cannot contain all identical digits' }
  }

  // Check for ascending sequential dummy numbers (e.g. 1234567890, 0123456789)
  if (localDigits.length >= 8 && SEQUENTIAL_ASC.includes(localDigits)) {
    return { isValid: false, error: 'Sequential dummy phone numbers are not allowed' }
  }

  // Standard E.164 length check on total or local
  if (localDigits.length < 7 || localDigits.length > 15) {
    return { isValid: false, error: 'Phone number must be between 7 and 15 digits' }
  }

  // Check country-specific length constraints (e.g. India +91 requires exactly 10 digits)
  const rule = COUNTRY_PHONE_RULES[cc]
  if (rule) {
    if (localDigits.length < rule.min || localDigits.length > rule.max) {
      return { isValid: false, error: rule.label }
    }
  }

  const formatted = `${cc}${localDigits}`
  return { isValid: true, formatted, cleanDigits: localDigits }
}

/**
 * Validates numeric inputs with custom boundaries.
 * @param {any} value
 * @param {object} [options]
 * @returns {{ isValid: boolean, error?: string, value?: number }}
 */
export function validateNumber(value, options = {}) {
  const { min, max, integerOnly = false, fieldName = 'Value', required = true } = options
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    if (!required) return { isValid: true, value: null }
    return { isValid: false, error: `${fieldName} is required` }
  }
  const num = Number(value)
  if (isNaN(num) || !isFinite(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` }
  }
  if (integerOnly && !Number.isInteger(num)) {
    return { isValid: false, error: `${fieldName} must be a whole number` }
  }
  if (min !== undefined && num < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` }
  }
  if (max !== undefined && num > max) {
    return { isValid: false, error: `${fieldName} cannot exceed ${max}` }
  }
  return { isValid: true, value: num }
}

export function validateGuests(value) {
  return validateNumber(value, { min: 1, max: 500, integerOnly: true, fieldName: 'Number of guests' })
}

export function validatePrice(value, fieldName = 'Price') {
  return validateNumber(value, { min: 0, fieldName })
}

export function validatePercentage(value, fieldName = 'Percentage') {
  return validateNumber(value, { min: 0, max: 100, fieldName })
}

export function validateRating(value) {
  return validateNumber(value, { min: 1, max: 5, integerOnly: true, fieldName: 'Rating' })
}

/**
 * Validates a guest or customer full name.
 * @param {string} name
 * @returns {{ isValid: boolean, error?: string, normalized?: string }}
 */
export function validateName(name) {
  const raw = (name || '').trim()
  if (!raw) {
    return { isValid: false, error: 'Please enter your full name' }
  }
  if (raw.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' }
  }
  if (raw.length > 100) {
    return { isValid: false, error: 'Name must not exceed 100 characters' }
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(raw)) {
    return { isValid: false, error: 'Name should only contain letters and spaces' }
  }
  const lower = raw.toLowerCase()
  if (['test', 'testing', 'asdf', 'qwerty', 'fake name', 'none', 'null', 'na'].includes(lower)) {
    return { isValid: false, error: 'Please enter your real full name' }
  }
  return { isValid: true, normalized: raw }
}
