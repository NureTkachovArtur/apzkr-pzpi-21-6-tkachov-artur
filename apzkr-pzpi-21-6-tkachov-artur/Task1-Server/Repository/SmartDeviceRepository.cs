using medireminder.Data;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.EntityFrameworkCore;

namespace medireminder.Repository
{
    public class SmartDeviceRepository : ISmartDeviceRepository
    {
        private readonly DataContext _context;

        public SmartDeviceRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateSmartDevice(SmartDevice smartDevice)
        {
            _context.Add(smartDevice);
            return Save();
        }

        public bool DeleteSmartDevice(SmartDevice smartDevice)
        {
            _context.Remove(smartDevice);
            return Save();
        }

        public SmartDevice GetLast()
        {
            return _context.SmartDevices.OrderByDescending(e => e.SmartDeviceId).FirstOrDefault();
        }

        public SmartDevice GetSmartDevice(int smartDeviceId)
        {
            return _context.SmartDevices
                .Where(e => e.SmartDeviceId == smartDeviceId)
                .FirstOrDefault();
        }

        public SmartDevice GetSmartDeviceByIdAndToken(int smartDeviceId, string token)
        {
            return _context.SmartDevices
                .Where(e => (e.SmartDeviceId == smartDeviceId) && (e.AuthenticationToken == token))
                .FirstOrDefault();
        }

        public ICollection<SmartDevice> GetSmartDevices()
        {
            return _context.SmartDevices
                .OrderBy(e => e.SmartDeviceId)
                .ToList();
        }

        public ICollection<SmartDevice> GetSmartDevicesOfPatient(int patientId)
        {
            return _context.SmartDevices
                .Where(e => e.PatientId  == patientId)
                .Include(e => e.SmartDeviceType)
                .ToList();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool SmartDeviceExists(int smartDeviceId)
        {
            return _context.SmartDevices.Any(e => e.SmartDeviceId == smartDeviceId);
        }

        public bool UpdateSmartDevice(SmartDevice smartDevice)
        {
            _context.Update(smartDevice);
            return Save();
        }
    }
}
