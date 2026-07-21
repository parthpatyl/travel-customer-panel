export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const DEFAULT_FALLBACK_IMAGE = `${API_URL}/assets/unsplash-pkg-card.jpg`
export const DEFAULT_HERO_IMAGE = `${API_URL}/assets/unsplash-pkg-hero.jpg`

/**
 * Resolves an image URL safely with fallback support for empty/undefined strings
 */
export function getImgUrl(url, fallback = DEFAULT_FALLBACK_IMAGE) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`
  return `${API_URL}${cleanPath}`
}

/**
 * Image onError event handler preventing broken image displays and infinite retry loops
 */
export function handleImageError(e, fallback = DEFAULT_FALLBACK_IMAGE) {
  if (e.currentTarget.src !== fallback) {
    e.currentTarget.onerror = null
    e.currentTarget.src = fallback
  }
}
