using AutoMapper;
using medireminder.Dto;
using medireminder.GetDto;
using medireminder.Interfaces;
using medireminder.Models;
using medireminder.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medireminder.Controllers
{
    [Route("api/MedicationStatistics")]
    [ApiController]
    public class MedicationStatisticsController : Controller
    {
        private readonly IMedicationStatisticsRepository _medicationStatisticsRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public MedicationStatisticsController(
            IMedicationStatisticsRepository medicationStatisticsRepository,
            IPatientRepository patientRepository,
            IMapper mapper)
        {
            _medicationStatisticsRepository = medicationStatisticsRepository;
            _patientRepository = patientRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicationStatistics>))]
        public IActionResult GetMedicationStatisticss()
        {
            var medicationStatistics = _mapper.Map<List<MedicationStatisticsGetDto>>
                (_medicationStatisticsRepository.GetMedicationStatistics());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicationStatistics);
        }

        [HttpGet("{mstatisticsId}")]
        [ProducesResponseType(200, Type = typeof(MedicationStatistics))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicationStatistics(int mstatisticsId)
        {
            if (!_medicationStatisticsRepository.MedicationStatisticsExists(mstatisticsId))
                return NotFound();

            var medicationStatistic = _mapper.Map<MedicationStatisticsGetDto>
                (_medicationStatisticsRepository.GetMedicationStatistic(mstatisticsId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicationStatistic);
        }

        [HttpGet("patient/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicationStatistics>))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicationStatisticsByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var medicationStatistic = _mapper.Map<List<MedicationStatisticsGetDto>>
                (_medicationStatisticsRepository.GetMedicationStatisticsByPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicationStatistic);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateMedicationStatistics([FromBody] MedicationStatisticsDto medicationStatisticsCreate)
        {
            if (medicationStatisticsCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var _medicationStatisticsMap = _mapper.Map<MedicationStatistics>(medicationStatisticsCreate);
            if (!_medicationStatisticsRepository.CreateMedicationStatistics(_medicationStatisticsMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{mstatisticsId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateMedicationStatistics(int mstatisticsId, [FromBody] MedicationStatisticsDto medicationStatisticsUpdate)
        {
            if (medicationStatisticsUpdate == null || medicationStatisticsUpdate.MedicationStatisticsId != mstatisticsId)
                return BadRequest(ModelState);

            if (!_medicationStatisticsRepository.MedicationStatisticsExists(mstatisticsId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var _medicationStatisticsMap = _mapper.Map<MedicationStatistics>(medicationStatisticsUpdate);
            if (!_medicationStatisticsRepository.UpdateMedicationStatistics(_medicationStatisticsMap))
            {
                ModelState.AddModelError("", "Something went wrong updating medicationStatistics");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{mstatisticsId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteMedicationStatistics(int mstatisticsId)
        {
            if (!_medicationStatisticsRepository.MedicationStatisticsExists(mstatisticsId))
                return NotFound();

            var medicationStatisticsToDelete = _medicationStatisticsRepository.GetMedicationStatistic(mstatisticsId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_medicationStatisticsRepository.DeleteMedicationStatistics(medicationStatisticsToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting medicationStatistics");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
