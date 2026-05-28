using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.FileProviders;
using JAV_API.Application.Interfaces;
using JAV_API.Application.Services;
using JAV_API.Infrastructure.Persistence;
using JAV_API.Infrastructure.Repositories;
using JAV_API.Infrastructure.Services;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;

var builder = WebApplication.CreateBuilder(args);

// ─────────────────────────────────────────────────────────
// Cargar variables de entorno desde el archivo .env si existe
// (Útil para desarrollo local fuera de Docker)
// ─────────────────────────────────────────────────────────
var currentDir = Directory.GetCurrentDirectory();
var envPath = Path.Combine(currentDir, ".env");
if (!File.Exists(envPath))
{
    var parent = Directory.GetParent(currentDir);
    while (parent != null)
    {
        envPath = Path.Combine(parent.FullName, ".env");
        if (File.Exists(envPath)) break;
        parent = parent.Parent;
    }
}

if (File.Exists(envPath))
{
    foreach (var line in File.ReadAllLines(envPath))
    {
        if (string.IsNullOrWhiteSpace(line) || line.StartsWith("#")) continue;
        var parts = line.Split('=', 2);
        if (parts.Length == 2)
        {
            var key = parts[0].Trim();
            var val = parts[1].Trim();
            Environment.SetEnvironmentVariable(key, val);
            builder.Configuration[key] = val; // Hacerlo disponible para builder.Configuration
        }
    }
}

// ─────────────────────────────────────────────────────────
// Servicios de infraestructura
// ─────────────────────────────────────────────────────────

// Base de datos: La cadena de conexión es sobreescrita por Docker Compose vía variable de entorno
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("JAV_API.Infrastructure")
    ));

// ─────────────────────────────────────────────────────────
// Inyección de dependencias (Principio D de SOLID)
// La API solo conoce interfaces, no implementaciones concretas.
// ─────────────────────────────────────────────────────────

// Repositorios (capa Infrastructure)
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IEgresoRepository, EgresoRepository>(); 
builder.Services.AddScoped<IPagoRepository, PagoRepository>();
builder.Services.AddScoped<IMensualidadRepository, MensualidadRepository>();

// Servicios de seguridad e infraestructura general (capa Infrastructure)
builder.Services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>(); // Integrado

// Servicios de negocio (capa Application)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<EgresoService>(); // Integrado
builder.Services.AddScoped<IngresoService>(); // Integrado


// ─────────────────────────────────────────────────────────
// Autenticación y Autorización con JWT
// ─────────────────────────────────────────────────────────
var jwtSecret = builder.Configuration["JWT_SECRET"]
    ?? throw new InvalidOperationException("La variable JWT_SECRET no está configurada. Agrégala a User Secrets o al .env.");

var keyBytes = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // En producción cambiar a true
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero // Sin margen de tolerancia en la expiración del token
    };
});

builder.Services.AddAuthorization();

// ─────────────────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost",
                "http://localhost:80",
                "http://localhost:5173"  // Vite dev server
              )
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ─────────────────────────────────────────────────────────
// Controladores y documentación
// ─────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// ─────────────────────────────────────────────────────────
// Pipeline de middlewares (el orden importa)
// ─────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    // Aplicar migraciones automáticamente e inicializar datos semilla en desarrollo
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

    try
    {
        context.Database.Migrate();

        // Semilla: Roles (TipoUsuario)
        if (!context.Set<TipoUsuario>().Any())
        {
            var roles = new List<TipoUsuario>
            {
                new TipoUsuario { Nombre = "Administrativo" },
                new TipoUsuario { Nombre = "Cliente" }
            };
            context.Set<TipoUsuario>().AddRange(roles);
            context.SaveChanges();
        }

        // Semilla: Usuario Administrador Inicial (Presidente)
        if (!context.Usuarios.Any())
        {
            var tipoAdmin = context.Set<TipoUsuario>().FirstOrDefault(t => t.Nombre == "Administrativo");
            if (tipoAdmin != null)
            {
                var personaAdmin = new Persona
                {
                    PrimerNombre = "Admin",
                    PrimerApellido = "Villalinda",
                    Dni = "0000000000000"
                };

                var usuarioAdmin = new Usuario
                {
                    Persona = personaAdmin,
                    Correo = "admin@villalinda.com",
                    PasswordHash = hasher.Hash("Admin123*"),
                    Telefono = "0000-0000",
                    Estado = true,
                    FechaCreacion = DateTime.UtcNow,
                    UltimoAcceso = DateTime.UtcNow,
                    Rol = Rol.Presidente,
                    IdTipoUsuario = tipoAdmin.IdTipo
                };

                context.Usuarios.Add(usuarioAdmin);
                context.SaveChanges();
            }
        }
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ocurrió un error al migrar o sembrar la base de datos.");
    }
}

app.UseHttpsRedirection();

// ─────────────────────────────────────────────────────────
// Middleware de Archivos Estáticos para Evidencias (Integrado)
// Permite acceder a las evidencias vía HTTP (ej. http://localhost:8080/uploads/archivo.pdf)
// ─────────────────────────────────────────────────────────
var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
if (!Directory.Exists(uploadPath))
{
    Directory.CreateDirectory(uploadPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadPath),
    RequestPath = "/uploads"
});

// IMPORTANTE: UseAuthentication() SIEMPRE debe ir ANTES que UseAuthorization()
// IMPORTANTE: UseCors() debe ir ANTES de UseAuthentication/UseAuthorization
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();