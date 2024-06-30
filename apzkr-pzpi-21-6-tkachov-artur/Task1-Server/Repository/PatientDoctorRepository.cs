using medireminder.Data;
using medireminder.Interfaces;
using medireminder.Models;

namespace medireminder.Repository
{
    public class PatientDoctorRepository : IPatientDoctorRepository
    {
        private readonly DataContext _context;

        public PatientDoctorRepository(DataContext context)
        {
            _context = context;
        }
        public bool CreatePatientDoctor(PatientDoctor patientDoctor)
        {
            _context.Add(patientDoctor);
            return Save();
        }

        public bool DeletePatientDoctor(PatientDoctor patientDoctor)
        {
            _context.Remove(patientDoctor);
            return Save();
        }

        public PatientDoctor GetPatientDoctor(int patientId, int doctorId)
        {
            return _context.PatientDoctors
                .Where(e => e.PatientId == patientId && e.DoctorId == doctorId)
                .FirstOrDefault();
        }

        public bool PatientDoctorExists(int patientId, int doctorId)
        {
            return _context.PatientDoctors.Any(e => e.PatientId == patientId && e.DoctorId == doctorId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdatePatientDoctor(PatientDoctor patientDoctor)
        {
            _context.Update(patientDoctor);
            return Save();
        }
    }
}
