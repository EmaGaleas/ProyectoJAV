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
builder.Services.AddScoped<PagoService>(); // Integrado


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
                "http://localhost:5173",  // Vite dev server
                "http://localhost:3000"
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

        // ── Semilla: Roles (TipoUsuario) ─────────────────────
        if (!context.Set<TipoUsuario>().Any())
        {
            context.Set<TipoUsuario>().AddRange(
                new TipoUsuario { Nombre = "Administrativo" },
                new TipoUsuario { Nombre = "Cliente" }
            );
            context.SaveChanges();
        }

        // ── Semilla: TiposCobro ───────────────────────────────
        if (!context.Set<TipoCobro>().Any())
        {
            context.Set<TipoCobro>().AddRange(
                new TipoCobro { Tipo = TipoCobroEnum.Mensualidad, Descripcion = "Mensualidad mensual" },
                new TipoCobro { Tipo = TipoCobroEnum.Multa,       Descripcion = "Multa por incumplimiento" },
                new TipoCobro { Tipo = TipoCobroEnum.Pegue,       Descripcion = "Conexión de servicio" }
            );
            context.SaveChanges();
        }

        // ── Semilla: Admin + Usuarios cliente de prueba ───────
        if (!context.Usuarios.Any(u => u.Correo == "maria@test.com"))
        {
            var tipoAdmin   = context.Set<TipoUsuario>().First(t => t.Nombre == "Administrativo");
            var tipoCliente = context.Set<TipoUsuario>().First(t => t.Nombre == "Cliente");

            var admin = new Usuario
            {
                Persona       = new Persona { PrimerNombre = "Admin",  PrimerApellido = "Villalinda", Dni = "0000000000000" },
                Correo        = "admin@villalinda.com",
                PasswordHash  = hasher.Hash("Admin123*"),
                Telefono      = "0000-0000",
                Estado        = true,
                FechaCreacion = DateTime.UtcNow,
                UltimoAcceso  = DateTime.UtcNow,
                Rol           = Rol.Presidente,
                IdTipoUsuario = tipoAdmin.IdTipo
            };
            var cliente1 = new Usuario
            {
                Persona       = new Persona { PrimerNombre = "María",  PrimerApellido = "López",   Dni = "0801199012345" },
                Correo        = "maria@test.com",
                PasswordHash  = hasher.Hash("Test123*"),
                Telefono      = "9999-0001",
                Estado        = true,
                FechaCreacion = DateTime.UtcNow,
                UltimoAcceso  = DateTime.UtcNow,
                Rol           = Rol.DuenoDeCasa,
                IdTipoUsuario = tipoCliente.IdTipo
            };
            var cliente2 = new Usuario
            {
                Persona       = new Persona { PrimerNombre = "Carlos", PrimerApellido = "Mendoza", Dni = "0801200054321" },
                Correo        = "carlos@test.com",
                PasswordHash  = hasher.Hash("Test123*"),
                Telefono      = "9999-0002",
                Estado        = true,
                FechaCreacion = DateTime.UtcNow,
                UltimoAcceso  = DateTime.UtcNow,
                Rol           = Rol.DuenoDeCasa,
                IdTipoUsuario = tipoCliente.IdTipo
            };

            context.Usuarios.AddRange(admin, cliente1, cliente2);
            context.SaveChanges();
        }

        // ── Semilla: Pagos de prueba ──────────────────────────
        if (!context.Set<Pago>().Any())
        {
            var admin    = context.Usuarios.First(u => u.Rol == Rol.Presidente);
            var cliente1 = context.Usuarios.Include(u => u.Persona).First(u => u.Correo == "maria@test.com");
            var cliente2 = context.Usuarios.Include(u => u.Persona).First(u => u.Correo == "carlos@test.com");
            var tipoMulta = context.Set<TipoCobro>().First(t => t.Tipo == TipoCobroEnum.Multa);

            // Domicilios de prueba
            var dom1 = new Domicilio { CodigoBloque = Bloque.A, LoteCasa = 10, Calle = Calle.Calle1A };
            var dom2 = new Domicilio { CodigoBloque = Bloque.B, LoteCasa = 20, Calle = Calle.Calle2B };
            context.Set<Domicilio>().AddRange(dom1, dom2);
            context.SaveChanges();

            context.Set<DomicilioUsuario>().AddRange(
                new DomicilioUsuario { IdUsuario = cliente1.IdUsuario, IdDomicilio = dom1.IdDomicilio, Estructura = 1 },
                new DomicilioUsuario { IdUsuario = cliente2.IdUsuario, IdDomicilio = dom2.IdDomicilio, Estructura = 1 }
            );
            context.SaveChanges();

            // === 1) MENSUALIDADES ===
            // Caso 1.A: Mensualidad Pagada (María)
            var mens1 = new Mensualidad { Usuario = cliente1, Monto = 350m, PeriodoPago = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc), FechaVencimiento = new DateTime(2026, 6, 30, 0, 0, 0, DateTimeKind.Utc), Estado = Estado.Pendiente};
            var pago1 = new Pago { RegistradoPor = admin.IdUsuario, MetodoPago = MetodoPago.Efectivo, Monto = 350m, FechaPago = new DateTime(2026, 6, 2, 0, 0, 0, DateTimeKind.Utc) };
            context.Set<Mensualidad>().Add(mens1);
            context.Set<Pago>().Add(pago1);
            context.SaveChanges();
            context.Set<Comprobante>().Add(new Comprobante { IdPago = pago1.IdPago, Codigo = 1, Url = string.Empty });
            context.Set<PagoMensualidad>().Add(new PagoMensualidad { IdMensualidad = mens1.IdMensualidad, IdPago = pago1.IdPago });

            // Caso 1.B: Mensualidad Pagada (Carlos)
            var mens2 = new Mensualidad { Usuario = cliente2, Monto = 350m, PeriodoPago = new DateTime(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc), FechaVencimiento = new DateTime(2026, 5, 31, 0, 0, 0, DateTimeKind.Utc), Estado = Estado.Pagado };
            var pago2 = new Pago { RegistradoPor = admin.IdUsuario, MetodoPago = MetodoPago.Transferencia, Monto = 350m, FechaPago = new DateTime(2026, 5, 15, 0, 0, 0, DateTimeKind.Utc) };
            context.Set<Mensualidad>().Add(mens2);
            context.Set<Pago>().Add(pago2);
            context.SaveChanges();
            context.Set<PagoMensualidad>().Add(new PagoMensualidad { IdMensualidad = mens2.IdMensualidad, IdPago = pago2.IdPago });

            // Caso 1.C: Mensualidad Pendiente (María - Julio 2026)
            var mensPendiente = new Mensualidad { Usuario = cliente1, Monto = 350m, PeriodoPago = new DateTime(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc), FechaVencimiento = new DateTime(2026, 7, 30, 0, 0, 0, DateTimeKind.Utc), Estado = Estado.Pendiente };
            context.Set<Mensualidad>().Add(mensPendiente);

            // Caso 1.D: Mensualidad Vencida (Carlos - Abril 2026)
            var mensVencida = new Mensualidad { Usuario = cliente2, Monto = 350m, PeriodoPago = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc), FechaVencimiento = new DateTime(2026, 4, 30, 0, 0, 0, DateTimeKind.Utc), Estado = Estado.Vencido };
            context.Set<Mensualidad>().Add(mensVencida);
            context.SaveChanges();

            // === 2) MULTAS ===
            // Caso 2.A: Multa Pagada (María)
            var multa1 = new Multa { TipoMulta = tipoMulta, Usuario = cliente1, Monto = 100m, Estado = Estado.Pagado };
            var pago3  = new Pago { RegistradoPor = admin.IdUsuario, MetodoPago = MetodoPago.Efectivo, Monto = 100m, FechaPago = new DateTime(2026, 4, 10, 0, 0, 0, DateTimeKind.Utc) };
            context.Set<Multa>().Add(multa1);
            context.Set<Pago>().Add(pago3);
            context.SaveChanges();
            context.Set<PagoMulta>().Add(new PagoMulta { IdMulta = multa1.IdMulta, IdPago = pago3.IdPago });

            // Caso 2.B: Multa Pendiente (María)
            var multaPendiente = new Multa { TipoMulta = tipoMulta, Usuario = cliente1, Monto = 150m, Estado = Estado.Pendiente };
            context.Set<Multa>().Add(multaPendiente);

            // Caso 2.C: Multa Vencida (Carlos)
            var multaVencida = new Multa { TipoMulta = tipoMulta, Usuario = cliente2, Monto = 200m, Estado = Estado.Vencido };
            context.Set<Multa>().Add(multaVencida);
            context.SaveChanges();

            // === 3) CONEXIONES (PEGUES) ===
            // Caso 3.A: Conexión Pagada (Carlos)
            var conexion1 = new Conexion { Usuario = cliente2, Monto = 500m, Domicilio = dom2, Estado = Estado.Pagado };
            var pago4 = new Pago { RegistradoPor = admin.IdUsuario, MetodoPago = MetodoPago.Transferencia, Monto = 500m, FechaPago = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) };
            context.Set<Conexion>().Add(conexion1);
            context.Set<Pago>().Add(pago4);
            context.SaveChanges();
            context.Set<PagoConexion>().Add(new PagoConexion { IdConexion = conexion1.IdConexion, IdPago = pago4.IdPago });

            // Caso 3.B: Conexión Pendiente (María)
            var conexionPendiente = new Conexion { Usuario = cliente1, Monto = 600m, Domicilio = dom1, Estado = Estado.Pendiente };
            context.Set<Conexion>().Add(conexionPendiente);

            // Caso 3.C: Conexión Vencida (Carlos)
            var conexionVencida = new Conexion { Usuario = cliente2, Monto = 700m, Domicilio = dom2, Estado = Estado.Vencido };
            context.Set<Conexion>().Add(conexionVencida);
            context.SaveChanges();
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