using Microsoft.AspNetCore.Mvc;
using JAV_API.Application.Services;
using JAV_API.Application.DTOs.Requests;

namespace JAV_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientesController : ControllerBase
{
    private readonly ClienteService _clienteService;

    public ClientesController(ClienteService clienteService)
    {
        _clienteService = clienteService;
    }

    [HttpGet("buscar")]
    public async Task<IActionResult> Buscar([FromQuery] FiltrarClientesRequest request)
    {
        var clientes = await _clienteService.BuscarClientesAsync(request.Calle, request.Bloque, request.Lote);
        return Ok(clientes);
    }
}