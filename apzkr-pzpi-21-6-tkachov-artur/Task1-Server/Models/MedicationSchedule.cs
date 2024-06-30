namespace medireminder.Models
{
    public class MedicationSchedule
    {
        public int MedicationScheduleId { get; set; }
        public int PatientId { get; set; }
        public Patient Patient { get; set; }
        public int SmartDeviceId { get; set; }
        public SmartDevice SmartDevice { get; set; }
        public int MedicineId { get; set; }
        public Medicine Medicine { get; set; }
        public DateTime MedicationTime { get; set; }
        public DateTime MedicationStartDate { get; set; }
        public DateTime MedicationEndDate { get; set; }
        public int MedicationIntervalMinutes { get; set; }
    }
}
