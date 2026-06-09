import { useIncomeHistorial } from './useIncomeHistorial'
import { IncomeTable } from './IncomeTable'
import { IncomeFilters } from './IncomeFilters'
import { IncomeDetailModal } from './IncomeDetailModal'
import { useIsTablet } from './useBreakpoint'

export function IncomeHistory() {
  const isTablet = useIsTablet()

  const {
    filtered,
    selected,
    detail,
    detailLoading,
    search,
    setSearch,
    filters,
    setFilters,
    filtersOpen,
    setFiltersOpen,
    setSelected,
    handleApply,
    handleClose,
  } = useIncomeHistorial()

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
        <IncomeDetailModal
          receiptNumber={selected.receiptNumber}
          detail={detail}
          isLoading={detailLoading}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
