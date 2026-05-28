using JAV_API.Domain.Entities;

namespace JAV_API.Application.Interfaces;

public interface IMensualidadRepository
{
    // Método que ya utiliza tu IngresoService
    Task<Mensualidad?> ObtenerPorIdAsync(int idMensualidad);
    
    // Método útil para que el frontend liste lo que debe un residente
    Task<IEnumerable<Mensualidad>> ObtenerPendientesPorUsuarioAsync(int idUsuario);
}