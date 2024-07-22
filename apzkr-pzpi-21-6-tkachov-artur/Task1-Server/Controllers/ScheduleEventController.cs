using AutoMapper;
using medireminder.Dto;
using medireminder.GetDto;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medireminder.Controllers
{
    [Route("api/ScheduleEvents")]
    [ApiController]
    public class ScheduleEventController : Controller
    {
        private readonly IScheduleEventRepository _scheduleEventRepository;
        private readonly IMedicineRepository _medicineRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public ScheduleEventController(
            IScheduleEventRepository scheduleEventRepository,
            IMedicineRepository medicineRepository,
            IPatientRepository patientRepository,
            IMapper mapper)
        {
            _scheduleEventRepository = scheduleEventRepository;
            _medicineRepository = medicineRepository;
            _patientRepository = patientRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ScheduleEvent>))]
        public IActionResult GetScheduleEvents()
        {
            var scheduleEvent = _mapper.Map<List<ScheduleEventGetDto>>
                (_scheduleEventRepository.GetScheduleEvents());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(scheduleEvent);
        }

        [HttpGet("{scheduleEventId}")]
        [ProducesResponseType(200, Type = typeof(ScheduleEvent))]
        [ProducesResponseType(400)]
        public IActionResult GetScheduleEvent(int scheduleEventId)
        {
            if (!_scheduleEventRepository.ScheduleEventExists(scheduleEventId))
                return NotFound();

            var _event = _mapper.Map<ScheduleEventGetDto>
                (_scheduleEventRepository.GetScheduleEvent(scheduleEventId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(_event);
        }

        [HttpGet("patient/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ScheduleEvent>))]
        [ProducesResponseType(400)]
        public IActionResult GetScheduleEventsByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var events = _mapper.Map<List<ScheduleEventGetDto>>
                (_scheduleEventRepository.GetScheduleEventsByPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(events);
        }

        [HttpGet("ofToday")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ScheduleEvent>))]
        [ProducesResponseType(400)]
        public IActionResult GetScheduleEventOfToday()
        {
            var events = _mapper.Map<List<ScheduleEventGetDto>>
                (_scheduleEventRepository.GetScheduleEventsOfToday());
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(events);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateScheduleEvent([FromBody] ScheduleEventDto scheduleEventCreate)
        {
            if (scheduleEventCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var _scheduleEventMap = _mapper.Map<ScheduleEvent>(scheduleEventCreate);
            if (!_scheduleEventRepository.CreateScheduleEvent(_scheduleEventMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("activate/{scheduleEventId}")]
        [Authorize(Roles = "Administrator,Patient")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult ActivateScheduleEvent(int scheduleEventId)
        {
            if (!_scheduleEventRepository.ScheduleEventExists(scheduleEventId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var sEvent = _scheduleEventRepository.GetScheduleEvent(scheduleEventId);
            sEvent.Activated = true;
            if (!_scheduleEventRepository.UpdateScheduleEvent(sEvent))
            {
                ModelState.AddModelError("", "Something went wrong updating scheduleEvent");
                return StatusCode(500, ModelState);
            }

            var medicine = _medicineRepository.GetMedicine(sEvent.MedicationSchedule.MedicineId);
            var newQuantity = medicine.Quantity - medicine.Dosage;
            if (newQuantity < 0)
            {
                ModelState.AddModelError("", "Medicine's quantity is not enough");
                return StatusCode(500, ModelState);
            }

            medicine.Quantity = newQuantity;
            if (!_medicineRepository.UpdateMedicine(medicine))
            {
                ModelState.AddModelError("", "Something went wrong updating medicine");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{scheduleEventId}")]
        [Authorize(Roles = "Administrator,Patient")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateScheduleEvent(int scheduleEventId, [FromBody] ScheduleEventDto scheduleEventUpdate)
        {
            if (scheduleEventUpdate == null || scheduleEventUpdate.ScheduleEventId != scheduleEventId)
                return BadRequest(ModelState);

            if (!_scheduleEventRepository.ScheduleEventExists(scheduleEventId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var _scheduleEventMap = _mapper.Map<ScheduleEvent>(scheduleEventUpdate);
            if (!_scheduleEventRepository.UpdateScheduleEvent(_scheduleEventMap))
            {
                ModelState.AddModelError("", "Something went wrong updating scheduleEvent");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{scheduleEventId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteScheduleEvent(int scheduleEventId)
        {
            if (!_scheduleEventRepository.ScheduleEventExists(scheduleEventId))
                return NotFound();

            var scheduleEventToDelete = _scheduleEventRepository.GetScheduleEvent(scheduleEventId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_scheduleEventRepository.DeleteScheduleEvent(scheduleEventToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting scheduleEvent");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
