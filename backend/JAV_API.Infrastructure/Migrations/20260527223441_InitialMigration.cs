using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace JAV_API.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Domicilio",
                columns: table => new
                {
                    id_Domicilio = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    codigo_Bloque = table.Column<string>(type: "text", nullable: false),
                    lote_Casa = table.Column<int>(type: "integer", nullable: false),
                    calle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Domicilio", x => x.id_Domicilio);
                });

            migrationBuilder.CreateTable(
                name: "Permisos",
                columns: table => new
                {
                    id_Permiso = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    descripcion = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permisos", x => x.id_Permiso);
                });

            migrationBuilder.CreateTable(
                name: "Persona",
                columns: table => new
                {
                    id_Persona = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    primer_Nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    segundo_Nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    primer_Apellido = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    segundo_Apellido = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    dni = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Persona", x => x.id_Persona);
                });

            migrationBuilder.CreateTable(
                name: "Tipo_Cobro",
                columns: table => new
                {
                    id_Tipo_Cobro = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tipo = table.Column<string>(type: "text", nullable: false),
                    descripcion = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tipo_Cobro", x => x.id_Tipo_Cobro);
                });

            migrationBuilder.CreateTable(
                name: "Tipo_Usuario",
                columns: table => new
                {
                    id_Tipo = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tipo_Usuario", x => x.id_Tipo);
                });

            migrationBuilder.CreateTable(
                name: "HistorialCostos",
                columns: table => new
                {
                    id_Cobro = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_Tipo_Cobro = table.Column<int>(type: "integer", nullable: false),
                    monto = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    fecha_Emision = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    fecha_Anulacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistorialCostos", x => x.id_Cobro);
                    table.ForeignKey(
                        name: "FK_HistorialCostos_Tipo_Cobro_id_Tipo_Cobro",
                        column: x => x.id_Tipo_Cobro,
                        principalTable: "Tipo_Cobro",
                        principalColumn: "id_Tipo_Cobro",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Tipo_Usuario_Permiso",
                columns: table => new
                {
                    id_Tipo = table.Column<int>(type: "integer", nullable: false),
                    id_Permiso = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tipo_Usuario_Permiso", x => new { x.id_Tipo, x.id_Permiso });
                    table.ForeignKey(
                        name: "FK_Tipo_Usuario_Permiso_Permisos_id_Permiso",
                        column: x => x.id_Permiso,
                        principalTable: "Permisos",
                        principalColumn: "id_Permiso",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Tipo_Usuario_Permiso_Tipo_Usuario_id_Tipo",
                        column: x => x.id_Tipo,
                        principalTable: "Tipo_Usuario",
                        principalColumn: "id_Tipo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Usuario",
                columns: table => new
                {
                    id_Usuario = table.Column<int>(type: "integer", nullable: false),
                    correo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    telefono = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    estado = table.Column<bool>(type: "boolean", nullable: false),
                    ultimo_Acceso = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fecha_Creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    rol = table.Column<string>(type: "text", nullable: true),
                    tipo_Usuario = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuario", x => x.id_Usuario);
                    table.ForeignKey(
                        name: "FK_Usuario_Persona_id_Usuario",
                        column: x => x.id_Usuario,
                        principalTable: "Persona",
                        principalColumn: "id_Persona",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Usuario_Tipo_Usuario_tipo_Usuario",
                        column: x => x.tipo_Usuario,
                        principalTable: "Tipo_Usuario",
                        principalColumn: "id_Tipo",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Conexion",
                columns: table => new
                {
                    id_Conexion = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_Usuario = table.Column<int>(type: "integer", nullable: false),
                    monto = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    id_Domicilio = table.Column<int>(type: "integer", nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conexion", x => x.id_Conexion);
                    table.ForeignKey(
                        name: "FK_Conexion_Domicilio_id_Domicilio",
                        column: x => x.id_Domicilio,
                        principalTable: "Domicilio",
                        principalColumn: "id_Domicilio",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Conexion_Usuario_id_Usuario",
                        column: x => x.id_Usuario,
                        principalTable: "Usuario",
                        principalColumn: "id_Usuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Domicilio_Usuario",
                columns: table => new
                {
                    id_Usuario = table.Column<int>(type: "integer", nullable: false),
                    id_Domicilio = table.Column<int>(type: "integer", nullable: false),
                    estructura = table.Column<int>(type: "integer", nullable: false),
                    estado = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Domicilio_Usuario", x => new { x.id_Usuario, x.id_Domicilio, x.estructura });
                    table.ForeignKey(
                        name: "FK_Domicilio_Usuario_Domicilio_id_Domicilio",
                        column: x => x.id_Domicilio,
                        principalTable: "Domicilio",
                        principalColumn: "id_Domicilio",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Domicilio_Usuario_Usuario_id_Usuario",
                        column: x => x.id_Usuario,
                        principalTable: "Usuario",
                        principalColumn: "id_Usuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Egresos",
                columns: table => new
                {
                    id_Egreso = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    registrado_Por = table.Column<int>(type: "integer", nullable: false),
                    titulo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    descripcion = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    monto = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    fecha = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false),
                    aprobado_Por = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Egresos", x => x.id_Egreso);
                    table.ForeignKey(
                        name: "FK_Egresos_Usuario_aprobado_Por",
                        column: x => x.aprobado_Por,
                        principalTable: "Usuario",
                        principalColumn: "id_Usuario",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Egresos_Usuario_registrado_Por",
                        column: x => x.registrado_Por,
                        principalTable: "Usuario",
                        principalColumn: "id_Usuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Jornada_Cobro",
                columns: table => new
                {
                    id_Jornada_Cobro = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fecha = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    encargado = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jornada_Cobro", x => x.id_Jornada_Cobro);
                    table.ForeignKey(
                        name: "FK_Jornada_Cobro_Usuario_encargado",
                        column: x => x.encargado,
                        principalTable: "Usuario",
                        principalColumn: "id_Usuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Mensualidad",
                columns: table => new
                {
                    id_Mensualidad = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_Usuario = table.Column<int>(type: "integer", nullable: false),
                    monto = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    periodo_Pago = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    estado = table.Column<string>(type: "text", nullable: false),
                    fecha_Vencimiento = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mensualidad", x => x.id_Mensualidad);
                    table.ForeignKey(
                        name: "FK_Mensualidad_Usuario_id_Usuario",
                        column: x => x.id_Usuario,
                        principalTable: "Usuario",
                        principalColumn: "id_Usuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Multa",
                columns: table => new
                {
                    id_Multa = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_Tipo_Multa = table.Column<int>(type: "integer", nullable: false),
                    id_Usuario = table.Column<int>(type: "integer", nullable: false),
                    monto = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Multa", x => x.id_Multa);
                    table.ForeignKey(
                        name: "FK_Multa_Tipo_Cobro_id_Tipo_Multa",
                        column: x => x.id_Tipo_Multa,
                        principalTable: "Tipo_Cobro",
                        principalColumn: "id_Tipo_Cobro",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Multa_Usuario_id_Usuario",
                        column: x => x.id_Usuario,
                        principalTable: "Usuario",
                        principalColumn: "id_Usuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Pago",
                columns: table => new
                {
                    id_Pago = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    registrado_Por = table.Column<int>(type: "integer", nullable: true),
                    metodo_Pago = table.Column<string>(type: "text", nullable: false),
                    monto = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    fecha_Pago = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pago", x => x.id_Pago);
                    table.ForeignKey(
                        name: "FK_Pago_Usuario_registrado_Por",
                        column: x => x.registrado_Por,
                        principalTable: "Usuario",
                        principalColumn: "id_Usuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Cierre_Caja",
                columns: table => new
                {
                    id_Cierre_Caja = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_Jornada_Cobro = table.Column<int>(type: "integer", nullable: false),
                    url_Firma_Tesorero = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    id_Fiscal = table.Column<int>(type: "integer", nullable: false),
                    url_Firma_Fiscal = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    estado = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cierre_Caja", x => x.id_Cierre_Caja);
                    table.ForeignKey(
                        name: "FK_Cierre_Caja_Jornada_Cobro_id_Jornada_Cobro",
                        column: x => x.id_Jornada_Cobro,
                        principalTable: "Jornada_Cobro",
                        principalColumn: "id_Jornada_Cobro",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Cierre_Caja_Usuario_id_Fiscal",
                        column: x => x.id_Fiscal,
                        principalTable: "Usuario",
                        principalColumn: "id_Usuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Comprobante",
                columns: table => new
                {
                    id_Comprobante = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_Pago = table.Column<int>(type: "integer", nullable: false),
                    codigo = table.Column<int>(type: "integer", nullable: false),
                    url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comprobante", x => x.id_Comprobante);
                    table.ForeignKey(
                        name: "FK_Comprobante_Pago_id_Pago",
                        column: x => x.id_Pago,
                        principalTable: "Pago",
                        principalColumn: "id_Pago",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Pago_Conexion",
                columns: table => new
                {
                    id_Conexion = table.Column<int>(type: "integer", nullable: false),
                    id_Pago = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pago_Conexion", x => new { x.id_Conexion, x.id_Pago });
                    table.ForeignKey(
                        name: "FK_Pago_Conexion_Conexion_id_Conexion",
                        column: x => x.id_Conexion,
                        principalTable: "Conexion",
                        principalColumn: "id_Conexion",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Pago_Conexion_Pago_id_Pago",
                        column: x => x.id_Pago,
                        principalTable: "Pago",
                        principalColumn: "id_Pago",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pago_Mensualidad",
                columns: table => new
                {
                    id_Mensualidad = table.Column<int>(type: "integer", nullable: false),
                    id_Pago = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pago_Mensualidad", x => new { x.id_Mensualidad, x.id_Pago });
                    table.ForeignKey(
                        name: "FK_Pago_Mensualidad_Mensualidad_id_Mensualidad",
                        column: x => x.id_Mensualidad,
                        principalTable: "Mensualidad",
                        principalColumn: "id_Mensualidad",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Pago_Mensualidad_Pago_id_Pago",
                        column: x => x.id_Pago,
                        principalTable: "Pago",
                        principalColumn: "id_Pago",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pago_Multa",
                columns: table => new
                {
                    id_Multa = table.Column<int>(type: "integer", nullable: false),
                    id_Pago = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pago_Multa", x => new { x.id_Multa, x.id_Pago });
                    table.ForeignKey(
                        name: "FK_Pago_Multa_Multa_id_Multa",
                        column: x => x.id_Multa,
                        principalTable: "Multa",
                        principalColumn: "id_Multa",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Pago_Multa_Pago_id_Pago",
                        column: x => x.id_Pago,
                        principalTable: "Pago",
                        principalColumn: "id_Pago",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cierre_Caja_id_Fiscal",
                table: "Cierre_Caja",
                column: "id_Fiscal");

            migrationBuilder.CreateIndex(
                name: "IX_Cierre_Caja_id_Jornada_Cobro",
                table: "Cierre_Caja",
                column: "id_Jornada_Cobro",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Comprobante_id_Pago",
                table: "Comprobante",
                column: "id_Pago",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Conexion_id_Domicilio",
                table: "Conexion",
                column: "id_Domicilio");

            migrationBuilder.CreateIndex(
                name: "IX_Conexion_id_Usuario",
                table: "Conexion",
                column: "id_Usuario");

            migrationBuilder.CreateIndex(
                name: "IX_Domicilio_codigo_Bloque_lote_Casa",
                table: "Domicilio",
                columns: new[] { "codigo_Bloque", "lote_Casa" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Domicilio_Usuario_id_Domicilio",
                table: "Domicilio_Usuario",
                column: "id_Domicilio");

            migrationBuilder.CreateIndex(
                name: "IX_Egresos_aprobado_Por",
                table: "Egresos",
                column: "aprobado_Por");

            migrationBuilder.CreateIndex(
                name: "IX_Egresos_registrado_Por",
                table: "Egresos",
                column: "registrado_Por");

            migrationBuilder.CreateIndex(
                name: "IX_HistorialCostos_id_Tipo_Cobro",
                table: "HistorialCostos",
                column: "id_Tipo_Cobro");

            migrationBuilder.CreateIndex(
                name: "IX_Jornada_Cobro_encargado",
                table: "Jornada_Cobro",
                column: "encargado");

            migrationBuilder.CreateIndex(
                name: "IX_Mensualidad_id_Usuario",
                table: "Mensualidad",
                column: "id_Usuario");

            migrationBuilder.CreateIndex(
                name: "IX_Multa_id_Tipo_Multa",
                table: "Multa",
                column: "id_Tipo_Multa");

            migrationBuilder.CreateIndex(
                name: "IX_Multa_id_Usuario",
                table: "Multa",
                column: "id_Usuario");

            migrationBuilder.CreateIndex(
                name: "IX_Pago_registrado_Por",
                table: "Pago",
                column: "registrado_Por");

            migrationBuilder.CreateIndex(
                name: "IX_Pago_Conexion_id_Pago",
                table: "Pago_Conexion",
                column: "id_Pago");

            migrationBuilder.CreateIndex(
                name: "IX_Pago_Mensualidad_id_Pago",
                table: "Pago_Mensualidad",
                column: "id_Pago");

            migrationBuilder.CreateIndex(
                name: "IX_Pago_Multa_id_Pago",
                table: "Pago_Multa",
                column: "id_Pago");

            migrationBuilder.CreateIndex(
                name: "IX_Permisos_descripcion",
                table: "Permisos",
                column: "descripcion",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Persona_dni",
                table: "Persona",
                column: "dni",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tipo_Cobro_descripcion",
                table: "Tipo_Cobro",
                column: "descripcion",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tipo_Usuario_nombre",
                table: "Tipo_Usuario",
                column: "nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tipo_Usuario_Permiso_id_Permiso",
                table: "Tipo_Usuario_Permiso",
                column: "id_Permiso");

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_correo",
                table: "Usuario",
                column: "correo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_telefono",
                table: "Usuario",
                column: "telefono",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_tipo_Usuario",
                table: "Usuario",
                column: "tipo_Usuario");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cierre_Caja");

            migrationBuilder.DropTable(
                name: "Comprobante");

            migrationBuilder.DropTable(
                name: "Domicilio_Usuario");

            migrationBuilder.DropTable(
                name: "Egresos");

            migrationBuilder.DropTable(
                name: "HistorialCostos");

            migrationBuilder.DropTable(
                name: "Pago_Conexion");

            migrationBuilder.DropTable(
                name: "Pago_Mensualidad");

            migrationBuilder.DropTable(
                name: "Pago_Multa");

            migrationBuilder.DropTable(
                name: "Tipo_Usuario_Permiso");

            migrationBuilder.DropTable(
                name: "Jornada_Cobro");

            migrationBuilder.DropTable(
                name: "Conexion");

            migrationBuilder.DropTable(
                name: "Mensualidad");

            migrationBuilder.DropTable(
                name: "Multa");

            migrationBuilder.DropTable(
                name: "Pago");

            migrationBuilder.DropTable(
                name: "Permisos");

            migrationBuilder.DropTable(
                name: "Domicilio");

            migrationBuilder.DropTable(
                name: "Tipo_Cobro");

            migrationBuilder.DropTable(
                name: "Usuario");

            migrationBuilder.DropTable(
                name: "Persona");

            migrationBuilder.DropTable(
                name: "Tipo_Usuario");
        }
    }
}
