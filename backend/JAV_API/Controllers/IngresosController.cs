using Microsoft.AspNetCore.Mvc;
using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.Services;
using JAV_API.Domain.Enums;

namespace JAV_API.Controllers;

public class RegistrarIngresoForm
{
    public int IdMensualidad { get; set; }
    public int RegistradoPor { get; set; }
    public MetodoPago MetodoPago { get; set; }
    public decimal Monto { get; set; }
    public int CodigoComprobante { get; set; }
    public IFormFile? ComprobanteArchivo { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class IngresosController : ControllerBase
{
    private readonly IngresoService _ingresoService;

    public IngresosController(IngresoService ingresoService) => _ingresoService = ingresoService;

    [HttpPost("mensualidad")]
    public async Task<IActionResult> RegistrarPagoMensualidad([FromForm] RegistrarIngresoForm form)
    {
        try
        {
            var request = new RegistrarIngresoRequest
            {
                IdMensualidad = form.IdMensualidad,
                RegistradoPor = form.RegistradoPor,
                MetodoPago = form.MetodoPago,
                Monto = form.Monto,
                CodigoComprobante = form.CodigoComprobante,
                ComprobanteStream = form.ComprobanteArchivo != null ? form.ComprobanteArchivo.OpenReadStream() : Stream.Null,
                ComprobanteNombre = form.ComprobanteArchivo != null ? form.ComprobanteArchivo.FileName : string.Empty
            };

            await _ingresoService.RegistrarPagoMensualidadAsync(request);
            return StatusCode(201, new { mensaje = "Pago registrado y comprobante guardado exitosamente." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("historial")]
    public async Task<IActionResult> ObtenerHistorial([FromQuery] FiltrarIngresosRequest filtros)
    {
        try
        {
            var historial = await _ingresoService.ObtenerHistorialIngresosAsync(filtros);
            return Ok(historial);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
