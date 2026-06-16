using JAV_API.Application.DTOs.Request;
using JAV_API.Application.DTOs.Response;

namespace JAV_API.Application.Interfaces;

public interface ITipoCobroService
{
    Task<IEnumerable<TipoCobroResponse>> ObtenerTiposMultaAsync();
    Task<TipoCobroResponse> CrearTipoMultaAsync(CrearTipoMultaRequest request);
    Task<TipoCobroResponse> ActualizarTipoMultaAsync(int id, ActualizarTipoMultaRequest request);
    Task EliminarTipoMultaAsync(int id);
}