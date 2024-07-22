using medireminder.Data;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.EntityFrameworkCore;

namespace medireminder.Repository
{
    public class PatientTrusteeRepository : IPatientTrusteeRepository
    {
        private readonly DataContext _context;

        public PatientTrusteeRepository(DataContext context)
        {
            _context = context;
        }
        public bool CreatePatientTrustee(PatientTrustee patientTrustee)
        {
            _context.Add(patientTrustee);
            return Save();
        }

        public bool DeletePatientTrustee(PatientTrustee patientTrustee)
        {
            _context.Remove(patientTrustee);
            return Save();
        }

        public PatientTrustee GetPatientTrustee(int patientId, int trusteeId)
        {
            return _context.PatientTrustees
                .Where(e => e.PatientId == patientId && e.TrusteeId == trusteeId)
                .FirstOrDefault();
        }

        public ICollection<PatientTrustee> GetPatientTrustees()
        {
            return _context.PatientTrustees.ToList();
        }

        public bool PatientTrusteeExists(int patientId, int trusteeId)
        {
            return _context.PatientTrustees.Any(e => e.PatientId == patientId && e.TrusteeId == trusteeId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdatePatientTrustee(PatientTrustee patientTrustee)
        {
            _context.Update(patientTrustee);
            return Save();
        }
    }
}
