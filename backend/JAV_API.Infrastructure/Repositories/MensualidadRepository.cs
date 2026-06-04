using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;
using JAV_API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace JAV_API.Infrastructure.Repositories;

public class MensualidadRepository : IMensualidadRepository
{
    private readonly ApplicationDbContext _context;

    public MensualidadRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Mensualidad>> ObtenerPorIdsAsync(IEnumerable<int> ids)
    {
        if (ids == null || !ids.Any())
            return new List<Mensualidad>();

        return await _context.Mensualidades
            .Include(m => m.Usuario) // Incluimos el usuario por si el servicio necesita validar datos del propietario
            .Where(m => ids.Contains(m.IdMensualidad))
            .ToListAsync();
    }

    public async Task<IEnumerable<Mensualidad>> ObtenerPendientesPorUsuarioAsync(int idUsuario)
    {
        // Filtramos solo las mensualidades en estado "Pendiente" de un usuario específico
        return await _context.Mensualidades
            .Where(m => m.IdUsuario == idUsuario && m.Estado == Estado.Pendiente)
            .OrderBy(m => m.FechaVencimiento) // Ordenamos para que las más viejas salgan primero
            .ToListAsync();
    }
}