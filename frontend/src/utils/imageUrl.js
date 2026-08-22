/**
 * Helper to resolve image paths (both external URLs and local backend /uploads/ paths)
 * @param {string} pathOrUrl
 * @returns {string}
 */
export function getImageUrl(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') {
    return ''
  }

  const trimmed = pathOrUrl.trim()
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed
  }

  const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${apiBase}${cleanPath}`
}
