// Archivo: JAV_API.Infrastructure.Repositories.PagoRepository.cs
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;
using JAV_API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JAV_API.Infrastructure.Repositories;

public class PagoRepository : IPagoRepository
{
    private readonly ApplicationDbContext _context;

    public PagoRepository(ApplicationDbContext context) => _context = context;

    public async Task RegistrarPagoMasivoAsync(
        Pago pago, 
        Comprobante comprobante, 
        List<PagoMensualidad> pagoMensualidades, 
        List<PagoMulta> pagoMultas, 
        List<PagoConexion> pagoConexiones,
        List<Mensualidad> mensualidades,
        List<Multa> multas,
        List<Conexion> conexiones)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            _context.Pagos.Add(pago);
            _context.Comprobantes.Add(comprobante);
            
            if (pagoMensualidades.Any()) _context.PagoMensualidades.AddRange(pagoMensualidades);
            if (pagoMultas.Any()) _context.PagoMultas.AddRange(pagoMultas);
            if (pagoConexiones.Any()) _context.PagoConexiones.AddRange(pagoConexiones);

            // Actualizamos los estados de las entidades cobradas
            if (mensualidades.Any()) _context.Mensualidades.UpdateRange(mensualidades);
            if (multas.Any()) _context.Multas.UpdateRange(multas);
            if (conexiones.Any()) _context.Conexiones.UpdateRange(conexiones);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<IEnumerable<Pago>> ObtenerHistorialPagosAsync()
    {
        return await _context.Pagos
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
                        .ThenInclude(u => u.Persona)
            .OrderByDescending(p => p.FechaPago)
            .ToListAsync();
    }

    public Task<Pago?> ObtenerPagoPorIdConDetallesAsync(int idPago)
    {
        return _context.Pagos
            .Include(p => p.Comprobante)
            .Include(p => p.PagoMensualidades!).ThenInclude(pm => pm.Mensualidad!).ThenInclude(m => m.Usuario!).ThenInclude(u => u.Persona)
            .Include(p => p.PagoMensualidades!).ThenInclude(pm => pm.Mensualidad!).ThenInclude(m => m.Usuario!).ThenInclude(u => u.DomicilioUsuarios!).ThenInclude(du => du.Domicilio)
            .Include(p => p.PagoMultas!).ThenInclude(pm => pm.Multa!).ThenInclude(m => m.Usuario!).ThenInclude(u => u.Persona)
            .Include(p => p.PagoMultas!).ThenInclude(pm => pm.Multa!).ThenInclude(m => m.Usuario!).ThenInclude(u => u.DomicilioUsuarios!).ThenInclude(du => du.Domicilio)
            .Include(p => p.PagoMultas!).ThenInclude(pm => pm.Multa!).ThenInclude(m => m.TipoMulta!)
            .Include(p => p.PagoConexiones!).ThenInclude(pc => pc.Conexion!).ThenInclude(c => c.Usuario!).ThenInclude(u => u.Persona)
            .Include(p => p.PagoConexiones!).ThenInclude(pc => pc.Conexion!).ThenInclude(c => c.Domicilio)
            .FirstOrDefaultAsync(p => p.IdPago == idPago);
    }

    public async Task<IEnumerable<Pago>> ObtenerHistorialPorUsuarioAsync(
        int idUsuario,
        DateTime? desde,
        DateTime? hasta)
    {
        // Npgsql requiere DateTimeKind.Utc para columnas 'timestamp with time zone'.
        // Los query params llegan como Kind=Unspecified, así que los normalizamos.
        var desdeUtc = desde.HasValue
            ? DateTime.SpecifyKind(desde.Value, DateTimeKind.Utc)
            : (DateTime?)null;

        var hastaUtc = hasta.HasValue
            ? DateTime.SpecifyKind(hasta.Value, DateTimeKind.Utc)
            : (DateTime?)null;

        var query = _context.Pagos
            .Include(p => p.Comprobante)
            .Include(p => p.Registrador).ThenInclude(r => r!.Persona)
            // Mensualidades del usuario
            .Include(p => p.PagoMensualidades)
                .ThenInclude(pm => pm.Mensualidad)
                    .ThenInclude(m => m.Usuario)
            // Multas del usuario
            .Include(p => p.PagoMultas)
                .ThenInclude(pm => pm.Multa)
                    .ThenInclude(m => m.Usuario)
            // Conexiones del usuario
            .Include(p => p.PagoConexiones)
                .ThenInclude(pc => pc.Conexion)
                    .ThenInclude(c => c.Usuario)
            // Solo pagos donde el titular sea el usuario autenticado
            .Where(p =>
                p.PagoMensualidades.Any(pm => pm.Mensualidad.IdUsuario == idUsuario) ||
                p.PagoMultas.Any(pm => pm.Multa.IdUsuario == idUsuario) ||
                p.PagoConexiones.Any(pc => pc.Conexion.IdUsuario == idUsuario))
            .AsQueryable();

        if (desdeUtc.HasValue)
            query = query.Where(p => p.FechaPago >= desdeUtc.Value);

        if (hastaUtc.HasValue)
            query = query.Where(p => p.FechaPago <= hastaUtc.Value);

        return await query
            .OrderByDescending(p => p.FechaPago)
            .ToListAsync();
    }

    public async Task<Pago?> ObtenerPorIdAsync(int idPago)
    {
        return await _context.Pagos.FindAsync(idPago);
    }

    public async Task AprobarAsync(int idPago, int aprobadoPor)
    {
        var pago = await _context.Pagos.FindAsync(idPago)
            ?? throw new KeyNotFoundException($"No se encontró el ingreso con ID {idPago}.");

        if (pago.Estado != EstadoAprobacion.EnRevision)
            throw new InvalidOperationException($"El ingreso ya fue procesado con estado '{pago.Estado}'.");

        pago.Estado = EstadoAprobacion.Aprobado;
        pago.AprobadoPor = aprobadoPor;
        await _context.SaveChangesAsync();
    }

    public async Task RechazarAsync(int idPago)
    {
        var pago = await _context.Pagos.FindAsync(idPago)
            ?? throw new KeyNotFoundException($"No se encontró el ingreso con ID {idPago}.");

        if (pago.Estado != EstadoAprobacion.EnRevision)
            throw new InvalidOperationException($"El ingreso ya fue procesado con estado '{pago.Estado}'.");

        pago.Estado = EstadoAprobacion.Rechazado;
        await _context.SaveChangesAsync();
    }
}