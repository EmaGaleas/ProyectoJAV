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

    public async Task<DeudasUsuarioResponse> ObtenerDeudasPendientesPorUsuarioAsync(int idUsuario, decimal valorMoraActual)
    {
        var response = new DeudasUsuarioResponse();

        // 1. Obtener Mensualidades pendientes o vencidas
        var mensualidades = await _context.Set<Mensualidad>()
            .Where(m => m.IdUsuario == idUsuario && (m.Estado == Estado.Pendiente || m.Estado == Estado.Vencido))
            .ToListAsync();

        response.Mensualidades = mensualidades.Select(m => new DeudaDetalleResponse
        {
            IdReal = m.IdMensualidad,
            IdVirtual = $"mensualidad-{m.IdMensualidad}",
            Concepto = m.PeriodoPago.HasValue ? $"Mensualidad {m.PeriodoPago.Value:MMMM yyyy}" : "Mensualidad",
            Monto = m.Monto,
            FechaVencimiento = m.FechaVencimiento,
            Estado = m.Estado.ToString(),
            Vencida = m.Estado == Estado.Vencido,
            Mora = m.Estado == Estado.Vencido ? valorMoraActual : 0m // Mora inyectada dinámicamente
        }).ToList();

        // 2. Obtener Multas pendientes o vencidas
        var multas = await _context.Set<Multa>()
            .Include(m => m.TipoMulta)
            .Where(m => m.IdUsuario == idUsuario && (m.Estado == Estado.Pendiente || m.Estado == Estado.Vencido))
            .ToListAsync();

        response.Multas = multas.Select(m => new DeudaDetalleResponse
        {
            IdReal = m.IdMulta,
            IdVirtual = $"multa-{m.IdMulta}",
            Concepto = m.TipoMulta != null ? m.TipoMulta.Descripcion : "Multa",
            Monto = m.Monto,
            FechaVencimiento = null,
            Estado = m.Estado.ToString(),
            Vencida = m.Estado == Estado.Vencido,
            Mora = 0m
        }).ToList();

        // 3. Obtener Conexiones pendientes o vencidas
        var conexiones = await _context.Set<Conexion>()
            .Where(c => c.IdUsuario == idUsuario && (c.Estado == Estado.Pendiente || c.Estado == Estado.Vencido))
            .ToListAsync();

        response.Conexiones = conexiones.Select(c => new DeudaDetalleResponse
        {
            IdReal = c.IdConexion,
            IdVirtual = $"conexion-{c.IdConexion}",
            Concepto = "Servicio de Conexión/Reconexión",
            Monto = c.Monto,
            FechaVencimiento = null,
            Estado = c.Estado.ToString(),
            Vencida = c.Estado == Estado.Vencido,
            Mora = 0m 
        }).ToList();

        return response;
    }
}