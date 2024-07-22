namespace medireminder.Dto
{
    public class MedicationScheduleDto
    {
        public int MedicationScheduleId { get; set; }
        public int PatientId { get; set; }
        public int MedicineId { get; set; }
        public int SmartDeviceId {  get; set; }
        public DateTime MedicationStartDate { get; set; }
        public float DosesPerDay { get; set; }
        public int MedicationIntervalMinutes { get; set; }
        public int EveryNDay { get; set; }
        public int DaysLeft { get; set; }
    }
}
