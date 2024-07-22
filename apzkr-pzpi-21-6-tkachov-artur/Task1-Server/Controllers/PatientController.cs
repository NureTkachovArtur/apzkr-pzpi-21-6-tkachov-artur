using AutoMapper;
using medireminder.Dto;
using medireminder.GetDto;
using medireminder.Interfaces;
using medireminder.Models;
using medireminder.UpdateDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace medireminder.Controllers
{
    [Route("api/Patients")]
    [ApiController]
    public class PatientController : Controller
    {
        private readonly IApplicationUserRepository _userRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public PatientController(
            IApplicationUserRepository userRepository,
            UserManager<ApplicationUser> userManager,
            IPatientRepository patientRepository,
            IMapper mapper)
        {
            _patientRepository = patientRepository;
            _userRepository = userRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Patient>))]
        public IActionResult GetPatients()
        {
            var patients = _mapper.Map<List<PatientGetDto>>(_patientRepository.GetPatients());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(patients);
        }

        [HttpGet("{patientId}")]
        [ProducesResponseType(200, Type = typeof(Patient))]
        [ProducesResponseType(400)]
        public IActionResult GetPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var patient = _mapper.Map<PatientGetDto>(_patientRepository.GetPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(patient);
        }

        [HttpGet("email/{email}")]
        [ProducesResponseType(200, Type = typeof(Patient))]
        [ProducesResponseType(400)]
        public IActionResult GetPatientByEmail(string email)
        {
            if (!_patientRepository.PatientExistsByEmail(email))
                return NotFound();

            var patient = _mapper.Map<PatientGetDto>(_patientRepository.GetPatientByEmail(email));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(patient);
        }

        [HttpGet("messages/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Message>))]
        [ProducesResponseType(400)]
        public IActionResult GetMessagesByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var messages = _patientRepository.GetMessagesByPatient(patientId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(messages);
        }

        [HttpGet("devices/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<SmartDevice>))]
        [ProducesResponseType(400)]
        public IActionResult GetSmartDevicesByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var smartDevices = _patientRepository.GetSmartDevicesByPatient(patientId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(smartDevices);
        }

        [HttpGet("medicines/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Medicine>))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicinesByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var medicines = _mapper.Map<List<MedicineDto>>(_patientRepository.GetMedicinesByPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicines);
        }

        [HttpGet("medication-schedules/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicationSchedule>))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicationSchedulesByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var medicationSchedules = _mapper.Map<List<MedicationScheduleDto>>
                (_patientRepository.GetMedicationSchedulesByPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicationSchedules);
        }

        [HttpGet("schedule-events/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ScheduleEvent>))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicationStatisticsByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var scheduleEvents = _mapper.Map<List<ScheduleEventGetDto>>
                (_patientRepository.GetScheduleEventsByPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(scheduleEvents);
        }

        [HttpGet("doctors/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Doctor>))]
        [ProducesResponseType(400)]
        public IActionResult GetDoctorsByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var doctors = _mapper.Map<List<DoctorGetDto>>(_patientRepository.GetDoctorsByPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(doctors);
        }

        [HttpGet("trustees/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Trustee>))]
        [ProducesResponseType(400)]
        public IActionResult GetTrusteesByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var trustees = _mapper.Map<List<TrusteeGetDto>>(_patientRepository.GetTrusteesByPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(trustees);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreatePatient([FromBody] PatientDto patientCreate)
        {
            if (patientCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var patientMap = _mapper.Map<Patient>(patientCreate);
            if (!_patientRepository.CreatePatient(patientMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("uid/{uid}")]
        [Authorize(Roles = "Administrator,Patient")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdatePatient(string uid, [FromBody] PatientUpdateDto patientUpdate)
        {
            if (patientUpdate == null)
                return BadRequest(ModelState);

            if (!_userRepository.UserExistsById(uid))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            Patient patient = _patientRepository.GetPatientByUID(uid);
            ApplicationUser account = patient.ApplicationUser;
            account.UserName = patientUpdate.UserName;
            account.LastName = patientUpdate.LastName;
            account.FirstName = patientUpdate.FirstName;
            account.MiddleName = patientUpdate.MiddleName;
            account.Email = patientUpdate.Email;
            account.PhoneNumber = patientUpdate.PhoneNumber;
            _userManager.UpdateAsync(account).Wait();

            patient.ApplicationUser = account;
            patient.Address = patientUpdate.Address;
            patient.Age = patientUpdate.Age;
            patient.Gender = patientUpdate.Gender;

            if (!_patientRepository.UpdatePatient(patient))
            {
                ModelState.AddModelError("", "Something went wrong updating administrator");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{patientId}")]
        [Authorize(Roles = "Administrator,Patient")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdatePatient(int patientId, [FromBody] PatientUpdateDto patientUpdate)
        {
            if (patientUpdate == null)
                return BadRequest(ModelState);

            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            Patient patient = _patientRepository.GetPatient(patientId);
            ApplicationUser account = patient.ApplicationUser;
            account.UserName = patientUpdate.UserName;
            account.LastName = patientUpdate.LastName;
            account.FirstName = patientUpdate.FirstName;
            account.MiddleName = patientUpdate.MiddleName;
            account.Email = patientUpdate.Email;
            account.PhoneNumber = patientUpdate.PhoneNumber;
            _userManager.UpdateAsync(account).Wait();

            patient.ApplicationUser = account;
            patient.Address = patientUpdate.Address;
            patient.Age = patientUpdate.Age;
            patient.Gender = patientUpdate.Gender;

            if (!_patientRepository.UpdatePatient(patient))
            {
                ModelState.AddModelError("", "Something went wrong updating administrator");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{patientId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeletePatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var patientToDelete = _patientRepository.GetPatient(patientId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_patientRepository.DeletePatient(patientToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting administrator");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("acc/{patientId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeletePatientAndAccount(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            Patient patientToDelete = _patientRepository.GetPatient(patientId);
            ApplicationUser account = patientToDelete.ApplicationUser;
            patientToDelete.ApplicationUser = null;
            _userManager.DeleteAsync(account).Wait();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_patientRepository.DeletePatient(patientToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting patient");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
