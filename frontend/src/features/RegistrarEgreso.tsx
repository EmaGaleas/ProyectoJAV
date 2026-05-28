import React, { useState } from 'react';
import { apiFetch } from '../services/apiClient';
import { useAuthStore } from './auth/store/authStore';

function Link() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex gap-[12px] items-center left-[24px] px-[12px] py-[10px] rounded-[8px] top-[calc(50%+0.5px)] w-[208px]" data-name="Link">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] min-w-px not-italic relative text-[#8ebfa3] text-[14px] tracking-[-0.28px]">{`Tesorero `}</p>
      <div className="relative shrink-0 size-[16px]" data-name="ep:arrow-right">
        <div className="absolute inset-[13.73%_29.36%_13.73%_32.44%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] min-w-px not-italic relative text-[#308c58] text-[14px] tracking-[-0.28px]">Egresos</p>
    </div>
  );
}

function Topbar() {
  return (
    <div className="absolute content-stretch flex flex-col h-[71px] items-start left-[256px] p-[24px] top-0 w-[1664px]" data-name="Topbar">
      <Link />
    </div>
  );
}

export default function RegistrarEgreso() {
  const [formData, setFormData] = useState({
    cliente: '',
    numeroComprobante: '',
    fecha: '',
    categoria: '',
    monto: '',
    factura: null as File | null,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        setError("El archivo excede el tamaño máximo permitido de 5MB.");
        e.target.value = ""; 
        return;
      }
      setError(null); 
      setFormData(prev => ({ ...prev, factura: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        Titulo: `Egreso a ${formData.cliente} (${formData.categoria})`,
        Descripcion: `Comprobante: ${formData.numeroComprobante}, Categoría: ${formData.categoria}`,
        Monto: parseFloat(formData.monto),
        Fecha: new Date(formData.fecha).toISOString(),
        Url: formData.factura ? formData.factura.name : '', 
      };

      await apiFetch('/api/Egresos', {
        method: 'POST',
        body: JSON.stringify(payload)
      }, token || undefined);

      alert('Egreso registrado exitosamente');
      
      setFormData({
        cliente: '',
        numeroComprobante: '',
        fecha: '',
        categoria: '',
        monto: '',
        factura: null,
      });
    } catch (err: any) {
      console.error('Error al registrar egreso:', err);
      setError(err.message || 'Ocurrió un error al registrar el egreso.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f2f2f2] relative size-full min-h-[900px]" data-name="Registrar Egresos">
      <Topbar />
      
      <form onSubmit={handleSubmit} className="relative w-full h-full">
        {/* Fondo blanco del formulario de Egreso */}
        <div className="absolute bg-white h-[700px] left-[352px] rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[100px] w-[648px]" data-name="forms Egreso" />
        
        {/* Input: Cliente */}
        <div className="absolute flex flex-col left-[387px] top-[130px] w-[576px] z-10">
          <label className="font-['Montserrat:Light',sans-serif] font-light text-[#514f4f] text-[18px] mb-2">Cliente:</label>
          <input 
            type="text" 
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            placeholder="Ingrese nombre del cliente" 
            className="h-[52px] w-full border border-[#cfd3d4] rounded-[8px] px-[16px] py-[8px] text-[16px] text-[#514f4f] placeholder-[#abafb1] focus:outline-none focus:border-[#8ebfa3] focus:ring-1 focus:ring-[#8ebfa3]"
            required
          />
        </div>

        {/* Input: Numero de comprobante */}
        <div className="absolute flex flex-col left-[387px] top-[244px] w-[576px] z-10">
          <label className="font-['Montserrat:Light',sans-serif] font-light text-[#514f4f] text-[18px] mb-2">Numero de comprobante:</label>
          <input 
            type="text" 
            name="numeroComprobante"
            value={formData.numeroComprobante}
            onChange={handleChange}
            placeholder="Ingrese el número de comprobante" 
            className="h-[52px] w-full border border-[#cfd3d4] rounded-[8px] px-[16px] py-[8px] text-[16px] text-[#514f4f] placeholder-[#abafb1] focus:outline-none focus:border-[#8ebfa3] focus:ring-1 focus:ring-[#8ebfa3]"
            required
          />
        </div>

        {/* Input: Fecha */}
        <div className="absolute flex flex-col left-[387px] top-[354px] w-[576px] z-10">
          <label className="font-['Montserrat:Light',sans-serif] font-light text-[#514f4f] text-[18px] mb-2">Fecha:</label>
          <input 
            type="date" 
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="h-[52px] w-full border border-[#cfd3d4] rounded-[8px] px-[16px] py-[8px] text-[16px] text-[#514f4f] placeholder-[#abafb1] focus:outline-none focus:border-[#8ebfa3] focus:ring-1 focus:ring-[#8ebfa3]"
            required
          />
        </div>

        {/* Input: Categoria del Egreso */}
        <div className="absolute flex flex-col left-[387px] top-[460px] w-[576px] z-10">
          <label className="font-['Montserrat:Light',sans-serif] font-light text-[#514f4f] text-[18px] mb-2">Categoria del Egreso:</label>
          <select 
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="h-[52px] w-full border border-[#cfd3d4] rounded-[8px] px-[16px] py-[8px] text-[16px] text-[#514f4f] bg-white focus:outline-none focus:border-[#8ebfa3] focus:ring-1 focus:ring-[#8ebfa3]"
            required
          >
            <option value="" disabled className="text-[#abafb1]">Seleccione la categoria del egreso</option>
            <option value="operativo">Gasto Operativo</option>
            <option value="financiero">Gasto Financiero</option>
            <option value="inversion">Inversión</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* Input: Monto */}
        <div className="absolute flex flex-col left-[387px] top-[566px] w-[576px] z-10">
          <label className="font-['Montserrat:Light',sans-serif] font-light text-[#514f4f] text-[18px] mb-2">Monto</label>
          <input 
            type="number" 
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            placeholder="Ingrese el monto" 
            className="h-[52px] w-full border border-[#cfd3d4] rounded-[8px] px-[16px] py-[8px] text-[16px] text-[#514f4f] placeholder-[#abafb1] focus:outline-none focus:border-[#8ebfa3] focus:ring-1 focus:ring-[#8ebfa3]"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Fondo blanco del frame de la factura */}
        <div className="absolute bg-white h-[600px] left-[1050px] rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[100px] w-[300px] z-0" data-name="frame factura" />
        
        {/* Input: Factura Upload */}
        <div className="absolute bg-[#dbdbdb] h-[553px] left-[1072px] overflow-hidden rounded-[15px] top-[124px] w-[259px] z-10 flex flex-col items-center justify-center cursor-pointer hover:bg-[#c9c9c9] transition-colors">
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer relative p-4">
            <input 
              type="file" 
              name="factura"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              accept=".pdf,.png,.jpg,.jpeg"
            />
            <div className="size-[40px] mb-4 text-[#514f4f] pointer-events-none">
              <svg className="block size-full" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] text-[#514f4f] text-[20px] text-center w-[214px] pointer-events-none break-words">
              {formData.factura ? formData.factura.name : "Adjunta su factura aqui"}
            </p>
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="absolute left-[1050px] top-[710px] w-[300px] text-red-500 text-sm text-center font-['Montserrat:Medium',sans-serif]">
            {error}
          </div>
        )}

        {/* Boton: Registrar Egreso */}
        <button 
          type="submit"
          disabled={isLoading}
          className="absolute bg-[#8ebfa3] h-[48px] left-[1050px] rounded-[15px] top-[750px] w-[300px] font-['Montserrat:Medium',sans-serif] font-medium text-[#f2f2f2] text-[20px] flex items-center justify-center hover:bg-[#7ead91] transition-colors z-10 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Registrando...' : 'Registrar Egreso'}
        </button>
      </form>
    </div>
  );
}