using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JAV_API.Application.DTOs.Request;
using JAV_API.Application.Interfaces;

namespace JAV_API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TiposCobroController : ControllerBase
{
    private readonly ITipoCobroService _tipoCobroService;

    public TiposCobroController(ITipoCobroService tipoCobroService)
    {
        _tipoCobroService = tipoCobroService;
    }

    [HttpGet("multas")]
    public async Task<IActionResult> ObtenerMultas()
    {
        var result = await _tipoCobroService.ObtenerTiposMultaAsync();
        return Ok(result);
    }

    [HttpPost("multas")]
    public async Task<IActionResult> CrearMulta([FromBody] CrearTipoMultaRequest request)
    {
        var result = await _tipoCobroService.CrearTipoMultaAsync(request);
        return Ok(result);
    }

    [HttpPut("multas/{id}")]
    public async Task<IActionResult> ActualizarMulta(int id, [FromBody] ActualizarTipoMultaRequest request)
    {
        var result = await _tipoCobroService.ActualizarTipoMultaAsync(id, request);
        return Ok(result);
    }

    [HttpDelete("multas/{id}")]
    public async Task<IActionResult> EliminarMulta(int id)
    {
        await _tipoCobroService.EliminarTipoMultaAsync(id);
        return NoContent();
    }
}