using JAV_API.Domain.Enums;

namespace JAV_API.Application.DTOs.Requests;

/// <summary>
/// Datos del domicilio que se asignará a un cliente (Rol = DuenoDeCasa) al momento de su registro.
/// Dos modos mutuamente excluyentes:
///   1. Domicilio existente: proporcionar únicamente <see cref="IdDomicilio"/>.
///   2. Domicilio nuevo:     proporcionar <see cref="CodigoBloque"/>, <see cref="LoteCasa"/> y <see cref="Calle"/>.
/// El campo <see cref="Estructura"/> es siempre obligatorio (forma parte de la PK compuesta de Domicilio_Usuario).
/// </summary>
public class DomicilioRequest
{
    // ── Modo 1: Domicilio ya existente ──────────────────────────────
    /// <summary>ID de un domicilio ya registrado en la base de datos. Opcional.</summary>
    public int? IdDomicilio { get; set; }

    // ── Modo 2: Domicilio nuevo ─────────────────────────────────────
    /// <summary>Bloque del nuevo domicilio. Requerido si no se indica <see cref="IdDomicilio"/>.</summary>
    public Bloque? CodigoBloque { get; set; }

    /// <summary>Número de lote/casa del nuevo domicilio. Requerido si no se indica <see cref="IdDomicilio"/>.</summary>
    public int? LoteCasa { get; set; }

    /// <summary>Calle del nuevo domicilio. Requerida si no se indica <see cref="IdDomicilio"/>.</summary>
    public Calle? Calle { get; set; }

    // ── Siempre obligatorio ─────────────────────────────────────────
    /// <summary>
    /// Tipo de estructura dentro del domicilio (ej. 1 = casa principal, 2 = accesoria).
    /// Es parte de la clave primaria compuesta de la tabla Domicilio_Usuario.
    /// </summary>
    public int Estructura { get; set; }
}
