import { useIncomeHistory }  from './useIncomeHistory'
import { IncomeTable }       from './IncomeTable'
import { IncomeFilters }     from './IncomeFilters'
import { IncomeDetailModal } from './IncomeDetailModal'
import { useIsTablet }       from './useBreakpoint'

export function IncomeHistory() {
  const isTablet = useIsTablet()

  const {
    filtered,
    isLoading,
    search,
    setSearch,
    filters,
    setFilters,
    selected,
    setSelected,
    filtersOpen,
    setFiltersOpen,
    handleApply,
    handleApprove,
    handleReject,
  } = useIncomeHistory()

  if (isLoading) return (
    <div className="flex items-center justify-center w-full py-20">
      <span className="text-sm text-[#8EBFA3]">Cargando historial...</span>
    </div>
  )

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
          <div className="fixed top-0 right-0 h-full z-40 p-4"
            style={{ width: 270, transform: filtersOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.25s ease', pointerEvents: filtersOpen ? 'auto' : 'none' }}>
            <IncomeFilters filters={filters} onChange={setFilters} onApply={handleApply} />
          </div>
        </>
      ) : (
        <IncomeFilters filters={filters} onChange={setFilters} onApply={handleApply} />
      )}

      {selected && (
        <IncomeDetailModal
          income={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  )
}