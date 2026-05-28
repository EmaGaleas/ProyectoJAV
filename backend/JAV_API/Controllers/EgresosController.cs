// CORREGIDO: Añadido el using necesario para que reconozca ControllerBase y los Atributos Web
using Microsoft.AspNetCore.Mvc; 
using System.IO;
using JAV_API.Application.DTOs.Requests;
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
}