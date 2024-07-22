using medireminder.Models;

namespace medireminder.Interfaces
{
    public interface IScheduleEventRepository
    {
        ICollection<ScheduleEvent> GetScheduleEvents();
        ScheduleEvent GetScheduleEvent(int eventId);
        ICollection<ScheduleEvent> GetScheduleEventsByPatient(int patientId);
        ICollection<ScheduleEvent> GetScheduleEventsOfToday();
        bool ScheduleEventExists(int eventId);
        bool CreateScheduleEvent(ScheduleEvent scheduleEvent);
        bool CreateEventsToSchedule(MedicationSchedule medicationSchedule);
        bool UpdateScheduleEvent(ScheduleEvent scheduleEvent);
        bool DeleteScheduleEvent(ScheduleEvent scheduleEvent);
        bool Save();
    }
}
