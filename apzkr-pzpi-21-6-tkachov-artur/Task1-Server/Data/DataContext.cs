using medireminder.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace medireminder.Data
{
    public class DataContext : IdentityDbContext<ApplicationUser>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}

        public DbSet<Administrator> Administrators { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<MedicationSchedule> MedicationSchedules { get; set; }
        public DbSet<MedicationStatistics> MedicationStatistics { get; set; }
        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MessageType> MessageTypes { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<PatientDoctor> PatientDoctors { get; set; }
        public DbSet<PatientTrustee> PatientTrustees { get; set; }
        public DbSet<SmartDevice> SmartDevices { get; set; }
        public DbSet<SmartDeviceType> SmartDeviceTypes { get; set; }
        public DbSet<Trustee> Trustees { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Patient>()
                .HasMany(e => e.Messages)
                .WithOne(e => e.Patient)
                .HasForeignKey(e => e.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>()
                .HasMany(e => e.Medicines)
                .WithOne(e => e.Patient)
                .HasForeignKey(e => e.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>()
                .HasMany(e => e.MedicationSchedules)
                .WithOne(e => e.Patient)
                .HasForeignKey(e => e.PatientId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Patient>()
                .HasMany(e => e.MedicationStatistics)
                .WithOne(e => e.Patient)
                .HasForeignKey(e => e.PatientId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Patient>()
                .HasMany(e => e.SmartDevices)
                .WithOne(e => e.Patient)
                .HasForeignKey(e => e.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>()
                .HasMany(e => e.PatientDoctors)
                .WithOne(e => e.Patient)
                .HasForeignKey(e => e.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>()
                .HasMany(e => e.PatientTrustees)
                .WithOne(e => e.Patient)
                .HasForeignKey(e => e.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Doctor>()
                .HasMany(e => e.PatientDoctors)
                .WithOne(e => e.Doctor)
                .HasForeignKey(e => e.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Trustee>()
                .HasMany(e => e.PatientTrustees)
                .WithOne(e => e.Trustee)
                .HasForeignKey(e => e.TrusteeId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<MessageType>()
                .HasMany(e => e.Messages)
                .WithOne(e => e.MessageType)
                .HasForeignKey(e => e.MessageTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<SmartDeviceType>()
                .HasMany(e => e.SmartDevices)
                .WithOne(e => e.SmartDeviceType)
                .HasForeignKey(e => e.SmartDeviceTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<PatientDoctor>()
                .HasKey(e => new { e.PatientId, e.DoctorId });
            builder.Entity<PatientDoctor>()
                .HasOne(e => e.Patient)
                .WithMany(e => e.PatientDoctors)
                .HasForeignKey(e => e.PatientId);
            builder.Entity<PatientDoctor>()
                .HasOne(e => e.Doctor)
                .WithMany(e => e.PatientDoctors)
                .HasForeignKey(e => e.DoctorId);

            builder.Entity<PatientTrustee>()
                .HasKey(e => new { e.PatientId, e.TrusteeId });
            builder.Entity<PatientTrustee>()
                .HasOne(e => e.Patient)
                .WithMany(e => e.PatientTrustees)
                .HasForeignKey(e => e.PatientId);
            builder.Entity<PatientTrustee>()
                .HasOne(e => e.Trustee)
                .WithMany(e => e.PatientTrustees)
                .HasForeignKey(e => e.TrusteeId);

            builder.Entity<MedicationSchedule>()
                .HasOne(e => e.SmartDevice)
                .WithMany(e => e.MedicationSchedules)
                .HasForeignKey(e => e.SmartDeviceId)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(builder);
        }
    }
}
