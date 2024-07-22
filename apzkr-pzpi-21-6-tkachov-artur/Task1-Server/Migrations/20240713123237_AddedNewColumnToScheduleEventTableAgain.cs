using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace medireminder.Migrations
{
    /// <inheritdoc />
    public partial class AddedNewColumnToScheduleEventTableAgain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Activated",
                table: "ScheduleEvents",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Activated",
                table: "ScheduleEvents");
        }
    }
}
