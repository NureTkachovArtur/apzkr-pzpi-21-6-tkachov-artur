using AutoMapper;
using medireminder.Dto;
using medireminder.GetDto;
using medireminder.Interfaces;
using medireminder.Models;
using medireminder.Repository;
using medireminder.UpdateDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace medireminder.Controllers
{
    [Route("api/Doctors")]
    [ApiController]
    public class DoctorController : Controller
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;

        public DoctorController(
            IDoctorRepository doctorRepository,
            UserManager<ApplicationUser> userManager,
            IMapper mapper)
        {
            _doctorRepository = doctorRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Doctor>))]
        public IActionResult GetDoctors()
        {
            var doctors = _mapper.Map<List<DoctorGetDto>>(_doctorRepository.GetDoctors());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(doctors);
        }

        [HttpGet("{doctorId}")]
        [ProducesResponseType(200, Type = typeof(Doctor))]
        [ProducesResponseType(400)]
        public IActionResult GetDoctor(int doctorId)
        {
            if (!_doctorRepository.DoctorExists(doctorId))
                return NotFound();

            var doctor = _mapper.Map<DoctorGetDto>(_doctorRepository.GetDoctor(doctorId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(doctor);
        }

        [HttpGet("email/{email}")]
        [ProducesResponseType(200, Type = typeof(Doctor))]
        [ProducesResponseType(400)]
        public IActionResult GetDoctorByEmail(string email)
        {
            if (!_doctorRepository.DoctorExistsByEmail(email))
                return NotFound();

            var doctor = _mapper.Map<DoctorGetDto>(_doctorRepository.GetDoctorByEmail(email));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(doctor);
        }

        [HttpGet("patients/{doctorId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Patient>))]
        [ProducesResponseType(400)]
        public IActionResult GetPatientsByDoctor(int doctorId)
        {
            if (!_doctorRepository.DoctorExists(doctorId))
                return NotFound();

            var patients = _mapper.Map<List<PatientGetDto>>(_doctorRepository.GetPatientsByDoctor(doctorId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(patients);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateDoctor([FromBody] DoctorDto doctorCreate)
        {
            if (doctorCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var doctorMap = _mapper.Map<Doctor>(doctorCreate);
            if (!_doctorRepository.CreateDoctor(doctorMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{doctorId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateDoctor(int doctorId, [FromBody] DoctorUpdateDto doctorUpdate)
        {
            if (doctorUpdate == null)
                return BadRequest(ModelState);

            if (!_doctorRepository.DoctorExists(doctorId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            Doctor doctor = _doctorRepository.GetDoctor(doctorId);
            ApplicationUser account = doctor.ApplicationUser;
            account.UserName = doctorUpdate.UserName;
            account.LastName = doctorUpdate.LastName;
            account.FirstName = doctorUpdate.FirstName;
            account.MiddleName = doctorUpdate.MiddleName;
            account.Email = doctorUpdate.Email;
            account.PhoneNumber = doctorUpdate.PhoneNumber;
            _userManager.UpdateAsync(account).Wait();

            doctor.ApplicationUser = account;

            if (!_doctorRepository.UpdateDoctor(doctor))
            {
                ModelState.AddModelError("", "Something went wrong updating administrator");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{doctorId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteDoctor(int doctorId)
        {
            if (!_doctorRepository.DoctorExists(doctorId))
                return NotFound();

            var doctorToDelete = _doctorRepository.GetDoctor(doctorId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_doctorRepository.DeleteDoctor(doctorToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting administrator");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("acc/{doctorId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteDoctorAndAccount(int doctorId)
        {
            if (!_doctorRepository.DoctorExists(doctorId))
                return NotFound();
            
            Doctor doctorToDelete = _doctorRepository.GetDoctor(doctorId);
            ApplicationUser account = doctorToDelete.ApplicationUser;
            doctorToDelete.ApplicationUser = null;
            _userManager.DeleteAsync(account).Wait();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_doctorRepository.DeleteDoctor(doctorToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting patient");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
