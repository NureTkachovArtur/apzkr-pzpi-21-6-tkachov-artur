using AutoMapper;
using medireminder.Dto;
using medireminder.Interfaces;
using medireminder.Models;
using medireminder.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medireminder.Controllers
{
    [Route("api/SmartDeviceTypes")]
    [ApiController]
    public class SmartDeviceTypeController : Controller
    {
        private readonly ISmartDeviceTypeRepository _smartDeviceTypeRepository;
        private readonly IMapper _mapper;

        public SmartDeviceTypeController(
            ISmartDeviceTypeRepository smartDeviceTypeRepository,
            IMapper mapper)
        {
            _smartDeviceTypeRepository = smartDeviceTypeRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<SmartDeviceType>))]
        public IActionResult GetSmartDeviceTypes()
        {
            var smartDeviceTypes = _mapper.Map<List<SmartDeviceTypeDto>>
                (_smartDeviceTypeRepository.GetSmartDeviceTypes());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(smartDeviceTypes);
        }

        [HttpGet("{smartDeviceTypeId}")]
        [ProducesResponseType(200, Type = typeof(SmartDeviceType))]
        [ProducesResponseType(400)]
        public IActionResult GetSmartDeviceType(int smartDeviceTypeId)
        {
            if (!_smartDeviceTypeRepository.SmartDeviceTypeExists(smartDeviceTypeId))
                return NotFound();

            var smartDeviceTypes = _mapper.Map<SmartDeviceTypeDto>
                (_smartDeviceTypeRepository.GetSmartDeviceType(smartDeviceTypeId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(smartDeviceTypes);
        }

        [HttpGet("devices/{smartDeviceTypeId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<SmartDevice>))]
        [ProducesResponseType(400)]
        public IActionResult GetSmartDevicesByType(int smartDeviceTypeId)
        {
            if (!_smartDeviceTypeRepository.SmartDeviceTypeExists(smartDeviceTypeId))
                return NotFound();

            var smartDevices = _mapper.Map<List<SmartDeviceDto>>
                (_smartDeviceTypeRepository.GetSmartDevicesByType(smartDeviceTypeId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(smartDevices);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateSmartDeviceType([FromBody] SmartDeviceTypeDto smartDeviceTypeCreate)
        {
            if (smartDeviceTypeCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var _smartDeviceTypeMap = _mapper.Map<SmartDeviceType>(smartDeviceTypeCreate);
            if (!_smartDeviceTypeRepository.CreateSmartDeviceType(_smartDeviceTypeMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{smartDeviceTypeId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateSmartDeviceType(int smartDeviceTypeId, [FromBody] SmartDeviceTypeDto smartDeviceTypeUpdate)
        {
            if (smartDeviceTypeUpdate == null || smartDeviceTypeUpdate.SmartDeviceTypeId != smartDeviceTypeId)
                return BadRequest(ModelState);

            if (!_smartDeviceTypeRepository.SmartDeviceTypeExists(smartDeviceTypeId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var _smartDeviceTypeMap = _mapper.Map<SmartDeviceType>(smartDeviceTypeUpdate);
            if (!_smartDeviceTypeRepository.UpdateSmartDeviceType(_smartDeviceTypeMap))
            {
                ModelState.AddModelError("", "Something went wrong updating smartDeviceType");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{smartDeviceTypeId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteSmartDeviceType(int smartDeviceTypeId)
        {
            if (!_smartDeviceTypeRepository.SmartDeviceTypeExists(smartDeviceTypeId))
                return NotFound();

            var smartDeviceTypeToDelete = _smartDeviceTypeRepository.GetSmartDeviceType(smartDeviceTypeId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_smartDeviceTypeRepository.DeleteSmartDeviceType(smartDeviceTypeToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting smartDeviceType");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
