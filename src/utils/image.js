export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
export const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80'

/**
 * Resolves an image URL safely with fallback support for empty/undefined strings
 */
export function getImgUrl(url, fallback = DEFAULT_FALLBACK_IMAGE) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
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
