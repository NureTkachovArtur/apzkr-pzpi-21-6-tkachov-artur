using medireminder.Dto;
using medireminder.Models;
using static medireminder.Dto.ServiceResponseDto;

namespace medireminder.Interfaces
{
    public interface IApplicationUserRepository
    {
        bool UserExistsById(string id);
        ApplicationUser GetUser(string id);
        Task<GeneralResponse> CreateAdministratorAccount(ApplicationUserDto userDto);
        Task<GeneralResponse> CreateTrusteeAccount(TrusteeUserDto userDto);
        Task<GeneralResponse> CreateDoctorAccount(DoctorUserDto userDto);
        Task<GeneralResponse> CreatePatientAccount(PatientUserDto userDto);
        Task<LoginResponse> LoginAccount(LoginDto loginDto);
    }
}
