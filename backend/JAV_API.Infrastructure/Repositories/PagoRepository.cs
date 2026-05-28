using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
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

    public async Task<IEnumerable<Pago>> ObtenerHistorialIngresosAsync()
    {
        // Usamos .Include() para hacer JOINs con las otras tablas y traer la información completa
        return await _context.Pagos
            .Include(p => p.PagoMensualidades)
                .ThenInclude(pm => pm.Mensualidad)
            .OrderByDescending(p => p.FechaPago)
            .ToListAsync();
    }
}