using Microsoft.AspNetCore.Mvc;
using JAV_API.Application.Interfaces;
using JAV_API.Application.DTOs.Responses;

namespace JAV_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportesController : ControllerBase
{
    private readonly IReporteService _reporteService;

    public ReportesController(IReporteService reporteService)
    {
        _reporteService = reporteService;
    }

    [HttpGet("morosos")]
    [ProducesResponseType(typeof(IEnumerable<MorosoResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMorosos()
    {
        var morosos = await _reporteService.GetMorososAsync();
        return Ok(morosos);
    }

    [HttpGet("balance")]
    [ProducesResponseType(typeof(IEnumerable<BalanceResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBalance()
    {
        var balance = await _reporteService.GetBalanceGeneralAsync();
        return Ok(balance);
    }
}