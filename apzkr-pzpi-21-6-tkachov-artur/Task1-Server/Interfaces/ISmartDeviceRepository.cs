using medireminder.Models;

namespace medireminder.Interfaces
{
    public interface ISmartDeviceRepository
    {
        ICollection<SmartDevice> GetSmartDevices();
        ICollection<SmartDevice> GetSmartDevicesOfPatient(int patientId);
        SmartDevice GetSmartDevice(int smartDeviceId);
        SmartDevice GetSmartDeviceByIdAndToken(int smartDeviceId, string token);
        SmartDevice GetLast();
        bool SmartDeviceExists(int smartDeviceId);
        bool CreateSmartDevice(SmartDevice smartDevice);
        bool UpdateSmartDevice(SmartDevice smartDevice);
        bool DeleteSmartDevice(SmartDevice smartDevice);
        bool Save();
    }
}
