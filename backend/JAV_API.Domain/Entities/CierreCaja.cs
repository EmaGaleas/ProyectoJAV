using JAV_API.Domain.Enums;

namespace JAV_API.Domain.Entities;

public class CierreCaja
{
    public int IdCierreCaja { get; set; }
    public int IdJornadaCobro { get; set; }
    public JornadaCobro JornadaCobro { get; set; } = null!;
    public string? UrlFirmaTesorero { get; set; }
    public int IdFiscal { get; set; }
    public Usuario Fiscal { get; set; } = null!;
    public string? UrlFirmaFiscal { get; set; }
    public EstadoAvalacion Estado { get; set; } = EstadoAvalacion.NoAvalado;
}
