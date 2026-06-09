import { useState } from 'react'
import type { Income } from './types'
import { L, fmtDate } from './types'

const PAGE_SIZE = 9
const ROW_H     = 49

// Dirección SIEMPRE en 3 columnas separadas (Calle / Bloque / Lote)
const COLS_DESKTOP = {
  template: '110px 130px 1fr 140px 95px 95px 110px 95px',
  headers:  ['N° Comprobante', 'Tipo de Ingreso', 'Titular', 'DNI', 'Fecha', 'Monto', 'Estado', ''],
}
const COLS_TABLET = {
  template: '105px 1fr 130px 82px 80px 105px 88px',
  headers:  ['N° Comprobante', 'Titular', 'DNI', 'Fecha', 'Monto', 'Estado', ''],
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  'Procesado':   { bg: '#EBF5EF', color: '#308C58' },
  'En revisión': { bg: '#FEF9EC', color: '#B45309' },
  'Rechazado':   { bg: '#FEF2F2', color: '#DC2626' },
}

interface Props {
  incomes: Income[]
  search: string
  onSearchChange: (v: string) => void
  onViewDetail: (income: Income) => void
  isTablet: boolean
  onToggleFilters: () => void
  filtersOpen: boolean
}

export function IncomeTable({ incomes, search, onSearchChange, onViewDetail, isTablet, onToggleFilters, filtersOpen }: Props) {
  const [page, setPage] = useState(0)

  const cols       = isTablet ? COLS_TABLET : COLS_DESKTOP
  const totalPages = Math.max(1, Math.ceil(incomes.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages - 1)
  const pageItems  = incomes.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)
  const slots      = Array.from({ length: PAGE_SIZE }).map((_, i) => pageItems[i] ?? null)
  const colSpan    = isTablet ? 7 : 8

  return (
    <div className="flex flex-col gap-4 flex-1 min-w-0">

      {/* Barra de búsqueda */}
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={e => { onSearchChange(e.target.value); setPage(0) }}
          placeholder="Buscar por cliente o DNI..."
          className="flex-1 h-10 px-4 text-sm rounded-xl border border-[rgba(0,0,0,0.12)] bg-white focus:outline-none focus:ring-2 focus:ring-[#308C58] focus:ring-opacity-30"
        />
        <button className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 40, height: 40, background: '#308C58' }}>
          <div style={{ width: 16, height: 16, background: '#fff', borderRadius: 3 }} />
        </button>
        {isTablet && (
          <button
            onClick={onToggleFilters}
            className="flex items-center gap-2 px-3 rounded-xl shrink-0 border transition-colors"
            style={{ height: 40, borderColor: filtersOpen ? '#308C58' : 'rgba(0,0,0,0.12)', background: filtersOpen ? '#F0FAF4' : '#fff', fontSize: 13, fontWeight: 600, color: filtersOpen ? '#308C58' : '#555' }}
          >
            <div style={{ width: 13, height: 13, background: filtersOpen ? '#308C58' : '#8EBFA3', borderRadius: 3 }} />
            Filtros
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="grid shrink-0 border-b border-[rgba(0,0,0,0.07)]" style={{ gridTemplateColumns: cols.template }}>
          {cols.headers.map(col => (
            <div key={col} className="px-3 py-3">
              <span style={{ fontSize: isTablet ? 10 : 11, fontWeight: 700, color: '#8EBFA3', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {col}
              </span>
            </div>
          ))}
        </div>

        {/* 9 filas fijas */}
        <div className="flex flex-col flex-1">
          {slots.map((inc, i) => (
            <div
              key={inc ? inc.id : `empty-${i}`}
              className={`grid ${inc ? 'hover:bg-[#F8FDFB]' : ''} transition-colors`}
              style={{ gridTemplateColumns: cols.template, height: ROW_H, borderBottom: i < PAGE_SIZE - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
            >
              {inc ? (
                <>
                  <Cell text={inc.receiptNumber} bold isTablet={isTablet} />
                  {/* Tipo de ingreso: solo en desktop */}
                  {!isTablet && <Cell text={inc.paymentType} isTablet={false} />}
                  <Cell text={inc.holderName} isTablet={isTablet} />
                  <Cell text={inc.dni} isTablet={isTablet} />
                  <Cell text={fmtDate(inc.date)} isTablet={isTablet} />
                  <Cell text={L(inc.total)} isTablet={isTablet} />
                  <div className="px-3 flex items-center">
                    <StatusBadge status={inc.status} />
                  </div>
                  <div className="px-3 flex items-center">
                    <button
                      onClick={() => onViewDetail(inc)}
                      style={{ fontSize: isTablet ? 11 : 12, fontWeight: 600, color: '#308C58', whiteSpace: 'nowrap' }}
                      className="hover:underline"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ gridColumn: `1 / ${colSpan + 1}` }} />
              )}
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(0,0,0,0.06)] shrink-0" style={{ background: '#FAFAFA' }}>
          <span style={{ fontSize: 11, color: '#8EBFA3' }}>
            {incomes.length === 0
              ? 'Sin resultados'
              : `${safePage * PAGE_SIZE + 1}–${Math.min((safePage + 1) * PAGE_SIZE, incomes.length)} de ${incomes.length} registros`}
          </span>
          <div className="flex items-center gap-0.5">
            <PageBtn onClick={() => setPage(0)}               disabled={safePage === 0}>«</PageBtn>
            <PageBtn onClick={() => setPage(p => p - 1)}     disabled={safePage === 0}>‹</PageBtn>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PageBtn key={i} onClick={() => setPage(i)} disabled={false} active={i === safePage}>{i + 1}</PageBtn>
            ))}
            <PageBtn onClick={() => setPage(p => p + 1)}     disabled={safePage === totalPages - 1}>›</PageBtn>
            <PageBtn onClick={() => setPage(totalPages - 1)} disabled={safePage === totalPages - 1}>»</PageBtn>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── sub-componentes locales ──────────────────────────────────────────────────

function Cell({ text, bold, isTablet }: { text: string; bold?: boolean; isTablet: boolean }) {
  return (
    <div className="px-3 flex items-center overflow-hidden">
      <span className="truncate" style={{ fontSize: isTablet ? 12 : 13, color: '#1A1A1A', fontWeight: bold ? 600 : 400 }}>
        {text}
      </span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE['En revisión']
  return (
    <span className="rounded-full whitespace-nowrap"
      style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', background: s.bg, color: s.color }}>
      {status}
    </span>
  )
}

function PageBtn({ onClick, disabled, active, children }: { onClick: () => void; disabled: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="flex items-center justify-center rounded-lg transition-colors disabled:opacity-30"
      style={{ width: 26, height: 26, fontSize: 12, fontWeight: active ? 700 : 400, background: active ? '#308C58' : 'transparent', color: active ? '#fff' : '#555' }}>
      {children}
    </button>
  )
}
