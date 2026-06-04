import type { EgresoRecord } from './types'
import { L, fmtDate } from './types'

const PAGE_SIZE = 9

const COLS = '130px 1fr 140px 95px 110px 1fr 110px'
const COL_COUNT = 7
const MIN_TABLE_WIDTH = 860

interface HeaderCellProps { children: React.ReactNode; center?: boolean }
function HeaderCell({ children, center }: HeaderCellProps) {
  return (
    <div
      className="py-3 px-3 text-xs font-semibold text-[#8EBFA3] uppercase tracking-wide shrink-0"
      style={{ textAlign: center ? 'center' : 'left' }}
    >
      {children}
    </div>
  )
}

interface PageBtnProps { label: string; active?: boolean; disabled?: boolean; onClick: () => void }
function PageBtn({ label, active, disabled, onClick }: PageBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded flex items-center justify-center text-sm transition-colors"
      style={{
        background: active ? '#308C58' : 'transparent',
        color:      active ? '#fff' : disabled ? '#d1d5db' : '#374151',
        cursor:     disabled ? 'default' : 'pointer',
        border:     'none',
      }}
    >
      {label}
    </button>
  )
}

interface Props {
  records:        EgresoRecord[]
  page:           number
  onPage:         (p: number) => void
  onDetails:      (r: EgresoRecord) => void
  isTablet:       boolean
  onToggleFilters: () => void
}

export function EgresoTable({ records, page, onPage, onDetails, isTablet, onToggleFilters }: Props) {
  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE))
  const pageItems  = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const slots      = Array.from({ length: PAGE_SIZE }).map((_, i) => pageItems[i] ?? null)

  return (
    <div className="flex flex-col gap-3 flex-1 min-w-0">
      {/* Search / tablet filter toggle bar */}
      {isTablet && (
        <div className="flex justify-end">
          <button
            onClick={onToggleFilters}
            className="px-4 py-2 rounded-[10px] text-sm font-medium transition-colors"
            style={{ background: '#308C58', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Filtros
          </button>
        </div>
      )}

      {/* Table with horizontal scroll */}
      <div className="bg-white rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-x-auto">
        <div style={{ minWidth: MIN_TABLE_WIDTH }}>
          {/* Header */}
          <div
            className="grid border-b border-[#e5e7eb]"
            style={{ gridTemplateColumns: COLS }}
          >
            <HeaderCell>Código</HeaderCell>
            <HeaderCell>Registrado por</HeaderCell>
            <HeaderCell>DNI</HeaderCell>
            <HeaderCell>Fecha</HeaderCell>
            <HeaderCell center>Monto</HeaderCell>
            <HeaderCell>Receptor de pago</HeaderCell>
            <HeaderCell center>Acción</HeaderCell>
          </div>

          {/* Rows */}
          {slots.map((r, i) => (
            r ? (
              <div
                key={r.id}
                className="grid border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors"
                style={{ gridTemplateColumns: COLS }}
              >
                <div className="py-3 px-3 text-sm text-[#374151] font-medium shrink-0">{r.codigoEgreso}</div>
                <div className="py-3 px-3 text-sm text-[#374151] shrink-0">{r.registradoPor}</div>
                <div className="py-3 px-3 text-sm text-[#6b7280] shrink-0">{r.dni}</div>
                <div className="py-3 px-3 text-sm text-[#6b7280] shrink-0">{fmtDate(r.fecha)}</div>
                <div className="py-3 px-3 text-sm text-[#374151] text-center shrink-0">{L(r.monto)}</div>
                <div className="py-3 px-3 text-sm text-[#374151] shrink-0">{r.receptorPago}</div>
                <div className="py-3 px-3 flex justify-center shrink-0">
                  <button
                    onClick={() => onDetails(r)}
                    className="text-xs font-medium px-3 py-1 rounded-full transition-colors"
                    style={{ background: '#e6f3ec', color: '#308C58', border: 'none', cursor: 'pointer' }}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={`empty-${i}`}
                className="border-b border-[#f3f4f6]"
                style={{ gridColumn: `1 / ${COL_COUNT + 1}`, height: '45px' }}
              />
            )
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-[#9ca3af]">
          {records.length} registro{records.length !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-1">
          <PageBtn label="«" disabled={page === 1}          onClick={() => onPage(1)} />
          <PageBtn label="‹" disabled={page === 1}          onClick={() => onPage(page - 1)} />
          {Array.from({ length: totalPages }).map((_, i) => (
            <PageBtn
              key={i + 1}
              label={String(i + 1)}
              active={page === i + 1}
              onClick={() => onPage(i + 1)}
            />
          ))}
          <PageBtn label="›" disabled={page === totalPages} onClick={() => onPage(page + 1)} />
          <PageBtn label="»" disabled={page === totalPages} onClick={() => onPage(totalPages)} />
        </div>
      </div>
    </div>
  )
}
