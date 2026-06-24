// asignarMultaTypes.ts
export interface UserDTO {
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

export interface AsignarMultaFormData {
  codigo: string;
  personaId: string;
  personaNombre: string;
  dni: string;
  calle: string;
  bloque: string;
  lote: string;
  tipoMultaId: string;
  tipoMulta: string;
  fecha: string;
  monto: number | '';
  descripcion: string;
}
