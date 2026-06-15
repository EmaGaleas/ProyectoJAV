using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.Interfaces;

public interface ICostosRepository
{
    // Listados generales por Tipo (Multa, Mensualidad, Pegue)
    Task<IEnumerable<HistorialCostos>> ObtenerVigentesAsync(TipoCobroEnum tipoCobroEnum, DateTime fechaActual);
    Task<IEnumerable<HistorialCostos>> ObtenerProximosAsync(TipoCobroEnum tipoCobroEnum, DateTime fechaActual);
    Task<IEnumerable<HistorialCostos>> ObtenerHistorialAsync(TipoCobroEnum tipoCobroEnum);
    
    // Búsquedas específicas
    Task<HistorialCostos?> ObtenerPorIdAsync(int idCobro);
    Task<HistorialCostos?> ObtenerVigenteActualPorIdTipoCobroAsync(int idTipoCobro, DateTime fechaActual);
    Task<TipoCobro?> ObtenerTipoCobroPorIdAsync(int idTipoCobro);

    // Operaciones de escritura
    Task AgregarAsync(HistorialCostos historialCosto);
    Task ActualizarAsync(HistorialCostos historialCosto);
    Task EliminarAsync(HistorialCostos historialCosto);
    
    Task GuardarCambiosAsync();
}