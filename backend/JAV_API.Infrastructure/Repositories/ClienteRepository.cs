using Microsoft.EntityFrameworkCore;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;
using JAV_API.Infrastructure.Persistence;

namespace JAV_API.Infrastructure.Repositories;

public class ClienteRepository : IClienteRepository
{
    private readonly ApplicationDbContext _context;

    public ClienteRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ClienteBusquedaResponse>> ObtenerClientesPorFiltroAsync(string? calle, string? bloque, int? lote)
    {
        var query = from du in _context.DomicilioUsuarios
                    join u in _context.Usuarios on du.IdUsuario equals u.IdUsuario
                    join p in _context.Personas on u.IdUsuario equals p.IdPersona
                    join d in _context.Domicilios on du.IdDomicilio equals d.IdDomicilio
                    select new { u, p, d };

        // Aplicación de filtros dinámicos basados en la selección del frontend
        if (!string.IsNullOrWhiteSpace(calle))
        {
            query = query.Where(x => x.d.Calle.ToString() == calle);
        }

        if (!string.IsNullOrWhiteSpace(bloque))
        {
            query = query.Where(x => x.d.CodigoBloque.ToString() == bloque);
        }

        if (lote.HasValue && lote.Value > 0)
        {
            query = query.Where(x => x.d.LoteCasa == lote.Value);
        }

        return await query
            .Select(x => new ClienteBusquedaResponse
            {
                IdUsuario = x.u.IdUsuario,
                NombreCompleto = $"{x.p.PrimerNombre} {x.p.SegundoNombre}".Trim() + $" {x.p.PrimerApellido} {x.p.SegundoApellido}".TrimEnd(),
                Dni = x.p.Dni,
                Calle = x.d.Calle.ToString(),
                Bloque = x.d.CodigoBloque.ToString(),
                Lote = x.d.LoteCasa
            })
            .ToListAsync();
    }
}