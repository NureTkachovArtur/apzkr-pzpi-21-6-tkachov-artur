using medireminder.Models;

namespace medireminder.Interfaces
{
    public interface IMedicationScheduleRepository
    {
        ICollection<MedicationSchedule> GetMedicationSchedules();
        MedicationSchedule GetMedicationSchedule(int medicationScheduleId);
        MedicationSchedule GetMedicationScheduleByDeviceId(int deviceId);
        ICollection<MedicationSchedule> GetMedicationSchedulesByPatient(int patientId);
        bool MedicationScheduleExists(int medicationScheduleId);
        bool CreateMedicationSchedule(MedicationSchedule medicationSchedule);
        bool UpdateMedicationSchedule(MedicationSchedule medicationSchedule);
        bool DeleteMedicationSchedule(MedicationSchedule medicationSchedule);
        bool Save();
    }
}
