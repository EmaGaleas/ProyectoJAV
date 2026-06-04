using JAV_API.Application.DTOs.Responses;

namespace JAV_API.Application.Interfaces;

public interface IClienteRepository
{
    Task<IEnumerable<ClienteBusquedaResponse>> ObtenerClientesPorFiltroAsync(string? calle, string? bloque, int? lote);
}