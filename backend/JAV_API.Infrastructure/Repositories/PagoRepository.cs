using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;
using JAV_API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JAV_API.Infrastructure.Repositories;

public class PagoRepository : IPagoRepository
{
    private readonly ApplicationDbContext _context;

    public PagoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task RegistrarPagoAsync(Pago pago, PagoMensualidad pagoMensualidad, Mensualidad mensualidad, Comprobante comprobante)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // Añadimos todas las entidades al contexto
            _context.Pagos.Add(pago);
            _context.Comprobantes.Add(comprobante); // Guardamos el comprobante
            _context.PagoMensualidades.Add(pagoMensualidad);
            _context.Mensualidades.Update(mensualidad);

            // Un solo SaveChanges impacta las 4 operaciones a la vez
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<IEnumerable<Pago>> ObtenerHistorialIngresosAsync(
        FiltrarIngresosRequest? filtros = null)
    {
        var query = ConsultaConRelaciones();
        query = AplicarFiltros(query, filtros);

        return await query
            .OrderByDescending(p => p.FechaPago)
            .ToListAsync();
    }

    // ─────────────────────────────────────────────────────────
    // Métodos privados
    // ─────────────────────────────────────────────────────────

    private IQueryable<Pago> ConsultaConRelaciones() =>
        _context.Pagos
            .Include(p => p.Comprobante)
            .Include(p => p.PagoMensualidades)
                .ThenInclude(pm => pm.Mensualidad)
                    .ThenInclude(m => m.Usuario)
                        .ThenInclude(u => u.Persona)
            .Include(p => p.PagoMultas)
                .ThenInclude(pm => pm.Multa)
                    .ThenInclude(m => m.Usuario)
                        .ThenInclude(u => u.Persona)
            .Include(p => p.PagoConexiones)
                .ThenInclude(pc => pc.Conexion)
                    .ThenInclude(c => c.Usuario)
                        .ThenInclude(u => u.Persona);

    private static IQueryable<Pago> AplicarFiltros(IQueryable<Pago> query, FiltrarIngresosRequest? filtros)
    {
        if (filtros is null) return query;

        if (filtros.Desde.HasValue)
        {
            var desde = DateTime.SpecifyKind(filtros.Desde.Value, DateTimeKind.Utc);
            query = query.Where(p => p.FechaPago >= desde);
        }

        if (filtros.Hasta.HasValue)
        {
            // Incluye todo el día "hasta" sumando 1 día y usando <
            var hasta = DateTime.SpecifyKind(filtros.Hasta.Value.Date.AddDays(1), DateTimeKind.Utc);
            query = query.Where(p => p.FechaPago < hasta);
        }

        if (filtros.TipoPago.HasValue)
            query = FiltrarPorTipo(query, filtros.TipoPago.Value);

        if (!string.IsNullOrWhiteSpace(filtros.Estado) && Enum.TryParse<Estado>(filtros.Estado, true, out var estadoEnum))
        {
            query = query.Where(p =>
                p.PagoMensualidades.Any(pm => pm.Mensualidad.Estado == estadoEnum) ||
                p.PagoMultas.Any(pm => pm.Multa.Estado == estadoEnum) ||
                p.PagoConexiones.Any(pc => pc.Conexion.Estado == estadoEnum)
            );
        }

        return query;
    }

    private static IQueryable<Pago> FiltrarPorTipo(IQueryable<Pago> query, TipoCobroEnum tipo) =>
        tipo switch
        {
            TipoCobroEnum.Mensualidad => query.Where(p => p.PagoMensualidades.Any()),
            TipoCobroEnum.Multa       => query.Where(p => p.PagoMultas.Any()),
            TipoCobroEnum.Pegue       => query.Where(p => p.PagoConexiones.Any()),
            _                         => query
        };
}