/**
 * ============================================================
 *  SERVICE — Conexión
 *  Backend: .NET Web API + PostgreSQL
 *
 *  Controlador: ConfiguracionConexionController.cs
 * ============================================================
 */

import { CONEXION_ACTUAL, CONEXION_HISTORIAL } from "../types";

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface ConexionActualDto {
  monto: number;
  fechaInicio: string; // ISO "YYYY-MM-DD" — sin fechaFin (Presente)
}

export interface ConexionHistorialDto {
  id: number;
  monto: number;
  fechaInicio: string;
  fechaFin?: string;  // opcional: el registro más reciente puede no tener fechaFin
  editadoPor: string;
}

export interface ProximaConexionDto {
  id: number;
  monto: number;
  fechaInicio: string;
}

// ─── GET /api/configuracion/conexion/actual ───────────────────────────────────
// Devuelve la tarifa de conexión vigente
export async function getConexionActual(): Promise<ConexionActualDto> {
  // TODO: return apiFetch('/api/configuracion/conexion/actual', { method: 'GET' }, token)

  // MOCK ↓
  return mockDelay({ monto: CONEXION_ACTUAL.monto, fechaInicio: CONEXION_ACTUAL.fechaInicio });
}

// ─── GET /api/configuracion/conexion/proximas-vigencias ───────────────────────
// Lista de tarifas de conexión programadas para el futuro
export async function getProximasVigencias(): Promise<ProximaConexionDto[]> {
  // TODO: return apiFetch('/api/configuracion/conexion/proximas-vigencias', { method: 'GET' }, token)

  // MOCK ↓
  return mockDelay([]);
}

// ─── POST /api/configuracion/conexion/proximas-vigencias ──────────────────────
// Programa una nueva tarifa de conexión para una fecha futura
// Body: { monto: number, fechaInicio: "YYYY-MM-DD" }
// El backend valida: fechaInicio > hoy
// Al activarse (job o trigger): cierra anterior con fechaFin = nuevaFechaInicio - 1
export async function createProximaVigencia(
  data: Omit<ProximaConexionDto, "id">,
): Promise<ProximaConexionDto> {
  // TODO:
  // return apiFetch(
  //   '/api/configuracion/conexion/proximas-vigencias',
  //   { method: 'POST', body: JSON.stringify(data) },
  //   token,
  // )

  // MOCK ↓
  return mockDelay({ id: Date.now(), ...data });
}

// ─── DELETE /api/configuracion/conexion/proximas-vigencias/{id} ───────────────
export async function deleteProximaVigencia(_id: number): Promise<void> {
  // TODO:
  // return apiFetch(`/api/configuracion/conexion/proximas-vigencias/${id}`, { method: 'DELETE' }, token)

  // MOCK ↓
  return mockDelay(undefined);
}

// ─── GET /api/configuracion/conexion/historial ────────────────────────────────
// Historial de todas las tarifas de conexión pasadas
export async function getHistorial(): Promise<ConexionHistorialDto[]> {
  // TODO: return apiFetch('/api/configuracion/conexion/historial', { method: 'GET' }, token)

  // MOCK ↓
  return mockDelay(CONEXION_HISTORIAL as ConexionHistorialDto[]);
}

// ─── Helper interno ───────────────────────────────────────────────────────────
function mockDelay<T>(data: T, ms = 350): Promise<T> {
  return new Promise((res) => setTimeout(() => res(data), ms));
}
