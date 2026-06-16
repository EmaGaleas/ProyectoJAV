// Archivo: JAV_API.Application.Interfaces.IPagoRepository.cs
using JAV_API.Domain.Entities;

namespace JAV_API.Application.Interfaces;

public interface IPagoRepository
{
    Task RegistrarPagoMasivoAsync(
        Pago pago, 
        Comprobante comprobante,
        List<PagoMensualidad> pagoMensualidades,
        List<PagoMulta> pagoMultas,
        List<PagoConexion> pagoConexiones,
        List<Mensualidad> mensualidades,
        List<Multa> multas,
        List<Conexion> conexiones
    );
    
    Task<IEnumerable<Pago>> ObtenerHistorialPagosAsync();

    Task<Pago?> ObtenerPagoPorIdConDetallesAsync(int idPago);

    Task<IEnumerable<Pago>> ObtenerHistorialPorUsuarioAsync(int idUsuario, DateTime? desde, DateTime? hasta);

    Task<Pago?> ObtenerPorIdAsync(int idPago);
    Task AprobarAsync(int idPago, int aprobadoPor);
    Task RechazarAsync(int idPago);
}