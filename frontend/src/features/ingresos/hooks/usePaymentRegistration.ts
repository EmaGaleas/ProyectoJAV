import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAuthStore } from '../../auth/store/authStore'
import type { Client, Payment } from '../components/types'
import type { Method } from '../components/PaymentMethodPanel'

const API_BASE_URL = 'http://localhost:5209' 

function mapClient(raw: any): Client {
  const nombre = raw.nombreCompleto ?? `${raw.primerNombre ?? ''} ${raw.primerApellido ?? ''}`.trim()
  const parts  = nombre.split(' ')
  return {
    id:       String(raw.idUsuario),
    name:     nombre,
    street:   raw.calle    ?? '',
    block:    raw.bloque   ?? '',
    lot:      raw.lote     ?? 0,
    dni:      raw.dni      ?? '',
    initials: parts.map((p: string) => p[0]).slice(0, 2).join('').toUpperCase(),
  }
}

function mapDeuda(raw: any, clientId: string): Payment {
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

  // ── Helper para inyectar el Token en Axios ────────────────────────────────
  const getConfig = () => ({
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  // ── Buscar clientes ───────────────────────────────────────────────────────
  const fetchClients = async (calle: string, bloque: string, lote?: number): Promise<Client[]> => {
    try {
      const params = { Calle: calle, Bloque: bloque, ...(lote != null ? { Lote: lote } : {}) }
      
      const response = await axios.get(`${API_BASE_URL}/api/Clientes/buscar`, {
        params,
        ...getConfig()
      })
      
      return response.data.map(mapClient)
    } catch (error: any) {
      console.error('Error fetching clients:', error)
      toast.error(error.response?.data?.message || 'Error al buscar los clientes. Verifica tu conexión.')
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
      const response = await axios.get(`${API_BASE_URL}/api/Deudas/usuario/${c.id}`, getConfig())
      
      // La respuesta ahora es un objeto: { mensualidades: [], multas: [] }
      const data = response.data; 

      // Combinamos ambas listas en un solo arreglo plano para que tu frontend siga funcionando igual
      const todasLasDeudas = [
        ...(data.mensualidades || []).map((m: any) => ({ ...mapDeudaCustom(m, 'mensualidad'), clientId: c.id })),
        ...(data.multas || []).map((m: any) => ({ ...mapDeudaCustom(m, 'multa'), clientId: c.id }))
      ];

      setPayments(todasLasDeudas);

    } catch (error: any) {
      console.error('Error fetching debts:', error);
      toast.error('No se pudieron cargar las deudas.');
    } finally {
      setIsLoadingPay(false);
    }
  }

  // Nueva función mapeadora adaptada a tus DTOs de C#
  function mapDeudaCustom(raw: any, tipo: 'mensualidad' | 'multa'): Payment {
    return {
      id:        `${raw.idReal}-${tipo}`, // Usamos IdReal de tu DTO
      clientId:  '', // Se asigna en el map superior
      concept:   raw.concepto,
      dueDate:   raw.fechaVencimiento?.split('T')[0] ?? '',
      amount:    raw.monto,
      mora:      raw.mora,
      overdue:   raw.vencida,
      type:      tipo,
      backId:    raw.idReal
    }
  }

  const handleTogglePay = (id: string) =>
    setSelPay(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleMethodChange = (m: Method) => {
    setMethod(m)
    setCodeError(false) // Solo limpiamos el error visual al cambiar, no el valor
  }

  const handleCodeChange = (v: string) => {
    setCode(v)
    if (v.trim()) setCodeError(false)
  }

  const handleSubmit = async () => {
    // 1. Verificamos que haya seleccionado un cliente y al menos un pago
    if (!client || selPay.length === 0) {
      toast.error('Selecciona un cliente y al menos un pago.')
      return
    }
    
    // 2. Verificamos que el código (recibo o comprobante) haya sido ingresado
    if (!code.trim()) {
      setCodeError(true)
      const errorMsg = method === 'cash' 
        ? 'El número de recibo es obligatorio.' 
        : 'El número de comprobante es obligatorio.'
      toast.error(errorMsg)
      return
    }

    const selected = payments.filter(p => selPay.includes(p.id))

    const mensualidadesIds = selected.filter(p => p.type === 'mensualidad').map(p => p.backId)
    const multasIds        = selected.filter(p => p.type === 'multa').map(p => p.backId)
    const conexionesIds    = selected.filter(p => p.type === 'conexion').map(p => p.backId)
    const total            = selected.reduce((a, p) => a + p.amount + p.mora, 0)

    // 3. Armamos el Payload como JSON para que C# ([FromBody]) lo procese correctamente
    const payload = {
      registradoPor: registradoPor,
      metodoPago: method === 'cash' ? 'Efectivo' : 'Transferencia',
      monto: total,
      codigoComprobante: code.trim(),
      mensualidadesIds: mensualidadesIds,
      multasIds: multasIds,
      conexionesIds: conexionesIds
    }

    setIsSubmitting(true)
    try {
      // Axios enviará esto automáticamente como 'application/json'
      await axios.post(`${API_BASE_URL}/api/Pagos`, payload, getConfig())
      
      toast.success('Pago registrado exitosamente.')

      // Limpiar estado
      setClient(null)
      setPayments([])
      setSelPay([])
      setMethod('cash')
      setCode('')
    } catch (error: any) {
      console.error('Error al registrar el pago:', error)
      const msg = error.response?.data?.error || error.response?.data?.detalle || error.message || 'Error al registrar el pago.'
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