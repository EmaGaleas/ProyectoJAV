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
}