namespace JAV_API.Application.DTOs.Responses;

public record BalanceResponse(
    string Id,
    string Codigo,
    string Fecha,
    string Tipo,
    string Categoria,
    string Descripcion,
    decimal Monto
);