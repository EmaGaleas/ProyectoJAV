using JAV_API.Domain.Entities;

namespace JAV_API.Application.Interfaces;

public interface IEgresoRepository
{
    Task RegistrarEgresoAsync(Egreso egreso);
    Task<IEnumerable<Egreso>> ObtenerHistorialEgresosAsync();
    Task<Egreso?> ObtenerEgresoPorIdAsync(int id);
    Task AprobarEgresoAsync(int id, int aprobadoPor);
    Task RechazarEgresoAsync(int id);
}