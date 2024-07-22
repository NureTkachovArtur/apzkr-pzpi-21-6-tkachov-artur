namespace medireminder.Models
{
    public class ScheduleEvent
    {
        public int ScheduleEventId { get; set; }
        public int MedicationScheduleId { get; set; }
        public MedicationSchedule MedicationSchedule { get; set; }
        public bool MissedDose { get; set; }
        public bool PastNeededTime { get; set; }
        public bool Activated { get; set; }
        public DateTime? MedicationTime { get; set; }
    }
}
