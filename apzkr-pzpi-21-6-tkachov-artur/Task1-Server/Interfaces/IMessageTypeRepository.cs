using medireminder.Dto;
using medireminder.Models;

namespace medireminder.Interfaces
{
    public interface IMessageTypeRepository
    {
        ICollection<MessageType> GetMessageTypes();
        MessageType GetMessageType(int messageTypeId);
        ICollection<MessageDto> GetMessagesByType(int messageTypeId);
        bool MessageTypeExists(int messageTypeId);
        bool CreateMessageType(MessageType messageType);
        bool UpdateMessageType(MessageType messageType);
        bool DeleteMessageType(MessageType messageType);
        bool Save();
    }
}
