using JAV_API.Domain.Entities;

namespace JAV_API.Application.Interfaces;

public interface IMensualidadRepository
{
    // Este es el método que invoca tu IngresoService
    Task<Mensualidad?> ObtenerPorIdAsync(int idMensualidad);
}