import { useState } from 'react'
import { apiFetch } from '../../../services/apiClient'
import { useAuthStore } from '../../auth/store/authStore'
import type { EgresoRecord, EgresoStatus, AprobarEgresoPayload, RechazarEgresoPayload } from './types'
import { DEFAULT_EGRESO_FILTERS } from './EgresoFilters'
import type { EgresoFilterValues } from './EgresoFilters'
import { MOCK_EGRESOS } from './data/mockdata'

export function useEgresoHistorial() {
  const { token, user } = useAuthStore()
  const userName: string = user?.nombre ?? 'Administrador'

  const [records,       setRecords]       = useState<EgresoRecord[]>(MOCK_EGRESOS)
  const [activeTab,     setActiveTab]     = useState<EgresoStatus>('Pendiente')
  const [page,          setPage]          = useState(1)
  const [selected,      setSelected]      = useState<EgresoRecord | null>(null)
  const [stagedFilters, setStagedFilters] = useState<EgresoFilterValues>(DEFAULT_EGRESO_FILTERS)
  const [activeFilters, setActiveFilters] = useState<EgresoFilterValues>(DEFAULT_EGRESO_FILTERS)

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
    const payload: AprobarEgresoPayload = { Status: 'Aprobado', AprobadoPor: userName }
    try {
      await apiFetch(`/api/Egresos/${id}/aprobar`, { method: 'PATCH', body: JSON.stringify(payload) }, token ?? undefined)
    } catch { /* update locally anyway */ }

    setRecords(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'Aprobado', aprobadoPor: userName } : r)
    )
    setSelected(null)
  }

  const handleReject = async (id: string) => {
    const payload: RechazarEgresoPayload = { Status: 'Rechazado', RechazadoPor: userName }
    try {
      await apiFetch(`/api/Egresos/${id}/rechazar`, { method: 'PATCH', body: JSON.stringify(payload) }, token ?? undefined)
    } catch { /* update locally anyway */ }

    setRecords(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'Rechazado', rechazadoPor: userName } : r)
    )
    setSelected(null)
  }

  return {
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
    handleReject,
  }
}
