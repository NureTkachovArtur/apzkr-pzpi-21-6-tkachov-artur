namespace medireminder.Dto
{
    public class MedicationScheduleDto
    {
        public int MedicationScheduleId { get; set; }
        public int PatientId { get; set; }
        public int MedicineId { get; set; }
        public int SmartDeviceId {  get; set; }
        public DateTime MedicationTime { get; set; }
        public DateTime MedicationStartDate { get; set; }
        public DateTime MedicationEndDate { get; set; }
        public int MedicationIntervalMinutes { get; set; }
    }
}
