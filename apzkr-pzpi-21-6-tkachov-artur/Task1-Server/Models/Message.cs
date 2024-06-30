namespace medireminder.Models
{
    public class Message
    {
        public int MessageId { get; set; }
        public int MessageTypeId { get; set; }
        public MessageType MessageType { get; set; }
        public int PatientId { get; set; }
        public Patient Patient { get; set; }
        public ApplicationUser Receiver { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsReceived { get; set; } = false;
        public bool IsRead { get; set; } = false;
    }
}
