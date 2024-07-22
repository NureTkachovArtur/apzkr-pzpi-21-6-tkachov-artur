using medireminder.Data;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.EntityFrameworkCore;

namespace medireminder.Repository
{
    public class TrusteeRepository : ITrusteeRepository
    {
        private readonly DataContext _context;

        public TrusteeRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateTrustee(Trustee trustee)
        {
            _context.Add(trustee);
            return Save();
        }

        public bool DeleteTrustee(Trustee trustee)
        {
            _context.Remove(trustee);
            return Save();
        }

        public ICollection<Patient> GetPatientsByTrustee(int trusteeId)
        {
            return _context.Trustees
                .Where(e => e.TrusteeId ==  trusteeId)
                .SelectMany(e => e.PatientTrustees.Select(e => e.Patient))
                .Include(e => e.ApplicationUser)
                .ToList();
        }

        public Trustee GetTrustee(int trusteeId)
        {
            return _context.Trustees
                .Include(e => e.ApplicationUser)
                .Where(e => e.TrusteeId == trusteeId)
                .FirstOrDefault();
        }

        public Trustee GetTrusteeByEmail(string email)
        {
            return _context.Trustees
                .Include(e => e.ApplicationUser)
                .Where(e => e.ApplicationUser.Email == email)
                .FirstOrDefault();
        }

        public Trustee GetTrusteeByUID(string uid)
        {
            return _context.Trustees
                .Include(e => e.ApplicationUser)
                .Where(e => e.ApplicationUser.Id == uid)
                .FirstOrDefault();
        }

        public ICollection<Trustee> GetTrustees()
        {
            return _context.Trustees
                .Include(e => e.ApplicationUser)
                .OrderBy(e => e.TrusteeId)
                .ToList();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool TrusteeExists(int trusteeId)
        {
            return _context.Trustees.Any(e => e.TrusteeId == trusteeId);
        }

        public bool TrusteeExistsByEmail(string email)
        {
            return _context.Trustees.Any(e => e.ApplicationUser.Email == email);
        }

        public bool UpdateTrustee(Trustee trustee)
        {
            _context.Update(trustee);
            return Save();
        }
    }
}
