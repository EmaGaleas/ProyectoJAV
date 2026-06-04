import { useState } from 'react'
import { useEgresoHistorial }  from './useEgresoHistorial'
import { EgresoTabs }          from './EgresoTabs'
import { EgresoTable }         from './EgresoTable'
import { EgresoFilters }       from './EgresoFilters'
import { EgresoDetailModal }   from './EgresoDetailModal'
import { useIsTablet }         from './useBreakpoint'
import { TAB_META }            from './types'
import type { UserRole }       from './types'

interface Props {
  userRole?: UserRole
}

export default function HistorialEgresos({ userRole = 'Tesorero' }: Props) {
  const isTablet = useIsTablet()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const {
    filtered,
    counts,
    activeTab,
    page,
    selected,
    stagedFilters,
    setPage,
    setSelected,
    setStagedFilters,
    handleTabChange,
    handleApply,
    handleApprove,
  } = useEgresoHistorial()

  const handleApplyAndClose = () => {
    handleApply()
    setFiltersOpen(false)
  }

  return (
    <div className="bg-[#f2f2f2] w-11/12 p-6 md:p-2 flex flex-col gap-5" data-name="Historial Egresos">
      <EgresoTabs
        tabs={TAB_META}
        active={activeTab}
        counts={counts}
        onSelect={tab => { handleTabChange(tab); setFiltersOpen(false) }}
      />

      {/* Table + Filter panel */}
      <div className="flex gap-5 items-stretch">
        <EgresoTable
          records={filtered}
          page={page}
          onPage={setPage}
          onDetails={setSelected}
          isTablet={isTablet}
          onToggleFilters={() => setFiltersOpen(p => !p)}
        />

        {isTablet ? (
          <>
            {filtersOpen && (
              <div
                className="fixed inset-0 z-30"
                style={{ background: 'rgba(0,0,0,0.25)' }}
                onClick={() => setFiltersOpen(false)}
              />
            )}
            <div
              className="fixed top-0 right-0 h-full z-40 p-4"
              style={{
                width:       270,
                transform:   filtersOpen ? 'translateX(0)' : 'translateX(100%)',
                transition:  'transform 0.25s ease',
                pointerEvents: filtersOpen ? 'auto' : 'none',
              }}
            >
              <EgresoFilters
                filters={stagedFilters}
                onChange={setStagedFilters}
                onApply={handleApplyAndClose}
              />
            </div>
          </>
        ) : (
          <EgresoFilters
            filters={stagedFilters}
            onChange={setStagedFilters}
            onApply={handleApply}
          />
        )}
      </div>

      {selected && (
        <EgresoDetailModal
          record={selected}
          userRole={userRole}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
        />
      )}
    </div>
  )
}
