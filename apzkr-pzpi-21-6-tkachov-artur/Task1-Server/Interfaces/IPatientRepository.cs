﻿using medireminder.Dto;
using medireminder.Models;

namespace medireminder.Interfaces
{
    public interface IPatientRepository
    {
        ICollection<Patient> GetPatients();
        Patient GetPatient(int patientId);
        Patient GetPatientByEmail(string email);
        ICollection<MessageDto> GetMessagesByPatient(int patientId);
        ICollection<Medicine> GetMedicinesByPatient(int patientId);
        ICollection<MedicationSchedule> GetMedicationSchedulesByPatient(int patientId);
        ICollection<MedicationStatistics> GetMedicationStatisticsByPatient(int patientId);
        ICollection<Trustee> GetTrusteesByPatient(int patientId);
        ICollection<Doctor> GetDoctorsByPatient(int patientId);
        bool PatientExists(int patientId);
        bool PatientExistsByEmail(string email);
        bool CreatePatient(Patient patient);
        bool UpdatePatient(Patient patient);
        bool DeletePatient(Patient patient);
        bool Save();
    }
}
