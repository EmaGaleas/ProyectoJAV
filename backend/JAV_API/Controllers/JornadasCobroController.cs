using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JAV_API.Application.DTOs.Request;
using JAV_API.Application.Interfaces;

namespace JAV_API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JornadasCobroController : ControllerBase
{
    private readonly IJornadaCobroService _jornadaCobroService;

    public JornadasCobroController(IJornadaCobroService jornadaCobroService)
    {
        _jornadaCobroService = jornadaCobroService;
    }

    [HttpPut("{id}/fecha")]
    public async Task<IActionResult> ActualizarFecha(int id, [FromBody] ActualizarJornadaCobroRequest request)
    {
        await _jornadaCobroService.ActualizarFechaJornadaAsync(id, request);
        return NoContent();
    }

    [HttpGet("fechas-meses")]
    public async Task<IActionResult> ObtenerFechasMeses([FromQuery] int anio = 0)
    {

        if (anio == 0)
        {
            var horaDeMiZona = DateTime.UtcNow.AddHours(-6).Date;
            anio = horaDeMiZona.Year;
        }

        var result = await _jornadaCobroService.ObtenerFechasMesesAsync(anio);
        return Ok(result);
    }
}