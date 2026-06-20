import api from './apiConfig';

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export interface ConexionActualDto {
  id?: number;
  monto: number;
  fechaInicio: string; 
}

export interface ConexionHistorialDto {
  id: number;
  monto: number;
  fechaInicio: string;
  fechaFin?: string;  
  editadoPor: string;
  editadoEl?: string;
}

export interface ProximaConexionDto {
  id: number;
  monto: number;
  fechaInicio: string;
}

// ⚠️ IMPORTANTE: Verifica qué ID tiene el TipoCobro "Conexión" en tu base de datos.
const ID_TIPO_COBRO_CONEXION = 2; 

// ─── ENDPOINTS ────────────────────────────────────────────────────────────────

// GET /api/costos/Conexion/vigentes
export async function getConexionActual(): Promise<ConexionActualDto> {
  try {
    const { data } = await api.get("/api/costos/Pegue/vigentes");
    if (data && data.length > 0) {
      return { id: data[0].id, monto: data[0].monto, fechaInicio: data[0].fechaInicio };
    }
    return { monto: 0, fechaInicio: "" };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { monto: 0, fechaInicio: "" };
    }
    throw error;
  }
}

// GET /api/costos/Conexion/proximos
export async function getProximasVigencias(): Promise<ProximaConexionDto[]> {
  const { data } = await api.get("/api/costos/Pegue/proximos");
  return data.map((item: any) => ({
    id: item.id,
    monto: item.monto,
    fechaInicio: item.fechaInicio
  }));
}

// POST /api/costos
export async function createProximaVigencia(
  payloadFrontend: Omit<ProximaConexionDto, "id">
): Promise<ProximaConexionDto> {
  const requestBackend = {
    idTipoCobro: ID_TIPO_COBRO_CONEXION, 
    monto: payloadFrontend.monto,
    fechaInicio: payloadFrontend.fechaInicio
  };

  const { data } = await api.post("/api/costos", requestBackend);
  return {
    id: data.id,
    monto: data.monto,
    fechaInicio: data.fechaInicio
  };
}

// DELETE /api/costos/proximos/{id}
export async function deleteProximaVigencia(id: number): Promise<void> {
  await api.delete(`/api/costos/proximos/${id}`);
}

// GET /api/costos/Conexion/historial
export async function getHistorial(): Promise<ConexionHistorialDto[]> {
  const { data } = await api.get("/api/costos/Pegue/historial");
  return data.map((item: any) => ({
    id: item.id,
    monto: item.monto,
    fechaInicio: item.fechaInicio,
    fechaFin: item.fechaFin,
    editadoPor: item.editadoPor,
    editadoEl: item.editadoEl
  }));
}