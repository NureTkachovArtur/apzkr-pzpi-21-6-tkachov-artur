using medireminder.Models;

namespace medireminder.Interfaces
{
    public interface IPatientTrusteeRepository
    {
        PatientTrustee GetPatientTrustee(int patientId, int trusteeId);
        bool PatientTrusteeExists(int patientId, int trusteeId);
        bool CreatePatientTrustee(PatientTrustee patientTrustee);
        bool UpdatePatientTrustee(PatientTrustee patientTrustee);
        bool DeletePatientTrustee(PatientTrustee patientTrustee);
        bool Save();
    }
}
