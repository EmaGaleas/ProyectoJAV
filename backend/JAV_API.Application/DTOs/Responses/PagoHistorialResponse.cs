namespace JAV_API.Application.DTOs.Responses;

public class PagoLineaResponse
{
    public string  Concepto   { get; set; } = string.Empty;
    public string  FechaVence { get; set; } = string.Empty;
    public decimal Monto      { get; set; }
    public decimal Mora       { get; set; }
    public string  Tipo       { get; set; } = string.Empty; // "mensualidad" | "multa"
}

public class PagoHistorialResponse
{
    public int     Id                  { get; set; }
    public string  Codigo              { get; set; } = string.Empty;
    public string  Titular             { get; set; } = string.Empty;
    public string  Dni                 { get; set; } = string.Empty;
    public string  TipoIngreso         { get; set; } = string.Empty;
    public string  Fecha               { get; set; } = string.Empty;
    public decimal Total               { get; set; }
    public string  Estado              { get; set; } = string.Empty;
    public string  MetodoPago          { get; set; } = string.Empty;
    public string? CodigoTransferencia { get; set; }
    public List<PagoLineaResponse> Lineas { get; set; } = new();
}
