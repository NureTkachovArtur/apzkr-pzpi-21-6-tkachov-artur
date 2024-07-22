using AutoMapper;
using medireminder.Dto;
using medireminder.Interfaces;
using medireminder.Models;
using medireminder.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medireminder.Controllers
{
    [Route("api/PatientDoctors")]
    [ApiController]
    public class PatientDoctorController : Controller
    {
        private readonly IPatientDoctorRepository _patientDoctorRepository;
        private readonly IMapper _mapper;

        public PatientDoctorController(
            IPatientDoctorRepository patientDoctorRepository,
            IMapper mapper)
        {
            _patientDoctorRepository = patientDoctorRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<PatientDoctor>))]
        public IActionResult GetPatientDoctors()
        {
            var patientDoctors = _patientDoctorRepository.GetPatientDoctors();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(patientDoctors);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Doctor")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreatePatientDoctor([FromBody] PatientDoctorDto patientDoctorCreate)
        {
            if (patientDoctorCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var _patientDoctorMap = _mapper.Map<PatientDoctor>(patientDoctorCreate);
            if (!_patientDoctorRepository.CreatePatientDoctor(_patientDoctorMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{patientId}/{doctorId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdatePatientDoctor(int patientId, int doctorId, [FromBody] PatientDoctorDto patientDoctorUpdate)
        {
            if (patientDoctorUpdate == null ||
                patientDoctorUpdate.PatientId != patientId ||
                patientDoctorUpdate.DoctorId != doctorId)
                return BadRequest(ModelState);

            if (!_patientDoctorRepository.PatientDoctorExists(patientId, doctorId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var _patientDoctorMap = _mapper.Map<PatientDoctor>(patientDoctorUpdate);
            if (!_patientDoctorRepository.UpdatePatientDoctor(_patientDoctorMap))
            {
                ModelState.AddModelError("", "Something went wrong updating patientDoctor");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{patientId}/{doctorId}")]
        [Authorize(Roles = "Administrator,Doctor")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeletePatientDoctor(int patientId, int doctorId)
        {
            if (!_patientDoctorRepository.PatientDoctorExists(patientId, doctorId))
                return NotFound();

            var patientDoctorToDelete = _patientDoctorRepository.GetPatientDoctor(patientId, doctorId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_patientDoctorRepository.DeletePatientDoctor(patientDoctorToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting patientDoctor");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
