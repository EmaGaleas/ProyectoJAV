import { useState } from 'react'
import { toast } from 'react-toastify'
import { apiFetch } from '../../../services/apiClient'
import { useAuthStore } from '../../auth/store/authStore'
import type { Client, Payment } from '../components/types'
import type { Method } from '../components/PaymentMethodPanel'

function mapClient(raw: any): Client {
  const nombre = raw.nombreCompleto ?? `${raw.primerNombre ?? ''} ${raw.primerApellido ?? ''}`.trim()
  const parts  = nombre.split(' ')
  return {
    id:       String(raw.idUsuario),
    name:     nombre,
    street:   raw.calle    ?? '',
    block:    raw.bloque   ?? '',
    lot:      raw.lote     ?? 0,  // <-- Corregido: Ahora usa 0 por defecto en lugar de ''
    dni:      raw.dni      ?? '',
    initials: parts.map((p: string) => p[0]).slice(0, 2).join('').toUpperCase(),
  }
}

function mapDeuda(raw: any, clientId: string): Payment {
  // DeudaDetalleResponse del back
  const isMensualidad = raw.tipo === 'Mensualidad' || raw.tipoCobro === 'Mensualidad'
  const isMulta       = raw.tipo === 'Multa'       || raw.tipoCobro === 'Multa'

  return {
    id:       `${raw.idMensualidad ?? raw.idMulta ?? raw.idConexion}-${raw.tipo}`,
    clientId,
    concept:  raw.descripcion ?? raw.periodo ?? raw.concepto ?? '',
    dueDate:  raw.fechaVencimiento?.split('T')[0] ?? '',
    amount:   raw.monto      ?? 0,
    mora:     raw.mora       ?? 0,
    overdue:  raw.estado === 'Vencido',
    type:     isMensualidad ? 'mensualidad' : isMulta ? 'multa' : 'conexion',
    backId:   raw.idMensualidad ?? raw.idMulta ?? raw.idConexion ?? 0,
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePaymentRegistration() {
  const { token, user } = useAuthStore()
  const registradoPor   = parseInt(user?.id ?? '0', 10)

  const [client,       setClient]       = useState<Client | null>(null)
  const [payments,     setPayments]     = useState<Payment[]>([])
  const [selPay,       setSelPay]       = useState<string[]>([])
  const [method,       setMethod]       = useState<Method>('cash')
  const [code,         setCode]         = useState('')
  const [codeError,    setCodeError]    = useState(false)
  const [isLoadingPay, setIsLoadingPay] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Buscar clientes ───────────────────────────────────────────────────────
  const fetchClients = async (calle: string, bloque: string, lote?: number): Promise<Client[]> => {
    try { // <-- Corregido: Faltaba abrir el bloque try
      const params = new URLSearchParams({ Calle: calle, Bloque: bloque, ...(lote != null ? { Lote: String(lote) } : {}) })
      const data   = await apiFetch<any[]>(`/api/Clientes/buscar?${params}`, {}, token ?? undefined)
      return data.map(mapClient)
    } catch {
      toast.error('No se pudieron cargar los clientes.')
      return []
    }
  }

  // ── Seleccionar cliente y cargar sus deudas ───────────────────────────────
  const handleSelectClient = async (c: Client | null) => {
    setClient(c)
    setSelPay([])
    setPayments([])

    if (!c) return

    setIsLoadingPay(true)
    try {
      const data = await apiFetch<any[]>(`/api/Deudas/usuario/${c.id}`, {}, token ?? undefined)
      setPayments(data.map(raw => mapDeuda(raw, c.id)))
    } catch {
      toast.error('No se pudieron cargar las deudas del cliente.')
    } finally {
      setIsLoadingPay(false)
    }
  }

  const handleTogglePay = (id: string) =>
    setSelPay(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleMethodChange = (m: Method) => {
    setMethod(m)
    if (m === 'cash') { setCode(''); setCodeError(false) }
  }

  const handleCodeChange = (v: string) => {
    setCode(v)
    if (v.trim()) setCodeError(false)
  }

  const handleSubmit = async () => {
    if (!client || selPay.length === 0) {
      toast.error('Selecciona un cliente y al menos un pago.')
      return
    }
    if (method === 'transfer' && !code.trim()) {
      setCodeError(true)
      toast.error('El número de comprobante es obligatorio para transferencia.')
      return
    }

    const selected = payments.filter(p => selPay.includes(p.id))

    const mensualidadesIds = selected.filter(p => p.type === 'mensualidad').map(p => p.backId)
    const multasIds        = selected.filter(p => p.type === 'multa').map(p => p.backId)
    const conexionesIds    = selected.filter(p => p.type === 'conexion').map(p => p.backId)
    const total            = selected.reduce((a, p) => a + p.amount + p.mora, 0)

    // El back usa [FromForm] con IFormFile opcional → FormData
    const body = new FormData()
    body.append('RegistradoPor',      String(registradoPor))
    body.append('MetodoPago',         method === 'cash' ? 'Efectivo' : 'Transferencia')
    body.append('Monto',              String(total))
    body.append('CodigoComprobante',  code.trim() || '0')

    mensualidadesIds.forEach(id => body.append('MensualidadesIds', String(id)))
    multasIds.forEach(id        => body.append('MultasIds',        String(id)))
    conexionesIds.forEach(id    => body.append('ConexionesIds',    String(id)))

    setIsSubmitting(true)
    try {
      await apiFetch('/api/Pagos', { method: 'POST', body }, token ?? undefined)
      toast.success('Pago registrado exitosamente.')

      // Limpiar estado
      setClient(null)
      setPayments([])
      setSelPay([])
      setMethod('cash')
      setCode('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar el pago.'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    client,
    payments,
    selPay,
    method,
    code,
    codeError,
    isLoadingPay,
    isSubmitting,
    fetchClients,
    handleSelectClient,
    handleTogglePay,
    handleMethodChange,
    handleCodeChange,
    handleSubmit,
  }
}