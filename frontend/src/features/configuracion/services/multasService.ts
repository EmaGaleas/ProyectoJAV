/**
 * ============================================================
 *  SERVICE — Multas
 *  Backend: .NET Web API + PostgreSQL
 *
 *  Controlador: ConfiguracionMultasController.cs
 * ============================================================
 */

import { MULTAS_ACTUALES, MULTAS_HISTORIAL } from "../types";

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface MultaTipoDto {
  id: number;
  tipo: string;
  descripcion: string;
  monto: number;
  fechaInicio: string; // ISO "YYYY-MM-DD"
}

export interface MultaHistorialDto {
  id: number;
  tipo: string;
  montoAnterior: number;
  montoNuevo: number;
  fechaInicio: string;
  fechaFin: string;
  editadoPor: string;
  editadoEl: string;
}

export interface ProximaMultaDto {
  id: number;
  tipo: string;
  descripcion: string;
  monto: number;
  fechaInicio: string;
}

// ─── GET /api/configuracion/multas ────────────────────────────────────────────
// Lista de tipos de multa vigentes (sin fechaFin = Presente)
export async function getMultasVigentes(): Promise<MultaTipoDto[]> {
  // TODO: return apiFetch('/api/configuracion/multas', { method: 'GET' }, token)

  // MOCK ↓
  return mockDelay(MULTAS_ACTUALES.map((m) => ({ ...m, fechaFin: undefined as any })));
}

// ─── POST /api/configuracion/multas ───────────────────────────────────────────
// Crea un nuevo tipo de multa con vigencia inmediata
// Body: { tipo, descripcion, monto, fechaInicio }
export async function createMulta(
  data: Omit<MultaTipoDto, "id">,
): Promise<MultaTipoDto> {
  // TODO:
  // return apiFetch('/api/configuracion/multas', { method: 'POST', body: JSON.stringify(data) }, token)

  // MOCK ↓
  return mockDelay({ id: Date.now(), ...data });
}

// ─── PUT /api/configuracion/multas/{id} ───────────────────────────────────────
// Edita un tipo de multa vigente
// Body: { tipo, descripcion, monto, fechaInicio }
// El backend debe cerrar el registro anterior con fechaFin = nuevaFechaInicio - 1 día
// y crear un nuevo registro en el historial automáticamente
export async function updateMulta(
  id: number,
  data: Omit<MultaTipoDto, "id">,
): Promise<MultaTipoDto> {
  // TODO:
  // return apiFetch(`/api/configuracion/multas/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token)

  // MOCK ↓
  return mockDelay({ id, ...data });
}

// ─── DELETE /api/configuracion/multas/{id} ────────────────────────────────────
export async function deleteMulta(_id: number): Promise<void> {
  // TODO: return apiFetch(`/api/configuracion/multas/${id}`, { method: 'DELETE' }, token)

  // MOCK ↓
  return mockDelay(undefined);
}

// ─── GET /api/configuracion/multas/proximas-vigencias ─────────────────────────
// Multas programadas para el futuro (fechaInicio > hoy)
export async function getProximasVigencias(): Promise<ProximaMultaDto[]> {
  // TODO: return apiFetch('/api/configuracion/multas/proximas-vigencias', { method: 'GET' }, token)

  // MOCK ↓
  return mockDelay([]);
}

// ─── POST /api/configuracion/multas/proximas-vigencias ───────────────────────
// Programa una multa (nueva o cambio) para una fecha futura
// Body: { tipo, descripcion, monto, fechaInicio }
export async function createProximaVigencia(
  data: Omit<ProximaMultaDto, "id">,
): Promise<ProximaMultaDto> {
  // TODO:
  // return apiFetch(
  //   '/api/configuracion/multas/proximas-vigencias',
  //   { method: 'POST', body: JSON.stringify(data) },
  //   token,
  // )

  // MOCK ↓
  return mockDelay({ id: Date.now(), ...data });
}

// ─── DELETE /api/configuracion/multas/proximas-vigencias/{id} ────────────────
export async function deleteProximaVigencia(_id: number): Promise<void> {
  // TODO:
  // return apiFetch(`/api/configuracion/multas/proximas-vigencias/${id}`, { method: 'DELETE' }, token)

  // MOCK ↓
  return mockDelay(undefined);
}

// ─── GET /api/configuracion/multas/historial ─────────────────────────────────
// Historial de todos los cambios en tipos de multa
export async function getHistorial(): Promise<MultaHistorialDto[]> {
  // TODO: return apiFetch('/api/configuracion/multas/historial', { method: 'GET' }, token)

  // MOCK ↓
  return mockDelay(MULTAS_HISTORIAL as MultaHistorialDto[]);
}

// ─── Helper interno ───────────────────────────────────────────────────────────
function mockDelay<T>(data: T, ms = 350): Promise<T> {
  return new Promise((res) => setTimeout(() => res(data), ms));
}
