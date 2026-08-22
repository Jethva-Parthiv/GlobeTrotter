import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { adminApi } from '@/api/adminApi'
import ErrorState from '@/components/common/ErrorState'
import Skeleton from '@/components/common/Skeleton'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'
import { getApiErrorMessage } from '@/utils/apiError'

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.adminAnalytics,
    queryFn: adminApi.analytics,
  })

  if (isLoading) return <Skeleton className="h-96" />
  if (isError) return <ErrorState description={getApiErrorMessage(error)} onRetry={refetch} />

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Admin analytics</h1>
          <p className="mt-1 text-sm text-muted">Platform-wide usage from the API.</p>
        </div>
        <Link to={ROUTES.adminUsers} className="text-sm font-medium text-accent">
          Manage users
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Users" value={data.total_users} />
        <Stat label="Trips" value={data.total_trips} />
        <Stat label="Public trips" value={data.total_public_trips} />
        <Stat label="Trips last 7 days" value={data.trips_created_last_7_days} />
      </div>
      <p className="text-sm text-muted">Average stops per trip: {data.avg_stops_per_trip}</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Popular cities" data={(data.top_cities || []).map((c) => ({ name: c.city_name, count: c.times_added }))} />
        <ChartCard title="Popular activities" data={(data.top_activities || []).map((a) => ({ name: a.activity_name, count: a.times_added }))} />
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4 shadow-card">
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  )
}

function ChartCard({ title, data }) {
  return (
    <section className="min-w-0 rounded-lg border border-line bg-paper p-4">
      <h2 className="mb-4 font-display text-xl">{title}</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4dbcd" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={110} fontSize={11} />
            <Tooltip />
            <Bar dataKey="count" fill="#b4532a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
