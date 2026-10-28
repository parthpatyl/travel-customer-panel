import { describe, it, expect, beforeEach } from 'vitest'
import { updatePageMeta, PAGE_TITLES } from '../utils/meta'

describe('Page Title & Social Meta Tag Automation', () => {
  beforeEach(() => {
    document.title = ''
    document.head.innerHTML = `
      <meta property="og:title" content="" />
      <meta property="twitter:title" content="" />
    `
  })

  it('updates document.title and og:title to "Kraft Your Trip | Luxury Travel Experiences" for home', () => {
    updatePageMeta('home')
    expect(document.title).toBe('Kraft Your Trip | Luxury Travel Experiences')
    expect(document.querySelector('meta[property="og:title"]').getAttribute('content')).toBe('Kraft Your Trip | Luxury Travel Experiences')
  })

  it('updates document.title and og:title for all primary site sections', () => {
    const expectations = [
      { page: 'destinations', expected: 'Kraft Your Trip | Destinations' },
      { page: 'detail', expected: 'Kraft Your Trip | Package Details' },
      { page: 'reviews', expected: 'Kraft Your Trip | Reviews' },
      { page: 'gallery', expected: 'Kraft Your Trip | Reviews' },
      { page: 'about', expected: 'Kraft Your Trip | About Us' },
      { page: 'corporate', expected: 'Kraft Your Trip | Corporate Travel' },
      { page: 'group-tours', expected: 'Kraft Your Trip | Group Tours' },
      { page: 'booking', expected: 'Kraft Your Trip | Plan Your Trip' },
      { page: 'luxury', expected: 'Kraft Your Trip | Luxury Experiences' },
      { page: 'enquiry', expected: 'Kraft Your Trip | Enquiry Status' },
    ]

    for (const { page, expected } of expectations) {
      updatePageMeta(page)
      expect(document.title).toBe(expected)
      expect(document.querySelector('meta[property="og:title"]').getAttribute('content')).toBe(expected)
      expect(document.querySelector('meta[property="twitter:title"]').getAttribute('content')).toBe(expected)
    }
  })
})
