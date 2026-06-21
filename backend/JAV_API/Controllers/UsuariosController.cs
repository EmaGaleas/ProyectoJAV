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

    // ──────────────────────────────────────────────────────────────────
    // Endpoints de perfil del usuario autenticado
    // ──────────────────────────────────────────────────────────────────

    /// <summary>
    /// Obtiene el perfil completo del usuario que está actualmente autenticado.
    /// </summary>
    /// <response code="200">Perfil obtenido exitosamente.</response>
    /// <response code="401">Token JWT ausente o inválido.</response>
    /// <response code="404">El usuario del token ya no existe en la base de datos.</response>
    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObtenerPerfil()
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idStr, out int idUsuario))
            return Unauthorized(new { mensaje = "No se pudo determinar la identidad del usuario desde el token." });

        var perfil = await _usuarioService.ObtenerPerfilAsync(idUsuario);
        if (perfil is null)
            return NotFound(new { mensaje = "El usuario autenticado no fue encontrado." });

        return Ok(perfil);
    }

    /// <summary>
    /// Actualiza el correo y el teléfono del usuario autenticado.
    /// </summary>
    /// <response code="204">Contacto actualizado exitosamente.</response>
    /// <response code="400">El correo o teléfono ya están en uso por otro usuario.</response>
    /// <response code="401">Token JWT ausente o inválido.</response>
    [HttpPatch("me/contacto")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ActualizarContacto([FromBody] ActualizarContactoRequest request)
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idStr, out int idUsuario))
            return Unauthorized(new { mensaje = "No se pudo determinar la identidad del usuario desde el token." });

        try
        {
            await _usuarioService.ActualizarContactoAsync(idUsuario, request);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    /// <summary>
    /// Cambia la contraseña del usuario autenticado.
    /// Requiere la contraseña actual para confirmar la identidad.
    /// </summary>
    /// <response code="204">Contraseña cambiada exitosamente.</response>
    /// <response code="400">La contraseña actual es incorrecta o la nueva no cumple los requisitos.</response>
    /// <response code="401">Token JWT ausente o inválido.</response>
    [HttpPatch("me/contrasena")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CambiarContrasena([FromBody] CambiarContrasenaRequest request)
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idStr, out int idUsuario))
            return Unauthorized(new { mensaje = "No se pudo determinar la identidad del usuario desde el token." });

        try
        {
            await _usuarioService.CambiarContrasenaAsync(idUsuario, request);
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

    // ──────────────────────────────────────────────────────────────────
    // Endpoints de edición de usuario (Presidente y Secretario)
    // ──────────────────────────────────────────────────────────────────

    /// <summary>
    /// Verifica la contraseña del usuario autenticado como paso previo a editar otro usuario.
    /// </summary>
    /// <response code="204">Contraseña correcta — identidad verificada.</response>
    /// <response code="401">Contraseña incorrecta o token inválido.</response>
    [HttpPost("verificar-identidad")]
    [Authorize(Roles = "Presidente,Secretario")]
    public async Task<IActionResult> VerificarIdentidad([FromBody] VerificarIdentidadRequest request)
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(idClaim, out int idAdmin))
            return Unauthorized(new { mensaje = "Token inválido." });

        try
        {
            await _usuarioService.VerificarIdentidadAsync(idAdmin, request.Password);
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { mensaje = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensaje = ex.Message });
        }
    }

    /// <summary>
    /// Actualiza todos los campos editables de la Persona y el Usuario con el ID indicado.
    /// </summary>
    /// <response code="200">Usuario actualizado exitosamente con sus nuevos datos.</response>
    /// <response code="400">Correo, DNI o teléfono ya en uso por otro usuario.</response>
    /// <response code="404">No existe un usuario con ese ID.</response>
    [HttpPatch("{id:int}")]
    [Authorize(Roles = "Presidente,Secretario")]
    public async Task<IActionResult> EditarUsuario(int id, [FromBody] EditarUsuarioRequest request)
    {
        try
        {
            var usuario = await _usuarioService.EditarUsuarioAsync(id, request);
            return Ok(usuario);
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
