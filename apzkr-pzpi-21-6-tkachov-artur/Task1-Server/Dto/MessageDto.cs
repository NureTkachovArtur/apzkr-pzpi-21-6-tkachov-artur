namespace medireminder.Dto
{
    public class MessageDto
    {
        public int MessageId { get; set; }
        public int MessageTypeId { get; set; }
        public int PatientId { get; set; }
        public string ReceiverId { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsReceived { get; set; } = false;
        public bool IsRead { get; set; } = false;
    }
}
