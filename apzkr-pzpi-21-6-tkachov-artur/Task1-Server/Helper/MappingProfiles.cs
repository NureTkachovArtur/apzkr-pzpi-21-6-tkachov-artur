using AutoMapper;
using medireminder.Dto;
using medireminder.GetDto;
using medireminder.Models;

namespace medireminder.Helper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Administrator, AdministratorDto>();
            CreateMap<AdministratorDto, Administrator>();
            CreateMap<Administrator, AdministratorGetDto>();
            CreateMap<AdministratorGetDto, Administrator>();

            CreateMap<Doctor, DoctorDto>();
            CreateMap<DoctorDto, Doctor>();
            CreateMap<Doctor, DoctorGetDto>();
            CreateMap<DoctorGetDto, Doctor>();

            CreateMap<Trustee, TrusteeDto>();
            CreateMap<TrusteeDto, Trustee>();
            CreateMap<Trustee, TrusteeGetDto>();
            CreateMap<TrusteeGetDto, Trustee>();

            CreateMap<Message, MessageDto>();
            CreateMap<MessageDto, MessageDto>();

            CreateMap<Medicine, MedicineDto>();
            CreateMap<MedicineDto, Medicine>();
            CreateMap<Medicine, MedicineGetDto>();
            CreateMap<MedicineGetDto, Medicine>();

            CreateMap<MedicationSchedule, MedicationScheduleDto>();
            CreateMap<MedicationScheduleDto,  MedicationSchedule>();

            CreateMap<MedicationStatistics, MedicationStatisticsDto>();
            CreateMap<MedicationStatisticsDto, MedicationStatistics>();
            CreateMap<MedicationStatistics, MedicationStatisticsGetDto>();
            CreateMap<MedicationStatisticsGetDto, MedicationStatistics>();

            CreateMap<MessageType, MessageTypeDto>();
            CreateMap<MessageTypeDto, MessageType>();

            CreateMap<SmartDevice, SmartDeviceDto>();
            CreateMap<SmartDeviceDto, SmartDevice>();

            CreateMap<SmartDeviceType, SmartDeviceTypeDto>();
            CreateMap<SmartDeviceTypeDto, SmartDeviceType>();

            CreateMap<PatientTrusteeDto, PatientTrustee>();
            CreateMap<PatientTrustee, PatientTrusteeDto>();

            CreateMap<PatientDoctorDto, PatientDoctor>();
            CreateMap<PatientDoctor, PatientDoctorDto>();

            CreateMap<Patient, PatientDto>();
            CreateMap<PatientDto, Patient>();
            CreateMap<Patient, PatientGetDto>();
            CreateMap<PatientGetDto, Patient>();

            CreateMap<ApplicationUser, ApplicationUserGetDto>();
            CreateMap<ApplicationUserGetDto, ApplicationUser>();
        }
    }
}
