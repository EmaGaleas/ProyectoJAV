using Microsoft.EntityFrameworkCore;
using JAV_API.Domain.Entities;

namespace JAV_API.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Persona> Personas => Set<Persona>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<TipoUsuario> TiposUsuario => Set<TipoUsuario>();
    public DbSet<Permiso> Permisos => Set<Permiso>();
    public DbSet<TipoUsuarioPermiso> TipoUsuarioPermisos => Set<TipoUsuarioPermiso>();
    public DbSet<Domicilio> Domicilios => Set<Domicilio>();
    public DbSet<DomicilioUsuario> DomicilioUsuarios => Set<DomicilioUsuario>();
    public DbSet<TipoCobro> TiposCobro => Set<TipoCobro>();
    public DbSet<HistorialCostos> HistorialCostos => Set<HistorialCostos>();
    public DbSet<Mensualidad> Mensualidades => Set<Mensualidad>();
    public DbSet<Multa> Multas => Set<Multa>();
    public DbSet<Conexion> Conexiones => Set<Conexion>();
    public DbSet<Pago> Pagos => Set<Pago>();
    public DbSet<Comprobante> Comprobantes => Set<Comprobante>();
    public DbSet<PagoMensualidad> PagoMensualidades => Set<PagoMensualidad>();
    public DbSet<PagoMulta> PagoMultas => Set<PagoMulta>();
    public DbSet<PagoConexion> PagoConexiones => Set<PagoConexion>();
    public DbSet<Egreso> Egresos => Set<Egreso>();
    public DbSet<JornadaCobro> JornadasCobro => Set<JornadaCobro>();
    public DbSet<CierreCaja> CierresCaja => Set<CierreCaja>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ─────────────────────────────────────────────────────────
        // Persona
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Persona>(entity =>
        {
            entity.ToTable("Persona");
            entity.HasKey(e => e.IdPersona);
            entity.Property(e => e.IdPersona).HasColumnName("id_Persona").ValueGeneratedOnAdd();
            entity.Property(e => e.PrimerNombre).HasColumnName("primer_Nombre").HasMaxLength(100).IsRequired();
            entity.Property(e => e.SegundoNombre).HasColumnName("segundo_Nombre").HasMaxLength(100);
            entity.Property(e => e.PrimerApellido).HasColumnName("primer_Apellido").HasMaxLength(100).IsRequired();
            entity.Property(e => e.SegundoApellido).HasColumnName("segundo_Apellido").HasMaxLength(100);
            entity.Property(e => e.Dni).HasColumnName("dni").HasMaxLength(20).IsRequired();
            entity.HasIndex(e => e.Dni).IsUnique();
        });

        // ─────────────────────────────────────────────────────────
        // Usuario (PK = FK hacia Persona, relación 1-1 compartida)
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("Usuario");
            entity.HasKey(e => e.IdUsuario);
            entity.Property(e => e.IdUsuario).HasColumnName("id_Usuario").ValueGeneratedNever(); // La PK viene de Persona
            entity.Property(e => e.Correo).HasColumnName("correo").HasMaxLength(150).IsRequired();
            // Columna para el hash de contraseña (BCrypt). Máx 72 chars de entrada, hash de 60 chars de salida.
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash").HasMaxLength(255).IsRequired();
            entity.Property(e => e.Telefono).HasColumnName("telefono").HasMaxLength(20).IsRequired();
            entity.Property(e => e.Estado).HasColumnName("estado").IsRequired();
            entity.Property(e => e.UltimoAcceso).HasColumnName("ultimo_Acceso").IsRequired();
            entity.Property(e => e.FechaCreacion).HasColumnName("fecha_Creacion").IsRequired();
            entity.Property(e => e.Rol).HasColumnName("rol").HasConversion<string>();
            entity.Property(e => e.IdTipoUsuario).HasColumnName("tipo_Usuario").IsRequired();

            entity.HasIndex(e => e.Correo).IsUnique();
            entity.HasIndex(e => e.Telefono).IsUnique();

            // Relación 1-1 con Persona (PK compartida)
            entity.HasOne(u => u.Persona)
                  .WithOne(p => p.Usuario)
                  .HasForeignKey<Usuario>(u => u.IdUsuario)
                  .OnDelete(DeleteBehavior.Restrict);

            // Relación N-1 con TipoUsuario
            entity.HasOne(u => u.TipoUsuario)
                  .WithMany(t => t.Usuarios)
                  .HasForeignKey(u => u.IdTipoUsuario)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ─────────────────────────────────────────────────────────
        // TipoUsuario
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<TipoUsuario>(entity =>
        {
            entity.ToTable("Tipo_Usuario");
            entity.HasKey(e => e.IdTipo);
            entity.Property(e => e.IdTipo).HasColumnName("id_Tipo").ValueGeneratedOnAdd();
            entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(50).IsRequired();
            entity.HasIndex(e => e.Nombre).IsUnique();
        });

        // ─────────────────────────────────────────────────────────
        // Permiso
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Permiso>(entity =>
        {
            entity.ToTable("Permisos");
            entity.HasKey(e => e.IdPermiso);
            entity.Property(e => e.IdPermiso).HasColumnName("id_Permiso").ValueGeneratedOnAdd();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasMaxLength(100).IsRequired();
            entity.HasIndex(e => e.Descripcion).IsUnique();
        });

        // ─────────────────────────────────────────────────────────
        // TipoUsuarioPermiso (N-N con PK compuesta)
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<TipoUsuarioPermiso>(entity =>
        {
            entity.ToTable("Tipo_Usuario_Permiso");
            entity.HasKey(e => new { e.IdTipo, e.IdPermiso });
            entity.Property(e => e.IdTipo).HasColumnName("id_Tipo");
            entity.Property(e => e.IdPermiso).HasColumnName("id_Permiso");

            entity.HasOne(tp => tp.TipoUsuario)
                  .WithMany(t => t.TipoUsuarioPermisos)
                  .HasForeignKey(tp => tp.IdTipo)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(tp => tp.Permiso)
                  .WithMany(p => p.TipoUsuarioPermisos)
                  .HasForeignKey(tp => tp.IdPermiso)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ─────────────────────────────────────────────────────────
        // Domicilio
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Domicilio>(entity =>
        {
            entity.ToTable("Domicilio");
            entity.HasKey(e => e.IdDomicilio);
            entity.Property(e => e.IdDomicilio).HasColumnName("id_Domicilio").ValueGeneratedOnAdd();
            entity.Property(e => e.CodigoBloque).HasColumnName("codigo_Bloque").HasConversion<string>().IsRequired();
            entity.Property(e => e.LoteCasa).HasColumnName("lote_Casa").IsRequired();
            entity.Property(e => e.Calle).HasColumnName("calle").HasConversion<string>().IsRequired();
            // Índice único compuesto: (codigo_Bloque, lote_Casa)
            entity.HasIndex(e => new { e.CodigoBloque, e.LoteCasa }).IsUnique();
        });

        // ─────────────────────────────────────────────────────────
        // DomicilioUsuario (PK compuesta de 3 campos)
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<DomicilioUsuario>(entity =>
        {
            entity.ToTable("Domicilio_Usuario");
            entity.HasKey(e => new { e.IdUsuario, e.IdDomicilio, e.Estructura });
            entity.Property(e => e.IdUsuario).HasColumnName("id_Usuario");
            entity.Property(e => e.IdDomicilio).HasColumnName("id_Domicilio");
            entity.Property(e => e.Estructura).HasColumnName("estructura");
            entity.Property(e => e.Estado).HasColumnName("estado").IsRequired();

            entity.HasOne(du => du.Usuario)
                  .WithMany(u => u.DomicilioUsuarios)
                  .HasForeignKey(du => du.IdUsuario)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(du => du.Domicilio)
                  .WithMany(d => d.DomicilioUsuarios)
                  .HasForeignKey(du => du.IdDomicilio)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ─────────────────────────────────────────────────────────
        // TipoCobro
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<TipoCobro>(entity =>
        {
            entity.ToTable("Tipo_Cobro");
            entity.HasKey(e => e.IdTipoCobro);
            entity.Property(e => e.IdTipoCobro).HasColumnName("id_Tipo_Cobro").ValueGeneratedOnAdd();
            entity.Property(e => e.Tipo).HasColumnName("tipo").HasConversion<string>().IsRequired();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasMaxLength(150).IsRequired();
            entity.HasIndex(e => e.Descripcion).IsUnique();
        });

        // ─────────────────────────────────────────────────────────
        // HistorialCostos
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<HistorialCostos>(entity =>
        {
            entity.ToTable("HistorialCostos");
            entity.HasKey(e => e.IdCobro);
            entity.Property(e => e.IdCobro).HasColumnName("id_Cobro").ValueGeneratedOnAdd();
            entity.Property(e => e.IdTipoCobro).HasColumnName("id_Tipo_Cobro").IsRequired();
            entity.Property(e => e.Monto).HasColumnName("monto").HasPrecision(18, 2).IsRequired();
            entity.Property(e => e.FechaEmision).HasColumnName("fecha_Emision");
            entity.Property(e => e.FechaAnulacion).HasColumnName("fecha_Anulacion");
            entity.Property(e => e.EditadoPor).HasColumnName("editado_Por").IsRequired();

            entity.HasOne(hc => hc.TipoCobro)
                  .WithMany(tc => tc.HistorialCostos)
                  .HasForeignKey(hc => hc.IdTipoCobro)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(hc => hc.UsuarioEditor)
                  .WithMany()
                  .HasForeignKey(hc => hc.EditadoPor)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ─────────────────────────────────────────────────────────
        // Mensualidad
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Mensualidad>(entity =>
        {
            entity.ToTable("Mensualidad");
            entity.HasKey(e => e.IdMensualidad);
            entity.Property(e => e.IdMensualidad).HasColumnName("id_Mensualidad").ValueGeneratedOnAdd();
            entity.Property(e => e.IdUsuario).HasColumnName("id_Usuario").IsRequired();
            entity.Property(e => e.Monto).HasColumnName("monto").HasPrecision(18, 2).IsRequired();
            entity.Property(e => e.PeriodoPago).HasColumnName("periodo_Pago");
            entity.Property(e => e.Estado).HasColumnName("estado").HasConversion<string>().IsRequired();
            entity.Property(e => e.FechaVencimiento).HasColumnName("fecha_Vencimiento");

            entity.HasOne(m => m.Usuario)
                  .WithMany(u => u.Mensualidades)
                  .HasForeignKey(m => m.IdUsuario)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ─────────────────────────────────────────────────────────
        // Multa
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Multa>(entity =>
        {
            entity.ToTable("Multa");
            entity.HasKey(e => e.IdMulta);
            entity.Property(e => e.IdMulta).HasColumnName("id_Multa").ValueGeneratedOnAdd();
            entity.Property(e => e.IdTipoMulta).HasColumnName("id_Tipo_Multa").IsRequired();
            entity.Property(e => e.IdUsuario).HasColumnName("id_Usuario").IsRequired();
            entity.Property(e => e.Monto).HasColumnName("monto").HasPrecision(18, 2).IsRequired();
            entity.Property(e => e.Estado).HasColumnName("estado").HasConversion<string>().IsRequired();

            entity.HasOne(m => m.TipoMulta)
                  .WithMany(tc => tc.Multas)
                  .HasForeignKey(m => m.IdTipoMulta)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(m => m.Usuario)
                  .WithMany(u => u.Multas)
                  .HasForeignKey(m => m.IdUsuario)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ─────────────────────────────────────────────────────────
        // Conexion
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Conexion>(entity =>
        {
            entity.ToTable("Conexion");
            entity.HasKey(e => e.IdConexion);
            entity.Property(e => e.IdConexion).HasColumnName("id_Conexion").ValueGeneratedOnAdd();
            entity.Property(e => e.IdUsuario).HasColumnName("id_Usuario").IsRequired();
            entity.Property(e => e.Monto).HasColumnName("monto").HasPrecision(18, 2).IsRequired();
            entity.Property(e => e.IdDomicilio).HasColumnName("id_Domicilio").IsRequired();
            entity.Property(e => e.Estado).HasColumnName("estado").HasConversion<string>().IsRequired();

            entity.HasOne(c => c.Usuario)
                  .WithMany(u => u.Conexiones)
                  .HasForeignKey(c => c.IdUsuario)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(c => c.Domicilio)
                  .WithMany(d => d.Conexiones)
                  .HasForeignKey(c => c.IdDomicilio)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ─────────────────────────────────────────────────────────
        // Pago
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Pago>(entity =>
        {
            entity.ToTable("Pago");
            entity.HasKey(e => e.IdPago);
            entity.Property(e => e.IdPago).HasColumnName("id_Pago").ValueGeneratedOnAdd();
            entity.Property(e => e.RegistradoPor).HasColumnName("registrado_Por");
            entity.Property(e => e.MetodoPago).HasColumnName("metodo_Pago").HasConversion<string>().IsRequired();
            entity.Property(e => e.Monto).HasColumnName("monto").HasPrecision(18, 2).IsRequired();
            entity.Property(e => e.FechaPago).HasColumnName("fecha_Pago").IsRequired();
            entity.Property(e => e.Estado).HasColumnName("estado").HasConversion<string>()
                  .HasDefaultValue(JAV_API.Domain.Enums.EstadoAprobacion.EnRevision);
            entity.Property(e => e.AprobadoPor).HasColumnName("aprobado_Por");

            entity.HasOne(p => p.Registrador)
                  .WithMany(u => u.PagosRegistrados)
                  .HasForeignKey(p => p.RegistradoPor)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(p => p.Aprobador)
                  .WithMany(u => u.PagosAprobados)
                  .HasForeignKey(p => p.AprobadoPor)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ─────────────────────────────────────────────────────────
        // Comprobante (1-1 con Pago)
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Comprobante>(entity =>
        {
            entity.ToTable("Comprobante");
            entity.HasKey(e => e.IdComprobante);
            entity.Property(e => e.IdComprobante).HasColumnName("id_Comprobante").ValueGeneratedOnAdd();
            entity.Property(e => e.IdPago).HasColumnName("id_Pago").IsRequired();
            entity.Property(e => e.Codigo).HasColumnName("codigo").IsRequired();
            entity.Property(e => e.Url).HasColumnName("url").HasMaxLength(500);
            entity.HasIndex(e => e.IdPago).IsUnique();

            entity.HasOne(c => c.Pago)
                  .WithOne(p => p.Comprobante)
                  .HasForeignKey<Comprobante>(c => c.IdPago)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ─────────────────────────────────────────────────────────
        // PagoMensualidad (N-N con PK compuesta)
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<PagoMensualidad>(entity =>
        {
            entity.ToTable("Pago_Mensualidad");
            entity.HasKey(e => new { e.IdMensualidad, e.IdPago });
            entity.Property(e => e.IdMensualidad).HasColumnName("id_Mensualidad");
            entity.Property(e => e.IdPago).HasColumnName("id_Pago");

            entity.HasOne(pm => pm.Mensualidad)
                  .WithMany(m => m.PagoMensualidades)
                  .HasForeignKey(pm => pm.IdMensualidad)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pm => pm.Pago)
                  .WithMany(p => p.PagoMensualidades)
                  .HasForeignKey(pm => pm.IdPago)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ─────────────────────────────────────────────────────────
        // PagoMulta (N-N con PK compuesta)
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<PagoMulta>(entity =>
        {
            entity.ToTable("Pago_Multa");
            entity.HasKey(e => new { e.IdMulta, e.IdPago });
            entity.Property(e => e.IdMulta).HasColumnName("id_Multa");
            entity.Property(e => e.IdPago).HasColumnName("id_Pago");

            entity.HasOne(pm => pm.Multa)
                  .WithMany(m => m.PagoMultas)
                  .HasForeignKey(pm => pm.IdMulta)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pm => pm.Pago)
                  .WithMany(p => p.PagoMultas)
                  .HasForeignKey(pm => pm.IdPago)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ─────────────────────────────────────────────────────────
        // PagoConexion (N-N con PK compuesta)
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<PagoConexion>(entity =>
        {
            entity.ToTable("Pago_Conexion");
            entity.HasKey(e => new { e.IdConexion, e.IdPago });
            entity.Property(e => e.IdConexion).HasColumnName("id_Conexion");
            entity.Property(e => e.IdPago).HasColumnName("id_Pago");

            entity.HasOne(pc => pc.Conexion)
                  .WithMany(c => c.PagoConexiones)
                  .HasForeignKey(pc => pc.IdConexion)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pc => pc.Pago)
                  .WithMany(p => p.PagoConexiones)
                  .HasForeignKey(pc => pc.IdPago)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ─────────────────────────────────────────────────────────
        // Egreso (con 2 FKs hacia Usuario)
        // ─────────────────────────────────────────────────────────
        // ─────────────────────────────────────────────────────────
        // Egreso (con 2 FKs hacia Usuario)
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Egreso>(entity =>
        {
            entity.ToTable("Egresos");
            entity.HasKey(e => e.IdEgreso);
            entity.Property(e => e.IdEgreso).HasColumnName("id_Egreso").ValueGeneratedOnAdd();
            entity.Property(e => e.RegistradoPor).HasColumnName("registrado_Por").IsRequired();
            entity.Property(e => e.Titulo).HasColumnName("titulo").HasMaxLength(150).IsRequired();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasMaxLength(500).IsRequired();
            entity.Property(e => e.Monto).HasColumnName("monto").HasPrecision(18, 2).IsRequired();
            entity.Property(e => e.Fecha).HasColumnName("fecha").IsRequired();
            entity.Property(e => e.Url).HasColumnName("url").HasMaxLength(500).IsRequired();
            entity.Property(e => e.Estado).HasColumnName("estado").HasConversion<string>().IsRequired();
            
            // CORREGIDO: Se elimina .IsRequired() para permitir nulos en la columna
            entity.Property(e => e.AprobadoPor).HasColumnName("aprobado_Por");

            entity.HasOne(e => e.Registrador)
                  .WithMany(u => u.EgresosRegistrados)
                  .HasForeignKey(e => e.RegistradoPor)
                  .OnDelete(DeleteBehavior.Restrict);

            // CORREGIDO: Se agrega .IsRequired(false) para indicar relación opcional
            entity.HasOne(e => e.Aprobador)
                  .WithMany(u => u.EgresosAprobados)
                  .HasForeignKey(e => e.AprobadoPor)
                  .IsRequired(false) 
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ─────────────────────────────────────────────────────────
        // JornadaCobro
        // ─────────────────────────────────────────────────────────
      modelBuilder.Entity<JornadaCobro>(entity =>
        {
            entity.ToTable("Jornada_Cobro");
            entity.HasKey(e => e.IdJornadaCobro);
            entity.Property(e => e.IdJornadaCobro).HasColumnName("id_Jornada_Cobro").ValueGeneratedOnAdd();
            entity.Property(e => e.Fecha).HasColumnName("fecha");
            entity.Property(e => e.PeriodoCobro).HasColumnName("periodo_cobro"); // Agregamos mapeo
            entity.Property(e => e.Encargado).HasColumnName("encargado").IsRequired();

            entity.HasOne(jc => jc.EncargadoUsuario)
                  .WithMany(u => u.JornadasCobroEncargado)
                  .HasForeignKey(jc => jc.Encargado)
                  .OnDelete(DeleteBehavior.Restrict);
        }); 

        // ─────────────────────────────────────────────────────────
        // CierreCaja (1-1 con JornadaCobro)
        // ─────────────────────────────────────────────────────────
        modelBuilder.Entity<CierreCaja>(entity =>
        {
            entity.ToTable("Cierre_Caja");
            entity.HasKey(e => e.IdCierreCaja);
            entity.Property(e => e.IdCierreCaja).HasColumnName("id_Cierre_Caja").ValueGeneratedOnAdd();
            entity.Property(e => e.IdJornadaCobro).HasColumnName("id_Jornada_Cobro").IsRequired();
            entity.Property(e => e.UrlFirmaTesorero).HasColumnName("url_Firma_Tesorero").HasMaxLength(500);
            entity.Property(e => e.IdFiscal).HasColumnName("id_Fiscal").IsRequired();
            entity.Property(e => e.UrlFirmaFiscal).HasColumnName("url_Firma_Fiscal").HasMaxLength(500);
            entity.Property(e => e.Estado).HasColumnName("estado").HasConversion<string>();
            entity.HasIndex(e => e.IdJornadaCobro).IsUnique();

            entity.HasOne(cc => cc.JornadaCobro)
                  .WithOne(jc => jc.CierreCaja)
                  .HasForeignKey<CierreCaja>(cc => cc.IdJornadaCobro)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(cc => cc.Fiscal)
                  .WithMany(u => u.CierresCajaFiscal)
                  .HasForeignKey(cc => cc.IdFiscal)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
