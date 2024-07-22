using medireminder.Dto;

namespace medireminder.GetDto
{
    public class ScheduleEventGetDto
    {
        public int ScheduleEventId { get; set; }
        public MedicationScheduleDto MedicationSchedule { get; set; }
        public DateTime MedicationTime { get; set; }
        public bool MissedDose { get; set; }
        public bool PastNeededTime { get; set; }
        public bool Activated { get; set; }
    }
}
