import api from './apiConfig';

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface MultaTipoDto {
  id: number;
  tipo: string;
  descripcion: string;
  monto: number;
  fechaInicio: string; 
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

// ─── ENDPOINTS ────────────────────────────────────────────────────────────────

// GET /api/costos/Multa/vigentes
export async function getMultasVigentes(): Promise<MultaTipoDto[]> {
  const { data } = await api.get("/api/costos/Multa/vigentes");
  return data
    .filter((item: any) => !item.descripcion?.toLowerCase().includes("mora"))
    .map((item: any) => ({
      id: item.id, 
      tipo: item.descripcion, // El frontend usa 'tipo' para el nombre principal
      descripcion: "", // El backend actualmente no maneja una descripción secundaria
      monto: item.monto,
      fechaInicio: item.fechaInicio
    }));
}

// POST /api/TiposCobro/multas + POST /api/costos
export async function createMulta(data: Omit<MultaTipoDto, "id">): Promise<MultaTipoDto> {
  // 1. Crear el Tipo de Cobro (Catálogo)
  const tipoRes = await api.post("/api/TiposCobro/multas", {
    descripcion: data.tipo 
  });
  const idTipoCobro = tipoRes.data.idTipoCobro;

  // 2. Registrar el Costo inicial para ese tipo
  const costoRes = await api.post("/api/costos", {
    idTipoCobro: idTipoCobro,
    monto: data.monto,
    fechaInicio: data.fechaInicio
  });

  return {
    id: costoRes.data.id,
    tipo: data.tipo,
    descripcion: data.descripcion,
    monto: costoRes.data.monto,
    fechaInicio: costoRes.data.fechaInicio
  };
}

// PUT /api/TiposCobro/multas/{id} + POST /api/costos
export async function updateMulta(id: number, data: Omit<MultaTipoDto, "id">): Promise<MultaTipoDto> {
  // 1. Buscamos el costo vigente para saber el nombre original
  const vigentesRes = await api.get("/api/costos/Multa/vigentes");
  const costoActual = vigentesRes.data.find((c: any) => c.id === id);
  if (!costoActual) throw new Error("No se encontró el costo vigente original.");

  // 2. Buscamos el catálogo de tipos para extraer su verdadero IdTipoCobro
  const tiposRes = await api.get("/api/TiposCobro/multas");
  const tipoExistente = tiposRes.data.find((t: any) => t.descripcion === costoActual.descripcion);
  if (!tipoExistente) throw new Error("No se encontró el tipo de multa base.");

  const idTipoCobro = tipoExistente.idTipoCobro;

  // 3. Si el usuario editó el nombre (tipo), actualizamos el catálogo
  if (costoActual.descripcion !== data.tipo) {
    await api.put(`/api/TiposCobro/multas/${idTipoCobro}`, {
      descripcion: data.tipo
    });
  }

  // 4. Registramos el nuevo costo para forzar el cierre del anterior y crear historial
  const costoRes = await api.post("/api/costos", {
    idTipoCobro: idTipoCobro,
    monto: data.monto,
    fechaInicio: data.fechaInicio
  });

  return { id: costoRes.data.id, ...data };
}

// DELETE /api/TiposCobro/multas/{id}
export async function deleteMulta(id: number): Promise<void> {
  const vigentesRes = await api.get("/api/costos/Multa/vigentes");
  const costoActual = vigentesRes.data.find((c: any) => c.id === id);
  if (!costoActual) throw new Error("No se encontró el costo vigente.");

  const tiposRes = await api.get("/api/TiposCobro/multas");
  const tipoExistente = tiposRes.data.find((t: any) => t.descripcion === costoActual.descripcion);
  if (!tipoExistente) throw new Error("No se encontró el tipo de multa base.");

  await api.delete(`/api/TiposCobro/multas/${tipoExistente.idTipoCobro}`);
}

// GET /api/costos/Multa/proximos
export async function getProximasVigencias(): Promise<ProximaMultaDto[]> {
  const { data } = await api.get("/api/costos/Multa/proximos");
  return data
    .filter((item: any) => !item.descripcion?.toLowerCase().includes("mora"))
    .map((item: any) => ({
      id: item.id,
      tipo: item.descripcion,
      descripcion: "",
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
    descripcion: data.descripcion, 
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

  const historial: MultaHistorialDto[] = data
    .filter((item: any) => !item.descripcion?.toLowerCase().includes("mora"))
    .map((item: any): MultaHistorialDto => ({
      id: item.id,
      tipo: item.descripcion || item.tipo,
      montoAnterior: 0,
      montoNuevo: item.monto,
      fechaInicio: item.fechaInicio,
      fechaFin: item.fechaFin || "",
      editadoPor: item.editadoPor,
      editadoEl: item.editadoEl,
    }));

  // Agrupar por tipo
  const grupos = historial.reduce<Record<string, MultaHistorialDto[]>>(
    (acc, item) => {
      (acc[item.tipo] ??= []).push(item);
      return acc;
    },
    {}
  );

  // Calcular montoAnterior
  Object.values(grupos).forEach(grupo => {
    grupo.sort(
      (a, b) =>
        new Date(a.fechaInicio).getTime() -
        new Date(b.fechaInicio).getTime()
    );

    for (let i = 1; i < grupo.length; i++) {
      grupo[i].montoAnterior = grupo[i - 1].montoNuevo;
    }
  });

  return historial;
}