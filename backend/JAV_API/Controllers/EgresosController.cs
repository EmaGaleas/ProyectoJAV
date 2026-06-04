using Microsoft.AspNetCore.Mvc;
using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.Services;

namespace JAV_API.Controllers;

public class RegistrarEgresoForm
{
    public int        RegistradoPor { get; set; }
    public string     Titulo        { get; set; } = string.Empty;
    public string     Descripcion   { get; set; } = string.Empty;
    public decimal    Monto         { get; set; }
    public IFormFile  Evidencia     { get; set; } = null!;
}

public class AprobarEgresoForm
{
    public int AprobadoPor { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class EgresosController : ControllerBase
{
    private readonly EgresoService _egresoService;

    public EgresosController(EgresoService egresoService) => _egresoService = egresoService;

    [HttpGet]
    public async Task<IActionResult> ObtenerHistorial()
    {
        var historial = await _egresoService.ObtenerHistorialAsync();
        return Ok(historial);
    }

    [HttpPost]
    public async Task<IActionResult> Registrar([FromForm] RegistrarEgresoForm form)
    {
        try
        {
            var request = new RegistrarEgresoRequest
            {
                RegistradoPor  = form.RegistradoPor,
                Titulo         = form.Titulo,
                Descripcion    = form.Descripcion,
                Monto          = form.Monto,
                EvidenciaStream = form.Evidencia.OpenReadStream(),
                EvidenciaNombre = form.Evidencia.FileName
            };

            await _egresoService.RegistrarEgresoAsync(request);
            return StatusCode(201, new { mensaje = "Egreso registrado exitosamente." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPatch("{id}/aprobar")]
    public async Task<IActionResult> Aprobar(int id, [FromBody] AprobarEgresoForm form)
    {
        try
        {
            await _egresoService.AprobarAsync(id, form.AprobadoPor);
            return Ok(new { mensaje = "Egreso aprobado." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPatch("{id}/rechazar")]
    public async Task<IActionResult> Rechazar(int id, [FromBody] AprobarEgresoForm form)
    {
        try
        {
            await _egresoService.RechazarAsync(id, form.AprobadoPor);
            return Ok(new { mensaje = "Egreso rechazado." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
