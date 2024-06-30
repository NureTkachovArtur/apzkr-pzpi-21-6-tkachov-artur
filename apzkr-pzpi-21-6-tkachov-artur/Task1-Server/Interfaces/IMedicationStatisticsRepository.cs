using medireminder.Models;

namespace medireminder.Interfaces
{
    public interface IMedicationStatisticsRepository
    {
        ICollection<MedicationStatistics> GetMedicationStatistics();
        MedicationStatistics GetMedicationStatistic(int medicationStatisticsId);
        ICollection<MedicationStatistics> GetMedicationStatisticsByPatient(int patientId);
        bool MedicationStatisticsExists(int medicationStatisticsId);
        bool CreateMedicationStatistics(MedicationStatistics medicationStatistics);
        bool UpdateMedicationStatistics(MedicationStatistics medicationStatistics);
        bool DeleteMedicationStatistics(MedicationStatistics medicationStatistics);
        bool Save();
    }
}
