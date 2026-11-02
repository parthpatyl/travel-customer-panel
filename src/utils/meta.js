/**
 * Dynamically updates document.title and social Open Graph / Twitter meta tags
 * following the "Kraft Your Trip | [Section]" standard.
 */
export const PAGE_TITLES = {
  home: 'Luxury Travel Experiences',
  destinations: 'Destinations',
  detail: 'Package Details',
  gallery: 'Reviews',
  reviews: 'Reviews',
  about: 'About Us',
  corporate: 'Corporate Travel',
  'group-tours': 'Group Tours',
  booking: 'Plan Your Trip',
  luxury: 'Luxury Experiences',
  enquiry: 'Enquiry Status'
}

export const updatePageMeta = (pageKey, customSectionTitle = null, details = {}) => {
  if (typeof document === 'undefined') return

  const section = details.title || customSectionTitle || PAGE_TITLES[pageKey] || 'Luxury Travel Experiences'
  const fullTitle = details.title ? `${details.title} | Kraft Your Trip` : `Kraft Your Trip | ${section}`

  document.title = fullTitle

  // Helper to get or create a meta tag
  const setMetaTag = (attributeName, attributeValue, content) => {
    if (!content) return
    let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute(attributeName, attributeValue)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }

  // Titles
  setMetaTag('property', 'og:title', fullTitle)
  setMetaTag('name', 'twitter:title', fullTitle)
  setMetaTag('property', 'twitter:title', fullTitle)

  // Description
  const desc = details.description || 'Discover handcrafted luxury journeys and bespoke travel experiences with Kraft Your Trip.'
  setMetaTag('name', 'description', desc)
  setMetaTag('property', 'og:description', desc)
  setMetaTag('name', 'twitter:description', desc)
  setMetaTag('property', 'twitter:description', desc)

  // Image
  if (details.image) {
    setMetaTag('property', 'og:image', details.image)
    setMetaTag('name', 'twitter:image', details.image)
    setMetaTag('property', 'twitter:image', details.image)
    setMetaTag('name', 'twitter:card', 'summary_large_image')
  }

  // URL
  const currentUrl = details.url || (typeof window !== 'undefined' ? window.location.href : '')
  if (currentUrl) {
    setMetaTag('property', 'og:url', currentUrl)
  }
}
