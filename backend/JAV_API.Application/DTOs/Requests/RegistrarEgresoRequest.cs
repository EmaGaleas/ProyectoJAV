using System.IO;

namespace JAV_API.Application.DTOs.Requests;

public class RegistrarEgresoRequest
{
    public int RegistradoPor { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    
    // Cambiado: Tipos primitivos de .NET, cero dependencias web
    public Stream EvidenciaStream { get; set; } = Stream.Null;
    public string EvidenciaNombre { get; set; } = string.Empty;
}