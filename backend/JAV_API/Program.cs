using Microsoft.EntityFrameworkCore;
using JAV_API.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// ─────────────────────────────────────────────────────────
// Servicios de la aplicación
// ─────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Configuración de Entity Framework Core con PostgreSQL
// La cadena de conexión es sobreescrita por Docker Compose vía variable de entorno
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("JAV_API.Infrastructure")
    ));

var app = builder.Build();

// ─────────────────────────────────────────────────────────
// Pipeline de middlewares
// ─────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
