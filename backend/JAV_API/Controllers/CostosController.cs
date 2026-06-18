using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JAV_API.Application.DTOs.Request;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Enums;

namespace JAV_API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Asegura que se requiere JWT
public class CostosController : ControllerBase
{
    private readonly ICostosService _costosService;

    public CostosController(ICostosService costosService)
    {
        _costosService = costosService;
    }

    // GET /api/costos/{tipoCobroEnum}/vigentes
    // Ejemplo: /api/costos/multa/vigentes
    [HttpGet("{tipoCobro}/vigentes")]
    public async Task<IActionResult> ObtenerVigentes(TipoCobroEnum tipoCobro)
    {
        var result = await _costosService.ObtenerCostosVigentesAsync(tipoCobro);
        return Ok(result);
    }

    // GET /api/costos/{tipoCobroEnum}/proximos
    [HttpGet("{tipoCobro}/proximos")]
    public async Task<IActionResult> ObtenerProximos(TipoCobroEnum tipoCobro)
    {
        var result = await _costosService.ObtenerProximasVigenciasAsync(tipoCobro);
        return Ok(result);
    }

    // GET /api/costos/{tipoCobroEnum}/historial
    [HttpGet("{tipoCobro}/historial")]
    public async Task<IActionResult> ObtenerHistorial(TipoCobroEnum tipoCobro)
    {
        var result = await _costosService.ObtenerHistorialAsync(tipoCobro);
        return Ok(result);
    }

    // POST /api/costos
    [HttpPost]
    public async Task<IActionResult> RegistrarCosto([FromBody] RegistrarCostoRequest request)
    {
        // Extraemos el ID del usuario desde el JWT (Asumiendo que lo guardaste en el NameIdentifier)
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out int idUsuario))
        {
            return Unauthorized("El token no contiene un ID de usuario válido.");
        }

        var result = await _costosService.RegistrarCostoAsync(request, idUsuario);
        return Ok(result);
    }

    // DELETE /api/costos/proximos/{id}
    [HttpDelete("proximos/{id}")]
    public async Task<IActionResult> EliminarProximaVigencia(int id)
    {
        await _costosService.EliminarProximaVigenciaAsync(id);
        return NoContent(); // 204 indica éxito sin cuerpo en la respuesta
    }

    // GET /api/costos/mora/vigente
    [HttpGet("mora/vigente")]
    public async Task<IActionResult> ObtenerMoraActual()
    {
        var result = await _costosService.ObtenerMoraActualAsync();
        if (result == null) return NotFound("No se ha configurado un monto para la mora.");
        
        return Ok(result);
    }

    // GET /api/costos/mora/proximos
    [HttpGet("mora/proximos")]
    public async Task<IActionResult> ObtenerMoraProximos()
    {
        var result = await _costosService.ObtenerMoraProximasVigenciasAsync();
        return Ok(result);
    }

    // GET /api/costos/mora/historial
    [HttpGet("mora/historial")]
    public async Task<IActionResult> ObtenerMoraHistorial()
    {
        var result = await _costosService.ObtenerMoraHistorialAsync();
        return Ok(result);
    }
}