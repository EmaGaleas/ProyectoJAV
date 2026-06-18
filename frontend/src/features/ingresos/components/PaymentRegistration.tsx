  import { usePaymentRegistration } from '../hooks/usePaymentRegistration'
  import { ClientFinder }           from './ClientFinder'
  import { PendingPayments }        from './PendingPayments'
  import { PaymentMethodPanel }     from './PaymentMethodPanel'
  import { ReceiptPanel }           from './ReceiptPanel'

  export function PaymentRegistration() {
    const {
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
    } = usePaymentRegistration()

    const canSubmit = !!client && selPay.length > 0 && !isSubmitting

    return (
      <div className="flex gap-5 items-start">

        {/* Columna izquierda */}
        <div className="flex flex-col gap-5 flex-1 min-w-0">
          <ClientFinder
            selectedClient={client}
            onSelectClient={handleSelectClient}
            fetchClients={fetchClients}
          />
          <PendingPayments
            client={client}
            payments={payments}
            selectedIds={selPay}
            onToggle={handleTogglePay}
            isLoading={isLoadingPay}
          />
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-5 shrink-0" style={{ width: 300 }}>
          <PaymentMethodPanel
            method={method}       onMethodChange={handleMethodChange}
            code={code}           onCodeChange={handleCodeChange}
            codeError={codeError}
          />
          <ReceiptPanel
            client={client}
            payments={payments}
            selectedIds={selPay}
            method={method}
            code={code}
          />

          {/* Botón registrar */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full h-12 rounded-2xl font-semibold text-sm transition-all"
            style={{
              background:  canSubmit ? '#308C58' : '#c8d8cf',
              color:       '#fff',
              cursor:      canSubmit ? 'pointer' : 'not-allowed',
              opacity:     isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Pago'}
          </button>
        </div>

      </div>
    )
  }