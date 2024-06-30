using AutoMapper;
using medireminder.Dto;
using medireminder.Interfaces;
using medireminder.Models;
using medireminder.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medireminder.Controllers
{
    [Route("api/MedicationSchedules")]
    [ApiController]
    public class MedicationScheduleController : Controller
    {
        private readonly IMedicationScheduleRepository _medicationScheduleRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public MedicationScheduleController(
            IMedicationScheduleRepository medicationScheduleRepository,
            IPatientRepository patientRepository,
            IMapper mapper)
        {
            _medicationScheduleRepository = medicationScheduleRepository;
            _patientRepository = patientRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicationSchedule>))]
        public IActionResult GetMedicationSchedules()
        {
            var medicationSchedules = _medicationScheduleRepository.GetMedicationSchedules();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicationSchedules);
        }

        [HttpGet("{msheduleId}")]
        [ProducesResponseType(200, Type = typeof(MedicationSchedule))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicationSchedule(int msheduleId)
        {
            if (!_medicationScheduleRepository.MedicationScheduleExists(msheduleId))
                return NotFound();

            var medicationSchedule = _medicationScheduleRepository.GetMedicationSchedule(msheduleId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicationSchedule);
        }

        [HttpGet("patient/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicationSchedule>))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicationSchedulesByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var medicationSchedules = _mapper.Map<List<MedicationScheduleDto>>
                (_medicationScheduleRepository.GetMedicationSchedulesByPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicationSchedules);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateMedicationSchedule([FromBody] MedicationScheduleDto medicationScheduleCreate)
        {
            if (medicationScheduleCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var _medicationScheduleMap = _mapper.Map<MedicationSchedule>(medicationScheduleCreate);
            if (!_medicationScheduleRepository.CreateMedicationSchedule(_medicationScheduleMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{msheduleId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateMedicationSchedule(int msheduleId, [FromBody] MedicationScheduleDto medicationScheduleUpdate)
        {
            if (medicationScheduleUpdate == null || medicationScheduleUpdate.MedicationScheduleId != msheduleId)
                return BadRequest(ModelState);

            if (!_medicationScheduleRepository.MedicationScheduleExists(msheduleId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var _medicationScheduleMap = _mapper.Map<MedicationSchedule>(medicationScheduleUpdate);
            if (!_medicationScheduleRepository.UpdateMedicationSchedule(_medicationScheduleMap))
            {
                ModelState.AddModelError("", "Something went wrong updating medicationSchedule");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{msheduleId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteMedicationSchedule(int msheduleId)
        {
            if (!_medicationScheduleRepository.MedicationScheduleExists(msheduleId))
                return NotFound();

            var medicationScheduleToDelete = _medicationScheduleRepository.GetMedicationSchedule(msheduleId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_medicationScheduleRepository.DeleteMedicationSchedule(medicationScheduleToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting medicationSchedule");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
