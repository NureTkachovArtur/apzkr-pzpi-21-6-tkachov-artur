namespace medireminder.Models
{
    public class Trustee
    {
        public int TrusteeId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public ICollection<PatientTrustee> PatientTrustees { get; set; }
    }
}
