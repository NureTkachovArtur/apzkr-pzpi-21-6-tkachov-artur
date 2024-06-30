using medireminder.Models;

namespace medireminder.Interfaces
{
    public interface IMedicineRepository
    {
        ICollection<Medicine> GetMedicines();
        Medicine GetMedicine(int medicineId);
        ICollection<Medicine> GetMedicinesByPatient(int patientId);
        bool MedicineExists(int medicineId);
        bool CreateMedicine(Medicine medicine);
        bool UpdateMedicine(Medicine medicine);
        bool DeleteMedicine(Medicine medicine);
        bool Save();
    }
}
