import { cn } from '@/utils/cn'
import { getImageUrl } from '@/utils/imageUrl'

export default function Avatar({ src, alt = '', name = '', size = 'md', className }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  const resolvedSrc = getImageUrl(src)

  if (resolvedSrc) {
    return (
      <img
        src={resolvedSrc}
        alt={alt || name}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    )
  }


  return (
    <div
      aria-hidden={!name}
      className={cn(
        'flex items-center justify-center rounded-full bg-accent-soft font-medium text-accent',
        sizes[size],
        className,
      )}
    >
      {initials || 'GT'}
    </div>
  )
}
