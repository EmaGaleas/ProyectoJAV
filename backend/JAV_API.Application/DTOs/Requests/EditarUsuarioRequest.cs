using JAV_API.Domain.Enums;

namespace JAV_API.Application.DTOs.Requests;

/// <summary>
/// Campos editables de la Persona y el Usuario para la pantalla de edición.
/// </summary>
public class EditarUsuarioRequest
{
    // ── Persona ────────────────────────────────────────────────
    public string  PrimerNombre    { get; set; } = string.Empty;
    public string? SegundoNombre   { get; set; }
    public string  PrimerApellido  { get; set; } = string.Empty;
    public string? SegundoApellido { get; set; }
    public string  Dni             { get; set; } = string.Empty;

    // ── Usuario ────────────────────────────────────────────────
    public string Correo   { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public bool   Estado   { get; set; }
    public Rol?   Rol      { get; set; }
}
