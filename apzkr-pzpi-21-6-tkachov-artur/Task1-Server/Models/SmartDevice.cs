namespace medireminder.Models
{
    public class SmartDevice
    {
        public int SmartDeviceId { get; set; }
        public int PatientId { get; set; }
        public Patient Patient { get; set; }
        public int SmartDeviceTypeId { get; set; }
        public SmartDeviceType SmartDeviceType { get; set; }
        public ICollection<MedicationSchedule> MedicationSchedules { get; set; }
    }
}
