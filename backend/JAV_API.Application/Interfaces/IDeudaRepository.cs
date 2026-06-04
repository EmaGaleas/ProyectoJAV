using JAV_API.Application.DTOs.Responses;

namespace JAV_API.Application.Interfaces;

public interface IDeudaRepository
{
    Task<DeudasUsuarioResponse> ObtenerDeudasPendientesPorUsuarioAsync(int idUsuario);
}