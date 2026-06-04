using Microsoft.AspNetCore.Mvc;
using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.Services;
using JAV_API.Domain.Enums;

namespace JAV_API.Controllers;

public class RegistrarPagoForm
{
    public int           RegistradoPor     { get; set; }
    public MetodoPago    MetodoPago        { get; set; }
    public decimal       Monto             { get; set; }
    public int           CodigoComprobante { get; set; }
    public IFormFile?    ComprobanteArchivo { get; set; }
    public List<int>     MensualidadesIds  { get; set; } = new();
    public List<int>     MultasIds         { get; set; } = new();
    public List<int>     ConexionesIds     { get; set; } = new();
}

[ApiController]
[Route("api/[controller]")]
public class PagosController : ControllerBase
{
    private readonly PagoService _pagoService;

    public PagosController(PagoService pagoService) => _pagoService = pagoService;

    [HttpGet("historial")]
    public async Task<IActionResult> ObtenerHistorial()
    {
        var historial = await _pagoService.ObtenerHistorialAsync();
        return Ok(historial);
    }

    [HttpPost]
    public async Task<IActionResult> RegistrarPago([FromForm] RegistrarPagoForm form)
    {
        try
        {
            var request = new RegistrarPagoRequest
            {
                RegistradoPor      = form.RegistradoPor,
                MetodoPago         = form.MetodoPago,
                Monto              = form.Monto,
                CodigoComprobante  = form.CodigoComprobante,
                ComprobanteStream  = form.ComprobanteArchivo?.OpenReadStream() ?? Stream.Null,
                ComprobanteNombre  = form.ComprobanteArchivo?.FileName ?? string.Empty,
                MensualidadesIds   = form.MensualidadesIds,
                MultasIds          = form.MultasIds,
                ConexionesIds      = form.ConexionesIds
            };

            await _pagoService.RegistrarPagoAsync(request);
            return StatusCode(201, new { mensaje = "Pago registrado exitosamente." });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Error interno al procesar el pago.", detalle = ex.Message });
        }
    }
}
