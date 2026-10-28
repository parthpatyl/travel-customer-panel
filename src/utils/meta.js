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

export const updatePageMeta = (pageKey, customSectionTitle = null) => {
  if (typeof document === 'undefined') return

  const section = customSectionTitle || PAGE_TITLES[pageKey] || 'Luxury Travel Experiences'
  const fullTitle = `Kraft Your Trip | ${section}`

  document.title = fullTitle

  // Update Open Graph og:title
  let ogTitle = document.querySelector('meta[property="og:title"]')
  if (!ogTitle) {
    ogTitle = document.createElement('meta')
    ogTitle.setAttribute('property', 'og:title')
    document.head.appendChild(ogTitle)
  }
  ogTitle.setAttribute('content', fullTitle)

  // Update Twitter twitter:title
  let twTitle = document.querySelector('meta[name="twitter:title"], meta[property="twitter:title"]')
  if (!twTitle) {
    twTitle = document.createElement('meta')
    twTitle.setAttribute('property', 'twitter:title')
    document.head.appendChild(twTitle)
  }
  twTitle.setAttribute('content', fullTitle)
}
