using Microsoft.EntityFrameworkCore;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;
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
            .Include(u => u.DomicilioUsuarios)
                .ThenInclude(du => du.Domicilio)
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
            .Include(u => u.DomicilioUsuarios)
                .ThenInclude(du => du.Domicilio)
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
    public async Task<bool> CrearConDomicilioAsync(
        Usuario usuario,
        DomicilioUsuario domicilioUsuario,
        Domicilio? nuevoDomicilio)
    {
        // EF Core rastrea el grafo completo de objetos enlazados.
        // Al agregar el Usuario, Persona se inserta primero (PK compartida).
        // Si hay un Domicilio nuevo referenciado desde DomicilioUsuario, EF lo inserta también.
        await _context.Usuarios.AddAsync(usuario);

        if (nuevoDomicilio is not null)
            await _context.Domicilios.AddAsync(nuevoDomicilio);

        await _context.DomicilioUsuarios.AddAsync(domicilioUsuario);

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

    /// <inheritdoc/>
    public async Task<bool> ExisteTipoUsuarioAsync(int idTipoUsuario)
    {
        return await _context.TiposUsuario
            .AnyAsync(t => t.IdTipo == idTipoUsuario);
    }

    /// <inheritdoc/>
    public async Task<int> ObtenerCantidadActivosPorRolAsync(Rol rol)
    {
        return await _context.Usuarios
            .CountAsync(u => u.Estado && u.Rol == rol);
    }

    /// <inheritdoc/>
    public async Task<Domicilio?> ObtenerDomicilioPorIdAsync(int idDomicilio)
    {
        return await _context.Domicilios
            .FirstOrDefaultAsync(d => d.IdDomicilio == idDomicilio);
    }

    /// <inheritdoc/>
    public async Task<bool> ExisteDomicilioAsync(Bloque bloque, int loteCasa, Calle calle)
    {
        return await _context.Domicilios
            .AnyAsync(d => d.CodigoBloque == bloque
                        && d.LoteCasa    == loteCasa
                        && d.Calle       == calle);
    }

    /// <inheritdoc/>
    public async Task<TipoUsuario?> ObtenerTipoUsuarioPorNombreAsync(string nombre)
    {
        return await _context.TiposUsuario
            .FirstOrDefaultAsync(t => t.Nombre == nombre);
    }

    /// <inheritdoc/>
    public async Task<bool> CambiarEstadoAsync(int id, bool estado)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario is null) return false;

        usuario.Estado = estado;
        return await _context.SaveChangesAsync() > 0;
    }
}
