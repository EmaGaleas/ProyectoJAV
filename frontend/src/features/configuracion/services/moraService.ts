/**
 * ============================================================
 *  SERVICE — Mora
 *  Backend: .NET Web API + PostgreSQL
 *
 *  Controlador: ConfiguracionMoraController.cs
 * ============================================================
 */

import { MORA_ACTUAL, MORA_HISTORIAL } from "../types";

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface MoraActualDto {
  monto: number;
  fechaInicio: string; // ISO "YYYY-MM-DD" — sin fechaFin (Presente)
}

export interface MoraHistorialDto {
  id: number;
  monto: number;
  fechaInicio: string;
  fechaFin: string;   // siempre tiene fin porque ya fue reemplazado
  editadoPor: string;
}

export interface ProximaMoraDto {
  id: number;
  monto: number;
  fechaInicio: string;
}

// ─── GET /api/configuracion/mora/actual ──────────────────────────────────────
// Devuelve el monto de mora vigente
export async function getMoraActual(): Promise<MoraActualDto> {
  // TODO: return apiFetch('/api/configuracion/mora/actual', { method: 'GET' }, token)

  // MOCK ↓
  return mockDelay(MORA_ACTUAL);
}

// ─── GET /api/configuracion/mora/proximas-vigencias ──────────────────────────
// Lista de montos de mora programados para el futuro
export async function getProximasVigencias(): Promise<ProximaMoraDto[]> {
  // TODO: return apiFetch('/api/configuracion/mora/proximas-vigencias', { method: 'GET' }, token)

  // MOCK ↓
  return mockDelay([]);
}

// ─── POST /api/configuracion/mora/proximas-vigencias ─────────────────────────
// Programa un nuevo monto de mora para una fecha futura
// Body: { monto: number, fechaInicio: "YYYY-MM-DD" }
// El backend debe validar que fechaInicio > hoy
export async function createProximaVigencia(
  data: Omit<ProximaMoraDto, "id">,
): Promise<ProximaMoraDto> {
  // TODO:
  // return apiFetch(
  //   '/api/configuracion/mora/proximas-vigencias',
  //   { method: 'POST', body: JSON.stringify(data) },
  //   token,
  // )

  // MOCK ↓
  return mockDelay({ id: Date.now(), ...data });
}

// ─── DELETE /api/configuracion/mora/proximas-vigencias/{id} ──────────────────
export async function deleteProximaVigencia(_id: number): Promise<void> {
  // TODO:
  // return apiFetch(`/api/configuracion/mora/proximas-vigencias/${id}`, { method: 'DELETE' }, token)

  // MOCK ↓
  return mockDelay(undefined);
}

// ─── GET /api/configuracion/mora/historial ───────────────────────────────────
// Historial de todos los montos de mora que han dejado de ser vigentes
// Nota .NET: el backend cierra el registro anterior con
//   fechaFin = nuevaFechaInicio - 1 día al crear una nueva vigencia
export async function getHistorial(): Promise<MoraHistorialDto[]> {
  // TODO: return apiFetch('/api/configuracion/mora/historial', { method: 'GET' }, token)

  // MOCK ↓
  return mockDelay(MORA_HISTORIAL as MoraHistorialDto[]);
}

// ─── Helper interno ───────────────────────────────────────────────────────────
function mockDelay<T>(data: T, ms = 350): Promise<T> {
  return new Promise((res) => setTimeout(() => res(data), ms));
}
