using JAV_API.Domain.Entities;

namespace JAV_API.Application.Interfaces;

public interface IConexionRepository
{
    Task<IEnumerable<Conexion>> ObtenerPorIdsAsync(IEnumerable<int> ids);
}