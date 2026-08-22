/**
 * Copy text to clipboard with fallback for non-secure / HTTP contexts
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback using textarea execCommand
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    textArea.remove()
    return successful
  } catch {
    textArea.remove()
    return false
  }
}

/**
 * Share via native dialog or copy link to clipboard
 * @param {string} url
 * @param {string} title
 * @returns {Promise<'shared' | 'copied'>}
 */
export async function shareOrCopy(url, title) {
  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`

  if (navigator.share) {
    try {
      await navigator.share({ title: title || 'GlobeTrotter Itinerary', url: fullUrl })
      return 'shared'
    } catch (e) {
      if (e.name !== 'AbortError') {
        await copyToClipboard(fullUrl)
        return 'copied'
      }
      throw e
    }
  }

  await copyToClipboard(fullUrl)
  return 'copied'
}
