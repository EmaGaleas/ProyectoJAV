import { usePaymentRegistration } from '../usePaymentRegistration'
import { ClientFinder } from './ClientFinder'
import { PendingPayments } from './PendingPayments'
import { PaymentMethodPanel } from './PaymentMethodPanel'
import { ReceiptPanel } from './ReceiptPanel'

export function PaymentRegistration() {
  const reg = usePaymentRegistration()

  return (
    <div className="flex gap-5 items-start">

      {/* Columna izquierda */}
      <div className="flex flex-col gap-5 flex-1 min-w-0">
        <ClientFinder
          selectedClient={reg.client}
          onSelectClient={reg.handleSelectClient}
        />
        <PendingPayments
          client={reg.client}
          payments={reg.payments}
          loading={reg.paymentsLoading}
          selectedIds={reg.selectedIds}
          onToggle={reg.handleToggle}
        />
      </div>

      {/* Columna derecha */}
      <div className="flex flex-col gap-5 shrink-0" style={{ width: 300 }}>
        <PaymentMethodPanel
          method={reg.method}
          onMethodChange={reg.handleMethodChange}
          code={reg.comprobanteCode}
          onCodeChange={reg.handleCodeChange}
          codeError={reg.codeError}
          file={reg.comprobanteFile}
          onFileChange={reg.setComprobanteFile}
        />
        <ReceiptPanel
          client={reg.client}
          selectedPayments={reg.selectedPayments}
          method={reg.method}
          code={reg.comprobanteCode}
          submitting={reg.submitting}
          submitError={reg.submitError}
          submitSuccess={reg.submitSuccess}
          onSubmit={reg.handleSubmit}
          onReset={reg.handleReset}
        />
      </div>

    </div>
  )
}
