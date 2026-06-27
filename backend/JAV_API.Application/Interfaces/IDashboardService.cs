using JAV_API.Application.DTOs.Responses;

namespace JAV_API.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardResponse> ObtenerDashboardAsync(int mes, int anio);
}