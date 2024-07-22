using AutoMapper;
using medireminder.Dto;
using medireminder.GetDto;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace medireminder.Controllers
{
    [Route("api/Accounts")]
    [ApiController]
    public class UserAccountController : ControllerBase
    {
        private readonly IApplicationUserRepository _userAccountRepository;
        private readonly IFileServiceRepository _fileServiceRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;

        public UserAccountController(
            IApplicationUserRepository userAccountRepository,
            IFileServiceRepository fileServiceRepository,
            UserManager<ApplicationUser> userManager,
            IMapper mapper
            )
        {
            _userAccountRepository = userAccountRepository;
            _fileServiceRepository = fileServiceRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ApplicationUser>))]
        public IActionResult GetUsers()
        {
            var users = _mapper.Map<List<ApplicationUserGetDto>>(_userAccountRepository.GetUsers());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(users);
        }

        [HttpGet("{userId}")]
        [ProducesResponseType(200, Type = typeof(ApplicationUser))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetUser(string userId)
        {
            if (!(await _userAccountRepository.UserExistsByIdAsync(userId)))
                return NotFound();

            var user = await _userAccountRepository.GetUserAsync(userId);
            var userMap = _mapper.Map<ApplicationUserGetDto>(user);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(userMap);
        }

        [HttpPost("{userId}/upload-profile-picture")]
        public async Task<IActionResult> UploadProfilePicture(string userId, IFormFile file)
        {
            if (!_userAccountRepository.UserExistsById(userId))
                return NotFound();

            var user = _userAccountRepository.GetUser(userId);
            if (file != null)
            {
                var filePath = await _fileServiceRepository.Upload(file);
                if (user.ProfilePictureUrl != null)
                {
                    await _fileServiceRepository.Delete(user.ProfilePictureUrl);
                }
                user.ProfilePictureUrl = filePath;
                _userManager.UpdateAsync(user).Wait();
            }

            return Ok(new { user.ProfilePictureUrl });
        }

        [HttpDelete("{userId}/delete-profile-picture")]
        public async Task<IActionResult> DeleteProfilePicture(string userId)
        {
            if (!_userAccountRepository.UserExistsById(userId))
                return NotFound();

            var user = _userAccountRepository.GetUser(userId);
            if (user.ProfilePictureUrl != null)
            {
                await _fileServiceRepository.Delete(user.ProfilePictureUrl);
                user.ProfilePictureUrl = null;
                _userManager.UpdateAsync(user).Wait();
            }

            return Ok();
        }

        //[Authorize(Roles = "Administrator")]
        [HttpPost("register-admin")]
        public async Task<IActionResult> RegisterAdministrator(ApplicationUserDto userDto)
        {
            var response = await _userAccountRepository.CreateAdministratorAccount(userDto);
            return Ok(response);
        }

        [HttpPost("register-trustee")]
        public async Task<IActionResult> RegisterCompanyManager(
            [FromBody] TrusteeUserDto userDto)
        {
            var response = await _userAccountRepository.CreateTrusteeAccount(userDto);
            return Ok(response);
        }

        [HttpPost("register-doctor")]
        public async Task<IActionResult> RegisterDoctor(DoctorUserDto doctorUserDto)
        {
            var response = await _userAccountRepository.CreateDoctorAccount(doctorUserDto);
            return Ok(response);
        }

        [HttpPost("register-patient")]
        public async Task<IActionResult> RegisterPatient(
            PatientUserDto userDto)
        {
            var response = await _userAccountRepository.CreatePatientAccount(userDto);
            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var response = await _userAccountRepository.LoginAccount(loginDto);
            return Ok(response);
        }
    }
}
