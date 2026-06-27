import api from './apiConfig';

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface MultaTipoDto {
  id: number;
  tipo: string;
  monto: number;
  fechaInicio: string; 
}

export interface MultaHistorialDto {
  id: number;
  multaAfectada: string; 
  monto: number;
  fechaInicio: string;
  fechaFin: string;
  editadoPor: string;
  editadoEl: string;
}

export interface ProximaMultaDto {
  id: number;
  tipo: string;
  monto: number;
  fechaInicio: string;
}

// ─── ENDPOINTS ────────────────────────────────────────────────────────────────

// GET /api/costos/Multa/vigentes
export async function getMultasVigentes(): Promise<MultaTipoDto[]> {
  const { data } = await api.get("/api/costos/Multa/vigentes");
  return data
    .filter((item: any) => !item.descripcion?.toLowerCase().includes("mora"))
    .map((item: any) => ({
      id: item.id, 
      tipo: item.descripcion,
      monto: item.monto,
      fechaInicio: item.fechaInicio
    }));
}

// POST /api/TiposCobro/multas + POST /api/costos
export async function createMulta(data: Omit<MultaTipoDto, "id">): Promise<MultaTipoDto> {
  const tipoRes = await api.post("/api/TiposCobro/multas", {
    descripcion: data.tipo 
  });
  const idTipoCobro = tipoRes.data.idTipoCobro;

  const costoRes = await api.post("/api/costos", {
    idTipoCobro: idTipoCobro,
    monto: data.monto,
    fechaInicio: data.fechaInicio
  });

  return {
    id: costoRes.data.id,
    tipo: data.tipo,
    monto: costoRes.data.monto,
    fechaInicio: costoRes.data.fechaInicio
  };
}

// PUT /api/TiposCobro/multas/{id} (Solo actualiza el nombre en el catálogo)
export async function updateMulta(id: number, tipoNuevo: string): Promise<void> {
  const vigentesRes = await api.get("/api/costos/Multa/vigentes");
  const costoActual = vigentesRes.data.find((c: any) => c.id === id);
  if (!costoActual) throw new Error("No se encontró el costo vigente original.");

  const tiposRes = await api.get("/api/TiposCobro/multas");
  const tipoExistente = tiposRes.data.find((t: any) => t.descripcion === costoActual.descripcion);
  if (!tipoExistente) throw new Error("No se encontró el tipo de multa base.");

  if (costoActual.descripcion !== tipoNuevo) {
    await api.put(`/api/TiposCobro/multas/${tipoExistente.idTipoCobro}`, {
      descripcion: tipoNuevo
    });
  }
}

// GET /api/costos/Multa/proximos
export async function getProximasVigencias(): Promise<ProximaMultaDto[]> {
  const { data } = await api.get("/api/costos/Multa/proximos");
  return data
    .filter((item: any) => !item.descripcion?.toLowerCase().includes("mora"))
    .map((item: any) => ({
      id: item.id,
      tipo: item.descripcion,
      monto: item.monto,
      fechaInicio: item.fechaInicio
    }));
}

// POST /api/costos (Reutilizando TipoCobro si existe)
export async function createProximaVigencia(data: Omit<ProximaMultaDto, "id">): Promise<ProximaMultaDto> {
  const tiposRes = await api.get("/api/TiposCobro/multas");
  const tipoExistente = tiposRes.data.find((t: any) => t.descripcion === data.tipo);
  
  let idTipo = tipoExistente?.idTipoCobro;
  
  if (!idTipo) {
    const nuevoTipo = await api.post("/api/TiposCobro/multas", { descripcion: data.tipo });
    idTipo = nuevoTipo.data.idTipoCobro;
  }

  const { data: costoData } = await api.post("/api/costos", {
    idTipoCobro: idTipo,
    monto: data.monto,
    fechaInicio: data.fechaInicio
  });

  return { 
    id: costoData.id, 
    tipo: data.tipo, 
    monto: costoData.monto, 
    fechaInicio: costoData.fechaInicio 
  };
}

// DELETE /api/costos/proximos/{id}
export async function deleteProximaVigencia(id: number): Promise<void> {
  await api.delete(`/api/costos/proximos/${id}`);
}

// GET /api/costos/Multa/historial
export async function getHistorial(): Promise<MultaHistorialDto[]> {
  const { data } = await api.get("/api/costos/Multa/historial");

  return data
    .filter((item: any) => !item.descripcion?.toLowerCase().includes("mora"))
    .map((item: any): MultaHistorialDto => ({
      id: item.id,
      multaAfectada: item.descripcion, // Tomamos la descripción que acabas de añadir al backend
      monto: item.monto,
      fechaInicio: item.fechaInicio,
      fechaFin: item.fechaFin || "",
      editadoPor: item.editadoPor,
      editadoEl: item.editadoEl,
    }))
    // Opcional pero recomendado: ordenamos del más reciente al más antiguo
    .sort((a: MultaHistorialDto, b: MultaHistorialDto) => 
      new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    );
}