/**
 * ============================================================
 *  SERVICE — Mensualidad
 *  Backend: .NET Web API + PostgreSQL
 *
 *  Patrón de importación cuando el API esté listo:
 *    import { apiFetch } from '../../../../services/apiClient'
 *    import { useAuthStore } from '../../../auth/store/authStore'
 *
 *  Todos los endpoints apuntan al controlador:
 *    ConfiguracionMensualidadController.cs
 * ============================================================
 */

import { MENSUALIDAD_HISTORIAL, MESES_ACTUALES } from "../types";

// ─── DTOs (deben coincidir con los records del backend) ───────────────────────

export interface MontoVigenteDto {
  monto: number;
  fechaInicio: string; // ISO "YYYY-MM-DD"
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

// ─── GET /api/configuracion/mensualidad/monto-actual ─────────────────────────
// Devuelve el monto vigente y su fecha de inicio
export async function getMontoActual(): Promise<MontoVigenteDto> {
  // TODO: descomentar cuando el endpoint esté listo
  // const token = useAuthStore.getState().token
  // return apiFetch('/api/configuracion/mensualidad/monto-actual', { method: 'GET' }, token)

  // MOCK ↓ eliminar este bloque al conectar el backend
  return mockDelay({ monto: 300, fechaInicio: "2025-01-01" });
}

// ─── GET /api/configuracion/mensualidad/fechas-meses ─────────────────────────
// Devuelve las fechas de inicio de los 12 meses del año activo
export async function getFechasMeses(): Promise<MesFechaDto[]> {
  // TODO: return apiFetch('/api/configuracion/mensualidad/fechas-meses', { method: 'GET' }, token)

  // MOCK ↓
  return mockDelay(MESES_ACTUALES.map((m) => ({ ...m })));
}

// ─── PUT /api/configuracion/mensualidad/meses/{id}/fecha-inicio ───────────────
// Actualiza la fecha de inicio de un mes específico
// Body: { fechaInicio: "YYYY-MM-DD" }
export async function updateFechaInicio(
  _mesId: number,
  _fechaInicio: string,
): Promise<void> {
  // TODO:
  // return apiFetch(
  //   `/api/configuracion/mensualidad/meses/${mesId}/fecha-inicio`,
  //   { method: 'PUT', body: JSON.stringify({ fechaInicio }) },
  //   token,
  // )

  // MOCK ↓
  return mockDelay(undefined);
}

// ─── GET /api/configuracion/mensualidad/proximas-vigencias ───────────────────
// Lista de montos programados para entrar en vigencia en el futuro
export async function getProximasVigencias(): Promise<VigenciaFuturaDto[]> {
  // TODO: return apiFetch('/api/configuracion/mensualidad/proximas-vigencias', { method: 'GET' }, token)

  // MOCK ↓
  return mockDelay([]);
}

// ─── POST /api/configuracion/mensualidad/proximas-vigencias ──────────────────
// Programa un nuevo monto futuro
// Body: { monto: number, fechaInicio: "YYYY-MM-DD" }
export async function createProximaVigencia(
  data: Omit<VigenciaFuturaDto, "id">,
): Promise<VigenciaFuturaDto> {
  // TODO:
  // return apiFetch(
  //   '/api/configuracion/mensualidad/proximas-vigencias',
  //   { method: 'POST', body: JSON.stringify(data) },
  //   token,
  // )

  // MOCK ↓
  return mockDelay({ id: Date.now(), ...data });
}

// ─── DELETE /api/configuracion/mensualidad/proximas-vigencias/{id} ────────────
export async function deleteProximaVigencia(_id: number): Promise<void> {
  // TODO:
  // return apiFetch(
  //   `/api/configuracion/mensualidad/proximas-vigencias/${id}`,
  //   { method: 'DELETE' },
  //   token,
  // )

  // MOCK ↓
  return mockDelay(undefined);
}

// ─── GET /api/configuracion/mensualidad/historial ────────────────────────────
// Historial completo de cambios de monto (paginado en backend si crece mucho)
export async function getHistorial(): Promise<MensualidadHistorialDto[]> {
  // TODO: return apiFetch('/api/configuracion/mensualidad/historial', { method: 'GET' }, token)

  // MOCK ↓
  return mockDelay(MENSUALIDAD_HISTORIAL as MensualidadHistorialDto[]);
}

// ─── Helper interno ───────────────────────────────────────────────────────────
function mockDelay<T>(data: T, ms = 350): Promise<T> {
  return new Promise((res) => setTimeout(() => res(data), ms));
}
