import { useState } from 'react'
import { cn } from '@/utils/cn'
import { getImageUrl } from '@/utils/imageUrl'

export default function CoverImage({ src, alt = '', className }) {
  const [failed, setFailed] = useState(false)
  const resolvedSrc = getImageUrl(src)
  const showFallback = !resolvedSrc || failed

  if (showFallback) {
    return (
      <div
        className={cn('bg-sand', className)}
        role="img"
        aria-label={alt || 'No image'}
      />
    )
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={cn('object-cover', className)}
      onError={() => setFailed(true)}
    />
  )
}

