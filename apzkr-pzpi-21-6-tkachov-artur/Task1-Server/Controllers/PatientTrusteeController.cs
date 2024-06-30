using AutoMapper;
using medireminder.Dto;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medireminder.Controllers
{
    [Route("api/PatientTrustees")]
    [ApiController]
    public class PatientTrusteeController : Controller
    {
        private readonly IPatientTrusteeRepository _patientTrusteeRepository;
        private readonly IMapper _mapper;

        public PatientTrusteeController(
            IPatientTrusteeRepository patientTrusteeRepository,
            IMapper mapper)
        {
            _patientTrusteeRepository = patientTrusteeRepository;
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreatePatientTrustee([FromBody] PatientTrusteeDto patientTrusteeCreate)
        {
            if (patientTrusteeCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var _patientTrusteeMap = _mapper.Map<PatientTrustee>(patientTrusteeCreate);
            if (!_patientTrusteeRepository.CreatePatientTrustee(_patientTrusteeMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{patientId, trusteeId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdatePatientTrustee(int patientId, int trusteeId, [FromBody] PatientTrusteeDto patientTrusteeUpdate)
        {
            if (patientTrusteeUpdate == null || 
                patientTrusteeUpdate.PatientId != patientId || 
                patientTrusteeUpdate.TrusteeId != trusteeId)
                return BadRequest(ModelState);

            if (!_patientTrusteeRepository.PatientTrusteeExists(patientId, trusteeId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var _patientTrusteeMap = _mapper.Map<PatientTrustee>(patientTrusteeUpdate);
            if (!_patientTrusteeRepository.UpdatePatientTrustee(_patientTrusteeMap))
            {
                ModelState.AddModelError("", "Something went wrong updating patientTrustee");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{patientId, trusteeId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeletePatientTrustee(int patientId, int trusteeId)
        {
            if (!_patientTrusteeRepository.PatientTrusteeExists(patientId, trusteeId))
                return NotFound();

            var patientTrusteeToDelete = _patientTrusteeRepository.GetPatientTrustee(patientId, trusteeId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_patientTrusteeRepository.DeletePatientTrustee(patientTrusteeToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting patientTrustee");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
