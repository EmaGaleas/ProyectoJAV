import { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { apiFetch } from '../../../services/apiClient'
import { useAuthStore } from '../../auth/store/authStore'
import type { Income, IncomeFilters, IncomeStatus } from './types'

export const DEFAULT_FILTERS: IncomeFilters = {
  paymentType: '',
  status:      '',
  dateFrom:    '',
  dateTo:      '',
}

// ─── Mapper: IngresoResponse del back → Income del front ─────────────────────
// Ajusta los campos cuando tengas el DTO exacto del back
function mapIncome(raw: any): Income {
  return {
    id:            String(raw.idPago),
    receiptNumber: `C-${String(raw.idPago).padStart(2, '0')}`,
    holderName:    raw.nombreTitular   ?? '',
    dni:           raw.dni             ?? '',
    paymentType:   raw.tipoPago        ?? 'Mensualidad',
    date:          raw.fechaPago?.split('T')[0] ?? '',
    total:         raw.monto           ?? 0,
    status:        raw.estado          ?? 'En revisión',
    payMethod:     raw.metodoPago      ?? 'Efectivo',
    transferCode:  raw.codigoComprobante ? String(raw.codigoComprobante) : undefined,
    street:        raw.calle           ?? '',
    block:         raw.bloque          ?? '',
    lot:           raw.lote            ?? '',
    lines:         (raw.lineas ?? []).map((l: any) => ({
      id:         String(l.id),
      concept:    l.concepto    ?? '',
      dueDate:    l.vencimiento?.split('T')[0] ?? '',
      baseAmount: l.montoBase   ?? 0,
      mora:       l.mora        ?? 0,
      type:       l.tipo        ?? 'mensualidad',
    })),
  }
}

export function useIncomeHistory() {
  const { token, user } = useAuthStore()
  const userName = user?.nombre ?? 'Administrador'

  const [records,       setRecords]       = useState<Income[]>([])
  const [isLoading,     setIsLoading]     = useState(false)
  const [search,        setSearch]        = useState('')
  const [filters,       setFilters]       = useState<IncomeFilters>(DEFAULT_FILTERS)
  const [activeFilters, setActiveFilters] = useState<IncomeFilters>(DEFAULT_FILTERS)
  const [selected,      setSelected]      = useState<Income | null>(null)
  const [filtersOpen,   setFiltersOpen]   = useState(false)

  // ── Fetch inicial ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchIncomes()
  }, [])

  const fetchIncomes = async () => {
    setIsLoading(true)
    try {
      const data = await apiFetch<any[]>('/api/Pagos', {}, token ?? undefined)
      setRecords(data.map(mapIncome))
    } catch {
      toast.error('No se pudo cargar el historial de ingresos.')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Filtrado local ────────────────────────────────────────────────────────
  const filtered = useMemo(() =>
    records.filter(inc => {
      const q = search.toLowerCase()
      const matchSearch = !search ||
        inc.holderName.toLowerCase().includes(q) ||
        inc.dni.toLowerCase().includes(q)
      const matchType   = !activeFilters.paymentType || inc.paymentType === activeFilters.paymentType
      const matchStatus = !activeFilters.status      || inc.status      === activeFilters.status
      const matchFrom   = !activeFilters.dateFrom    || inc.date >= activeFilters.dateFrom
      const matchTo     = !activeFilters.dateTo      || inc.date <= activeFilters.dateTo
      return matchSearch && matchType && matchStatus && matchFrom && matchTo
    }),
  [records, search, activeFilters])

  // ── Aprobar ───────────────────────────────────────────────────────────────
  const handleApprove = async (id: string) => {
    try {
      await apiFetch(
        `/api/Pagos/${id}/aprobar`,
        { method: 'PATCH', body: JSON.stringify({ estado: 'Procesado', aprobadoPor: userName }) },
        token ?? undefined,
      )
      toast.success('Ingreso aprobado exitosamente.')
    } catch {
      toast.error('No se pudo aprobar el ingreso.')
    }

    setRecords(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'Procesado' } : r)
    )
    setSelected(null)
  }

  // ── Rechazar ──────────────────────────────────────────────────────────────
  const handleReject = async (id: string) => {
    try {
      await apiFetch(
        `/api/Pagos/${id}/rechazar`,
        { method: 'PATCH', body: JSON.stringify({ estado: 'Rechazado', rechazadoPor: userName }) },
        token ?? undefined,
      )
      toast.success('Ingreso rechazado.')
    } catch {
      toast.error('No se pudo rechazar el ingreso.')
    }

    setRecords(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'Rechazado' } : r)
    )
    setSelected(null)
  }

  const handleApply = () => {
    setActiveFilters(filters)
    setFiltersOpen(false)
  }

  return {
    records,
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
  }
}