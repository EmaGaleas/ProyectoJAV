import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
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
  estado:        string
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

// ─── URL Base del Backend ─────────────────────────────────────────────────────
const API_URL = 'http://localhost:5209'

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEgresoHistorial() {
  const { token, user } = useAuthStore()
  const userName: string = user?.nombre ?? 'Administrador'

  const [records,  setRecords]  = useState<EgresoRecord[]>(MOCK_EGRESOS)
  const [loading,  setLoading]  = useState(false)
  const [activeTab,setActiveTab]= useState<EgresoStatus>('Pendiente')
  const [page,     setPage]     = useState(1)
  const [selected, setSelected] = useState<EgresoRecord | null>(null)
  
  // Estado único para filtros en tiempo real
  const [filters,  setFilters]  = useState<EgresoFilterValues>(DEFAULT_EGRESO_FILTERS)

  // ── Carga inicial: GET /api/Egresos ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }

    axios.get<EgresoBackend[]>(`${API_URL}/api/Egresos`, config)
      .then(res => {
        if (!cancelled) setRecords(res.data.map(mapBackendToRecord))
      })
      .catch(() => {
        if (!cancelled) setRecords(MOCK_EGRESOS)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
      
    return () => { cancelled = true }
  }, [token])

  // ── Filtrado (Tiempo Real) ───────────────────────────────────────────────────
  const byTab = records.filter(r => r.status === activeTab)

  const filtered = byTab.filter(r => {
    const q = filters.search.toLowerCase().trim()
    if (q) {
      const match =
        r.codigoEgreso.toLowerCase().includes(q)  ||
        r.registradoPor.toLowerCase().includes(q) ||
        r.receptorPago.toLowerCase().includes(q)  ||
        r.dni.toLowerCase().includes(q)
      if (!match) return false
    }
    if (filters.dateFrom && r.fecha < filters.dateFrom) return false
    if (filters.dateTo   && r.fecha > filters.dateTo)   return false
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
  }

  const handleApprove = async (id: string) => {
    const userId  = user ? parseInt(user.id, 10) : 0
    const payload = { AprobadoPor: userId }
    const config = { headers: token ? { Authorization: `Bearer ${token}` } : {} }

    try {
      await axios.patch(`${API_URL}/api/Egresos/${id}/aprobar`, payload, config)
      toast.success('Egreso aprobado exitosamente.')
      setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Aprobado', aprobadoPor: userName } : r))
    } catch {
      toast.error('No se pudo aprobar el egreso. Intenta de nuevo más tarde.')
    } finally {
      setSelected(null)
    }
  }

  const handleReject = async (id: string) => {
    const userId  = user ? parseInt(user.id, 10) : 0
    const payload = { RechazadoPor: userId }
    const config = { headers: token ? { Authorization: `Bearer ${token}` } : {} }

    try {
      await axios.patch(`${API_URL}/api/Egresos/${id}/rechazar`, payload, config)
      toast.success('Egreso rechazado.')
      setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Rechazado', rechazadoPor: userName } : r))
    } catch {
      toast.error('No se pudo rechazar el egreso. Intenta de nuevo más tarde.')
    } finally {
      setSelected(null)
    }
  }

  return {
    filtered,
    counts,
    activeTab,
    page,
    selected,
    filters, // <-- Modificado
    loading,
    setPage,
    setSelected,
    setFilters, // <-- Modificado
    handleTabChange,
    handleApprove,
    handleReject,
  }
}