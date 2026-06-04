using Microsoft.EntityFrameworkCore;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;
using JAV_API.Infrastructure.Persistence;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;

namespace JAV_API.Infrastructure.Repositories;

public class DeudaRepository : IDeudaRepository
{
    private readonly ApplicationDbContext _context;

    public DeudaRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DeudasUsuarioResponse> ObtenerDeudasPendientesPorUsuarioAsync(int idUsuario)
    {
        var response = new DeudasUsuarioResponse();

        // 1. Obtener Mensualidades pendientes o vencidas
        var mensualidades = await _context.Set<Mensualidad>()
            .Where(m => m.IdUsuario == idUsuario && (m.Estado == Estado.Pendiente || m.Estado == Estado.Vencido))
            .ToListAsync();

        response.Mensualidades = mensualidades.Select(m => new DeudaDetalleResponse
        {
            IdReal = m.IdMensualidad,
            IdVirtual = $"mensualidad-{m.IdMensualidad}", // Clave para el frontend
            Concepto = m.PeriodoPago.HasValue ? $"Mensualidad {m.PeriodoPago.Value:MMMM yyyy}" : "Mensualidad",
            Monto = m.Monto,
            FechaVencimiento = m.FechaVencimiento,
            Estado = m.Estado.ToString(),
            Vencida = m.Estado == Estado.Vencido,
            Mora = CalcularMora(m.Estado, m.Monto) 
        }).ToList();

        // 2. Obtener Multas pendientes o vencidas
        var multas = await _context.Set<Multa>()
            .Include(m => m.TipoMulta) // Para traernos la descripción
            .Where(m => m.IdUsuario == idUsuario && (m.Estado == Estado.Pendiente || m.Estado == Estado.Vencido))
            .ToListAsync();

        response.Multas = multas.Select(m => new DeudaDetalleResponse
        {
            IdReal = m.IdMulta,
            IdVirtual = $"multa-{m.IdMulta}", // Clave para el frontend
            Concepto = m.TipoMulta != null ? m.TipoMulta.Descripcion : "Multa",
            Monto = m.Monto,
            FechaVencimiento = null, // La tabla multa no tiene vencimiento explícito en DB.txt
            Estado = m.Estado.ToString(),
            Vencida = m.Estado == Estado.Vencido,
            Mora = 0m // Suponiendo que las multas no generan doble mora
        }).ToList();

        return response;
    }

    // Método auxiliar (puedes ajustar la lógica de negocio real aquí)
    private decimal CalcularMora(Estado estado, decimal montoBase)
    {
        return estado == Estado.Vencido ? montoBase * 0.10m : 0m; 
    }
}