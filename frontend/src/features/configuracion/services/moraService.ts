import api from "./apiConfig";
 
// ─── DTOs ─────────────────────────────────────────────────────────────────────
 
export interface MoraActualDto {
  id?: number;
  monto: number;
  fechaInicio: string; // ISO "YYYY-MM-DD" — sin fechaFin (Presente)
}
 
export interface ProximaMoraDto {
  id: number;
  monto: number;
  fechaInicio: string;
}
 
export interface MoraHistorialDto {
  id: number;
  monto: number;
  fechaInicio: string;
  fechaFin: string;
  editadoPor: string;
  editadoEl: string;
}
 
// ─── Helper interno: resolver idTipoCobro de "Mora" ────────────────────────────
// Busca en el catálogo de tipos de Multa el que contenga "mora" en su descripción.
// Lanza error si no se encuentra (se asume que ya existe vía seed).
async function obtenerIdTipoCobroMora(): Promise<number> {
  const { data } = await api.get("/api/TiposCobro/multas");
  const tipoMora = data.find((t: any) =>
    t.descripcion?.toLowerCase().includes("mora")
  );
 
  if (!tipoMora) {
    throw new Error(
      "No se encontró un TipoCobro de Mora configurado en el catálogo. Verifique el seed de la base de datos."
    );
  }
 
  return tipoMora.idTipoCobro;
}
 
// ─── ENDPOINTS ────────────────────────────────────────────────────────────────
 
// GET /api/costos/mora/vigente
export async function getMoraActual(): Promise<MoraActualDto> {
  try {
    const { data } = await api.get("/api/costos/mora/vigente");
    return { id: data.id, monto: data.monto, fechaInicio: data.fechaInicio };
  } catch (error: any) {
    // El backend responde 404 cuando no hay mora configurada todavía
    if (error.response?.status === 404) {
      return { monto: 0, fechaInicio: "" };
    }
    throw error;
  }
}
 
// GET /api/costos/mora/proximos
export async function getProximasVigencias(): Promise<ProximaMoraDto[]> {
  const { data } = await api.get("/api/costos/mora/proximos");
  return data.map((item: any) => ({
    id: item.id,
    monto: item.monto,
    fechaInicio: item.fechaInicio,
  }));
}
 
// POST /api/costos
// Resuelve dinámicamente el idTipoCobro de Mora antes de registrar el costo.
export async function createProximaVigencia(
  payloadFrontend: Omit<ProximaMoraDto, "id">
): Promise<ProximaMoraDto> {
  const idTipoCobro = await obtenerIdTipoCobroMora();
 
  const requestBackend = {
    idTipoCobro,
    monto: payloadFrontend.monto,
    fechaInicio: payloadFrontend.fechaInicio,
  };
 
  const { data } = await api.post("/api/costos", requestBackend);
  return {
    id: data.id,
    monto: data.monto,
    fechaInicio: data.fechaInicio,
  };
}
 
// DELETE /api/costos/proximos/{id}
export async function deleteProximaVigencia(id: number): Promise<void> {
  await api.delete(`/api/costos/proximos/${id}`);
}
 
// GET /api/costos/mora/historial
export async function getHistorial(): Promise<MoraHistorialDto[]> {
  const { data } = await api.get("/api/costos/mora/historial");
  return data.map((item: any) => ({
    id: item.id,
    monto: item.monto,
    fechaInicio: item.fechaInicio,
    fechaFin: item.fechaFin,
    editadoPor: item.editadoPor,
    editadoEl: item.editadoEl,
  }));
}