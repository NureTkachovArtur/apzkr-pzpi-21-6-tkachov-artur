using AutoMapper;
using medireminder.Dto;
using medireminder.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using medireminder.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

namespace medireminder.Controllers
{
    [Route("api/SmartDevices")]
    [ApiController]
    public class SmartDeviceController : Controller
    {
        private readonly IMedicationScheduleRepository _medicationScheduleRepository;
        private readonly ISmartDeviceRepository _smartDeviceRepository;
        private readonly IPatientRepository _petientRepository;
        private readonly IDistributedCache _cache;
        private readonly IMapper _mapper;

        private int DeviceActivationTimeOut => 300;

        public SmartDeviceController(
            IMedicationScheduleRepository medicationScheduleRepository,
            ISmartDeviceRepository smartDeviceRepository,
            IPatientRepository petientRepository,
            IDistributedCache cache,
            IMapper mapper)
        {
            _medicationScheduleRepository = medicationScheduleRepository;
            _smartDeviceRepository = smartDeviceRepository;
            _petientRepository = petientRepository;
            _mapper = mapper;
            _cache = cache;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<SmartDevice>))]
        public IActionResult GetSmartDevices()
        {
            var smartDevices = _mapper.Map<List<SmartDeviceDto>>(_smartDeviceRepository.GetSmartDevices());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(smartDevices);
        }

        [HttpGet("{smartDeviceId}")]
        [ProducesResponseType(200, Type = typeof(SmartDevice))]
        [ProducesResponseType(400)]
        public IActionResult GetSmartDevice(int smartDeviceId)
        {
            if (!_smartDeviceRepository.SmartDeviceExists(smartDeviceId))
                return NotFound();

            var smartDevice = _mapper.Map<SmartDeviceDto>(_smartDeviceRepository.GetSmartDevice(smartDeviceId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(smartDevice);
        }

        [HttpGet("deviceInfo")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public IActionResult GetDeviceInfo(
            [FromHeader(Name = "Token")] string token,
            [FromHeader(Name = "DeviceId")] int deviceId)
        {
            var device = _smartDeviceRepository.GetSmartDeviceByIdAndToken(deviceId, token);
            if (device == null)
            {
                return NotFound();
            }
            else if (device.IsActive)
            {
                return BadRequest();
            }

            var schedule = _medicationScheduleRepository.GetMedicationScheduleByDeviceId(deviceId);
            if (schedule == null)
            {
                return NotFound();
            }

            return Ok( new { medicationScheduleId = schedule.MedicationScheduleId } );
        }

        [HttpGet("patient/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<SmartDevice>))]
        [ProducesResponseType(400)]
        public IActionResult GetSmartDevicesOfUser(int patientId)
        {
            if (!_petientRepository.PatientExists(patientId))
                return NotFound();

            var smartDevices = _smartDeviceRepository.GetSmartDevicesOfPatient(patientId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(smartDevices);
        }

        [HttpGet("waiting-activation")]
        [ProducesResponseType(200, Type = typeof(string))]
        [ProducesResponseType(400)]
        public IActionResult GetWaitingActivationDevices(
            [FromHeader(Name = "Token")] string token,
            [FromHeader(Name = "DeviceId")] int deviceId)
        {
            var device = _smartDeviceRepository.GetSmartDeviceByIdAndToken(deviceId, token);
            if (device == null)
            {
                return NotFound();
            }
            else if (device.IsActive)
            {
                return BadRequest();
            }

            _cache.SetString($"device:{deviceId}:device:activate", "true");

            DateTime connectionStart = DateTime.Now;
            string data = null;

            while ((data = _cache.GetString($"device:{deviceId}:user:activate")) is null)
            {
                if (DateTime.Now > connectionStart + TimeSpan.FromSeconds(DeviceActivationTimeOut))
                {
                    _cache.Remove($"device:{deviceId}:device:activate");
                    return BadRequest();
                }
                Task.Delay(1000);
            }

            int patientId = 0;
            if(!int.TryParse(data, out patientId))
            {
                return StatusCode(500);
            }

            device = _smartDeviceRepository.GetSmartDevice(deviceId);
            var newToken = new byte[512];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(newToken);
            }

            device.AuthenticationToken = Convert.ToBase64String(newToken).Replace("\\", "").Replace("/", "").Replace("=", "");
            device.ActivatedAt = DateTime.UtcNow;
            device.IsActive = true;
            if (!_smartDeviceRepository.UpdateSmartDevice(device))
            {
                ModelState.AddModelError("", "Something went wrong updating smartDevice");
                return StatusCode(500, ModelState);
            }

            return Ok(new
            {
                patientId = patientId,
                authenticationToken = device.AuthenticationToken
            });
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateSmartDevice([FromBody] SmartDeviceDto smartDeviceCreate)
        {
            if (smartDeviceCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var _smartDeviceMap = _mapper.Map<SmartDevice>(smartDeviceCreate);
            var token = new byte[512];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(token);
            }

            _smartDeviceMap.PatientId = null;
            _smartDeviceMap.AuthenticationToken = 
                Convert.ToBase64String(token).Replace("\\", "").Replace("/", "").Replace("=", "");

            if (!_smartDeviceRepository.CreateSmartDevice(_smartDeviceMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            var createdDevice = _smartDeviceRepository.GetLast();
            return Ok(new { 
                ok = true,
                data = new {
                    deviceId = createdDevice.SmartDeviceId, 
                    authenticationToken = createdDevice.AuthenticationToken
                }
            });
        }

        [HttpPut("activate")]
        [Authorize(Roles = "Patient")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult ActivateDevice([FromQuery] ActivateDeviceRequest request)
        {
            int patientId = 0;
            if(!int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out patientId))
            {
                return Unauthorized();
            }
            var device = _smartDeviceRepository.GetSmartDevice(request.DeviceId);
            if (device == null || device.PatientId < 0)
            {
                return NotFound();
            }
            if (device.IsActive)
            {
                return Ok(new { ok = true });
            }

            _cache.SetString($"device:{request.DeviceId}:user:activate", patientId.ToString());

            DateTime connectionStart = DateTime.Now;

            string data = null;
            while ((data = _cache.GetString($"device:{request.DeviceId}:device:activate")) is null)
            {
                if (HttpContext.RequestAborted.IsCancellationRequested)
                {
                    return NoContent();
                }

                if (DateTime.Now > connectionStart + TimeSpan.FromSeconds(DeviceActivationTimeOut))
                {
                    _cache.Remove($"device:{request.DeviceId}:user:activate");
                    return BadRequest();
                }
                Task.Delay(1000);
            }

            device = _smartDeviceRepository.GetSmartDevice(request.DeviceId);
            device.PatientId = patientId;
            if (!_smartDeviceRepository.UpdateSmartDevice(device))
            {
                ModelState.AddModelError("", "Something went wrong updating smartDevice");
                return StatusCode(500, ModelState);
            }

            _cache.Remove($"device:{request.DeviceId}:user:activate");
            _cache.Remove($"device:{request.DeviceId}:device:activate");

            return Ok(new { ok = true });
        }

        [HttpPut("{smartDeviceId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateSmartDevice(int smartDeviceId, [FromBody] SmartDeviceDto smartDeviceUpdate)
        {
            if (smartDeviceUpdate == null || smartDeviceUpdate.SmartDeviceId != smartDeviceId)
                return BadRequest(ModelState);

            if (!_smartDeviceRepository.SmartDeviceExists(smartDeviceId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var _smartDeviceMap = _mapper.Map<SmartDevice>(smartDeviceUpdate);
            if (!_smartDeviceRepository.UpdateSmartDevice(_smartDeviceMap))
            {
                ModelState.AddModelError("", "Something went wrong updating smartDevice");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{smartDeviceId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteSmartDevice(int smartDeviceId)
        {
            if (!_smartDeviceRepository.SmartDeviceExists(smartDeviceId))
                return NotFound();

            var smartDeviceToDelete = _smartDeviceRepository.GetSmartDevice(smartDeviceId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_smartDeviceRepository.DeleteSmartDevice(smartDeviceToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting smartDevice");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
