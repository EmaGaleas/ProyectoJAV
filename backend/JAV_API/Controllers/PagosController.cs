using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Services;
using JAV_API.Domain.Enums;

namespace JAV_API.Controllers;

public class RegistrarPagoForm
{
    public int RegistradoPor { get; set; }
    public MetodoPago MetodoPago { get; set; }
    public decimal Monto { get; set; }
    public int CodigoComprobante { get; set; }
    public IFormFile? ComprobanteArchivo { get; set; }
    
    public List<int> MensualidadesIds { get; set; } = new();
    public List<int> MultasIds { get; set; } = new();
    public List<int> ConexionesIds { get; set; } = new();
}

[ApiController]
[Route("api/[controller]")]
public class PagosController : ControllerBase
{
    private readonly PagoService _pagoService;

    public PagosController(PagoService pagoService) => _pagoService = pagoService;

    [HttpPost]
    public async Task<IActionResult> RegistrarPago([FromForm] RegistrarPagoForm form)
    {
        try
        {
            var request = new RegistrarPagoRequest
            {
                RegistradoPor = form.RegistradoPor,
                MetodoPago = form.MetodoPago,
                Monto = form.Monto,
                CodigoComprobante = form.CodigoComprobante,
                ComprobanteStream = form.ComprobanteArchivo?.OpenReadStream() ?? Stream.Null,
                ComprobanteNombre = form.ComprobanteArchivo?.FileName ?? string.Empty,
                MensualidadesIds = form.MensualidadesIds,
                MultasIds = form.MultasIds,
                ConexionesIds = form.ConexionesIds
            };

            await _pagoService.RegistrarPagoAsync(request);
            return StatusCode(201, new { mensaje = "Pago registrado y comprobante guardado exitosamente." });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            // Para excepciones no controladas o de base de datos
            return StatusCode(500, new { error = "Ocurrió un error interno al procesar el pago.", detalle = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<IngresoResponse>>> ObtenerHistorial([FromQuery] FiltrarIngresosRequest filtros)
    {
        var historial = await _pagoService.ObtenerHistorialIngresosAsync(filtros);
        return Ok(historial);
    }

    [HttpGet("{id}/detalle")]
    public async Task<ActionResult<DetallePagoResponse>> ObtenerDetalleModal(int id)
    {
        try
        {
            return Ok(await _pagoService.ObtenerDetallePagoModalAsync(id));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensaje = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    /// <summary>
    /// Devuelve el historial de pagos del usuario autenticado.
    /// Solo retorna los pagos en los que ese usuario es el titular (mensualidad, multa o conexión).
    /// Soporta filtro opcional por rango de fechas mediante los query params <c>desde</c> y <c>hasta</c>.
    /// </summary>
    /// <response code="200">Lista de pagos del usuario autenticado.</response>
    /// <response code="401">El token JWT no está presente o es inválido.</response>
    [HttpGet("historial")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<HistorialPagoUsuarioResponse>>> ObtenerMiHistorial(
        [FromQuery] DateTime? desde,
        [FromQuery] DateTime? hasta)
    {
        // El claim "sub" del JWT contiene el IdUsuario (ver AuthService.GenerarToken)
        var subClaim = User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)
                    ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(subClaim, out var idUsuario))
            return Unauthorized(new { mensaje = "Token inválido: no se pudo identificar al usuario." });

        var historial = await _pagoService.ObtenerHistorialPorUsuarioAsync(idUsuario, desde, hasta);
        return Ok(historial);
    }
}