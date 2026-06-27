using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Text.Json;
using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Services;
using System.Text.Json.Serialization;

namespace JAV_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PagosController : ControllerBase
{
    private readonly PagoService _pagoService;

    public PagosController(PagoService pagoService) => _pagoService = pagoService;

    /// <summary>Registra un pago con comprobante físico y genera moras dinámicas.</summary>
    [HttpPost]
    public async Task<IActionResult> RegistrarPago(
        IFormFile comprobanteArchivo, 
        [FromForm] string datosJson)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(datosJson))
                return BadRequest(new { error = "Los datos del pago no pueden estar vacíos." });

            // 1. CONFIGURAR LAS OPCIONES PARA SOPORTAR ENUMS EN TEXTO
            var jsonOptions = new JsonSerializerOptions 
            { 
                PropertyNameCaseInsensitive = true 
            };
            jsonOptions.Converters.Add(new JsonStringEnumConverter()); // <--- CRUCIAL

            // 2. Deserializar usando las opciones configuradas
            var request = JsonSerializer.Deserialize<RegistrarPagoRequest>(datosJson, jsonOptions);
            
            if (request == null)
                return BadRequest(new { error = "Formato JSON inválido." });

            if (comprobanteArchivo != null && comprobanteArchivo.Length > 0)
            {
                request.ComprobanteStream = comprobanteArchivo.OpenReadStream();
                request.ComprobanteNombre = comprobanteArchivo.FileName;
            }

            await _pagoService.RegistrarPagoAsync(request);
            return StatusCode(201, new { mensaje = "Pago registrado exitosamente." });
        }
        catch (Exception ex)
        {
            // Esto te ayudará a ver el error real en la respuesta si vuelve a fallar
            return StatusCode(500, new { error = "Ocurrió un error interno.", detalle = ex.Message, inner = ex.InnerException?.Message });
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
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("historial")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<HistorialPagoUsuarioResponse>>> ObtenerMiHistorial(
        [FromQuery] DateTime? desde,
        [FromQuery] DateTime? hasta)
    {
        var subClaim = User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)
                    ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(subClaim, out var idUsuario))
            return Unauthorized(new { mensaje = "Token inválido o expirado." });

        var historial = await _pagoService.ObtenerHistorialPorUsuarioAsync(idUsuario, desde, hasta);
        return Ok(historial);
    }

    [HttpPatch("{id:int}/aprobar")]
    public async Task<IActionResult> Aprobar(int id, [FromBody] AprobarPagoRequest request)
    {
        try
        {
            await _pagoService.AprobarPagoAsync(id, request);
            return Ok(new { mensaje = "Ingreso aprobado exitosamente." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPatch("{id:int}/rechazar")]
    public async Task<IActionResult> Rechazar(int id, [FromBody] RechazarPagoRequest request)
    {
        try
        {
            await _pagoService.RechazarPagoAsync(id, request);
            return Ok(new { mensaje = "Ingreso rechazado exitosamente." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}