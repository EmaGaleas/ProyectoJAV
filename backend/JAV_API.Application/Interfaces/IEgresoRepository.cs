using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.Interfaces;

public interface IEgresoRepository
{
    Task RegistrarEgresoAsync(Egreso egreso);
    Task<IEnumerable<Egreso>> ObtenerHistorialEgresosAsync();
    Task<Egreso?> ObtenerPorIdAsync(int idEgreso);
    Task AprobarAsync(int idEgreso, int aprobadoPor);
    Task RechazarAsync(int idEgreso);
}