namespace medireminder.Models
{
    public class Medicine
    {
        public int MedicineId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public float Dosage { get; set; }
        public int PatientId { get; set; }
        public Patient Patient { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string Instruction { get; set; }
        public float Quantity { get; set; }
    }
}
