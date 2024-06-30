using medireminder.Data;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.EntityFrameworkCore;

namespace medireminder.Repository
{
    public class SmartDeviceTypeRepository : ISmartDeviceTypeRepository
    {
        private readonly DataContext _context;

        public SmartDeviceTypeRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateSmartDeviceType(SmartDeviceType smartDeviceType)
        {
            _context.Add(smartDeviceType);
            return Save();
        }

        public bool DeleteSmartDeviceType(SmartDeviceType smartDeviceType)
        {
            _context.Remove(smartDeviceType);
            return Save();
        }

        public ICollection<SmartDevice> GetSmartDevicesByType(int smartDeviceTypeId)
        {
            return _context.SmartDevices
                .Where(e => e.SmartDeviceTypeId ==  smartDeviceTypeId)
                .ToList();
        }

        public SmartDeviceType GetSmartDeviceType(int smartDeviceTypeId)
        {
            return _context.SmartDeviceTypes
                .Where(e => e.SmartDeviceTypeId == smartDeviceTypeId)
                .FirstOrDefault();
        }

        public ICollection<SmartDeviceType> GetSmartDeviceTypes()
        {
            return _context.SmartDeviceTypes
                .OrderBy(e => e.SmartDeviceTypeId)
                .ToList();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool SmartDeviceTypeExists(int smartDeviceTypeId)
        {
            return _context.SmartDeviceTypes.Any(e => e.SmartDeviceTypeId == smartDeviceTypeId);
        }

        public bool UpdateSmartDeviceType(SmartDeviceType smartDeviceType)
        {
            _context.Update(smartDeviceType);
            return Save();
        }
    }
}
