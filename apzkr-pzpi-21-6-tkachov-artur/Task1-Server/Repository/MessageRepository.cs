using medireminder.Data;
using medireminder.Dto;
using medireminder.Interfaces;
using medireminder.Models;

namespace medireminder.Repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;

        public MessageRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateMessage(Message message)
        {
            _context.Add(message);
            return Save();
        }

        public bool DeleteMessage(Message message)
        {
            _context.Remove(message);
            return Save();
        }

        public MessageDto GetMessage(int messageId)
        {
            return _context.Messages
                .Where(e => e.MessageId == messageId)
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
                .FirstOrDefault();
        }

        public ICollection<MessageDto> GetMessages()
        {
            return _context.Messages
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

        public ICollection<MessageDto> GetMessagesOfUser(string userId)
        {
            return _context.Messages
                .Where(e => e.Receiver.Id == userId)
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

        public bool MessageExists(int messageId)
        {
            return _context.Messages.Any(e => e.MessageId == messageId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateMessage(Message message)
        {
            _context.Update(message);
            return Save();
        }
    }
}
