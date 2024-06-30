namespace medireminder.GetDto
{
    public class MedicationStatisticsGetDto
    {
        public int MedicationStatisticsId { get; set; }
        public int PatientId { get; set; }
        public MedicineGetDto Medicine { get; set; }
        public DateTime MedicationTime { get; set; }
        public bool MissedDose { get; set; }
    }
}
