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

export function usePaymentRegistration() {
  const { token, user } = useAuthStore()
  const registradoPor   = parseInt(user?.id ?? '0', 10)

  const [client,       setClient]       = useState<Client | null>(null)
  const [payments,     setPayments]     = useState<Payment[]>([])
  const [selPay,       setSelPay]       = useState<string[]>([])
  const [method,       setMethod]       = useState<Method>('cash')
  const [code,         setCode]         = useState('')
  const [codeError,    setCodeError]    = useState(false)
  
  // Estados para el archivo (Solo para UI, no se envían al backend)
  const [file,         setFile]         = useState<File | null>(null)
  const [fileError,    setFileError]    = useState(false)

  const [isLoadingPay, setIsLoadingPay] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getConfig = () => ({
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  const fetchClients = async (calle: string, bloque: string, lote?: number): Promise<Client[]> => {
    try {
      const params = { Calle: calle, Bloque: bloque, ...(lote != null ? { Lote: lote } : {}) }
      const response = await axios.get(`${API_BASE_URL}/api/Clientes/buscar`, { params, ...getConfig() })
      return response.data.map(mapClient)
    } catch (error: any) {
      console.error('Error fetching clients:', error)
      toast.error(error.response?.data?.message || 'Error al buscar los clientes.')
      return []
    }
  }

  const handleSelectClient = async (c: Client | null) => {
    setClient(c)
    setSelPay([])
    setPayments([])
    setFile(null)
    setFileError(false)

    if (!c) return

    setIsLoadingPay(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Deudas/usuario/${c.id}`, getConfig())
      const data = response.data; 

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

  function mapDeudaCustom(raw: any, tipo: 'mensualidad' | 'multa'): Payment {
    return {
      id:        `${raw.idReal}-${tipo}`,
      clientId:  '',
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
    setCodeError(false) 
  }

  const handleCodeChange = (v: string) => {
    setCode(v)
    if (v.trim()) setCodeError(false)
  }

  const handleFileChange = (f: File | null) => {
    if (f) {
      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (f.size > maxSize) {
        toast.error('El archivo supera el límite máximo de 5 MB.')
        setFileError(true)
        setFile(null)
        return
      }
      setFileError(false)
    }
    setFile(f)
  }

  const handleSubmit = async () => {
    if (!client || selPay.length === 0) {
      toast.error('Selecciona un cliente y al menos un pago.')
      return
    }
    
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

    // ── RETORNAMOS AL PAYLOAD JSON ORIGINAL (Sin FormData ni archivo) ──
    const payload = {
      registradoPor: registradoPor,
      metodoPago: method === 'cash' ? 'Efectivo' : 'Transferencia',
      monto: total,
      codigoComprobante: code.trim(),
      mensualidadesIds,
      multasIds,
      conexionesIds
    }

    setIsSubmitting(true)
    try {
      await axios.post(`${API_BASE_URL}/api/Pagos`, payload, getConfig())
      
      toast.success('Pago registrado exitosamente.')

      setClient(null)
      setPayments([])
      setSelPay([])
      setMethod('cash')
      setCode('')
      setFile(null)
      setFileError(false)
    } catch (error: any) {
      console.error('Error al registrar el pago:', error)
      const msg = error.response?.data?.error || error.response?.data?.detalle || error.message || 'Error al registrar el pago.'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    client, payments, selPay, method, code, codeError,
    file, fileError, 
    isLoadingPay, isSubmitting, fetchClients, handleSelectClient,
    handleTogglePay, handleMethodChange, handleCodeChange,
    handleFileChange, handleSubmit,
  }
}