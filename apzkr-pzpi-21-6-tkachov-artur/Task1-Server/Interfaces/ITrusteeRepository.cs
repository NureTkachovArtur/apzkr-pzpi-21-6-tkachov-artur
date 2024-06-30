using medireminder.Models;

namespace medireminder.Interfaces
{
    public interface ITrusteeRepository
    {
        ICollection<Trustee> GetTrustees();
        Trustee GetTrustee(int trusteeId);
        Trustee GetTrusteeByEmail(string email);
        ICollection<Patient> GetPatientsByTrustee(int trusteeId);
        bool TrusteeExists(int trusteeId);
        bool TrusteeExistsByEmail(string email);
        bool CreateTrustee(Trustee trustee);
        bool UpdateTrustee(Trustee trustee);
        bool DeleteTrustee(Trustee trustee);
        bool Save();
    }
}
