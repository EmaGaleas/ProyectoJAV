// useAsignarMultaForm.ts
import { useState, useEffect } from 'react';
import type { AsignarMultaFormData, UserDTO } from './asignarMultaTypes';
import { api } from "../../../services/api";
import type { TipoMulta } from '../types';

export function useAsignarMultaForm(
  onClose: () => void,
  tiposMultaDb: TipoMulta[],
  onSuccess?: () => void
) {
  const [formData, setFormData] = useState<AsignarMultaFormData>({
    codigo: `MUL-${Math.floor(1000 + Math.random() * 9000)}`, // Mantenemos como generador local o adáptalo si la DB lo asigna
    personaId: '',
    personaNombre: '',
    dni: '',
    calle: '',
    bloque: '',
    lote: '',
    tipoMultaId: '',
    tipoMulta: '',
    fecha: new Date().toISOString().split('T')[0],
    monto: '',
    descripcion: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [dueñosDeCasa, setDueñosDeCasa] = useState<UserDTO[]>([]);

  // Extraer el catálogo omitiendo la opción "Todos" que se usa para los filtros
  const tiposMulta = tiposMultaDb
    .filter(t => t.idMulta !== 0)
    .map(t => ({
      id: t.idMulta.toString(),
      tipo: t.tipoDescripcion,
      monto: (t as any).monto || 0 // Ajusta si la API trae el monto por defecto, de lo contrario deja 0
    }));

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get("api/usuarios");
        // Filtra por el Rol según cómo lo envíe tu backend
        const dueños = response.data.filter((u: any) => u.rol === 'DuenoDeCasa' || u.idRol === 1); 
        setDueñosDeCasa(dueños);
      } catch (error) {
        console.error('Error al cargar dueños de casa:', error);
      }
    };
    fetchUsuarios();
  }, []);

  const handlePersonaSelect = (userOpt: { value: string, label: string, data: UserDTO }) => {
    const user = userOpt.data;
    setFormData(prev => ({
      ...prev,
      personaId: user.id,
      personaNombre: user.nombre,
      dni: user.dni,
      calle: user.direccion?.calle || '',
      bloque: user.direccion?.bloque || '',
      lote: user.direccion?.lote || ''
    }));
  };

  const handleTipoMultaSelect = (tipoOpt: { value: string, label: string, monto: number }) => {
    setFormData(prev => ({
      ...prev,
      tipoMultaId: tipoOpt.value,
      tipoMulta: tipoOpt.label,
      monto: tipoOpt.monto || 0
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

      await api.post("api/multas", payload);
      alert('Multa asignada con éxito');
      
      if(onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al asignar multa:', error);
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
    tiposMulta,
    handlePersonaSelect,
    handleTipoMultaSelect,
    handleSubmit
  };
}
