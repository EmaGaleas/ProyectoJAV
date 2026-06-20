import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { apiClient } from '../../../services/apiClient'
import { useAuthStore } from '../../auth/store/authStore'
import type { Income, IncomeStatus } from './types'

interface IngresoBackend {
  id:          number
  codigo:      string
  tipoIngreso: string
  titular:     string
  dni:         string
  fecha:       string
  monto:       number
  estado:      string
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
    date:          b.fecha.split('T')[0],
    total:         b.monto,
    status:        statusMap[b.estado] ?? 'En revisión',
    payMethod:     "Efectivo",
    street:        '',
    block:         '',
    lot:           '',
    lines:         [],
  }
}

export function useIncomeHistorial() {
  const { token, user } = useAuthStore()
  const userName = user?.nombre ?? 'Administrador'

  const [records,   setRecords]   = useState<Income[]>([])
  const [loading,   setLoading]   = useState(false)
  const [selected,  setSelected]  = useState<Income | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    // Configuración del token para Axios
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

    // Sintaxis de Axios puro, utilizando la instancia configurada
    apiClient.get<IngresoBackend[]>('/api/Pagos', config)
      .then(res => {
        if (!cancelled) setRecords(res.data.map(mapBackendToIncome))
      })
      .catch((error) => {
        console.error("Detalle del error Axios:", error)
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
    const config  = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

    try {
      await apiClient.patch(`/api/Pagos/${id}/aprobar`, payload, config)
      toast.success('Ingreso aprobado.')
      setRecords(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'Procesado' as IncomeStatus } : r)
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
    const config  = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

    try {
      await apiClient.patch(`/api/Pagos/${id}/rechazar`, payload, config)
      toast.success('Ingreso rechazado.')
      setRecords(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'Rechazado' as IncomeStatus } : r)
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