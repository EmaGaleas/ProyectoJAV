using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;

namespace JAV_API.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IDashboardRepository _dashboardRepository;

    public DashboardService(IDashboardRepository dashboardRepository)
    {
        _dashboardRepository = dashboardRepository;
    }

    public async Task<DashboardResponse> ObtenerDashboardAsync(int mes, int anio)
    {
        if (mes < 1 || mes > 12) throw new ArgumentException("Mes inválido.");
        if (anio < 2000 || anio > 2100) throw new ArgumentException("Año inválido.");

        return await _dashboardRepository.ObtenerResumenDashboardAsync(mes, anio);
    }
}