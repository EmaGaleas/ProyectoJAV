import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { apiFetch } from '../../../services/apiClient'
import { useAuthStore } from '../../auth/store/authStore'
import type { Income, IncomeStatus } from './types'

// ─── Tipos para la respuesta del backend ──────────────────────────────────────
// GET /api/Pagos devuelve una lista de IngresoResponse del backend
interface IngresoBackend {
  id:          number
  codigo:      string
  tipoIngreso: string
  titular:     string
  dni:         string
  fecha:       string
  monto:       number
  estado:      string   // 'En revisión' | 'Procesado' | 'Rechazado'
}

function mapBackendToIncome(b: IngresoBackend): Income {
  const statusMap: Record<string, IncomeStatus> = {
    'En revisión': 'En revisión',
    'Procesado':   'Procesado',
    'Rechazado':   'Rechazado',
  }
  return {
    id:            String(b.id),
    receiptNumber: b.codigo,
    holderName:    b.titular,
    dni:           b.dni,
    paymentType:   (b.tipoIngreso === 'Mensualidad' ? 'Mensualidad' : 'Multa'),
    date:          b.fecha.split('T')[0],   // recortar la parte de hora si viene en ISO
    total:         b.monto,
    status:        statusMap[b.estado] ?? 'En revisión',
    payMethod:      "Efectivo",              // el historial general no devuelve esto aún
    street:        '',
    block:         '',
    lot:           '',
    lines:         [],
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useIncomeHistorial() {
  const { token, user } = useAuthStore()
  const userName = user?.nombre ?? 'Administrador'

  const [records,   setRecords]   = useState<Income[]>([])
  const [loading,   setLoading]   = useState(false)
  const [selected,  setSelected]  = useState<Income | null>(null)

  // Carga inicial: GET /api/Pagos
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    apiFetch<IngresoBackend[]>('/api/Pagos', undefined, token ?? undefined)
      .then(data => {
        if (!cancelled) setRecords(data.map(mapBackendToIncome))
      })
      .catch(() => {
        if (!cancelled) {
          toast.error('No se pudo cargar el historial de ingresos.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [token])

  const handleApprove = async (id: string) => {
    const userId  = user ? parseInt(user.id, 10) : 0
    const payload = { AprobadoPor: userId }
    try {
      await apiFetch(
        `/api/Pagos/${id}/aprobar`,
        { method: 'PATCH', body: JSON.stringify(payload) },
        token ?? undefined,
      )
      toast.success('Ingreso aprobado .')
      setRecords(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status: 'Procesado' as IncomeStatus } : r
        )
      )
    } catch {
      toast.error('No se pudo aprobar el ingreso.')
    } finally {
      setSelected(null)
    }
  }

  const handleReject = async (id: string) => {
    const userId  = user ? parseInt(user.id, 10) : 0
    const payload = { RechazadoPor: userId }
    try {
      await apiFetch(
        `/api/Pagos/${id}/rechazar`,
        { method: 'PATCH', body: JSON.stringify(payload) },
        token ?? undefined,
      )
      toast.success('Ingreso rechazado .')
      setRecords(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status: 'Rechazado' as IncomeStatus } : r
        )
      )
    } catch {
      toast.error('No se pudo rechazar el ingreso.')
    } finally {
      setSelected(null)
    }
  }

  return {
    records,
    loading,
    selected,
    setSelected,
    handleApprove,
    handleReject,
    userName,
  }
}
