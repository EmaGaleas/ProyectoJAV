using JAV_API.Domain.Entities;

namespace JAV_API.Application.Interfaces;

public interface IMultaRepository
{
    Task<IEnumerable<Multa>> ObtenerPorIdsAsync(IEnumerable<int> ids);
}