using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;

namespace JAV_API.Application.Services;

public class ClienteService
{
    private readonly IClienteRepository _clienteRepository;

    public ClienteService(IClienteRepository clienteRepository)
    {
        _clienteRepository = clienteRepository;
    }

    public async Task<IEnumerable<ClienteBusquedaResponse>> BuscarClientesAsync(string? calle, string? bloque, int? lote)
    {
        return await _clienteRepository.ObtenerClientesPorFiltroAsync(calle, bloque, lote);
    }
}