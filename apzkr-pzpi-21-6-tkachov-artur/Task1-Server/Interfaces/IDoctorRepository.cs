using medireminder.Models;

namespace medireminder.Interfaces
{
    public interface IDoctorRepository
    {
        ICollection<Doctor> GetDoctors();
        Doctor GetDoctor(int doctorId);
        Doctor GetDoctorByUID(string uid);
        Doctor GetDoctorByEmail(string email);
        ICollection<Patient> GetPatientsByDoctor(int doctorId);
        bool DoctorExists(int doctorId);
        bool DoctorExistsByEmail(string email);
        bool CreateDoctor(Doctor doctor);
        bool UpdateDoctor(Doctor doctor);
        bool DeleteDoctor(Doctor doctor);
        bool Save();
    }
}
