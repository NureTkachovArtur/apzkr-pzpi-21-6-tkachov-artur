namespace medireminder.Models
{
    public class MedicationStatistics
    {
        public int MedicationStatisticsId { get; set; }
        public int PatientId { get; set; }
        public Patient Patient { get; set; }
        public int MedicineId { get; set; }
        public Medicine Medicine { get; set; }
        public DateTime MedicationTime { get; set; }
        public bool MissedDose { get; set; }
    }
}
