import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { apiFetch } from '../../../services/apiClient'
import { useAuthStore } from '../../auth/store/authStore'
import type { EgresoRecord, EgresoStatus } from './types'
import { DEFAULT_EGRESO_FILTERS } from './EgresoFilters'
import type { EgresoFilterValues } from './EgresoFilters'
import { MOCK_EGRESOS } from './data/mockdata'

// ─── Tipo de la respuesta del backend GET /api/Egresos ────────────────────────
interface EgresoBackend {
  idEgreso:      number
  codigoEgreso:  string
  registradoPor: string
  dni:           string
  fecha:         string
  monto:         number
  receptorPago:  string
  descripcion:   string
  facturaUrl:    string
  estado:        string   // 'Aprobado' | 'Pendiente' | 'Rechazado'
  aprobadoPor?:  string | null
}

function mapBackendToRecord(b: EgresoBackend): EgresoRecord {
  return {
    id:            String(b.idEgreso),
    codigoEgreso:  b.codigoEgreso,
    registradoPor: b.registradoPor,
    dni:           b.dni,
    fecha:         b.fecha.split('T')[0],
    monto:         b.monto,
    receptorPago:  b.receptorPago,
    descripcion:   b.descripcion,
    facturaUrl:    b.facturaUrl,
    status:        (b.estado as EgresoStatus) ?? 'Pendiente',
    aprobadoPor:   b.aprobadoPor ?? undefined,
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEgresoHistorial() {
  const { token, user } = useAuthStore()
  const userName: string = user?.nombre ?? 'Administrador'

  const [records,       setRecords]       = useState<EgresoRecord[]>(MOCK_EGRESOS)
  const [loading,       setLoading]       = useState(false)
  const [activeTab,     setActiveTab]     = useState<EgresoStatus>('Pendiente')
  const [page,          setPage]          = useState(1)
  const [selected,      setSelected]      = useState<EgresoRecord | null>(null)
  const [stagedFilters, setStagedFilters] = useState<EgresoFilterValues>(DEFAULT_EGRESO_FILTERS)
  const [activeFilters, setActiveFilters] = useState<EgresoFilterValues>(DEFAULT_EGRESO_FILTERS)

  // ── Carga inicial: GET /api/Egresos ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    apiFetch<EgresoBackend[]>('/api/Egresos', undefined, token ?? undefined)
      .then(data => {
        if (!cancelled) setRecords(data.map(mapBackendToRecord))
      })
      .catch(() => {
        if (!cancelled) setRecords(MOCK_EGRESOS)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [token])

  // ── Filtrado ─────────────────────────────────────────────────────────────────
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

  // ── Handlers ─────────────────────────────────────────────────────────────────
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
    const userId  = user ? parseInt(user.id, 10) : 0
    const payload = { AprobadoPor: userId }
    try {
      await apiFetch(
        `/api/Egresos/${id}/aprobar`,
        { method: 'PATCH', body: JSON.stringify(payload) },
        token ?? undefined,
      )
      toast.success('Egreso aprobado exitosamente.')
    } catch {
      toast.error('No se pudo aprobar el egreso. Intenta de nuevo más tarde.')
    }

    setRecords(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'Aprobado', aprobadoPor: userName } : r)
    )
    setSelected(null)
  }

  const handleReject = async (id: string) => {
    const userId  = user ? parseInt(user.id, 10) : 0
    const payload = { RechazadoPor: userId }
    try {
      await apiFetch(
        `/api/Egresos/${id}/rechazar`,
        { method: 'PATCH', body: JSON.stringify(payload) },
        token ?? undefined,
      )
      toast.success('Egreso rechazado.')
    } catch {
      toast.error('No se pudo rechazar el egreso. Intenta de nuevo más tarde.')
    }

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
    loading,
    setPage,
    setSelected,
    setStagedFilters,
    handleTabChange,
    handleApply,
    handleApprove,
    handleReject,
  }
}
