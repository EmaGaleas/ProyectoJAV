import { useState } from 'react'
import { apiFetch } from '../../services/apiClient'
import { useAuthStore } from '../auth/store/authStore'
import type { EgresoFormData } from './types'
import { MAX_FILE_SIZE_BYTES } from './types'

const EMPTY_FORM: EgresoFormData = {
  cliente:     '',
  descripcion: '',
  monto:       '',
  factura:     null,
}

export function useEgresoForm() {
  const { token, user } = useAuthStore()
  const registradoPor: string = user?.nombre ?? 'Usuario desconocido'

  const [formData,  setFormData]  = useState<EgresoFormData>(EMPTY_FORM)
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [success,   setSuccess]   = useState(false)

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

  const buildFormData = (): FormData => {
    const fd = new FormData()
    fd.append('Titulo',        formData.cliente.trim())
    fd.append('Descripcion',   formData.descripcion.trim())
    fd.append('Monto',         String(parseFloat(formData.monto)))
    fd.append('RegistradoPor', String(parseInt(user!.id)))
    fd.append('Evidencia',     formData.factura!)
    return fd
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormComplete) return

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await apiFetch(
        '/api/Egresos',
        { method: 'POST', body: buildFormData() },
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
