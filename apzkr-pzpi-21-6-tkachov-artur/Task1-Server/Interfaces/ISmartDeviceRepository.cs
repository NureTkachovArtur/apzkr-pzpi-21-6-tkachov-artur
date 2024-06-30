using medireminder.Models;

namespace medireminder.Interfaces
{
    public interface ISmartDeviceRepository
    {
        ICollection<SmartDevice> GetSmartDevices();
        SmartDevice GetSmartDevice(int smartDeviceId);
        bool SmartDeviceExists(int smartDeviceId);
        bool CreateSmartDevice(SmartDevice smartDevice);
        bool UpdateSmartDevice(SmartDevice smartDevice);
        bool DeleteSmartDevice(SmartDevice smartDevice);
        bool Save();
    }
}
