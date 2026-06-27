import { useState } from 'react'
import { toast } from 'react-toastify'
import { api } from '../../services/api'
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
  const { user } = useAuthStore()

  const registradoPor: number = parseInt(user?.id ?? '0', 10)
  const nombreUsuario: string = user?.nombre ?? 'Usuario desconocido'

  const [formData,  setFormData]  = useState<EgresoFormData>(EMPTY_FORM)
  const [isLoading, setIsLoading] = useState(false)

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
      toast.error('El archivo excede el tamaño máximo permitido de 5 MB.')
      e.target.value = ''
      return
    }

    setFormData(prev => ({ ...prev, factura: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormComplete) return

    setIsLoading(true)

    try {
      const body = new FormData()
      body.append('RegistradoPor', String(registradoPor))
      body.append('Titulo',        formData.cliente.trim())
      body.append('Descripcion',   formData.descripcion.trim())
      body.append('Monto',         formData.monto) 
      body.append('Evidencia',     formData.factura!)

      
      await api.post('/api/Egresos', body)

      toast.success('Egreso registrado exitosamente.')
      setFormData(EMPTY_FORM)
    } catch (err: any) {
      // Axios guarda el mensaje de error de tu backend en err.response.data
      const message = err.response?.data?.error 
                      ?? err.response?.data?.title 
                      ?? err.message 
                      ?? 'Ocurrió un error al registrar el egreso.'
                      
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    registradoPor: nombreUsuario,
    isLoading,
    isFormComplete,
    handleFieldChange,
    handleFileChange,
    handleSubmit,
  }
}