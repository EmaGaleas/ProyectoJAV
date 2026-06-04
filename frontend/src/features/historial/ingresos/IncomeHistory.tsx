import { useState, useMemo } from 'react'
import { MOCK_INCOMES } from './data/mockdata'
import type { Income } from './data/mockdata'
import { IncomeTable } from './IncomeTable'
import { IncomeFilters, DEFAULT_FILTERS } from './IncomeFilters'
import type { Filters } from './IncomeFilters'
import { IncomeDetailModal } from './IncomeDetailModal'
import { useIsTablet } from './useBreakpoint'

export function IncomeHistory() {
  const isTablet = useIsTablet()

  const [search,        setSearch]        = useState('')
  const [filters,       setFilters]       = useState<Filters>(DEFAULT_FILTERS)
  const [activeFilters, setActiveFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selected,      setSelected]      = useState<Income | null>(null)
  const [filtersOpen,   setFiltersOpen]   = useState(false)

  const filtered = useMemo(() =>
    MOCK_INCOMES.filter(inc => {
      const q = search.toLowerCase()
      const matchSearch = !search || inc.holderName.toLowerCase().includes(q) || inc.dni.toLowerCase().includes(q)
      const matchType   = !activeFilters.paymentType || inc.paymentType === activeFilters.paymentType
      const matchStatus = !activeFilters.status      || inc.status      === activeFilters.status
      const matchFrom   = !activeFilters.dateFrom || inc.date >= activeFilters.dateFrom
      const matchTo     = !activeFilters.dateTo   || inc.date <= activeFilters.dateTo
      return matchSearch && matchType && matchStatus && matchFrom && matchTo
    }),
  [search, activeFilters])

  const handleApply = () => { setActiveFilters(filters); setFiltersOpen(false) }

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
      />

      {isTablet ? (
        <>
          {filtersOpen && (
            <div className="fixed inset-0 z-30" style={{ background: 'rgba(0,0,0,0.25)' }}
              onClick={() => setFiltersOpen(false)} />
          )}
          <div className="fixed top-0 right-0 h-full z-40 p-4" style={{ width: 270, transform: filtersOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.25s ease', pointerEvents: filtersOpen ? 'auto' : 'none' }}>
            <IncomeFilters filters={filters} onChange={setFilters} onApply={handleApply} />
          </div>
        </>
      ) : (
        <IncomeFilters filters={filters} onChange={setFilters} onApply={handleApply} />
      )}

      {selected && <IncomeDetailModal income={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
