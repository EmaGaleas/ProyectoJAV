using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JAV_API.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CorregirEgresoAprobadoPorNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "aprobado_Por",
                table: "Egresos",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "aprobado_Por",
                table: "Egresos",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}
