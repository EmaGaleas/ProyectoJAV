using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JAV_API.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregarComentarioRechazo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "comentario_Rechazo",
                table: "Pago",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "comentario_Rechazo",
                table: "Egresos",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "comentario_Rechazo",
                table: "Pago");

            migrationBuilder.DropColumn(
                name: "comentario_Rechazo",
                table: "Egresos");
        }
    }
}
