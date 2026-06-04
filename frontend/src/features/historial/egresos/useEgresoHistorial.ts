import { useState, useEffect } from 'react'
import { apiFetch } from '../../../services/apiClient'
import { useAuthStore } from '../../auth/store/authStore'
import type { EgresoRecord, EgresoStatus } from './types'
import { DEFAULT_EGRESO_FILTERS } from './EgresoFilters'
import type { EgresoFilterValues } from './EgresoFilters'

interface EgresoAPI {
  id:            number
  codigo:        string
  registradoPor: string
  dni:           string
  fecha:         string
  monto:         number
  titulo:        string
  descripcion:   string
  facturaUrl:    string
  estado:        string
  aprobadoPor:   string | null
}

function mapToRecord(e: EgresoAPI): EgresoRecord {
  const statusMap: Record<string, EgresoStatus> = {
    Aprobado:  'Aprobado',
    Rechazado: 'Rechazado',
    Pendiente: 'Pendiente',
  }
  return {
    id:            String(e.id),
    codigoEgreso:  e.codigo,
    registradoPor: e.registradoPor,
    dni:           e.dni,
    fecha:         e.fecha,
    monto:         e.monto,
    receptorPago:  e.titulo,
    descripcion:   e.descripcion,
    facturaUrl:    e.facturaUrl,
    status:        statusMap[e.estado] ?? 'Pendiente',
    aprobadoPor:   e.aprobadoPor ?? undefined,
  }
}

export function useEgresoHistorial() {
  const { token, user } = useAuthStore()
  const userName: string = user?.nombre ?? 'Administrador'

  const [records,       setRecords]       = useState<EgresoRecord[]>([])
  const [loading,       setLoading]       = useState(true)
  const [activeTab,     setActiveTab]     = useState<EgresoStatus>('Pendiente')
  const [page,          setPage]          = useState(1)
  const [selected,      setSelected]      = useState<EgresoRecord | null>(null)
  const [stagedFilters, setStagedFilters] = useState<EgresoFilterValues>(DEFAULT_EGRESO_FILTERS)
  const [activeFilters, setActiveFilters] = useState<EgresoFilterValues>(DEFAULT_EGRESO_FILTERS)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    apiFetch<EgresoAPI[]>('/api/Egresos', {}, token)
      .then(data => setRecords(data.map(mapToRecord)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  const byTab = records.filter(r => r.status === activeTab)

  const filtered = byTab.filter(r => {
    const q = activeFilters.search.toLowerCase().trim()
    if (q) {
      const match =
        r.codigoEgreso.toLowerCase().includes(q)  ||
        r.registradoPor.toLowerCase().includes(q) ||
        r.receptorPago.toLowerCase().includes(q)  ||
        r.dni.toLowerCase().includes(q)
      if (!match) return false
    }
    if (activeFilters.dateFrom && r.fecha < activeFilters.dateFrom) return false
    if (activeFilters.dateTo   && r.fecha > activeFilters.dateTo)   return false
    return true
  })

  const counts: Record<EgresoStatus, number> = {
    Aprobado:  records.filter(r => r.status === 'Aprobado').length,
    Pendiente: records.filter(r => r.status === 'Pendiente').length,
    Rechazado: records.filter(r => r.status === 'Rechazado').length,
  }

  const handleTabChange = (s: EgresoStatus) => {
    setActiveTab(s)
    setPage(1)
    setSelected(null)
    setStagedFilters(DEFAULT_EGRESO_FILTERS)
    setActiveFilters(DEFAULT_EGRESO_FILTERS)
  }

  const handleApply = () => {
    setActiveFilters(stagedFilters)
    setPage(1)
  }

  const handleApprove = async (id: string) => {
    try {
      await apiFetch(`/api/Egresos/${id}/aprobar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ AprobadoPor: user ? Number(user.id) : 0 })
      }, token ?? undefined)
    } catch { /* actualización local como fallback */ }

    setRecords(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'Aprobado', aprobadoPor: userName } : r)
    )
    setSelected(null)
  }

  const handleReject = async (id: string) => {
    try {
      await apiFetch(`/api/Egresos/${id}/rechazar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ AprobadoPor: user ? Number(user.id) : 0 })
      }, token ?? undefined)
    } catch { /* actualización local como fallback */ }

    setRecords(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'Rechazado', rechazadoPor: userName } : r)
    )
    setSelected(null)
  }

  return {
    filtered,
    counts,
    loading,
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
    handleReject,
  }
}
