using JAV_API.Domain.Entities;

namespace JAV_API.Application.Interfaces;

public interface IJornadaCobroRepository
{
    Task<JornadaCobro?> ObtenerPorIdAsync(int id);
    Task ActualizarAsync(JornadaCobro jornada);
    Task GuardarCambiosAsync();
}