import type { MultaRecord } from '../types';

export const MOCK_MULTAS: MultaRecord[] = [
  { 
    id: '1', codigoMulta: 'MUL-1001', personaMultada: 'Juan Pérez', dni: '0501-1990-12345', 
    ubicacion: { street: 'CALLE1A', block: 'A', lot: '12' }, 
    tipoMulta: 'Estacionamiento', fecha: '2026-06-15', monto: 500, motivo: 'Vehículo estacionado en zona peatonal bloqueando el paso de transeúntes.', status: 'Pendiente' 
  },
  { 
    id: '2', codigoMulta: 'MUL-1002', personaMultada: 'María López', dni: '0801-1985-67890', 
    ubicacion: { street: 'CALLE2C', block: 'B', lot: '4' }, 
    tipoMulta: 'Exceso de velocidad', fecha: '2026-06-14', monto: 1200, motivo: 'Conducía a 90km/h en zona escolar de 30km/h.', status: 'Aprobado' 
  },
  { 
    id: '3', codigoMulta: 'MUL-1003', personaMultada: 'Carlos Martínez', dni: '0501-1992-54321', 
    ubicacion: { street: 'CALLE3D', block: 'C-2', lot: '15' }, 
    tipoMulta: 'Tránsito', fecha: '2026-06-12', monto: 800, motivo: 'Se saltó el semáforo en rojo en intersección concurrida.', status: 'Aprobado' 
  },
];