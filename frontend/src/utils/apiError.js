export function getApiErrorMessage(error) {
  const status = error?.response?.status
  const detail = error?.response?.data?.detail

  if (typeof detail === 'string' && detail.trim()) return detail

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => item?.msg || item?.message || item?.detail)
      .filter(Boolean)
    if (messages.length) return messages.join('. ')
  }

  if (detail && typeof detail === 'object' && detail.msg) return detail.msg

  if (status === 401) return 'Please log in to continue.'
  if (status === 403) return 'You do not have permission to do that.'
  if (status === 404) return 'We could not find that.'
  if (status === 409) return 'This conflicts with existing data.'
  if (status === 422) return 'Please check the form and try again.'
  if (status >= 500) return 'The server had a problem. Please try again.'

  return 'Something went wrong. Please try again.'
}
