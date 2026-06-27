using JAV_API.Application.DTOs.Responses;

namespace JAV_API.Application.Interfaces;

public interface IReporteService
{
    Task<IEnumerable<MorosoResponse>> GetMorososAsync();
    Task<IEnumerable<BalanceResponse>> GetBalanceGeneralAsync();
}