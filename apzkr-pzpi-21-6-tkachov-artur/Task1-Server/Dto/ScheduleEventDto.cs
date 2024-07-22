namespace medireminder.Dto
{
    public class ScheduleEventDto
    {
        public int ScheduleEventId { get; set; }
        public int MedicationScheduleId { get; set; }
        public DateTime MedicationTime { get; set; }
        public bool MissedDose { get; set; }
        public bool PastNeededTime { get; set; }
        public bool Activated { get; set; }
    }
}
