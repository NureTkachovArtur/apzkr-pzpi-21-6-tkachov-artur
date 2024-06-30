namespace medireminder.Models
{
    public class Doctor
    {
        public int DoctorId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public ICollection<PatientDoctor> PatientDoctors { get; set; }
    }
}
