using medireminder.Data;
using medireminder.Dto;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.EntityFrameworkCore;

namespace medireminder.Repository
{
    public class PatientRepository : IPatientRepository
    {
        private readonly DataContext _context;

        public PatientRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreatePatient(Patient patient)
        {
            _context.Add(patient);
            return Save();
        }

        public bool DeletePatient(Patient patient)
        {
            _context.Remove(patient);
            return Save();
        }

        public ICollection<Doctor> GetDoctorsByPatient(int patientId)
        {
            return _context.Patients
                .Where(e => e.PatientId == patientId)
                .SelectMany(e => e.PatientDoctors.Select(e => e.Doctor))
                .Include(e => e.ApplicationUser)
                .ToList();
        }

        public ICollection<MedicationSchedule> GetMedicationSchedulesByPatient(int patientId)
        {
            return _context.MedicationSchedules.Where(e => e.PatientId == patientId).ToList();
        }

        public ICollection<MedicationStatistics> GetMedicationStatisticsByPatient(int patientId)
        {
            return _context.MedicationStatistics
                .Where(e => e.PatientId == patientId)
                .Include(e => e.Medicine)
                .ToList();
        }

        public ICollection<Medicine> GetMedicinesByPatient(int patientId)
        {
            return _context.Medicines.Where(e => e.PatientId == patientId).ToList();
        }

        public ICollection<MessageDto> GetMessagesByPatient(int patientId)
        {
            return _context.Messages
                .Where(e => e.PatientId == patientId)
                .Select(e => new MessageDto
                {
                    MessageId = e.MessageId,
                    MessageTypeId = e.MessageTypeId,
                    PatientId = e.PatientId,
                    ReceiverId = e.Receiver.Id,
                    Text = e.Text,
                    CreatedAt = e.CreatedAt,
                    IsReceived = e.IsReceived,
                    IsRead = e.IsRead
                })
                .ToList();
        }

        public Patient GetPatient(int patientId)
        {
            return _context.Patients
                .Include(e => e.ApplicationUser)
                .Where(e => e.PatientId == patientId)
                .FirstOrDefault();
        }

        public Patient GetPatientByEmail(string email)
        {
            return _context.Patients
                .Include(e => e.ApplicationUser)
                .Where(e => e.ApplicationUser.Email == email)
                .FirstOrDefault();
        }

        public ICollection<Patient> GetPatients()
        {
            return _context.Patients
                .Include(e => e.ApplicationUser)
                .OrderBy(e => e.PatientId)
                .ToList();
        }

        public ICollection<Trustee> GetTrusteesByPatient(int patientId)
        {
            return _context.Patients
                .Where(e => e.PatientId == patientId)
                .SelectMany(e => e.PatientTrustees.Select(e => e.Trustee))
                .Include(e => e.ApplicationUser)
                .ToList();
        }

        public bool PatientExists(int patientId)
        {
            return _context.Patients.Any(e => e.PatientId == patientId);
        }

        public bool PatientExistsByEmail(string email)
        {
            return _context.Patients.Any(e => e.ApplicationUser.Email == email);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdatePatient(Patient patient)
        {
            _context.Update(patient);
            return Save();
        }
    }
}
