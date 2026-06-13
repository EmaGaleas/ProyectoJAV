// CORREGIDO: Añadido el using necesario para que reconozca ControllerBase y los Atributos Web
using Microsoft.AspNetCore.Mvc; 
using System.IO;
using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Services;

namespace JAV_API.Controllers;

public class RegistrarEgresoForm
{
    public int RegistradoPor { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public IFormFile Evidencia { get; set; } = null!;
}

[ApiController]
[Route("api/[controller]")]
public class EgresosController : ControllerBase
{
    private readonly EgresoService _egresoService;

    public EgresosController(EgresoService egresoService) => _egresoService = egresoService;

    /// <summary>Devuelve el historial completo de egresos.</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EgresoResponse>>> ObtenerHistorial()
    {
        var historial = await _egresoService.ObtenerHistorialEgresosAsync();
        return Ok(historial);
    }

    /// <summary>Registra un nuevo egreso con su evidencia adjunta.</summary>
    [HttpPost]
    public async Task<IActionResult> Registrar([FromForm] RegistrarEgresoForm form)
    {
        try
        {
            var applicationRequest = new RegistrarEgresoRequest
            {
                RegistradoPor = form.RegistradoPor,
                Titulo = form.Titulo,
                Descripcion = form.Descripcion,
                Monto = form.Monto,
                EvidenciaStream = form.Evidencia.OpenReadStream(),
                EvidenciaNombre = form.Evidencia.FileName
            };

            await _egresoService.RegistrarEgresoAsync(applicationRequest);
            return StatusCode(201, new { mensaje = "Egreso registrado exitosamente." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>Aprueba un egreso en estado EnRevision.</summary>
    /// <response code="200">Egreso aprobado exitosamente.</response>
    /// <response code="404">No existe un egreso con ese ID.</response>
    /// <response code="409">El egreso ya fue procesado (aprobado o rechazado).</response>
    [HttpPatch("{id:int}/aprobar")]
    public async Task<IActionResult> Aprobar(int id, [FromBody] AprobarEgresoRequest request)
    {
        try
        {
            await _egresoService.AprobarEgresoAsync(id, request);
            return Ok(new { mensaje = "Egreso aprobado exitosamente." });
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

    /// <summary>Rechaza un egreso en estado EnRevision.</summary>
    /// <response code="200">Egreso rechazado exitosamente.</response>
    /// <response code="404">No existe un egreso con ese ID.</response>
    /// <response code="409">El egreso ya fue procesado (aprobado o rechazado).</response>
    [HttpPatch("{id:int}/rechazar")]
    public async Task<IActionResult> Rechazar(int id, [FromBody] RechazarEgresoRequest request)
    {
        try
        {
            await _egresoService.RechazarEgresoAsync(id, request);
            return Ok(new { mensaje = "Egreso rechazado exitosamente." });
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