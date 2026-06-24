import type { MultaRecord } from "../types";
import { api } from "../../../services/api";

export const MOCK_MULTAS: MultaRecord[] = [
  {
    idMulta: "1",
    idUsuario: "3",
    codigoMulta: "MUL-1001",
    nombreUsuario: "Juan Pérez",
    dni: "0501-1990-12345",
    ubicacion: { street: "CALLE1A", block: "A", lot: "12" },
    tipoDescripcion: "Estacionamiento",
    fecha: "2026-06-15",
    monto: 500,

    estado: "Pendiente",
  },
  {
    idMulta: "2",
    idUsuario: "5",
    codigoMulta: "MUL-1002",
    nombreUsuario: "María López",
    dni: "0801-1985-67890",
    ubicacion: { street: "CALLE2C", block: "B", lot: "4" },
    tipoDescripcion: "Exceso de velocidad",
    fecha: "2026-06-14",
    monto: 1200,

    estado: "Aprobado",
  },
  {
    idMulta: "3",
    idUsuario: "6",
    codigoMulta: "MUL-1003",
    nombreUsuario: "Carlos Martínez",
    dni: "0501-1992-54321",
    ubicacion: { street: "CALLE3D", block: "C-2", lot: "15" },
    tipoDescripcion: "Tránsito",
    fecha: "2026-06-12",
    monto: 800,
    estado: "Aprobado",
  },
];

export const getMultas = async () => {
  const { data } = await api.get("api/multas");
  return data;
};

export const getUserMultado = async (id: string) => {
  const { data } = await api.get(`api/usuarios/${id}`);
  return data;
};
