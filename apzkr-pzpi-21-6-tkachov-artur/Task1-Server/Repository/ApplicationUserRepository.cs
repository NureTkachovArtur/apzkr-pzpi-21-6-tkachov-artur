﻿using medireminder.Data;
using medireminder.Dto;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace medireminder.Repository
{
    public class ApplicationUserRepository : IApplicationUserRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        private readonly IAdministratorRepository _administratorRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly ITrusteeRepository _trusteeRepository;
        private readonly IDoctorRepository _doctorRepository;

        private readonly DataContext _context;

        public ApplicationUserRepository(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            IAdministratorRepository administratorRepository,
            ITrusteeRepository trusteeRepository,
            IDoctorRepository doctorRepository,
            IPatientRepository patientRepository,
            DataContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;

            _trusteeRepository = trusteeRepository;
            _administratorRepository = administratorRepository;
            _patientRepository = patientRepository;
            _doctorRepository = doctorRepository;

            _context = context;
        }

        public async Task<ServiceResponseDto.GeneralResponse> CreateAdministratorAccount(
            ApplicationUserDto userDto)
        {
            if (userDto == null)
                return new ServiceResponseDto.GeneralResponse(false, "Model is empty");

            var newUser = new ApplicationUser()
            {
                FirstName = userDto.FirstName,
                Email = userDto.Email,
                PasswordHash = userDto.Password,
                UserName = userDto.UserName,
                MiddleName = userDto.MiddleName,
                LastName = userDto.LastName,
                PhoneNumber = userDto.PhoneNumber
            };

            var user = await _userManager.FindByEmailAsync(newUser.Email);
            if (user != null)
                return new ServiceResponseDto.GeneralResponse(false, "User is already registered");

            var userCreate = await _userManager.CreateAsync(newUser, userDto.Password);
            if (!userCreate.Succeeded)
                return new ServiceResponseDto.GeneralResponse(false, "An error occured creating the user");

            var administrator = new Administrator
            {
                AdministratorId = 0,
                ApplicationUser = newUser
            };
            _administratorRepository.CreateAdministrator(administrator);

            await _roleManager.CreateAsync(new IdentityRole() { Name = "Administrator" });
            await _userManager.AddToRoleAsync(newUser, "Administrator");
            return new ServiceResponseDto.GeneralResponse(true, "Account created");
        }

        public async Task<ServiceResponseDto.GeneralResponse> CreateTrusteeAccount(
            TrusteeUserDto userDto)
        {
            if (userDto == null)
                return new ServiceResponseDto.GeneralResponse(false, "Model is empty");

            var newUser = new ApplicationUser()
            {
                FirstName = userDto.FirstName,
                Email = userDto.Email,
                PasswordHash = userDto.Password,
                UserName = userDto.UserName,
                MiddleName = userDto.MiddleName,
                LastName = userDto.LastName,
                PhoneNumber = userDto.PhoneNumber
            };

            var user = await _userManager.FindByEmailAsync(newUser.Email);
            if (user != null)
                return new ServiceResponseDto.GeneralResponse(false, "User is already registered");

            var userCreate = await _userManager.CreateAsync(newUser, userDto.Password);
            if (!userCreate.Succeeded)
                return new ServiceResponseDto.GeneralResponse(false, "An error occured creating the user");

            var trustee = new Trustee
            {
                TrusteeId = 0,
                ApplicationUser = newUser
            };
            _trusteeRepository.CreateTrustee(trustee);

            await _roleManager.CreateAsync(new IdentityRole() { Name = "Trustee" });
            await _userManager.AddToRoleAsync(newUser, "Trustee");
            return new ServiceResponseDto.GeneralResponse(true, "Account created");
        }

        public async Task<ServiceResponseDto.GeneralResponse> CreateDoctorAccount(
            DoctorUserDto userDto)
        {
            if (userDto == null)
                return new ServiceResponseDto.GeneralResponse(false, "Model is empty");

            var newUser = new ApplicationUser()
            {
                FirstName = userDto.FirstName,
                Email = userDto.Email,
                PasswordHash = userDto.Password,
                UserName = userDto.UserName,
                MiddleName = userDto.MiddleName,
                LastName = userDto.LastName,
                PhoneNumber = userDto.PhoneNumber
            };

            var user = await _userManager.FindByEmailAsync(newUser.Email);
            if (user != null)
                return new ServiceResponseDto.GeneralResponse(false, "User is already registered");

            var userCreate = await _userManager.CreateAsync(newUser, userDto.Password);
            
            if (!userCreate.Succeeded)
            {
                if (userCreate.Errors.First().Code == "InvalidUserName")
                {
                    return new ServiceResponseDto.GeneralResponse(false, "User Name should consist of Enligh and numbers");
                }
                return new ServiceResponseDto.GeneralResponse(false, "An error occured creating the user");
            }

            var doctor = new Doctor
            {
                DoctorId = 0,
                ApplicationUser = newUser
            };
            _doctorRepository.CreateDoctor(doctor);

            await _roleManager.CreateAsync(new IdentityRole() { Name = "Doctor" });
            await _userManager.AddToRoleAsync(newUser, "Doctor");
            return new ServiceResponseDto.GeneralResponse(true, "Account created");
        }

        public async Task<ServiceResponseDto.GeneralResponse> CreatePatientAccount(
            PatientUserDto userDto)
        {
            if (userDto == null)
                return new ServiceResponseDto.GeneralResponse(false, "Model is empty");

            var newUser = new ApplicationUser()
            {
                FirstName = userDto.FirstName,
                Email = userDto.Email,
                PasswordHash = userDto.Password,
                UserName = userDto.UserName,
                MiddleName = userDto.MiddleName,
                LastName = userDto.LastName,
                PhoneNumber = userDto.PhoneNumber
            };

            var user = await _userManager.FindByEmailAsync(newUser.Email);
            if (user != null)
                return new ServiceResponseDto.GeneralResponse(false, "User is already registered");

            var userCreate = await _userManager.CreateAsync(newUser, userDto.Password);
            if (!userCreate.Succeeded)
                return new ServiceResponseDto.GeneralResponse(false, "An error occured creating the user");

            var patient = new Patient
            {
                PatientId = 0,
                ApplicationUser = newUser,
                Gender = userDto.Gender,
                Address = userDto.Address,
                Age = userDto.Age
            };
            _patientRepository.CreatePatient(patient);

            await _roleManager.CreateAsync(new IdentityRole() { Name = "Patient" });
            await _userManager.AddToRoleAsync(newUser, "Patient");
            return new ServiceResponseDto.GeneralResponse(true, "Account created");
        }

        public async Task<ServiceResponseDto.LoginResponse> LoginAccount(LoginDto loginDto)
        {
            if (loginDto == null)
                return new ServiceResponseDto.LoginResponse(false, null, "Login is empty");

            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
                return new ServiceResponseDto.LoginResponse(false, null, "User was not found");

            bool checkUserPasswords = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!checkUserPasswords)
                return new ServiceResponseDto.LoginResponse(false, null, "Invalid email/password");

            var userRole = await _userManager.GetRolesAsync(user);

            var recordId = 0;
            if (userRole.First() == "Patient")
            {
                recordId = _context.Patients
                    .Where(e => e.ApplicationUser.Id ==  user.Id)
                    .FirstOrDefault().PatientId;
            } else if (userRole.First() == "Doctor")
            {
                recordId = _context.Doctors
                    .Where(e => e.ApplicationUser.Id == user.Id)
                    .FirstOrDefault().DoctorId;
            } else if (userRole.First() == "Trustee")
            {
                recordId = _context.Trustees
                    .Where(e => e.ApplicationUser.Id == user.Id)
                    .FirstOrDefault().TrusteeId;
            }

            var userSession = new UserSessionDto(recordId, user.UserName, user.Email, userRole.First());
            string token = GenerateToken(userSession);

            return new ServiceResponseDto.LoginResponse(true, token, "Login completed");
        }

        private string GenerateToken(UserSessionDto userSession)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var userClaims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userSession.Id.ToString()),
                new Claim(ClaimTypes.Name, userSession.Name),
                new Claim(ClaimTypes.Email, userSession.Email),
                new Claim(ClaimTypes.Role, userSession.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["jwt:Issuer"],
                audience: _configuration["jwt:Audience"],
                claims: userClaims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<bool> UserExistsByIdAsync(string id)
        {
            return await _context.Users.AnyAsync(e => e.Id == id);
        }

        public async Task<ApplicationUser> GetUserAsync(string id)
        {
            return await _context.Users.FindAsync(id);
        }

        public bool UserExistsById(string id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        public ApplicationUser GetUser(string id)
        {
            return _context.Users.Find(id);
        }

        public ICollection<ApplicationUser> GetUsers()
        {
            return _context.Users.OrderBy(e => e.UserName).ToList();
        }
    }
}
