using AutoMapper;
using medireminder.Dto;
using medireminder.Interfaces;
using medireminder.Models;
using medireminder.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medireminder.Controllers
{
    [Route("api/MessageTypes")]
    [ApiController]
    public class MessageTypeController : Controller
    {
        private readonly IMessageTypeRepository _messageTypeRepository;
        private readonly IMapper _mapper;

        public MessageTypeController(
            IMessageTypeRepository messageTypeRepository,
            IMapper mapper)
        {
            _messageTypeRepository = messageTypeRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MessageType>))]
        public IActionResult GetMessageTypes()
        {
            var messageTypes = _messageTypeRepository.GetMessageTypes();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(messageTypes);
        }

        [HttpGet("{messageTypeId}")]
        [ProducesResponseType(200, Type = typeof(MessageType))]
        [ProducesResponseType(400)]
        public IActionResult GetMessageType(int messageTypeId)
        {
            if (!_messageTypeRepository.MessageTypeExists(messageTypeId))
                return NotFound();

            var messageType = _messageTypeRepository.GetMessageType(messageTypeId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(messageType);
        }

        [HttpGet("messages/{messageTypeId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Message>))]
        [ProducesResponseType(400)]
        public IActionResult GetMessagesByType(int messageTypeId)
        {
            if (!_messageTypeRepository.MessageTypeExists(messageTypeId))
                return NotFound();

            var messages = _mapper.Map<List<MessageDto>>(_messageTypeRepository.GetMessagesByType(messageTypeId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(messages);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateMessageType([FromBody] MessageTypeDto messageTypeCreate)
        {
            if (messageTypeCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var _messageTypeMap = _mapper.Map<MessageType>(messageTypeCreate);
            if (!_messageTypeRepository.CreateMessageType(_messageTypeMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving message type");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{messageTypeId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateMessageType(int messageTypeId, [FromBody] MessageTypeDto messageTypeUpdate)
        {
            if (messageTypeUpdate == null || messageTypeUpdate.MessageTypeId != messageTypeId)
                return BadRequest(ModelState);

            if (!_messageTypeRepository.MessageTypeExists(messageTypeId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var _messageTypeMap = _mapper.Map<MessageType>(messageTypeUpdate);
            if (!_messageTypeRepository.UpdateMessageType(_messageTypeMap))
            {
                ModelState.AddModelError("", "Something went wrong updating message type");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{messageTypeId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteMessageType(int messageTypeId)
        {
            if (!_messageTypeRepository.MessageTypeExists(messageTypeId))
                return NotFound();

            var messageTypeToDelete = _messageTypeRepository.GetMessageType(messageTypeId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_messageTypeRepository.DeleteMessageType(messageTypeToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting message type");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
