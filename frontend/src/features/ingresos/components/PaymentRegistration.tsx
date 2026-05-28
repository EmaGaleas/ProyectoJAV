import { useState } from 'react'
import type { Client } from '../data/mock-data'
import { ClientFinder } from './ClientFinder'
import { PendingPayments } from './PendingPayments'
import { PaymentMethodPanel } from './PaymentMethodPanel'
import type { Method } from './PaymentMethodPanel'
import { ReceiptPanel } from './ReceiptPanel'

export function PaymentRegistration() {
  const [client,    setClient]    = useState<Client | null>(null)
  const [selPay,    setSelPay]    = useState<string[]>([])
  const [method,    setMethod]    = useState<Method>('cash')
  const [code,      setCode]      = useState('')
  const [codeError, setCodeError] = useState(false)

  const handleSelectClient = (c: Client | null) => { setClient(c); setSelPay([]) }
  const handleTogglePay    = (id: string) => setSelPay(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const handleMethodChange = (m: Method) => { setMethod(m); if (m === 'cash') { setCode(''); setCodeError(false) } }
  const handleCodeChange   = (v: string) => { setCode(v); if (v.trim()) setCodeError(false) }

  return (
    <div className="flex gap-5 items-start">

      {/* Columna izquierda */}
      <div className="flex flex-col gap-5 flex-1 min-w-0">
        <ClientFinder selectedClient={client} onSelectClient={handleSelectClient} />
        <PendingPayments client={client} selectedIds={selPay} onToggle={handleTogglePay} />
      </div>

      {/* Columna derecha */}
      <div className="flex flex-col gap-5 shrink-0" style={{ width: 300 }}>
        <PaymentMethodPanel
          method={method}   onMethodChange={handleMethodChange}
          code={code}       onCodeChange={handleCodeChange}
          codeError={codeError}
        />
        <ReceiptPanel client={client} selectedIds={selPay} method={method} code={code} />
      </div>

    </div>
  )
}
