namespace medireminder.GetDto
{
    public class PatientGetDto
    {
        public int PatientId { get; set; }
        public string Address { get; set; }
        public int Age { get; set; }
        public char Gender { get; set; }
        public ApplicationUserGetDto ApplicationUser { get; set; }
    }
}
