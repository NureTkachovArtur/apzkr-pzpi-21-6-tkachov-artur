namespace medireminder.Models
{
    public class PatientTrustee
    {
        public int PatientId { get; set; }
        public Patient Patient { get; set; }
        public int TrusteeId { get; set; }
        public Trustee Trustee { get; set; }
    }
}
