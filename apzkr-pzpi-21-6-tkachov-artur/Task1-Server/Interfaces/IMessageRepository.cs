using medireminder.Dto;
using medireminder.Models;

namespace medireminder.Interfaces
{
    public interface IMessageRepository
    {
        ICollection<MessageDto> GetMessages();
        ICollection<MessageDto> GetMessagesOfUser(string userId);
        MessageDto GetMessage(int messageId);
        bool MessageExists(int messageId);
        bool CreateMessage(Message message);
        bool UpdateMessage(Message message);
        bool DeleteMessage(Message message);
        bool Save();
    }
}
