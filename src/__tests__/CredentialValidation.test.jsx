import { describe, it, expect } from 'vitest'
import { validateEmail, validatePhone, validateName } from '../utils/validation'

describe('Credential & Contact Verification Suite', () => {
  describe('Email Verification', () => {
    it('accepts valid personal and business emails', () => {
      expect(validateEmail('priya.sharma@gmail.com').isValid).toBe(true)
      expect(validateEmail('aarav@kraftyourtrip.com').isValid).toBe(true)
      expect(validateEmail('contact@company.co.uk').isValid).toBe(true)
      expect(validateEmail('user.name+tag@domain.org').isValid).toBe(true)
    })

    it('rejects empty or whitespace-only emails', () => {
      const res = validateEmail('   ')
      expect(res.isValid).toBe(false)
      expect(res.error).toMatch(/Please enter your email address/i)
    })

    it('rejects invalid email syntax without domain or @', () => {
      expect(validateEmail('notanemail').isValid).toBe(false)
      expect(validateEmail('test@').isValid).toBe(false)
      expect(validateEmail('@domain.com').isValid).toBe(false)
      expect(validateEmail('user@domain..com').isValid).toBe(false)
      expect(validateEmail('user@domain').isValid).toBe(false)
    })

    it('blocks disposable and temporary email domains', () => {
      const disposable = ['tempmail.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'trashmail.com', 'yopmail.com']
      for (const domain of disposable) {
        const res = validateEmail(`traveler@${domain}`)
        expect(res.isValid).toBe(false)
        expect(res.error).toMatch(/Disposable and temporary email addresses are not accepted/i)
      }
    })

    it('blocks obvious fake test emails like test@test.com', () => {
      expect(validateEmail('test@test.com').isValid).toBe(false)
      expect(validateEmail('dummy@dummy.com').isValid).toBe(false)
    })
  })

  describe('Phone Number Verification', () => {
    it('accepts valid 10-digit mobile numbers with country codes', () => {
      expect(validatePhone('9876543210', '+91').isValid).toBe(true)
      expect(validatePhone('7046704693', '+91').isValid).toBe(true)
      expect(validatePhone('2025550188', '+1').isValid).toBe(true)
      expect(validatePhone('+919876543210').isValid).toBe(true)
    })

    it('rejects empty phone input', () => {
      const res = validatePhone('')
      expect(res.isValid).toBe(false)
      expect(res.error).toMatch(/Please enter your phone number/i)
    })

    it('rejects numbers that are too short or too long', () => {
      expect(validatePhone('12345').isValid).toBe(false)
      expect(validatePhone('12345678901234567').isValid).toBe(false)
    })

    it('blocks numbers with all identical digits (0000000000, 1111111111, 9999999999)', () => {
      expect(validatePhone('0000000000').isValid).toBe(false)
      expect(validatePhone('1111111111').isValid).toBe(false)
      expect(validatePhone('9999999999').isValid).toBe(false)
      expect(validatePhone('0000000000').error).toMatch(/cannot contain all identical digits/i)
    })

    it('blocks sequential ascending dummy numbers (1234567890)', () => {
      expect(validatePhone('1234567890').isValid).toBe(false)
      expect(validatePhone('0123456789').isValid).toBe(false)
      expect(validatePhone('1234567890').error).toMatch(/Sequential dummy phone numbers are not allowed/i)
    })
  })

  describe('Name Verification', () => {
    it('accepts genuine full names', () => {
      expect(validateName('Rahul Verma').isValid).toBe(true)
      expect(validateName('Mary Jane O\'Connor').isValid).toBe(true)
      expect(validateName('Jean-Luc Picard').isValid).toBe(true)
    })

    it('rejects empty or 1-character names', () => {
      expect(validateName('').isValid).toBe(false)
      expect(validateName('A').isValid).toBe(false)
    })

    it('rejects names with numbers or symbols', () => {
      expect(validateName('John123').isValid).toBe(false)
      expect(validateName('User@Trip').isValid).toBe(false)
    })

    it('blocks dummy placeholder names like asdf or qwerty', () => {
      expect(validateName('asdf').isValid).toBe(false)
      expect(validateName('qwerty').isValid).toBe(false)
      expect(validateName('testing').isValid).toBe(false)
    })
  })

  describe('Itinerary Download Validation Invariants', () => {
    it('enforces that invalid email domains cannot pass validation for itinerary leads', () => {
      const invalidEmails = ['fake@tempmail.com', 'test@test.com', 'admin@trashmail.com', 'bad@']
      for (const mail of invalidEmails) {
        expect(validateEmail(mail).isValid).toBe(false)
      }
    })

    it('enforces that dummy phone patterns cannot pass validation for itinerary leads', () => {
      const invalidPhones = ['1234567890', '0000000000', '1111111111', '9999999999', '123']
      for (const num of invalidPhones) {
        expect(validatePhone(num, '+91').isValid).toBe(false)
      }
    })
  })
})
