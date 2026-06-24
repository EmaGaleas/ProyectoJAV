namespace JAV_API.Application.DTOs.Responses;

public record MorosoResponse(
    string Id,
    string Residente,
    string Dni,
    UbicacionResponse Ubicacion,
    int MesesAtraso,
    string DetalleDeuda,
    decimal MontoTotal
);