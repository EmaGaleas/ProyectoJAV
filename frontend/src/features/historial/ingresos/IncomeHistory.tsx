import { useState, useMemo, useEffect } from 'react'
import type { Income, PaymentType, IncomeStatus, InvoiceLine } from './data/mockdata'
import { IncomeTable } from './IncomeTable'
import { IncomeFilters, DEFAULT_FILTERS } from './IncomeFilters'
import type { Filters } from './IncomeFilters'
import { IncomeDetailModal } from './IncomeDetailModal'
import { useIsTablet } from './useBreakpoint'
import { apiFetch } from '../../../services/apiClient'
import { useAuthStore } from '../../auth/store/authStore'

// Forma en que llega la respuesta del backend
interface PagoHistorialAPI {
  id:                  number
  codigo:              string
  titular:             string
  dni:                 string
  tipoIngreso:         string
  fecha:               string
  total:               number
  estado:              string
  metodoPago:          string
  codigoTransferencia: string | null
  lineas: {
    concepto:   string
    fechaVence: string
    monto:      number
    mora:       number
    tipo:       string
  }[]
}

function mapToIncome(e: PagoHistorialAPI): Income {
  const lines: InvoiceLine[] = e.lineas.map((l, i) => ({
    id:         `${e.id}-${i}`,
    concept:    l.concepto,
    dueDate:    l.fechaVence || '',
    baseAmount: l.monto,
    mora:       l.mora,
    type:       l.tipo as 'mensualidad' | 'multa',
  }))

  return {
    id:            String(e.id),
    receiptNumber: e.codigo,
    holderName:    e.titular,
    dni:           e.dni,
    paymentType:   e.tipoIngreso as PaymentType,
    date:          e.fecha,
    total:         e.total,
    status:        e.estado as IncomeStatus,
    payMethod:     e.metodoPago as 'Efectivo' | 'Transferencia',
    transferCode:  e.codigoTransferencia ?? undefined,
    street:        '',
    block:         '',
    lot:           '',
    lines,
  }
}

export function IncomeHistory() {
  const isTablet       = useIsTablet()
  const { token }      = useAuthStore()

  const [incomes,       setIncomes]       = useState<Income[]>([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [filters,       setFilters]       = useState<Filters>(DEFAULT_FILTERS)
  const [activeFilters, setActiveFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selected,      setSelected]      = useState<Income | null>(null)
  const [filtersOpen,   setFiltersOpen]   = useState(false)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    apiFetch<PagoHistorialAPI[]>('/api/pagos/historial', {}, token)
      .then(data => setIncomes(data.map(mapToIncome)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  const filtered = useMemo(() =>
    incomes.filter(inc => {
      const q = search.toLowerCase()
      const matchSearch = !search || inc.holderName.toLowerCase().includes(q) || inc.dni.toLowerCase().includes(q)
      const matchType   = !activeFilters.paymentType || inc.paymentType === activeFilters.paymentType
      const matchStatus = !activeFilters.status      || inc.status      === activeFilters.status
      const matchFrom   = !activeFilters.dateFrom || inc.date >= activeFilters.dateFrom
      const matchTo     = !activeFilters.dateTo   || inc.date <= activeFilters.dateTo
      return matchSearch && matchType && matchStatus && matchFrom && matchTo
    }),
  [incomes, search, activeFilters])

  const handleApply = () => { setActiveFilters(filters); setFiltersOpen(false) }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span style={{ fontSize: 14, color: '#8EBFA3' }}>Cargando historial…</span>
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

      {selected && <IncomeDetailModal income={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
