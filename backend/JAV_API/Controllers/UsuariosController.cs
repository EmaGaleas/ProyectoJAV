using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.Interfaces;

namespace JAV_API.Controllers;

/// <summary>
/// Controlador de gestión de usuarios. Solo maneja el protocolo HTTP y delega al servicio.
/// Los endpoints protegidos requieren un JWT válido con el rol apropiado.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize] // Todos los endpoints de este controlador requieren autenticación
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuariosController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    /// <summary>
    /// Obtiene la lista de todos los usuarios registrados en el sistema.
    /// Accesible por cualquier usuario autenticado.
    /// </summary>
    /// <response code="200">Lista de usuarios obtenida exitosamente.</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ObtenerTodos()
    {
        var usuarios = await _usuarioService.ObtenerTodosAsync();
        return Ok(usuarios);
    }

    /// <summary>
    /// Obtiene los datos de un usuario específico por su ID.
    /// </summary>
    /// <response code="200">Usuario encontrado.</response>
    /// <response code="404">No existe un usuario con ese ID.</response>
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObtenerPorId(int id)
    {
        var usuario = await _usuarioService.ObtenerPorIdAsync(id);

        if (usuario is null)
            return NotFound(new { mensaje = $"No se encontró un usuario con ID {id}." });

        return Ok(usuario);
    }

    /// <summary>
    /// Activa o desactiva un usuario por su ID.
    /// Solo los roles administrativos pueden cambiar el estado de un usuario.
    /// </summary>
    /// <response code="200">Estado actualizado. Retorna el usuario con el nuevo estado.</response>
    /// <response code="404">No existe un usuario con ese ID.</response>
    [HttpPatch("{id:int}/estado")]
    [Authorize(Roles = "Presidente,Vicepresidente,Secretario,Vocal")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CambiarEstado(int id, [FromBody] bool estado)
    {
        var usuario = await _usuarioService.CambiarEstadoAsync(id, estado);

        if (usuario is null)
            return NotFound(new { mensaje = $"No se encontró un usuario con ID {id}." });

        return Ok(usuario);
    }

    /// <summary>
    /// Registra un nuevo usuario en el sistema.
    /// Solo los roles con permisos administrativos pueden crear usuarios.
    /// <list type="bullet">
    ///   <item><b>SuperAdministrador</b> (Presidente): puede crear cualquier rol.</item>
    ///   <item><b>Administrador</b> (Vocal, Secretario, Vicepresidente): solo puede crear DuenoDeCasa.</item>
    /// </list>
    /// </summary>
    /// <response code="201">Usuario creado exitosamente.</response>
    /// <response code="400">Los datos de entrada son inválidos o ya existen duplicados.</response>
    /// <response code="401">El token JWT no está presente o es inválido.</response>
    /// <response code="403">El rol del solicitante no tiene permiso para crear un usuario con ese rol.</response>
    [HttpPost]
    [Authorize(Roles = "Presidente,Vicepresidente,Secretario,Vocal,Tesorero,Fiscal")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Crear([FromBody] RegistroUsuarioRequest request)
    {
        // Extraer el rol del claim del JWT
        var rolSolicitante = User.FindFirstValue(ClaimTypes.Role);
        if (string.IsNullOrEmpty(rolSolicitante))
            return Unauthorized(new { mensaje = "No se pudo determinar el rol del solicitante desde el token." });

        try
        {
            var usuario = await _usuarioService.CrearUsuarioAsync(request, rolSolicitante);
            // Retorna 201 Created con la URL del recurso recién creado y los datos del usuario
            return CreatedAtAction(nameof(ObtenerPorId), new { id = usuario.IdUsuario }, usuario);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { mensaje = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // El servicio lanza InvalidOperationException para errores de negocio esperados (duplicados, etc.)
            return BadRequest(new { mensaje = ex.Message });
        }
    }
}
