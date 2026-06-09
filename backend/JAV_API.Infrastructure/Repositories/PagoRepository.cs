// Archivo: JAV_API.Infrastructure.Repositories.PagoRepository.cs
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
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
}