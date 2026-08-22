import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cityApi } from '@/api/cityApi'
import CityCard from '@/components/cities/CityCard'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import Pagination from '@/components/common/Pagination'
import SearchInput from '@/components/common/SearchInput'
import Select from '@/components/common/Select'
import Skeleton from '@/components/common/Skeleton'
import { QUERY_KEYS } from '@/constants/queryKeys'
import useDebounce from '@/hooks/useDebounce'
import { getApiErrorMessage } from '@/utils/apiError'

const LIMIT = 12

export default function DiscoverCitiesPage() {
  const [searchParams] = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [sort, setSort] = useState('popularity')
  const [offset, setOffset] = useState(0)
  const debouncedQ = useDebounce(q)

  const params = {
    q: debouncedQ || undefined,
    country: country || undefined,
    region: region || undefined,
    sort,
    limit: LIMIT,
    offset,
  }

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.cities(params),
    queryFn: () => cityApi.list(params),
  })

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl">City discovery</h1>
      <p className="mt-2 text-sm text-muted">Find the next stop for your itinerary.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <SearchInput
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setOffset(0)
          }}
          placeholder="Search cities"
        />
        <InputFilter label="Country" value={country} onChange={setCountry} onOffset={setOffset} />
        <InputFilter label="Region" value={region} onChange={setRegion} onOffset={setOffset} />
        <Select
          id="city-sort"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value)
            setOffset(0)
          }}
        >
          <option value="popularity">Popularity</option>
          <option value="name">Name</option>
          <option value="cost_index">Cost index</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState className="mt-8" description={getApiErrorMessage(error)} onRetry={refetch} />
      ) : data?.cities?.length ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.cities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
          <Pagination offset={offset} limit={LIMIT} total={data.total} onChange={setOffset} />
        </>
      ) : (
        <EmptyState className="mt-8" title="No cities found" description="Try a different search or filter." />
      )}
    </div>
  )
}

function InputFilter({ label, value, onChange, onOffset }) {
  return (
    <input
      aria-label={label}
      placeholder={label}
      value={value}
      onChange={(e) => {
        onChange(e.target.value)
        onOffset(0)
      }}
      className="h-10 rounded-md border border-line bg-paper px-3 text-sm outline-none focus:ring-2 focus:ring-accent/20"
    />
  )
}
