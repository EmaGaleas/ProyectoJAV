using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;

namespace JAV_API.Application.Services;

public class ReporteService : IReporteService
{
    private readonly IReporteRepository _reporteRepository;

    public ReporteService(IReporteRepository reporteRepository)
    {
        _reporteRepository = reporteRepository;
    }

    public async Task<IEnumerable<MorosoResponse>> GetMorososAsync()
    {
        return await _reporteRepository.ObtenerMorososAsync();
    }

    public async Task<IEnumerable<BalanceResponse>> GetBalanceGeneralAsync()
    {
        return await _reporteRepository.ObtenerBalanceGeneralAsync();
    }
}