namespace JAV_API.Application.DTOs.Requests;

public class LoginRequest
{
    public string Correo { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
