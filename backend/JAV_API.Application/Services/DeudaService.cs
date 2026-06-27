using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;

namespace JAV_API.Application.Services;

public class DeudaService
{
    private readonly IDeudaRepository _deudaRepository;
    private readonly ICostosService _costosService;

    public DeudaService(IDeudaRepository deudaRepository, ICostosService costosService)
    {
        _deudaRepository = deudaRepository;
        _costosService = costosService;
    }

    public async Task<DeudasUsuarioResponse> ObtenerDeudasPorUsuarioAsync(int idUsuario)
    {
        // 1. Obtener la mora dinámica vigente
        var moraActualResponse = await _costosService.ObtenerMoraActualAsync();
        decimal valorMora = moraActualResponse?.Monto ?? 0m;

        // 2. Pasar el valor exacto al repositorio para que construya el Read Model
        return await _deudaRepository.ObtenerDeudasPendientesPorUsuarioAsync(idUsuario, valorMora);
    }
}