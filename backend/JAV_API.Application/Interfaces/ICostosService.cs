using JAV_API.Application.DTOs.Request;
using JAV_API.Application.DTOs.Response;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.Interfaces;

public interface ICostosService
{
    // Obtiene los costos actuales (FechaEmision <= Hoy y FechaAnulacion nula)
    Task<IEnumerable<CostoVigenteResponse>> ObtenerCostosVigentesAsync(TipoCobroEnum tipoCobro);

    // Obtiene los costos programados (FechaEmision > Hoy)
    Task<IEnumerable<CostoVigenteResponse>> ObtenerProximasVigenciasAsync(TipoCobroEnum tipoCobro);

    // Obtiene el registro de costos anulados/pasados
    Task<IEnumerable<CostoHistorialResponse>> ObtenerHistorialAsync(TipoCobroEnum tipoCobro);

    // Registra un nuevo costo (si es para hoy, cierra el anterior; si es futuro, lo programa)
    Task<CostoVigenteResponse> RegistrarCostoAsync(RegistrarCostoRequest request, int idUsuarioEditor);

    // Elimina una vigencia futura programada por error
    Task EliminarProximaVigenciaAsync(int idCobro);

    Task<CostoVigenteResponse?> ObtenerMoraActualAsync();
}