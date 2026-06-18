import api from './apiConfig';

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface MontoVigenteDto {
  id?: number;
  monto: number;
  fechaInicio: string; 
}

export interface MesFechaDto {
  id: number;
  mes: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface VigenciaFuturaDto {
  id: number;
  monto: number;
  fechaInicio: string;
}

export interface MensualidadHistorialDto {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  monto: number;
  editadoPor: string;
  editadoEl: string;
}

// ─── ENDPOINTS ────────────────────────────────────────────────────────────────

// GET /api/costos/Mensualidad/vigentes
export async function getMontoActual(): Promise<MontoVigenteDto> {
  const { data } = await api.get("http://localhost:5209/api/costos/Mensualidad/vigentes");
  if (data && data.length > 0) {
    return { id: data[0].id, monto: data[0].monto, fechaInicio: data[0].fechaInicio };
  }
  return { monto: 0, fechaInicio: "" }; 
}

// GET /api/JornadasCobro/fechas-meses
export async function getFechasMeses(anio?: number): Promise<MesFechaDto[]> {
  const url = anio ? `http://localhost:5209/api/JornadasCobro/fechas-meses?anio=${anio}` : "/api/JornadasCobro/fechas-meses";
  const { data } = await api.get(url);
  return data;
}

// PUT /api/JornadasCobro/{id}/fecha
export async function updateFechaInicio(idJornada: number, fecha: string): Promise<void> {
  // Ajustado para coincidir con ActualizarJornadaCobroRequest del backend
  await api.put(`http://localhost:5209/api/JornadasCobro/${idJornada}/fecha`, { nuevaFechaCobro: fecha });
}

// GET /api/costos/Mensualidad/proximos
export async function getProximasVigencias(): Promise<VigenciaFuturaDto[]> {
  const { data } = await api.get("http://localhost:5209/api/costos/Mensualidad/proximos");
  return data.map((item: any) => ({
    id: item.id,
    monto: item.monto,
    fechaInicio: item.fechaInicio
  }));
}

// POST /api/costos
export async function createProximaVigencia(payloadFrontend: Omit<VigenciaFuturaDto, "id">): Promise<VigenciaFuturaDto> {
  const requestBackend = {
    idTipoCobro: 1, // Verifica que el ID 1 corresponde a "Mensualidad"
    monto: payloadFrontend.monto,
    fechaInicio: payloadFrontend.fechaInicio
  };
  
  const { data } = await api.post("http://localhost:5209/api/costos", requestBackend);
  return {
    id: data.id,
    monto: data.monto,
    fechaInicio: data.fechaInicio
  };
}

// DELETE /api/costos/proximos/{id}
export async function deleteProximaVigencia(id: number): Promise<void> {
  await api.delete(`http://localhost:5209/api/costos/proximos/${id}`);
}

// GET /api/costos/Mensualidad/historial
export async function getHistorial(): Promise<MensualidadHistorialDto[]> {
  const { data } = await api.get("http://localhost:5209/api/costos/Mensualidad/historial");
  return data;
}