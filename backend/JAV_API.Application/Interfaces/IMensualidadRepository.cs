using JAV_API.Domain.Entities;

namespace JAV_API.Application.Interfaces;

public interface IMensualidadRepository
{
    // Añade este método a tu IMensualidadRepository y su implementación
    Task<IEnumerable<Mensualidad>> ObtenerPorIdsAsync(IEnumerable<int> ids);
    
    // Método útil para que el frontend liste lo que debe un residente
    Task<IEnumerable<Mensualidad>> ObtenerPendientesPorUsuarioAsync(int idUsuario);
}