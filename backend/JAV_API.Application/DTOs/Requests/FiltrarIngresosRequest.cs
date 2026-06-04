using JAV_API.Domain.Enums;

namespace JAV_API.Application.DTOs.Requests;

/// <summary>
/// Filtros opcionales para el historial de ingresos.
/// Todos los campos son opcionales; si se omiten, no se aplica ese filtro.
/// </summary>
public class FiltrarIngresosRequest
{
    public TipoCobroEnum? TipoPago { get; set; }
    public string? Estado { get; set; }
    public DateTime? Desde { get; set; }
    public DateTime? Hasta { get; set; }
}
