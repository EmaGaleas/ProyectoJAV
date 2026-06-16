using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JAV_API.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregarPeriodoCobro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "periodo_cobro",
                table: "Jornada_Cobro",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "periodo_cobro",
                table: "Jornada_Cobro");
        }
    }
}
