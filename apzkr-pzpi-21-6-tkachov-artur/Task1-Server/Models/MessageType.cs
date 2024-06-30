namespace medireminder.Models
{
    public class MessageType
    {
        public int MessageTypeId { get; set; }
        public string Name { get; set; }
        public ICollection<Message> Messages { get; set; }
    }
}
