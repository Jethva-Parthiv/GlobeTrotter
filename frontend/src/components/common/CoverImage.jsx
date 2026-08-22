import { useState } from 'react'
import { cn } from '@/utils/cn'

export default function CoverImage({ src, alt = '', className }) {
  const [failed, setFailed] = useState(false)
  const showFallback = !src || failed

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
      src={src}
      alt={alt}
      className={cn('object-cover', className)}
      onError={() => setFailed(true)}
    />
  )
}
