using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    /// </summary>
    /// <response code="201">Usuario creado exitosamente.</response>
    /// <response code="400">Los datos de entrada son inválidos o ya existen duplicados.</response>
    [HttpPost]
    [Authorize(Roles = "Presidente,Vicepresidente,Secretario,Vocal,Tesorero,Fiscal")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Crear([FromBody] RegistroUsuarioRequest request)
    {
        try
        {
            var usuario = await _usuarioService.CrearUsuarioAsync(request);
            // Retorna 201 Created con la URL del recurso recién creado y los datos del usuario
            return CreatedAtAction(nameof(ObtenerPorId), new { id = usuario.IdUsuario }, usuario);
        }
        catch (InvalidOperationException ex)
        {
            // El servicio lanza InvalidOperationException para errores de negocio esperados (duplicados, etc.)
            return BadRequest(new { mensaje = ex.Message });
        }
    }
}
