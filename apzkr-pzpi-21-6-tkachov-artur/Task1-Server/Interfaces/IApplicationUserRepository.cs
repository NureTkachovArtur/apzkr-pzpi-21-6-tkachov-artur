using medireminder.Dto;
using medireminder.Models;
using static medireminder.Dto.ServiceResponseDto;

namespace medireminder.Interfaces
{
    public interface IApplicationUserRepository
    {
        Task<bool> UserExistsByIdAsync(string id);
        Task<ApplicationUser> GetUserAsync(string id);
        bool UserExistsById(string id);
        ApplicationUser GetUser(string id);
        ICollection<ApplicationUser> GetUsers();
        Task<GeneralResponse> CreateAdministratorAccount(ApplicationUserDto userDto);
        Task<GeneralResponse> CreateTrusteeAccount(TrusteeUserDto userDto);
        Task<GeneralResponse> CreateDoctorAccount(DoctorUserDto userDto);
        Task<GeneralResponse> CreatePatientAccount(PatientUserDto userDto);
        Task<LoginResponse> LoginAccount(LoginDto loginDto);
    }
}
