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

  const cleanDigits = raw.replace(/\D/g, '')
  if (!cleanDigits) {
    return { isValid: false, error: 'Phone number must contain digits' }
  }

  // Standard E.164 length check
  if (cleanDigits.length < 7 || cleanDigits.length > 15) {
    return { isValid: false, error: 'Phone number must be between 7 and 15 digits' }
  }

  // Check for repeated identical digits (e.g. 0000000000, 1111111111, 9999999999)
  if (/^(\d)\1+$/.test(cleanDigits)) {
    return { isValid: false, error: 'Phone number cannot contain all identical digits' }
  }

  // Check for ascending sequential dummy numbers (e.g. 1234567890, 0123456789)
  if (cleanDigits.length >= 8 && SEQUENTIAL_ASC.includes(cleanDigits)) {
    return { isValid: false, error: 'Sequential dummy phone numbers are not allowed' }
  }

  const cc = countryCode?.startsWith('+') ? countryCode : `+${countryCode || '91'}`
  const formatted = `${cc}${cleanDigits}`
  return { isValid: true, formatted, cleanDigits }
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
