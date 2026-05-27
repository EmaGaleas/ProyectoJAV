using JAV_API.Domain.Enums;

namespace JAV_API.Application.DTOs.Requests;

public class RegistrarPagoRequest
{
    public MetodoPago MetodoPago { get; set; }
    public decimal Monto { get; set; }
    // Un pago puede cubrir múltiples mensualidades, multas o conexiones simultáneamente
    public List<int> MensualidadesIds { get; set; } = new();
    public List<int> MultasIds { get; set; } = new();
    public List<int> ConexionesIds { get; set; } = new();
}
