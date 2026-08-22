import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function SearchInput({
  id,
  value,
  onChange,
  placeholder = 'Search',
  className,
  ...props
}) {
  return (
    <div className={cn('relative w-full', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-line bg-paper pr-3 pl-9 text-sm text-ink outline-none placeholder:text-muted/80 focus:border-ink/30 focus:ring-2 focus:ring-accent/20"
        {...props}
      />
    </div>
  )
}
