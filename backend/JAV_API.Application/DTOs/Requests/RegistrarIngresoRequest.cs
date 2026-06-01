using System.IO;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.DTOs.Requests;

public class RegistrarIngresoRequest
{
    public int IdMensualidad { get; set; }
    public int RegistradoPor { get; set; }
    public MetodoPago MetodoPago { get; set; }
    public decimal Monto { get; set; }
    public int CodigoComprobante { get; set; }
    
    public Stream ComprobanteStream { get; set; } = Stream.Null;
    public string ComprobanteNombre { get; set; } = string.Empty;
}