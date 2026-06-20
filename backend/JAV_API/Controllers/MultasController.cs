using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.Interfaces;

namespace JAV_API.Controllers;

/// <summary>
/// Controlador del módulo de Multas.
/// Gestiona el ciclo de vida de las multas: listar, registrar y anular.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MultasController : ControllerBase
{
    private readonly IMultaService _multaService;

    public MultasController(IMultaService multaService)
    {
        _multaService = multaService;
    }

    /// <summary>
    /// Obtiene la lista completa de multas registradas en el sistema.
    /// </summary>
    /// <response code="200">Lista de multas obtenida exitosamente.</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ObtenerTodos()
    {
        var multas = await _multaService.ObtenerTodosAsync();
        return Ok(multas);
    }

    /// <summary>
    /// Registra una nueva multa para un usuario.
    /// Solo el SuperAdministrador puede crear multas.
    /// </summary>
    /// <response code="201">Multa registrada exitosamente.</response>
    /// <response code="400">Datos inválidos (tipo de cobro incorrecto, monto ≤ 0, etc.).</response>
    /// <response code="401">Token JWT ausente o inválido.</response>
    /// <response code="403">El rol del solicitante no tiene permiso.</response>
    [HttpPost]
    [Authorize(Roles = "Presidente")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Registrar([FromBody] RegistrarMultaRequest request)
    {
        try
        {
            var multa = await _multaService.RegistrarAsync(request);
            return StatusCode(StatusCodes.Status201Created, multa);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    /// <summary>
    /// Anula una multa existente. No se puede anular una multa que ya está anulada.
    /// Solo el SuperAdministrador puede anular multas.
    /// </summary>
    /// <response code="204">Multa anulada exitosamente.</response>
    /// <response code="400">La multa ya está anulada.</response>
    /// <response code="401">Token JWT ausente o inválido.</response>
    /// <response code="403">El rol del solicitante no tiene permiso.</response>
    /// <response code="404">No existe una multa con ese ID.</response>
    [HttpPatch("{id:int}/anular")]
    [Authorize(Roles = "Presidente")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Anular(int id)
    {
        try
        {
            await _multaService.AnularAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensaje = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }
}
