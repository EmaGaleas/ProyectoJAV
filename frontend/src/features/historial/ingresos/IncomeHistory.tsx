import { useState, useEffect, useMemo } from 'react'
import { fetchHistorialIngresos } from './services/historialService'
import type { IngresoApi } from './services/historialService'
import { useAuthStore } from '../../auth/store/authStore'
import { IncomeTable } from './IncomeTable'
import { IncomeFilters, DEFAULT_FILTERS } from './IncomeFilters'
import type { Filters } from './IncomeFilters'
import { IncomeDetailModal } from './IncomeDetailModal'
import { useIsTablet } from './useBreakpoint'

export function IncomeHistory() {
  const { token } = useAuthStore()
  const isTablet  = useIsTablet()

  const [incomes,       setIncomes]       = useState<IngresoApi[]>([])
  const [isLoading,     setIsLoading]     = useState(true)
  const [fetchError,    setFetchError]    = useState<string | null>(null)
  const [search,        setSearch]        = useState('')
  const [filters,       setFilters]       = useState<Filters>(DEFAULT_FILTERS)
  const [activeFilters, setActiveFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selected,      setSelected]      = useState<IngresoApi | null>(null)
  const [filtersOpen,   setFiltersOpen]   = useState(false)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setFetchError(null)

    fetchHistorialIngresos(token ?? '')
      .then(data  => { if (!cancelled) setIncomes(data) })
      .catch(()   => { if (!cancelled) setFetchError('No se pudo cargar el historial de ingresos') })
      .finally(() => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [token])

  const filtered = useMemo(() =>
    incomes.filter(inc => {
      const q           = search.toLowerCase()
      const matchSearch = !search || inc.titular.toLowerCase().includes(q) || inc.dni.toLowerCase().includes(q)
      const matchType   = !activeFilters.tipoIngreso || inc.tipoIngreso === activeFilters.tipoIngreso
      const matchStatus = !activeFilters.estado      || inc.estado      === activeFilters.estado
      const incDate     = inc.fecha.split('T')[0]
      const matchFrom   = !activeFilters.dateFrom || incDate >= activeFilters.dateFrom
      const matchTo     = !activeFilters.dateTo   || incDate <= activeFilters.dateTo
      return matchSearch && matchType && matchStatus && matchFrom && matchTo
    }),
  [incomes, search, activeFilters])

  const handleApply = () => { setActiveFilters(filters); setFiltersOpen(false) }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span style={{ fontSize: 14, color: '#8EBFA3' }}>Cargando historial...</span>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center py-24">
        <span style={{ fontSize: 14, color: '#EF4444' }}>{fetchError}</span>
      </div>
    )
  }

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

      {selected && (
        <IncomeDetailModal income={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
