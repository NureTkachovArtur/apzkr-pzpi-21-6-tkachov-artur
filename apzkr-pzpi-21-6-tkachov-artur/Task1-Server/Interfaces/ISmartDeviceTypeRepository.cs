using medireminder.Models;

namespace medireminder.Interfaces
{
    public interface ISmartDeviceTypeRepository
    {
        ICollection<SmartDeviceType> GetSmartDeviceTypes();
        SmartDeviceType GetSmartDeviceType(int smartDeviceTypeId);
        ICollection<SmartDevice> GetSmartDevicesByType(int smartDeviceTypeId);
        bool SmartDeviceTypeExists(int smartDeviceTypeId);
        bool CreateSmartDeviceType(SmartDeviceType smartDeviceType);
        bool UpdateSmartDeviceType(SmartDeviceType smartDeviceType);
        bool DeleteSmartDeviceType(SmartDeviceType smartDeviceType);
        bool Save();
    }
}
