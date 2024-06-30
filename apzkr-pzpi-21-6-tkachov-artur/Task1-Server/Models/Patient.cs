namespace medireminder.Models
{
    public class Patient
    {
        public int PatientId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public string Address { get; set; }
        public int Age { get; set; }
        public char Gender { get; set; }
        public ICollection<SmartDevice> SmartDevices { get; set; }
        public ICollection<Message> Messages { get; set; }
        public ICollection<Medicine> Medicines { get; set; }
        public ICollection<MedicationSchedule> MedicationSchedules { get; set; }
        public ICollection<MedicationStatistics> MedicationStatistics { get; set; }
        public ICollection<PatientDoctor> PatientDoctors { get; set; }
        public ICollection<PatientTrustee> PatientTrustees { get; set; }
    }
}
