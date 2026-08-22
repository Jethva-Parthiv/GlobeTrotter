import { cn } from '@/utils/cn'

export default function Card({ as: Component = 'div', className, children, ...props }) {
  return (
    <Component
      className={cn(
        'shadow-card rounded-lg border border-line bg-paper p-5',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
