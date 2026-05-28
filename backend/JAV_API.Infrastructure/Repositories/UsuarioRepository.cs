using Microsoft.EntityFrameworkCore;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Infrastructure.Persistence;

namespace JAV_API.Infrastructure.Repositories;

/// <summary>
/// Implementación concreta del repositorio de Usuario usando Entity Framework Core.
/// Encapsula todas las consultas a la base de datos, manteniendo la lógica de acceso a datos
/// separada de la lógica de negocio (Principio de Responsabilidad Única - SOLID).
/// </summary>
public class UsuarioRepository : IUsuarioRepository
{
    private readonly ApplicationDbContext _context;

    public UsuarioRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <inheritdoc/>
    public async Task<Usuario?> ObtenerPorIdAsync(int id)
    {
        return await _context.Usuarios
            .Include(u => u.Persona)
            .Include(u => u.TipoUsuario)
            .FirstOrDefaultAsync(u => u.IdUsuario == id);
    }

    /// <inheritdoc/>
    public async Task<Usuario?> ObtenerPorCorreoAsync(string correo)
    {
        return await _context.Usuarios
            .Include(u => u.Persona)
            .Include(u => u.TipoUsuario)
            .FirstOrDefaultAsync(u => u.Correo.ToLower() == correo.ToLower());
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<Usuario>> ObtenerTodosAsync()
    {
        return await _context.Usuarios
            .Include(u => u.Persona)
            .Include(u => u.TipoUsuario)
            .OrderBy(u => u.Persona.PrimerApellido)
            .ToListAsync();
    }

    /// <inheritdoc/>
    public async Task<bool> CrearAsync(Usuario usuario)
    {
        // EF Core maneja automáticamente la inserción de Persona primero (FK compartida 1-1)
        await _context.Usuarios.AddAsync(usuario);
        return await _context.SaveChangesAsync() > 0;
    }

    /// <inheritdoc/>
    public async Task<bool> ExisteCorreoAsync(string correo)
    {
        return await _context.Usuarios
            .AnyAsync(u => u.Correo.ToLower() == correo.ToLower());
    }

    /// <inheritdoc/>
    public async Task<bool> ExisteDniAsync(string dni)
    {
        return await _context.Personas
            .AnyAsync(p => p.Dni == dni);
    }

    /// <inheritdoc/>
    public async Task<bool> ExisteTelefonoAsync(string telefono)
    {
        return await _context.Usuarios
            .AnyAsync(u => u.Telefono == telefono);
    }
}
