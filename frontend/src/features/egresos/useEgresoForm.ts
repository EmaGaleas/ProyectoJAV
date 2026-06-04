import { useState } from 'react'
import { apiFetch } from '../../services/apiClient'          // ajusta la ruta según tu proyecto
import { useAuthStore } from '../auth/store/authStore'       // ajusta la ruta según tu proyecto
import type { EgresoFormData, EgresoPayload } from './types'
import { MAX_FILE_SIZE_BYTES } from './types'

// ─── Estado inicial ───────────────────────────────────────────────────────────

const EMPTY_FORM: EgresoFormData = {
  cliente:     '',
  descripcion: '',
  monto:       '',
  factura:     null,
}

const todayISO = () => new Date().toISOString()

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEgresoForm() {
  const { token, user } = useAuthStore()
  // Ajusta "user?.name" al campo que use tu authStore para el nombre del usuario
  const registradoPor: string = user?.nombre ?? 'Usuario desconocido'

  const [formData,  setFormData]  = useState<EgresoFormData>(EMPTY_FORM)
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [success,   setSuccess]   = useState(false)

  // Todos los campos obligatorios están completos
  const isFormComplete =
    formData.cliente.trim()     !== '' &&
    formData.descripcion.trim() !== '' &&
    formData.monto.trim()       !== '' &&
    parseFloat(formData.monto)   >  0  &&
    formData.factura             !== null

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('El archivo excede el tamaño máximo permitido de 5 MB.')
      e.target.value = ''
      return
    }

    setError(null)
    setFormData(prev => ({ ...prev, factura: file }))
  }

  const buildPayload = (): EgresoPayload => ({
    Cliente:       formData.cliente.trim(),
    Descripcion:   formData.descripcion.trim(),
    Monto:         parseFloat(formData.monto),
    Fecha:         todayISO(),
    RegistradoPor: registradoPor,
    FacturaUrl:    formData.factura?.name ?? '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormComplete) return

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const payload = buildPayload()

      // POST /api/Egresos — el backend recibe EgresoPayload (ver types.ts)
      await apiFetch(
        '/api/Egresos',
        { method: 'POST', body: JSON.stringify(payload) },
        token ?? undefined,
      )

      setSuccess(true)
      setFormData(EMPTY_FORM)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error al registrar el egreso.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    registradoPor,
    isLoading,
    isFormComplete,
    error,
    success,
    handleFieldChange,
    handleFileChange,
    handleSubmit,
  }
}
