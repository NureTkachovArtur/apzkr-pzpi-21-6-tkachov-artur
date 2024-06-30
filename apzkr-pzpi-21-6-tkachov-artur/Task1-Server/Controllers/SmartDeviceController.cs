using AutoMapper;
using medireminder.Dto;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medireminder.Controllers
{
    [Route("api/SmartDevices")]
    [ApiController]
    public class SmartDeviceController : Controller
    {
        private readonly ISmartDeviceRepository _smartDeviceRepository;
        private readonly IMapper _mapper;

        public SmartDeviceController(
            ISmartDeviceRepository smartDeviceRepository,
            IMapper mapper)
        {
            _smartDeviceRepository = smartDeviceRepository;
            _mapper = mapper;
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
            if (!_smartDeviceRepository.CreateSmartDevice(_smartDeviceMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

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
