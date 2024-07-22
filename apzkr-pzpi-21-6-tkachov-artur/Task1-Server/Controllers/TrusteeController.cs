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
    [Route("api/Trustees")]
    [ApiController]
    public class TrusteeController : Controller
    {
        private readonly IApplicationUserRepository _userRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITrusteeRepository _trusteeRepository;
        private readonly IMapper _mapper;

        public TrusteeController(
            IApplicationUserRepository userRepository,
            UserManager<ApplicationUser> userManager,
            ITrusteeRepository trusteeRepository,
            IMapper mapper)
        {
            _trusteeRepository = trusteeRepository;
            _userRepository = userRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Trustee>))]
        public IActionResult GetTrustees()
        {
            var trustees = _mapper.Map<List<TrusteeGetDto>>(_trusteeRepository.GetTrustees());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(trustees);
        }

        [HttpGet("{trusteeId}")]
        [ProducesResponseType(200, Type = typeof(Trustee))]
        [ProducesResponseType(400)]
        public IActionResult GetTrustee(int trusteeId)
        {
            if (!_trusteeRepository.TrusteeExists(trusteeId))
                return NotFound();

            var trustee = _mapper.Map<TrusteeGetDto>(_trusteeRepository.GetTrustee(trusteeId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(trustee);
        }

        [HttpGet("email/{email}")]
        [ProducesResponseType(200, Type = typeof(Trustee))]
        [ProducesResponseType(400)]
        public IActionResult GetTrusteeByEmail(string email)
        {
            if (!_trusteeRepository.TrusteeExistsByEmail(email))
                return NotFound();

            var trustee = _mapper.Map<TrusteeGetDto>(_trusteeRepository.GetTrusteeByEmail(email));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(trustee);
        }

        [HttpGet("patients/{trusteeId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Patient>))]
        [ProducesResponseType(400)]
        public IActionResult GetPatientsByTrustee(int trusteeId)
        {
            if (!_trusteeRepository.TrusteeExists(trusteeId))
                return NotFound();

            var patients = _mapper.Map<List<PatientGetDto>>(_trusteeRepository.GetPatientsByTrustee(trusteeId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(patients);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateTrustee([FromBody] TrusteeDto trusteeCreate)
        {
            if (trusteeCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var trusteeMap = _mapper.Map<Trustee>(trusteeCreate);
            if (!_trusteeRepository.CreateTrustee(trusteeMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("uid/{uid}")]
        [Authorize(Roles = "Administrator,Trustee")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateTrustee(string uid, [FromBody] TrusteeUpdateDto trusteeUpdate)
        {
            if (trusteeUpdate == null)
                return BadRequest(ModelState);

            if (!_userRepository.UserExistsById(uid))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            Trustee trustee = _trusteeRepository.GetTrusteeByUID(uid);
            ApplicationUser account = trustee.ApplicationUser;
            account.UserName = trusteeUpdate.UserName;
            account.LastName = trusteeUpdate.LastName;
            account.FirstName = trusteeUpdate.FirstName;
            account.MiddleName = trusteeUpdate.MiddleName;
            account.Email = trusteeUpdate.Email;
            account.PhoneNumber = trusteeUpdate.PhoneNumber;
            _userManager.UpdateAsync(account).Wait();

            trustee.ApplicationUser = account;

            if (!_trusteeRepository.UpdateTrustee(trustee))
            {
                ModelState.AddModelError("", "Something went wrong updating administrator");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{trusteeId}")]
        [Authorize(Roles = "Administrator,Trustee")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateTrustee(int trusteeId, [FromBody] TrusteeUpdateDto trusteeUpdate)
        {
            if (trusteeUpdate == null)
                return BadRequest(ModelState);

            if (!_trusteeRepository.TrusteeExists(trusteeId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            Trustee trustee = _trusteeRepository.GetTrustee(trusteeId);
            ApplicationUser account = trustee.ApplicationUser;
            account.UserName = trusteeUpdate.UserName;
            account.LastName = trusteeUpdate.LastName;
            account.FirstName = trusteeUpdate.FirstName;
            account.MiddleName = trusteeUpdate.MiddleName;
            account.Email = trusteeUpdate.Email;
            account.PhoneNumber = trusteeUpdate.PhoneNumber;
            _userManager.UpdateAsync(account).Wait();

            trustee.ApplicationUser = account;

            if (!_trusteeRepository.UpdateTrustee(trustee))
            {
                ModelState.AddModelError("", "Something went wrong updating administrator");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{trusteeId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteTrustee(int trusteeId)
        {
            if (!_trusteeRepository.TrusteeExists(trusteeId))
                return NotFound();

            var trusteeToDelete = _trusteeRepository.GetTrustee(trusteeId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_trusteeRepository.DeleteTrustee(trusteeToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting administrator");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("acc/{trusteeId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteTrusteeAndAccount(int trusteeId)
        {
            if (!_trusteeRepository.TrusteeExists(trusteeId))
                return NotFound();

            Trustee trusteeToDelete = _trusteeRepository.GetTrustee(trusteeId);
            ApplicationUser account = trusteeToDelete.ApplicationUser;
            trusteeToDelete.ApplicationUser = null;
            _userManager.DeleteAsync(account).Wait();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_trusteeRepository.DeleteTrustee(trusteeToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting patient");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
