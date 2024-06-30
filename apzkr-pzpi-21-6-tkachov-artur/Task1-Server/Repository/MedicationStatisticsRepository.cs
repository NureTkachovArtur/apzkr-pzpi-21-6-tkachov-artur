using medireminder.Data;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.EntityFrameworkCore;

namespace medireminder.Repository
{
    public class MedicationStatisticsRepository : IMedicationStatisticsRepository
    {
        private readonly DataContext _context;

        public MedicationStatisticsRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateMedicationStatistics(MedicationStatistics medicationStatistics)
        {
            _context.Add(medicationStatistics);
            return Save();
        }

        public bool DeleteMedicationStatistics(MedicationStatistics medicationStatistics)
        {
            _context.Remove(medicationStatistics);
            return Save();
        }

        public MedicationStatistics GetMedicationStatistic(int medicationStatisticsId)
        {
            return _context.MedicationStatistics
                .Include(e => e.Medicine)
                .Where(e => e.MedicationStatisticsId == medicationStatisticsId)
                .FirstOrDefault();
        }

        public ICollection<MedicationStatistics> GetMedicationStatistics()
        {
            return _context.MedicationStatistics
                .Include(e => e.Medicine)
                .OrderBy(e => e.MedicationStatisticsId)
                .ToList();
        }

        public ICollection<MedicationStatistics> GetMedicationStatisticsByPatient(int patientId)
        {
            return _context.MedicationStatistics
                .Include(e => e.Medicine)
                .Where(e => e.PatientId == patientId)
                .ToList();
        }

        public bool MedicationStatisticsExists(int medicationStatisticsId)
        {
            return _context.MedicationStatistics.Any(e => e.MedicationStatisticsId == medicationStatisticsId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateMedicationStatistics(MedicationStatistics medicationStatistics)
        {
            _context.Update(medicationStatistics);
            return Save();
        }
    }
}
