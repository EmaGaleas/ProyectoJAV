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
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IDeudaRepository, DeudaRepository>();
builder.Services.AddScoped<ICostosRepository, CostosRepository>();
builder.Services.AddScoped<ICostosService, CostosService>();
builder.Services.AddScoped<ITipoCobroRepository, TipoCobroRepository>();
builder.Services.AddScoped<ITipoCobroService, TipoCobroService>();
builder.Services.AddScoped<IJornadaCobroRepository, JornadaCobroRepository>();
builder.Services.AddScoped<IJornadaCobroService, JornadaCobroService>();
builder.Services.AddScoped<IMultaRepository, MultaRepository>();
builder.Services.AddScoped<IMultaService, MultaService>();
builder.Services.AddScoped<IConexionRepository, ConexionRepository>();
builder.Services.AddScoped<IReporteRepository, ReporteRepository>();
builder.Services.AddScoped<IReporteService, ReporteService>();
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// Si MensualidadRepository tampoco estaba registrado, agrégalo:
// builder.Services.AddScoped<IMensualidadRepository, MensualidadRepository>();

// Servicios de seguridad e infraestructura general (capa Infrastructure)
builder.Services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>(); // Integrado

// Servicios de negocio (capa Application)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<EgresoService>(); // Integrado
builder.Services.AddScoped<PagoService>(); // Integrado
builder.Services.AddScoped<ClienteService>();
builder.Services.AddScoped<DeudaService>();



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
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        // Permite enviar/recibir enums como strings ("DuenoDeCasa") en lugar de números (0)
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "JAV API", Version = "v1" });

    // Configuración para que Swagger soporte tus tokens JWT
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Ingresa 'Bearer' [espacio] y luego tu token JWT. Ejemplo: \"Bearer eyJhbGci...\""
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ─────────────────────────────────────────────────────────
// Pipeline de middlewares (el orden importa)
// ─────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // Aplicar migraciones automáticamente e inicializar datos semilla en desarrollo
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

    try
    {
        context.Database.Migrate();

        // ── Semilla: Tipos de Usuario ─────────────────────────
        // Cada TipoUsuario agrupa uno o más Roles:
        //   SuperAdministrador → Presidente
        //   Administrador      → Vocal, Secretario, Vicepresidente
        //   Fiscal             → Fiscal
        //   Tesorero           → Tesorero
        //   Cliente            → DuenoDeCasa
        if (!context.Set<TipoUsuario>().Any())
        {
            context.Set<TipoUsuario>().AddRange(
                new TipoUsuario { Nombre = "SuperAdministrador" },  // IdTipo = 1
                new TipoUsuario { Nombre = "Administrador" },       // IdTipo = 2
                new TipoUsuario { Nombre = "Fiscal" },              // IdTipo = 3
                new TipoUsuario { Nombre = "Tesorero" },            // IdTipo = 4
                new TipoUsuario { Nombre = "Cliente" }              // IdTipo = 5
            );
            context.SaveChanges();
        }

        // ── Semilla: TiposCobro ───────────────────────────────
        if (!context.Set<TipoCobro>().Any())
        {
            context.Set<TipoCobro>().AddRange(
                // Mensualidad
                new TipoCobro { Tipo = TipoCobroEnum.Mensualidad, Descripcion = "Mensualidad por consumo de agua" },
                
                // Conexiones (Pegues)
                new TipoCobro { Tipo = TipoCobroEnum.Pegue, Descripcion = "Nueva conexión de agua principal" },
                
                // Multas Random
                new TipoCobro { Tipo = TipoCobroEnum.Multa, Descripcion = "Multa por desperdicio de agua" },
                new TipoCobro { Tipo = TipoCobroEnum.Multa, Descripcion = "Multa por botar basura en áreas verdes" },
                new TipoCobro { Tipo = TipoCobroEnum.Multa, Descripcion = "Mora por atraso" }
            );
            context.SaveChanges();
        }

        // ── Semilla: Admin + Usuarios cliente de prueba ───────
        if (!context.Usuarios.Any(u => u.Correo == "maria@test.com"))
        {
            var tipoSuperAdmin = context.Set<TipoUsuario>().First(t => t.Nombre == "SuperAdministrador");
            var tipoTesorero = context.Set<TipoUsuario>().First(t => t.Nombre == "Tesorero");
            var tipoCliente    = context.Set<TipoUsuario>().First(t => t.Nombre == "Cliente");

            var admin = new Usuario
            {
                Persona       = new Persona { PrimerNombre = "Juan",  PrimerApellido = "Castellanos", Dni = "0508197300548" },
                Correo        = "admin@villalinda.com",
                PasswordHash  = hasher.Hash("Admin123*"),
                Telefono      = "0000-0000",
                Estado        = true,
                FechaCreacion = DateTime.UtcNow,
                UltimoAcceso  = DateTime.UtcNow,
                Rol           = Rol.Presidente,
                IdTipoUsuario = tipoSuperAdmin.IdTipo
            };
            var tesorero = new Usuario
            {
                Persona       = new Persona { PrimerNombre = "Juan",  PrimerApellido = "Perez",   Dni = "0501199902322" },
                Correo        = "tesorero@villalinda.com",
                PasswordHash  = hasher.Hash("Tesorero123*"),
                Telefono      = "9009-1001",
                Estado        = true,
                FechaCreacion = DateTime.UtcNow,
                UltimoAcceso  = DateTime.UtcNow,
                Rol           = Rol.Tesorero,
                IdTipoUsuario = tipoTesorero.IdTipo
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

            context.Usuarios.AddRange(admin, tesorero, cliente1, cliente2);
            context.SaveChanges();
        }

        // ── Semilla: Historial de Costos (Precios) ──────────────────────────
        // ── Semilla: Historial de Costos (Precios) ──────────────────────────
        if (!context.Set<HistorialCostos>().Any())
        {
            var admin = context.Usuarios.First(u => u.Rol == Rol.Presidente);
            var tipos = context.Set<TipoCobro>().ToList();

            // Identificar los tipos de cobro por su descripción exacta
            var mensualidadAgua = tipos.First(t => t.Tipo == TipoCobroEnum.Mensualidad);
            var nuevaConexion = tipos.First(t => t.Tipo == TipoCobroEnum.Pegue);
            var multaDesperdicio = tipos.First(t => t.Descripcion == "Multa por desperdicio de agua");
            var multaBasura = tipos.First(t => t.Descripcion == "Multa por botar basura en áreas verdes");
            var multaMora = tipos.First(t => t.Descripcion == "Mora por atraso");

            // Fechas clave dinámicas para las vigencias (Pasado, Presente, Futuro)
            var fechaActual = DateTime.UtcNow;
            var inicioAnioPasado = new DateTime(fechaActual.Year - 2, 1, 1, 0, 0, 0, DateTimeKind.Utc);     // Hace 2 años
            var finAnioAnterior = new DateTime(fechaActual.Year - 1, 12, 31, 23, 59, 59, DateTimeKind.Utc); // Fin del año pasado
            var inicioAnioActual = new DateTime(fechaActual.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);         // 1 de enero de este año
            var inicioFuturo = new DateTime(fechaActual.Year + 1, 1, 1, 0, 0, 0, DateTimeKind.Utc);         // 1 de enero del próximo año

            context.Set<HistorialCostos>().AddRange(
                // --- HISTORIAL MENSUALIDAD ---
                new HistorialCostos { IdTipoCobro = mensualidadAgua.IdTipoCobro, Monto = 200m, FechaEmision = inicioAnioPasado, FechaAnulacion = new DateTime(fechaActual.Year - 1, 5, 31, 23, 59, 59, DateTimeKind.Utc), EditadoPor = admin.IdUsuario },
                new HistorialCostos { IdTipoCobro = mensualidadAgua.IdTipoCobro, Monto = 200m, FechaEmision = new DateTime(fechaActual.Year - 1, 6, 1, 0, 0, 0, DateTimeKind.Utc), FechaAnulacion = finAnioAnterior, EditadoPor = admin.IdUsuario },
                new HistorialCostos { IdTipoCobro = mensualidadAgua.IdTipoCobro, Monto = 350m, FechaEmision = inicioAnioActual, FechaAnulacion = null, EditadoPor = admin.IdUsuario },
                new HistorialCostos { IdTipoCobro = mensualidadAgua.IdTipoCobro, Monto = 450m, FechaEmision = inicioFuturo, FechaAnulacion = null, EditadoPor = admin.IdUsuario },

                // --- HISTORIAL MORA POR ATRASO ---
                new HistorialCostos { IdTipoCobro = multaMora.IdTipoCobro, Monto = 20m, FechaEmision = inicioAnioPasado, FechaAnulacion = finAnioAnterior, EditadoPor = admin.IdUsuario },
                new HistorialCostos { IdTipoCobro = multaMora.IdTipoCobro, Monto = 30m, FechaEmision = inicioAnioActual, FechaAnulacion = null, EditadoPor = admin.IdUsuario },
                new HistorialCostos { IdTipoCobro = multaMora.IdTipoCobro, Monto = 50m, FechaEmision = inicioFuturo, FechaAnulacion = null, EditadoPor = admin.IdUsuario },

                // --- HISTORIAL NUEVA CONEXIÓN (PEGUE) ---
                new HistorialCostos { IdTipoCobro = nuevaConexion.IdTipoCobro, Monto = 1000m, FechaEmision = inicioAnioPasado, FechaAnulacion = finAnioAnterior, EditadoPor = admin.IdUsuario },
                new HistorialCostos { IdTipoCobro = nuevaConexion.IdTipoCobro, Monto = 1500m, FechaEmision = inicioAnioActual, FechaAnulacion = null, EditadoPor = admin.IdUsuario },
                new HistorialCostos { IdTipoCobro = nuevaConexion.IdTipoCobro, Monto = 2000m, FechaEmision = inicioFuturo, FechaAnulacion = null, EditadoPor = admin.IdUsuario },

                // --- HISTORIAL MULTA POR DESPERDICIO ---
                new HistorialCostos { IdTipoCobro = multaDesperdicio.IdTipoCobro, Monto = 300m, FechaEmision = inicioAnioPasado, FechaAnulacion = finAnioAnterior, EditadoPor = admin.IdUsuario },
                new HistorialCostos { IdTipoCobro = multaDesperdicio.IdTipoCobro, Monto = 500m, FechaEmision = inicioAnioActual, FechaAnulacion = null, EditadoPor = admin.IdUsuario },
                new HistorialCostos { IdTipoCobro = multaDesperdicio.IdTipoCobro, Monto = 750m, FechaEmision = inicioFuturo, FechaAnulacion = null, EditadoPor = admin.IdUsuario },

                // --- HISTORIAL MULTA POR BASURA ---
                new HistorialCostos { IdTipoCobro = multaBasura.IdTipoCobro, Monto = 500m, FechaEmision = inicioAnioPasado, FechaAnulacion = finAnioAnterior, EditadoPor = admin.IdUsuario },
                new HistorialCostos { IdTipoCobro = multaBasura.IdTipoCobro, Monto = 800m, FechaEmision = inicioAnioActual, FechaAnulacion = null, EditadoPor = admin.IdUsuario },
                new HistorialCostos { IdTipoCobro = multaBasura.IdTipoCobro, Monto = 1200m, FechaEmision = inicioFuturo, FechaAnulacion = null, EditadoPor = admin.IdUsuario }
            );
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

            // Caso 1.C: Mensualidad Pendiente (María - Julio 2026)
            var mensPendiente = new Mensualidad { Usuario = cliente1, Monto = 350m, PeriodoPago = new DateTime(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc), FechaVencimiento = new DateTime(2026, 7, 30, 0, 0, 0, DateTimeKind.Utc), Estado = Estado.Pendiente };
            context.Set<Mensualidad>().Add(mensPendiente);

            // Caso 1.D: Mensualidad Vencida (Carlos - Abril 2026)
            var mensVencida = new Mensualidad { Usuario = cliente2, Monto = 350m, PeriodoPago = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc), FechaVencimiento = new DateTime(2026, 4, 30, 0, 0, 0, DateTimeKind.Utc), Estado = Estado.Vencido };
            context.Set<Mensualidad>().Add(mensVencida);
            context.SaveChanges();

            // === 2) MULTAS ===
            // Caso 2.B: Multa Pendiente (María)
            var multaPendiente = new Multa { TipoMulta = tipoMulta, Usuario = cliente1, Monto = 150m, Estado = Estado.Pendiente };
            context.Set<Multa>().Add(multaPendiente);

            // Caso 2.C: Multa Vencida (Carlos)
            var multaVencida = new Multa { TipoMulta = tipoMulta, Usuario = cliente2, Monto = 200m, Estado = Estado.Vencido };
            context.Set<Multa>().Add(multaVencida);
            context.SaveChanges();

            // === 3) CONEXIONES (PEGUES) ===

            // Caso 3.B: Conexión Pendiente (María)
            var conexionPendiente = new Conexion { Usuario = cliente1, Monto = 600m, Domicilio = dom1, Estado = Estado.Pendiente };
            context.Set<Conexion>().Add(conexionPendiente);

            // Caso 3.C: Conexión Vencida (Carlos)
            var conexionVencida = new Conexion { Usuario = cliente2, Monto = 700m, Domicilio = dom2, Estado = Estado.Vencido };
            context.Set<Conexion>().Add(conexionVencida);
            context.SaveChanges();
        }

        // ─────────────────────────────────────────────────────────
        // Siembra de Jornadas de Cobro para el año 2026
        // ─────────────────────────────────────────────────────────
        var tieneJornadas2026 = context.Set<JornadaCobro>().Any(j => j.PeriodoCobro.HasValue && j.PeriodoCobro.Value.Year == 2026);

        if (!tieneJornadas2026)
        {
            // Obtener el Tesorero (o el Administrador) para asignarlo como Encargado,
            // ya que en ApplicationDbContext 'Encargado' es IsRequired().
            var encargadoJornada = context.Usuarios.FirstOrDefault(u => u.Rol == Rol.Tesorero) 
                                ?? context.Usuarios.First(u => u.Rol == Rol.Presidente);

            var jornadas = new List<JornadaCobro>();

            for (int mes = 1; mes <= 12; mes++)
            {
                // 1. Crear el periodo y la jornada correspondiente (ej. programada para el día 5 de cada mes)
                var periodo = new DateTime(2026, mes, 1, 0, 0, 0, DateTimeKind.Utc);
                var fechaJornada = new DateTime(2026, mes, 5, 0, 0, 0, DateTimeKind.Utc);

                jornadas.Add(new JornadaCobro
                {
                    Fecha = fechaJornada,
                    PeriodoCobro = periodo,
                    Encargado = encargadoJornada.IdUsuario // Campo obligatorio asignado
                });
            }
            
            context.Set<JornadaCobro>().AddRange(jornadas);
            context.SaveChanges();
        }

        // ── Semilla: Egresos de prueba ────────────────────────
        if (!context.Egresos.Any())
        {
            var admin = context.Usuarios.First(u => u.Rol == Rol.Presidente);

            var egresos = new List<Egreso>
            {
                // Pendientes (en revisión)
                new Egreso
                {
                    RegistradoPor = admin.IdUsuario,
                    Titulo        = "Compra de herramientas",
                    Descripcion   = "Compra de palas, picos y guantes para mantenimiento de zonas verdes.",
                    Monto         = 1500.00m,
                    Fecha         = new DateTime(2026, 6, 1, 10, 0, 0, DateTimeKind.Utc),
                    Url           = string.Empty,
                    Estado        = EstadoAprobacion.EnRevision,
                },
                new Egreso
                {
                    RegistradoPor = admin.IdUsuario,
                    Titulo        = "Reparación bomba de agua",
                    Descripcion   = "Servicio técnico para reparación de la bomba principal del pozo comunitario.",
                    Monto         = 3200.00m,
                    Fecha         = new DateTime(2026, 6, 5, 14, 30, 0, DateTimeKind.Utc),
                    Url           = string.Empty,
                    Estado        = EstadoAprobacion.EnRevision,
                },
                new Egreso
                {
                    RegistradoPor = admin.IdUsuario,
                    Titulo        = "Papelería y útiles de oficina",
                    Descripcion   = "Compra de resmas de papel, bolígrafos, sellos y archivadores para la tesorería.",
                    Monto         = 420.50m,
                    Fecha         = new DateTime(2026, 6, 8, 9, 0, 0, DateTimeKind.Utc),
                    Url           = string.Empty,
                    Estado        = EstadoAprobacion.EnRevision,
                },

                // Aprobados
                new Egreso
                {
                    RegistradoPor = admin.IdUsuario,
                    Titulo        = "Pintura de entrada principal",
                    Descripcion   = "Contratación de pintor para renovación de la fachada y portón de entrada.",
                    Monto         = 2800.00m,
                    Fecha         = new DateTime(2026, 5, 12, 8, 0, 0, DateTimeKind.Utc),
                    Url           = string.Empty,
                    Estado        = EstadoAprobacion.Aprobado,
                    AprobadoPor   = admin.IdUsuario,
                },
                new Egreso
                {
                    RegistradoPor = admin.IdUsuario,
                    Titulo        = "Mantenimiento de jardines",
                    Descripcion   = "Poda de árboles y corte de césped en todas las áreas comunes. Servicio mensual.",
                    Monto         = 950.00m,
                    Fecha         = new DateTime(2026, 5, 20, 11, 0, 0, DateTimeKind.Utc),
                    Url           = string.Empty,
                    Estado        = EstadoAprobacion.Aprobado,
                    AprobadoPor   = admin.IdUsuario,
                },

                // Rechazado
                new Egreso
                {
                    RegistradoPor = admin.IdUsuario,
                    Titulo        = "Compra de sillas de patio",
                    Descripcion   = "Adquisición de 20 sillas plásticas para el área de reuniones exteriores. Factura no presentada.",
                    Monto         = 1800.00m,
                    Fecha         = new DateTime(2026, 5, 28, 16, 0, 0, DateTimeKind.Utc),
                    Url           = string.Empty,
                    Estado        = EstadoAprobacion.Rechazado,
                },
            };

            context.Egresos.AddRange(egresos);
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