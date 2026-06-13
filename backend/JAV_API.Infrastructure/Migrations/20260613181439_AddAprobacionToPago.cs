using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JAV_API.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAprobacionToPago : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "aprobado_Por",
                table: "Pago",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "estado",
                table: "Pago",
                type: "text",
                nullable: false,
                defaultValue: "EnRevision");

            migrationBuilder.CreateIndex(
                name: "IX_Pago_aprobado_Por",
                table: "Pago",
                column: "aprobado_Por");

            migrationBuilder.AddForeignKey(
                name: "FK_Pago_Usuario_aprobado_Por",
                table: "Pago",
                column: "aprobado_Por",
                principalTable: "Usuario",
                principalColumn: "id_Usuario",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pago_Usuario_aprobado_Por",
                table: "Pago");

            migrationBuilder.DropIndex(
                name: "IX_Pago_aprobado_Por",
                table: "Pago");

            migrationBuilder.DropColumn(
                name: "aprobado_Por",
                table: "Pago");

            migrationBuilder.DropColumn(
                name: "estado",
                table: "Pago");
        }
    }
}
