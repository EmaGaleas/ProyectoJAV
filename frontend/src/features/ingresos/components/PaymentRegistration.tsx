import { useState, useEffect } from 'react'
import { useAuthStore } from '../../auth/store/authStore'
import { obtenerDeudas, registrarPago } from '../services/ingresoService'
import type { ClienteAPI, DeudaItemAPI } from '../types'
import { ClientFinder } from './ClientFinder'
import { PendingPayments } from './PendingPayments'
import { PaymentMethodPanel } from './PaymentMethodPanel'
import type { Method } from './PaymentMethodPanel'
import { ReceiptPanel } from './ReceiptPanel'

export function PaymentRegistration() {
  const { token, user } = useAuthStore()

  const [client,     setClient]     = useState<ClienteAPI | null>(null)
  const [deudas,     setDeudas]     = useState<DeudaItemAPI[]>([])
  const [selIds,     setSelIds]     = useState<string[]>([])
  const [method,     setMethod]     = useState<Method>('cash')
  const [code,       setCode]       = useState('')
  const [codeError,  setCodeError]  = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success,    setSuccess]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  // Cuando cambia el cliente, recargar sus deudas en este nivel para pasarlas al ReceiptPanel
  useEffect(() => {
    if (!client || !token) { setDeudas([]); setSelIds([]); return }
    obtenerDeudas(token, client.idUsuario)
      .then(d => setDeudas([...d.mensualidades, ...d.multas]))
      .catch(console.error)
  }, [client, token])

  const handleSelectClient = (c: ClienteAPI | null) => { setClient(c); setSelIds([]); setSuccess(false); setError(null) }
  const handleToggle       = (id: string) => setSelIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const handleMethodChange = (m: Method) => { setMethod(m); if (m === 'cash') { setCode(''); setCodeError(false) } }
  const handleCodeChange   = (v: string) => { setCode(v); if (v.trim()) setCodeError(false) }

  const handleSubmit = async () => {
    if (!client || selIds.length === 0 || !token || !user) return
    if (method === 'transfer' && !code.trim()) { setCodeError(true); return }

    const mensualidadesIds = deudas
      .filter(d => selIds.includes(d.idVirtual) && d.idVirtual.startsWith('mensualidad-'))
      .map(d => d.idReal)

    const multasIds = deudas
      .filter(d => selIds.includes(d.idVirtual) && d.idVirtual.startsWith('multa-'))
      .map(d => d.idReal)

    const total = deudas
      .filter(d => selIds.includes(d.idVirtual))
      .reduce((a, d) => a + d.monto + d.mora, 0)

    setSubmitting(true)
    setError(null)
    try {
      await registrarPago(token, {
        registradoPor:    Number(user.id),
        metodoPago:       method === 'cash' ? 0 : 1,
        monto:            total,
        codigoComprobante: parseInt(code) || 0,
        mensualidadesIds,
        multasIds,
        conexionesIds:    [],
      })
      setSuccess(true)
      setClient(null)
      setSelIds([])
      setCode('')
      setMethod('cash')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al registrar el pago')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = client !== null && selIds.length > 0

  return (
    <div className="flex gap-5 items-start">

      {/* Columna izquierda */}
      <div className="flex flex-col gap-5 flex-1 min-w-0">
        <ClientFinder selectedClient={client} onSelectClient={handleSelectClient} />
        <PendingPayments client={client} selectedIds={selIds} onToggle={handleToggle} />
      </div>

      {/* Columna derecha */}
      <div className="flex flex-col gap-5 shrink-0" style={{ width: 300 }}>
        <PaymentMethodPanel
          method={method}   onMethodChange={handleMethodChange}
          code={code}       onCodeChange={handleCodeChange}
          codeError={codeError}
        />
        <ReceiptPanel client={client} deudas={deudas} selectedIds={selIds} method={method} code={code} />

        {/* Mensajes de estado */}
        {success && (
          <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: '#F0FAF4', color: '#308C58', border: '1px solid #D5EDDF' }}>
            Pago registrado exitosamente.
          </div>
        )}
        {error && (
          <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' }}>
            {error}
          </div>
        )}

        {/* Botón de confirmar */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="w-full h-11 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: canSubmit && !submitting ? '#308C58' : '#D5EDDF',
            color:      canSubmit && !submitting ? '#fff' : '#8EBFA3',
            cursor:     canSubmit && !submitting ? 'pointer' : 'not-allowed'
          }}>
          {submitting ? 'Registrando…' : 'Confirmar pago'}
        </button>
      </div>

    </div>
  )
}
