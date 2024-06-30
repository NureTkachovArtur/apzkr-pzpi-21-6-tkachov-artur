using medireminder.Data;
using medireminder.Dto;
using medireminder.Interfaces;
using medireminder.Models;

namespace medireminder.Repository
{
    public class MessageTypeRepository : IMessageTypeRepository
    {
        private readonly DataContext _context;

        public MessageTypeRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateMessageType(MessageType messageType)
        {
            _context.Add(messageType);
            return Save();
        }

        public bool DeleteMessageType(MessageType messageType)
        {
            _context.Remove(messageType);
            return Save();
        }

        public ICollection<MessageDto> GetMessagesByType(int messageTypeId)
        {
            return _context.Messages
                .Where(e => e.MessageTypeId == messageTypeId)
                .Select(e => new MessageDto
                {
                    MessageId = e.MessageId,
                    MessageTypeId = e.MessageTypeId,
                    PatientId = e.PatientId,
                    ReceiverId = e.Receiver.Id,
                    Text = e.Text,
                    CreatedAt = e.CreatedAt,
                    IsReceived = e.IsReceived,
                    IsRead = e.IsRead
                })
                .ToList();
        }

        public MessageType GetMessageType(int messageTypeId)
        {
            return _context.MessageTypes
                .Where(e => e.MessageTypeId == messageTypeId)
                .FirstOrDefault();
        }

        public ICollection<MessageType> GetMessageTypes()
        {
            return _context.MessageTypes
                .OrderBy(e => e.MessageTypeId)
                .ToList();
        }

        public bool MessageTypeExists(int messageTypeId)
        {
            return _context.MessageTypes.Any(e => e.MessageTypeId == messageTypeId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateMessageType(MessageType messageType)
        {
            _context.Update(messageType);
            return Save();
        }
    }
}
