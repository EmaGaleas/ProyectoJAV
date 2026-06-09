import { useState } from 'react'
import { useAuthStore } from '../auth/store/authStore'
import type { Client, Payment } from './types'
import type { Method } from './components/PaymentMethodPanel'
import { fetchDeudas, registrarPago } from './ingresoRegistroService'

export function usePaymentRegistration() {
  const { user, token } = useAuthStore()

  const [client,          setClient]          = useState<Client | null>(null)
  const [payments,        setPayments]        = useState<Payment[]>([])
  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [selectedIds,     setSelectedIds]     = useState<string[]>([])
  const [method,          setMethod]          = useState<Method>('cash')
  const [comprobanteCode, setComprobanteCode] = useState('')
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null)
  const [codeError,       setCodeError]       = useState(false)
  const [submitting,      setSubmitting]      = useState(false)
  const [submitError,     setSubmitError]     = useState<string | null>(null)
  const [submitSuccess,   setSubmitSuccess]   = useState(false)

  const handleSelectClient = async (c: Client | null) => {
    setClient(c)
    setSelectedIds([])
    setPayments([])
    setSubmitSuccess(false)
    setSubmitError(null)
    if (!c || !token) return
    setPaymentsLoading(true)
    try {
      const data = await fetchDeudas(c.id, token)
      setPayments(data)
    } catch {
      console.error('Error cargando deudas del cliente')
    } finally {
      setPaymentsLoading(false)
    }
  }

  const handleToggle = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleMethodChange = (m: Method) => {
    setMethod(m)
    if (m === 'cash') { setComprobanteCode(''); setComprobanteFile(null); setCodeError(false) }
  }

  const handleCodeChange = (v: string) => {
    setComprobanteCode(v)
    if (v.trim()) setCodeError(false)
  }

  const handleReset = () => {
    setClient(null)
    setPayments([])
    setSelectedIds([])
    setMethod('cash')
    setComprobanteCode('')
    setComprobanteFile(null)
    setCodeError(false)
    setSubmitSuccess(false)
    setSubmitError(null)
  }

  const handleSubmit = async () => {
    if (method === 'transfer' && !comprobanteCode.trim()) { setCodeError(true); return }
    const selected = payments.filter(p => selectedIds.includes(p.id))
    if (selected.length === 0 || !user || !token) return
    const mensualidadesIds = selected.filter(p => p.type === 'mensualidad').map(p => p.idReal)
    const multasIds        = selected.filter(p => p.type === 'multa').map(p => p.idReal)
    const total            = selected.reduce((a, p) => a + p.amount + p.mora, 0)
    const codigoNum        = method === 'transfer' ? parseInt(comprobanteCode) || 0 : Math.floor(Date.now() / 1000)
    setSubmitting(true)
    setSubmitError(null)
    try {
      await registrarPago(
        parseInt(user.id),
        method === 'cash' ? 'Efectivo' : 'Transferencia',
        total,
        codigoNum,
        mensualidadesIds,
        multasIds,
        method === 'transfer' ? comprobanteFile : null,
        token,
      )
      setSubmitSuccess(true)
    } catch {
      setSubmitError('Error al registrar el ingreso. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    client,
    payments,
    paymentsLoading,
    selectedIds,
    selectedPayments: payments.filter(p => selectedIds.includes(p.id)),
    method,
    comprobanteCode,
    comprobanteFile,
    codeError,
    submitting,
    submitError,
    submitSuccess,
    handleSelectClient,
    handleToggle,
    handleMethodChange,
    handleCodeChange,
    setComprobanteFile,
    handleSubmit,
    handleReset,
  }
}
