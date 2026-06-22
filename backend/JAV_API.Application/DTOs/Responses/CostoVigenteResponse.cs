namespace JAV_API.Application.DTOs.Response;

public class CostoVigenteResponse
{
    public int Id { get; set; }
    public int IdTipoCobro { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public string FechaInicio { get; set; } = string.Empty;
}