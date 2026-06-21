// useAsignarMultaForm.ts
import { useState, useMemo } from 'react';
import type { AsignarMultaFormData, MockUser } from './asignarMultaTypes';
import { MOCK_USERS_DB, TIPOS_MULTA_DB } from './asignarMultaTypes';

export function useAsignarMultaForm(onClose: () => void) {
  const [formData, setFormData] = useState<AsignarMultaFormData>({
    codigo: `MUL-${Math.floor(1000 + Math.random() * 9000)}`, // Generado automáticamente
    personaId: '',
    personaNombre: '',
    dni: '',
    calle: '',
    bloque: '',
    lote: '',
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
      tipoMulta: tipoOpt.label,
      monto: tipoOpt.monto
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular llamada a API
    setTimeout(() => {
      setIsLoading(false);
      alert('Multa asignada con éxito');
      onClose();
    }, 1000);
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