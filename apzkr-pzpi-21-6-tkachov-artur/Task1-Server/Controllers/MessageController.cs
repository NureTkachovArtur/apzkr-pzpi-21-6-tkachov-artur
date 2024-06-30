using AutoMapper;
using medireminder.Dto;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medireminder.Controllers
{
    [Route("api/Messages")]
    [ApiController]
    public class MessageController : Controller
    {
        private readonly IMessageTypeRepository _messageTypeRepository;
        private readonly IApplicationUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public MessageController(
            IMessageTypeRepository messageTypeRepository,
            IApplicationUserRepository userRepository,
            IMessageRepository messageRepository,
            IPatientRepository patientRepository,
            IMapper mapper)
        {
            _messageTypeRepository = messageTypeRepository;
            _messageRepository = messageRepository;
            _patientRepository = patientRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MessageDto>))]
        public IActionResult GetMessages()
        {
            var messages = _messageRepository.GetMessages();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(messages);
        }

        [HttpGet("{messageId}")]
        [ProducesResponseType(200, Type = typeof(Message))]
        [ProducesResponseType(400)]
        public IActionResult GetMessage(int messageId)
        {
            if (!_messageRepository.MessageExists(messageId))
                return NotFound();

            var messages = _messageRepository.GetMessage(messageId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(messages);
        }

        [HttpGet("user/{userId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Message>))]
        [ProducesResponseType(400)]
        public IActionResult GetMessagesOfUser(string userId)
        {
            if (!_userRepository.UserExistsById(userId))
                return NotFound();

            var messages = _messageRepository.GetMessagesOfUser(userId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(messages);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateMessage([FromBody] MessageDto messageCreate)
        {
            if (messageCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var message = new Message()
            {
                MessageId = 0,
                MessageTypeId = messageCreate.MessageTypeId,
                MessageType = _messageTypeRepository.GetMessageType(messageCreate.MessageTypeId),
                PatientId = messageCreate.PatientId,
                Patient = _patientRepository.GetPatient(messageCreate.PatientId),
                Receiver = _userRepository.GetUser(messageCreate.ReceiverId),
                Text = messageCreate.Text,
                CreatedAt = messageCreate.CreatedAt,
                IsReceived = messageCreate.IsReceived,
                IsRead = messageCreate.IsRead
            };
            if (!_messageRepository.CreateMessage(message))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{messageId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateMessage(int messageId, [FromBody] MessageDto messageUpdate)
        {
            if (messageUpdate == null || messageUpdate.MessageId != messageId)
                return BadRequest(ModelState);

            if (!_messageRepository.MessageExists(messageId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var _messageMap = _mapper.Map<Message>(messageUpdate);
            if (!_messageRepository.UpdateMessage(_messageMap))
            {
                ModelState.AddModelError("", "Something went wrong updating message");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{messageId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteMessage(int messageId)
        {
            if (!_messageRepository.MessageExists(messageId))
                return NotFound();

            var messageToDelete = _messageRepository.GetMessage(messageId);
            var message = new Message
            {
                MessageId       = messageToDelete.MessageId,
                MessageTypeId   = messageToDelete.MessageTypeId,
                MessageType     = _messageTypeRepository.GetMessageType(messageToDelete.MessageTypeId),
                PatientId       = messageToDelete.PatientId,
                Patient         = _patientRepository.GetPatient(messageToDelete.PatientId),
                Receiver        = _userRepository.GetUser(messageToDelete.ReceiverId),
                Text            = messageToDelete.Text,
                CreatedAt       = messageToDelete.CreatedAt,
                IsReceived      = messageToDelete.IsReceived,
                IsRead          = messageToDelete.IsRead
            };

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_messageRepository.DeleteMessage(message))
            {
                ModelState.AddModelError("", "Something went wrong deleting message");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
