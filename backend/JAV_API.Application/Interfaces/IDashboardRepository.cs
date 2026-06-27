using JAV_API.Application.DTOs.Responses;

namespace JAV_API.Application.Interfaces;

public interface IDashboardRepository
{
    Task<DashboardResponse> ObtenerResumenDashboardAsync(int mes, int anio);
}