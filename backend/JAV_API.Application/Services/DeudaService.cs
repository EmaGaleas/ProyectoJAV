using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;

namespace JAV_API.Application.Services;

public class DeudaService
{
    private readonly IDeudaRepository _deudaRepository;

    public DeudaService(IDeudaRepository deudaRepository)
    {
        _deudaRepository = deudaRepository;
    }

    public async Task<DeudasUsuarioResponse> ObtenerDeudasPorUsuarioAsync(int idUsuario)
    {
        return await _deudaRepository.ObtenerDeudasPendientesPorUsuarioAsync(idUsuario);
    }
}