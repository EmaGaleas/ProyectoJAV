namespace JAV_API.Domain.Entities;

public class Persona
{
    public int IdPersona { get; set; }
    public string PrimerNombre { get; set; } = string.Empty;
    public string? SegundoNombre { get; set; }
    public string PrimerApellido { get; set; } = string.Empty;
    public string? SegundoApellido { get; set; }
    public string Dni { get; set; } = string.Empty;

    // Relación 1-1 con Usuario
    public Usuario? Usuario { get; set; }
}
