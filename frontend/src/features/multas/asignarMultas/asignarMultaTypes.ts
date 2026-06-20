// asignarMultaTypes.ts
export interface MockUser {
  id: string;
  nombre: string;
  dni: string;
  rol: string;
  direccion: {
    calle: string;
    bloque: string;
    lote: string;
  };
}

export const MOCK_USERS_DB: MockUser[] = [
  { id: '1', nombre: 'Juan Carlos López', dni: '0801-1990-12345', rol: 'DuenoDeCasa', direccion: { calle: 'Calle 1A', bloque: 'A', lote: '15' } },
  { id: '2', nombre: 'María García', dni: '0501-1985-67890', rol: 'DuenoDeCasa', direccion: { calle: 'Calle 2B', bloque: 'C', lote: '8' } },
  { id: '3', nombre: 'Pedro Sánchez', dni: '1804-1992-54321', rol: 'Inquilino', direccion: { calle: 'Calle 3A', bloque: 'D', lote: '22' } }, // No debería aparecer
  { id: '4', nombre: 'Ana Gómez', dni: '0801-1988-11223', rol: 'DuenoDeCasa', direccion: { calle: 'Calle 4A', bloque: 'F', lote: '5' } },
];

export const TIPOS_MULTA_DB = [
  { id: '1', tipo: 'Tránsito', monto: 600 },
  { id: '2', tipo: 'Estacionamiento', monto: 500 },
  { id: '3', tipo: 'Exceso de velocidad', monto: 1200 },
  { id: '4', tipo: 'Documentación', monto: 1500 },
  { id: '5', tipo: 'Ruidos molestos', monto: 800 },
  { id: '6', tipo: 'Daños a propiedad', monto: 2500 },
];

export interface AsignarMultaFormData {
  codigo: string;
  personaId: string;
  personaNombre: string;
  dni: string;
  calle: string;
  bloque: string;
  lote: string;
  tipoMulta: string;
  fecha: string;
  monto: number | '';
  descripcion: string;
}