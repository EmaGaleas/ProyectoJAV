import { useMemo, useState } from 'react'
import { useIncomeHistorial } from './useIncomeHistorial'
import { useAuthStore } from '../../auth/store/authStore'
import { IncomeTable }       from './IncomeTable'
import { IncomeFilters, DEFAULT_FILTERS } from './IncomeFilters'
import type { Filters } from './IncomeFilters'
import { IncomeDetailModal } from './IncomeDetailModal'
import { useIsTablet }       from './useBreakpoint'

export function IncomeHistory() {
  const isTablet = useIsTablet()
  const { user } = useAuthStore()
  const userRole = user?.rol ?? 'Tesorero'

  const {
    records,
    loading,
    selected,
    setSelected,
    handleApprove,
    handleReject,
  } = useIncomeHistorial()

  const [search,        setSearch]        = useState('')
  const [filters,       setFilters]       = useState<Filters>(DEFAULT_FILTERS)
  const [filtersOpen,   setFiltersOpen]   = useState(false)

  const filtered = useMemo(() =>
    records.filter(inc => {
      const q = search.toLowerCase()
      const matchSearch = !search || inc.holderName.toLowerCase().includes(q) || inc.dni.toLowerCase().includes(q)
      const matchType   = !filters.paymentType || inc.paymentType === filters.paymentType
      const matchStatus = !filters.status      || inc.status      === filters.status
      const matchFrom   = !filters.dateFrom || inc.date >= filters.dateFrom
      const matchTo     = !filters.dateTo   || inc.date <= filters.dateTo
      return matchSearch && matchType && matchStatus && matchFrom && matchTo
    }),
  [records, search, filters])

  return (
    <div className="flex gap-5 items-stretch">
      <IncomeTable
        incomes={filtered}
        search={search}
        onSearchChange={setSearch}
        onViewDetail={setSelected}
        isTablet={isTablet}
        onToggleFilters={() => setFiltersOpen(p => !p)}
        filtersOpen={filtersOpen}
        loading={loading}
      />

      {isTablet ? (
        <>
          {filtersOpen && (
            <div className="fixed inset-0 z-30" style={{ background: 'rgba(0,0,0,0.25)' }}
              onClick={() => setFiltersOpen(false)} />
          )}
          <div className="fixed top-0 right-0 h-full z-40 p-4"
            style={{ width: 270, transform: filtersOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.25s ease', pointerEvents: filtersOpen ? 'auto' : 'none' }}>
            <IncomeFilters filters={filters} onChange={setFilters} />
          </div>
        </>
      ) : (
        <IncomeFilters filters={filters} onChange={setFilters} />
      )}

      {selected && (
        <IncomeDetailModal
          income={selected}
          userRole={userRole}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  )
}