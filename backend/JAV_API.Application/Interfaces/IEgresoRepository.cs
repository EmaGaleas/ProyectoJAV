using JAV_API.Domain.Entities;

namespace JAV_API.Application.Interfaces;

public interface IEgresoRepository
{
    Task RegistrarEgresoAsync(Egreso egreso);
    Task<IEnumerable<Egreso>> ObtenerHistorialEgresosAsync();
}