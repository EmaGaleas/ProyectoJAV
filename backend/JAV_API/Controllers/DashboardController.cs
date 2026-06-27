using Microsoft.AspNetCore.Mvc;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;

namespace JAV_API.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize] // Descomenta cuando conectes JWT
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("resumen")]
    public async Task<ActionResult<DashboardResponse>> GetDashboardResumen([FromQuery] int mes, [FromQuery] int anio)
    {
        try
        {
            var data = await _dashboardService.ObtenerDashboardAsync(mes, anio);
            return Ok(data);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
        catch (Exception ex)
        {
            // Log the exception here
            return StatusCode(500, new { mensaje = "Ocurrió un error al generar el dashboard.", detalle = ex.Message });
        }
    }
}