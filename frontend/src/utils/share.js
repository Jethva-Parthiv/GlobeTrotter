export async function shareOrCopy(url, title) {
  if (navigator.share) {
    await navigator.share({ title, url })
    return 'shared'
  }

  await navigator.clipboard.writeText(url)
  return 'copied'
}
