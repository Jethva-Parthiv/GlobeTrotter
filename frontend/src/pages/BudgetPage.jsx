import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { budgetApi } from '@/api/budgetApi'
import ErrorState from '@/components/common/ErrorState'
import Skeleton from '@/components/common/Skeleton'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/dates'
import { getApiErrorMessage } from '@/utils/apiError'

const COLORS = ['#b4532a', '#3f3a33', '#2f6b4f', '#6f675d']

export default function BudgetPage() {
  const { tripId } = useParams()
  const budgetQuery = useQuery({
    queryKey: QUERY_KEYS.budget(tripId),
    queryFn: () => budgetApi.get(tripId),
  })
  const dailyQuery = useQuery({
    queryKey: QUERY_KEYS.dailyBudget(tripId),
    queryFn: () => budgetApi.daily(tripId),
  })

  if (budgetQuery.isLoading) return <Skeleton className="h-96" />
  if (budgetQuery.isError) {
    return <ErrorState description={getApiErrorMessage(budgetQuery.error)} onRetry={budgetQuery.refetch} />
  }

  const budget = budgetQuery.data
  const categoryData = [
    { name: 'Transport', value: budget.transport_total },
    { name: 'Stay', value: budget.stay_total },
    { name: 'Activities', value: budget.activity_total },
  ]
  const daily = dailyQuery.data || []

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Budget</h1>
          <p className="mt-1 text-sm text-muted">Figures come from the trip on the server — not a second calculation.</p>
        </div>
        <Link to={ROUTES.trip(tripId)} className="text-sm font-medium text-accent">
          Back to builder
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total" value={formatCurrency(budget.total_cost)} />
        <Stat label="Transport" value={formatCurrency(budget.transport_total)} />
        <Stat label="Accommodation" value={formatCurrency(budget.stay_total)} />
        <Stat label="Daily average" value={formatCurrency(budget.daily_average)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="min-w-0 rounded-lg border border-line bg-paper p-4">
          <h2 className="mb-4 font-display text-xl">Category breakdown</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="min-w-0 rounded-lg border border-line bg-paper p-4">
          <h2 className="mb-4 font-display text-xl">Daily cost trend</h2>
          <div className="h-64 w-full">
            {dailyQuery.isError ? (
              <ErrorState description={getApiErrorMessage(dailyQuery.error)} onRetry={dailyQuery.refetch} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4dbcd" />
                  <XAxis dataKey="date" tickFormatter={(v) => formatDate(v, 'd MMM')} fontSize={11} />
                  <YAxis tickFormatter={(v) => `₹${v}`} fontSize={11} width={56} />
                  <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={(v) => formatDate(v)} />
                  <Bar dataKey="cost" fill="#b4532a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      <section className="overflow-x-auto rounded-lg border border-line bg-paper">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="bg-sand text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Stop</th>
              <th className="px-4 py-3 font-medium">Transport</th>
              <th className="px-4 py-3 font-medium">Stay</th>
              <th className="px-4 py-3 font-medium">Activities</th>
              <th className="px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {(budget.per_stop || []).map((row) => (
              <tr key={row.stop_id} className="border-t border-line">
                <td className="px-4 py-3">{row.city_name}</td>
                <td className="px-4 py-3">{formatCurrency(row.transport_cost)}</td>
                <td className="px-4 py-3">{formatCurrency(row.stay_cost)}</td>
                <td className="px-4 py-3">{formatCurrency(row.activity_cost)}</td>
                <td className="px-4 py-3 font-medium">{formatCurrency(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4 shadow-card">
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-2 font-display text-2xl">{value}</p>
    </div>
  )
}
