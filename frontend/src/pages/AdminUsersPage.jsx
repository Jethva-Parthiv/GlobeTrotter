import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/api/adminApi'
import ErrorState from '@/components/common/ErrorState'
import Pagination from '@/components/common/Pagination'
import SearchInput from '@/components/common/SearchInput'
import Skeleton from '@/components/common/Skeleton'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'
import useDebounce from '@/hooks/useDebounce'
import { formatDate } from '@/utils/dates'
import { getApiErrorMessage } from '@/utils/apiError'

const LIMIT = 20

export default function AdminUsersPage() {
  const [q, setQ] = useState('')
  const [offset, setOffset] = useState(0)
  const debouncedQ = useDebounce(q)
  const params = { q: debouncedQ || undefined, limit: LIMIT, offset }
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.adminUsers(params),
    queryFn: () => adminApi.users(params),
  })

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl">Users</h1>
        <Link to={ROUTES.adminDashboard} className="text-sm font-medium text-accent">
          Analytics
        </Link>
      </div>
      <div className="mt-6 max-w-md">
        <SearchInput
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setOffset(0)
          }}
          placeholder="Search name or email"
        />
      </div>
      {isLoading ? (
        <Skeleton className="mt-6 h-64" />
      ) : isError ? (
        <ErrorState className="mt-6" description={getApiErrorMessage(error)} onRetry={refetch} />
      ) : (
        <>
          <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-paper">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-sand text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Trips</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {(data.users || []).map((row) => (
                  <tr key={row.id} className="border-t border-line">
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="px-4 py-3">{row.trip_count}</td>
                    <td className="px-4 py-3">{formatDate(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination offset={offset} limit={LIMIT} total={data.total || 0} onChange={setOffset} />
        </>
      )}
    </div>
  )
}
