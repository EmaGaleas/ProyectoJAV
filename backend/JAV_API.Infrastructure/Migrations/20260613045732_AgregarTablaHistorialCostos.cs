using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JAV_API.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregarTablaHistorialCostos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "editado_Por",
                table: "HistorialCostos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_HistorialCostos_editado_Por",
                table: "HistorialCostos",
                column: "editado_Por");

            migrationBuilder.AddForeignKey(
                name: "FK_HistorialCostos_Usuario_editado_Por",
                table: "HistorialCostos",
                column: "editado_Por",
                principalTable: "Usuario",
                principalColumn: "id_Usuario",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HistorialCostos_Usuario_editado_Por",
                table: "HistorialCostos");

            migrationBuilder.DropIndex(
                name: "IX_HistorialCostos_editado_Por",
                table: "HistorialCostos");

            migrationBuilder.DropColumn(
                name: "editado_Por",
                table: "HistorialCostos");
        }
    }
}
