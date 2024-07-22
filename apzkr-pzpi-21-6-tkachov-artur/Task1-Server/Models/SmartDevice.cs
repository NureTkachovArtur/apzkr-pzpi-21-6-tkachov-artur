namespace medireminder.Models
{
    public class SmartDevice
    {
        public int SmartDeviceId { get; set; }
        public int? PatientId { get; set; }
        public string AuthenticationToken { get; set; }
        public Patient Patient { get; set; }
        public int SmartDeviceTypeId { get; set; }
        public bool IsActive { get; set; }
        public DateTime? ActivatedAt { get; set; }
        public SmartDeviceType SmartDeviceType { get; set; }
    }
}
