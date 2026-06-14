using System.ComponentModel.DataAnnotations;

namespace JAV_API.Application.DTOs.Request;

public class RegistrarCostoRequest
{
    [Required]
    public int IdTipoCobro { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a 0.")]
    public decimal Monto { get; set; }

    [Required]
    public DateTime FechaInicio { get; set; }
    
    // Nota: El Id del usuario que edita lo extraeremos del token JWT en el controlador, 
    // no es necesario que el frontend lo envíe en el body por seguridad.
}