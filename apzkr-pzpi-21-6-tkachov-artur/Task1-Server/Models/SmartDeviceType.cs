namespace medireminder.Models
{
    public class SmartDeviceType
    {
        public int SmartDeviceTypeId { get; set; }
        public string Name { get; set; }
        public ICollection<SmartDevice> SmartDevices { get; set; }
    }
}
