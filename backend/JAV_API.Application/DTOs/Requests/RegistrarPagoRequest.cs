using System.IO;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.DTOs.Requests;

public class RegistrarPagoRequest
{
    public int RegistradoPor { get; set; }
    public MetodoPago MetodoPago { get; set; }
    public decimal Monto { get; set; }
    public int CodigoComprobante { get; set; }
    
    public Stream ComprobanteStream { get; set; } = Stream.Null;
    public string ComprobanteNombre { get; set; } = string.Empty;

    public List<int> MensualidadesIds { get; set; } = new();
    public List<int> MultasIds { get; set; } = new();
    public List<int> ConexionesIds { get; set; } = new();
}