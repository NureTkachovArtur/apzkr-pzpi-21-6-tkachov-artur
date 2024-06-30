namespace medireminder.Dto
{
    public class MedicationStatisticsDto
    {
        public int MedicationStatisticsId { get; set; }
        public int PatientId { get; set; }
        public int MedicineId { get; set; }
        public DateTime MedicationTime { get; set; }
        public bool MissedDose { get; set; } = false;
    }
}
