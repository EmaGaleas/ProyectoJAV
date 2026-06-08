import { useState } from 'react'
import { ClientFinder } from './ClientFinder'
import { PendingPayments } from './PendingPayments'
import { PaymentMethodPanel } from './PaymentMethodPanel'
import type { Method } from './PaymentMethodPanel'
import { ReceiptPanel } from './ReceiptPanel'
import { registrarPago } from '../services/ingresoService'
import { useAuthStore } from '../../auth/store/authStore'
import type { ClienteApi, DeudaItemApi } from '../types'

export function PaymentRegistration() {
  const { token, user } = useAuthStore()

  const [client,           setClient]           = useState<ClienteApi | null>(null)
  const [selMensualidades, setSelMensualidades] = useState<DeudaItemApi[]>([])
  const [selMultas,        setSelMultas]        = useState<DeudaItemApi[]>([])
  const [method,           setMethod]           = useState<Method>('cash')
  const [code,             setCode]             = useState('')
  const [codeError,        setCodeError]        = useState(false)
  const [transferFile,     setTransferFile]     = useState<File | null>(null)
  const [fileError,        setFileError]        = useState(false)
  const [isSubmitting,     setIsSubmitting]     = useState(false)
  const [submitError,      setSubmitError]      = useState<string | null>(null)
  const [submitSuccess,    setSubmitSuccess]    = useState(false)

  const handleSelectClient = (c: ClienteApi | null) => {
    setClient(c)
    setSelMensualidades([])
    setSelMultas([])
    setSubmitError(null)
    setSubmitSuccess(false)
  }

  const handleToggleMensualidad = (item: DeudaItemApi) =>
    setSelMensualidades(prev =>
      prev.some(m => m.idReal === item.idReal)
        ? prev.filter(m => m.idReal !== item.idReal)
        : [...prev, item]
    )

  const handleToggleMulta = (item: DeudaItemApi) =>
    setSelMultas(prev =>
      prev.some(m => m.idReal === item.idReal)
        ? prev.filter(m => m.idReal !== item.idReal)
        : [...prev, item]
    )

  const handleMethodChange = (m: Method) => {
    setMethod(m)
    if (m === 'cash') {
      setCode('')
      setCodeError(false)
      setTransferFile(null)
      setFileError(false)
    }
  }

  const handleSubmit = async () => {
    if (!client) return
    if (selMensualidades.length === 0 && selMultas.length === 0) return
    if (method === 'transfer' && !code.trim()) { setCodeError(true); return }
    if (method === 'transfer' && !transferFile) { setFileError(true); return }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const total = [...selMensualidades, ...selMultas].reduce((a, i) => a + i.monto + i.mora, 0)

      await registrarPago({
        registradoPor:      parseInt(user?.id ?? '0'),
        metodoPago:         method === 'cash' ? 'Efectivo' : 'Transferencia',
        monto:              total,
        selMensualidades,
        selMultas,
        comprobanteArchivo: method === 'transfer' ? transferFile : null,
      }, token ?? '')

      setSubmitSuccess(true)
      setClient(null)
      setSelMensualidades([])
      setSelMultas([])
      setMethod('cash')
      setCode('')
      setTransferFile(null)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Error al registrar el pago')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSubmitReady =
    !!client &&
    (selMensualidades.length > 0 || selMultas.length > 0) &&
    (method === 'cash' || (!!code.trim() && !!transferFile))

  return (
    <div className="flex gap-5 items-start">

      {/* Columna izquierda */}
      <div className="flex flex-col gap-5 flex-1 min-w-0">
        <ClientFinder selectedClient={client} onSelectClient={handleSelectClient} />
        <PendingPayments
          client={client}
          selMensualidades={selMensualidades}
          selMultas={selMultas}
          onToggleMensualidad={handleToggleMensualidad}
          onToggleMulta={handleToggleMulta}
        />
      </div>

      {/* Columna derecha */}
      <div className="flex flex-col gap-5 shrink-0" style={{ width: 300 }}>
        <PaymentMethodPanel
          method={method}           onMethodChange={handleMethodChange}
          code={code}               onCodeChange={v => { setCode(v); if (v.trim()) setCodeError(false) }}
          codeError={codeError}
          transferFile={transferFile}
          onTransferFileChange={f  => { setTransferFile(f); if (f) setFileError(false) }}
          fileError={fileError}
        />
        <ReceiptPanel
          client={client}
          selMensualidades={selMensualidades}
          selMultas={selMultas}
          method={method}
          code={code}
          isSubmitReady={isSubmitReady}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
          submitSuccess={submitSuccess}
        />
      </div>

    </div>
  )
}
