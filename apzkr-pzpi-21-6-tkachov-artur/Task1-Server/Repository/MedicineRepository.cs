using medireminder.Data;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.EntityFrameworkCore;

namespace medireminder.Repository
{
    public class MedicineRepository : IMedicineRepository
    {
        private readonly DataContext _context;

        public MedicineRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateMedicine(Medicine medicine)
        {
            _context.Add(medicine);
            return Save();
        }

        public bool DeleteMedicine(Medicine medicine)
        {
            _context.Remove(medicine);
            return Save();
        }

        public Medicine GetMedicine(int medicineId)
        {
            return _context.Medicines
                .Where(e => e.MedicineId == medicineId)
                .FirstOrDefault();
        }

        public ICollection<Medicine> GetMedicines()
        {
            return _context.Medicines
                .OrderBy(e => e.MedicineId)
                .ToList();
        }

        public ICollection<Medicine> GetMedicinesByPatient(int patientId)
        {
            return _context.Medicines.Where(e => e.PatientId == patientId).ToList();
        }

        public bool MedicineExists(int medicineId)
        {
            return _context.Medicines.Any(e => e.MedicineId == medicineId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateMedicine(Medicine medicine)
        {
            _context.Update(medicine);
            return Save();
        }
    }
}
