using Microsoft.AspNetCore.Mvc;
using JAV_API.Application.Services;

namespace JAV_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DeudasController : ControllerBase
{
    private readonly DeudaService _deudaService;

    public DeudasController(DeudaService deudaService)
    {
        _deudaService = deudaService;
    }

    [HttpGet("usuario/{idUsuario}")]
    public async Task<IActionResult> ObtenerDeudasPorUsuario(int idUsuario)
    {
        var deudas = await _deudaService.ObtenerDeudasPorUsuarioAsync(idUsuario);
        return Ok(deudas);
    }
}