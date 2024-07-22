using medireminder.Data;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace medireminder.Repository
{
    public class MedicationScheduleRepository : IMedicationScheduleRepository
    {
        private readonly DataContext _context;

        public MedicationScheduleRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateMedicationSchedule(MedicationSchedule medicationSchedule)
        {
            _context.Add(medicationSchedule);
            return Save();
        }

        public bool DeleteMedicationSchedule(MedicationSchedule medicationSchedule)
        {
            _context.Remove(medicationSchedule);
            return Save();
        }

        public MedicationSchedule GetMedicationSchedule(int medicationScheduleId)
        {
            return _context.MedicationSchedules
                .Include(e => e.Medicine)
                .Where(e => e.MedicationScheduleId == medicationScheduleId)
                .FirstOrDefault();
        }

        public MedicationSchedule GetMedicationScheduleByDeviceId(int deviceId)
        {
            return _context.MedicationSchedules.Where(e => e.SmartDeviceId == deviceId).FirstOrDefault();
        }

        public ICollection<MedicationSchedule> GetMedicationSchedules()
        {
            return _context.MedicationSchedules
                .Include(e => e.Medicine)
                .OrderBy(e => e.MedicationScheduleId)
                .ToList();
        }

        public ICollection<MedicationSchedule> GetMedicationSchedulesByPatient(int patientId)
        {
            return _context.MedicationSchedules.Where(e => e.PatientId == patientId).ToList();
        }

        public bool MedicationScheduleExists(int medicationScheduleId)
        {
            return _context.MedicationSchedules.Any(e => e.MedicationScheduleId == medicationScheduleId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateMedicationSchedule(MedicationSchedule medicationSchedule)
        {
            _context.Update(medicationSchedule);
            return Save();
        }
    }
}
