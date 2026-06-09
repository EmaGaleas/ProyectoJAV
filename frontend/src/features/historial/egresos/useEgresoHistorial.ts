import { useState, useEffect } from 'react'
import { useAuthStore } from '../../auth/store/authStore'
import { fetchEgresos, aprobarEgreso, rechazarEgreso } from './egresoHistorialService'
import type { EgresoRecord, EgresoStatus } from './types'
import { DEFAULT_EGRESO_FILTERS } from './EgresoFilters'
import type { EgresoFilterValues } from './EgresoFilters'

export function useEgresoHistorial() {
  const { token, user } = useAuthStore()

  const [records,       setRecords]       = useState<EgresoRecord[]>([])
  const [activeTab,     setActiveTab]     = useState<EgresoStatus>('Pendiente')
  const [page,          setPage]          = useState(1)
  const [selected,      setSelected]      = useState<EgresoRecord | null>(null)
  const [stagedFilters, setStagedFilters] = useState<EgresoFilterValues>(DEFAULT_EGRESO_FILTERS)
  const [activeFilters, setActiveFilters] = useState<EgresoFilterValues>(DEFAULT_EGRESO_FILTERS)

  useEffect(() => {
    if (!token) return
    fetchEgresos(token).then(setRecords).catch(console.error)
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
    const aprobadoPorId = parseInt(user!.id)
    try {
      await aprobarEgreso(parseInt(id), aprobadoPorId, token!)
      setRecords(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'Aprobado', aprobadoPor: user!.nombre } : r)
      )
    } catch (err) {
      console.error('Error al aprobar egreso:', err)
    }
    setSelected(null)
  }

  const handleReject = async (id: string) => {
    try {
      await rechazarEgreso(parseInt(id), token!)
      setRecords(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'Rechazado' } : r)
      )
    } catch (err) {
      console.error('Error al rechazar egreso:', err)
    }
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
