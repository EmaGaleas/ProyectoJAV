using Microsoft.AspNetCore.Mvc;
using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.Interfaces;

namespace JAV_API.Controllers;

/// <summary>
/// Controlador de autenticación. Responsabilidad única (SRP): solo maneja el endpoint de login.
/// No contiene lógica de negocio; delega completamente al servicio.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Autentica a un usuario con su correo y contraseña.
    /// Si las credenciales son válidas, retorna un token JWT para usar en peticiones protegidas.
    /// </summary>
    /// <response code="200">Login exitoso. Retorna token JWT y datos del usuario.</response>
    /// <response code="401">Credenciales inválidas o cuenta inactiva.</response>
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var resultado = await _authService.LoginAsync(request);

        if (resultado is null)
            return Unauthorized(new { mensaje = "Correo o contraseña incorrectos." });

        return Ok(resultado);
    }
}
