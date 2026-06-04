using JAV_API.Domain.Entities;
using JAV_API.Application.DTOs.Requests;

namespace JAV_API.Application.Interfaces;

public interface IPagoRepository
{
    Task RegistrarPagoAsync(Pago pago, PagoMensualidad pagoMensualidad, Mensualidad mensualidad, Comprobante comprobante);
    Task<IEnumerable<Pago>> ObtenerHistorialIngresosAsync(FiltrarIngresosRequest? filtros = null);
}