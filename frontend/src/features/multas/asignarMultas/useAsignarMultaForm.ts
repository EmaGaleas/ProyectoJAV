// useAsignarMultaForm.ts
import { useState, useMemo } from 'react';
import type { AsignarMultaFormData, MockUser } from './asignarMultaTypes';
import { MOCK_USERS_DB, TIPOS_MULTA_DB } from './asignarMultaTypes';
import {api} from "../../../services/api";

export function useAsignarMultaForm(onClose: () => void, onSuccess?: () => void) {
  const [formData, setFormData] = useState<AsignarMultaFormData>({
    codigo: `MUL-${Math.floor(1000 + Math.random() * 9000)}`, // Generado automáticamente
    personaId: '',
    personaNombre: '',
    dni: '',
    calle: '',
    bloque: '',
    lote: '',
    tipoMultaId: '',
    tipoMulta: '',
    fecha: new Date().toISOString().split('T')[0], // Hoy por defecto
    monto: '',
    descripcion: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // Filtrar solo Dueños de Casa para el buscador
  const dueñosDeCasa = useMemo(() => 
    MOCK_USERS_DB.filter(u => u.rol === 'DuenoDeCasa')
  , []);

  // Handlers para autocompletado
  const handlePersonaSelect = (userOpt: { value: string, label: string, data: MockUser }) => {
    const user = userOpt.data;
    setFormData(prev => ({
      ...prev,
      personaId: user.id,
      personaNombre: user.nombre,
      dni: user.dni,
      calle: user.direccion.calle,
      bloque: user.direccion.bloque,
      lote: user.direccion.lote
    }));
  };

  const handleTipoMultaSelect = (tipoOpt: { value: string, label: string, monto: number }) => {
    setFormData(prev => ({
      ...prev,
      tipoMultaId: tipoOpt.value,
      tipoMulta: tipoOpt.label,
      monto: tipoOpt.monto
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const payload = {
        idTipoMulta: parseInt(formData.tipoMultaId, 10) || 0,
        idUsuario: parseInt(formData.personaId, 10) || 0,
        monto: Number(formData.monto) || 0
      };

      const response = await api.post("api/multas", payload);
      console.log(response);

      

      alert('Multa asignada con éxito');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al asignar la multa');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    dueñosDeCasa,
    tiposMulta: TIPOS_MULTA_DB,
    handlePersonaSelect,
    handleTipoMultaSelect,
    handleSubmit
  };
}