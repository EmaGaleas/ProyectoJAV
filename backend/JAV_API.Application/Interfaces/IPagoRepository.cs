using JAV_API.Domain.Entities;

namespace JAV_API.Application.Interfaces;

public interface IPagoRepository
{
    // Agregamos el parámetro Comprobante
    Task RegistrarPagoAsync(Pago pago, PagoMensualidad pagoMensualidad, Mensualidad mensualidad, Comprobante comprobante);
    Task<IEnumerable<Pago>> ObtenerHistorialIngresosAsync();
}