using medireminder.Data;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.EntityFrameworkCore;

namespace medireminder.Repository
{
    public class ScheduleEventRepository : IScheduleEventRepository
    {
        private readonly DataContext _context;

        public ScheduleEventRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateScheduleEvent(ScheduleEvent scheduleEvent)
        {
            _context.Add(scheduleEvent);
            return Save();
        }

        public bool DeleteScheduleEvent(ScheduleEvent scheduleEvent)
        {
            _context.Remove(scheduleEvent);
            return Save();
        }

        public ScheduleEvent GetScheduleEvent(int eventId)
        {
            return _context.ScheduleEvents
                .Include(e => e.MedicationSchedule)
                .Where(e => e.ScheduleEventId == eventId)
                .FirstOrDefault();
        }

        public ICollection<ScheduleEvent> GetScheduleEvents()
        {
            return _context.ScheduleEvents
                .Include(e => e.MedicationSchedule)
                .OrderBy(e => e.ScheduleEventId)
                .ToList();
        }

        public ICollection<ScheduleEvent> GetScheduleEventsByPatient(int patientId)
        {
            return _context.ScheduleEvents
                .Include(e => e.MedicationSchedule)
                .Where(e => e.MedicationSchedule.PatientId == patientId)
                .ToList();
        }

        public bool ScheduleEventExists(int eventId)
        {
            return _context.ScheduleEvents.Any(e => e.ScheduleEventId == eventId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateScheduleEvent(ScheduleEvent scheduleEvent)
        {
            _context.Update(scheduleEvent);
            return Save();
        }

        public static DateTime AddMinutesToDate(DateTime date, int minutes)
        {
            return date.AddMinutes(minutes);
        }

        public bool CreateEventsToSchedule(MedicationSchedule medicationSchedule)
        {
            IList<ScheduleEvent> scheduleEvents = new List<ScheduleEvent>();

            for (int i = 0; i < medicationSchedule.DaysLeft * medicationSchedule.EveryNDay; i += medicationSchedule.EveryNDay)
            {
                for (int j = 0; j < medicationSchedule.DosesPerDay; j++)
                {
                    ScheduleEvent _event = new ScheduleEvent
                    {
                        MedicationScheduleId = medicationSchedule.MedicationScheduleId,
                        MedicationSchedule = medicationSchedule,
                        MissedDose = false,
                        PastNeededTime = false,
                        Activated = false,
                        MedicationTime = AddMinutesToDate(
                            AddMinutesToDate(medicationSchedule.MedicationStartDate, i * 1440), 
                            medicationSchedule.MedicationIntervalMinutes * j
                        )
                    };
                    scheduleEvents.Add(_event);
                }
            }

            _context.AddRange(scheduleEvents);
            return Save();
        }

        public ICollection<ScheduleEvent> GetScheduleEventsOfToday()
        {
            var today = DateTime.Today;
            return _context.ScheduleEvents
                .Where(e => !e.MissedDose && !e.Activated && (e.MedicationTime.HasValue && e.MedicationTime.Value.Date == today))
                .Include(e => e.MedicationSchedule)
                .OrderBy(e => e.ScheduleEventId)
                .ToList();
        }
    }
}
