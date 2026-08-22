import Skeleton from '@/components/common/Skeleton'

export default function TripCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-paper">
      <Skeleton className="h-44 w-full" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}
