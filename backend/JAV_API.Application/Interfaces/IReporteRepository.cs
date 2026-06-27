using JAV_API.Application.DTOs.Responses;

namespace JAV_API.Application.Interfaces;

public interface IReporteRepository
{
    Task<IEnumerable<MorosoResponse>> ObtenerMorososAsync();
    Task<IEnumerable<BalanceResponse>> ObtenerBalanceGeneralAsync();
}