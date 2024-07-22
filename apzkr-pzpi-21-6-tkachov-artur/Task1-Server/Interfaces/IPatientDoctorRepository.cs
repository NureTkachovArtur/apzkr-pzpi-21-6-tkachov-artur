using medireminder.Models;

namespace medireminder.Interfaces
{
    public interface IPatientDoctorRepository
    {
        ICollection<PatientDoctor> GetPatientDoctors();
        PatientDoctor GetPatientDoctor(int patientId, int doctorId);
        bool PatientDoctorExists(int patientId, int doctorId);
        bool CreatePatientDoctor(PatientDoctor patientDoctor);
        bool UpdatePatientDoctor(PatientDoctor patientDoctor);
        bool DeletePatientDoctor(PatientDoctor patientDoctor);
        bool Save();
    }
}
