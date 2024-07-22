using AutoMapper;
using medireminder.Dto;
using medireminder.Interfaces;
using medireminder.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medireminder.Controllers
{
    [Route("api/Medicines")]
    [ApiController]
    public class MedicineController : Controller
    {
        private readonly IMedicineRepository _medicineRepository;
        private readonly IPatientRepository _petientRepository;
        private readonly IMapper _mapper;

        public MedicineController(
            IMedicineRepository medicineRepository,
            IPatientRepository petientRepository,
            IMapper mapper)
        {
            _medicineRepository = medicineRepository;
            _petientRepository = petientRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Medicine>))]
        public IActionResult GetMedicines()
        {
            var medicines = _medicineRepository.GetMedicines();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicines);
        }

        [HttpGet("{medicineId}")]
        [ProducesResponseType(200, Type = typeof(Medicine))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicine(int medicineId)
        {
            if (!_medicineRepository.MedicineExists(medicineId))
                return NotFound();

            var medication = _medicineRepository.GetMedicine(medicineId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medication);
        }

        [HttpGet("patient/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Medicine>))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicinesByPatient(int patientId)
        {
            if (!_petientRepository.PatientExists(patientId))
                return NotFound();

            var medicines = _mapper.Map<List<MedicineDto>>(_medicineRepository.GetMedicinesByPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicines);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Doctor,Patient")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateMedicine([FromBody] MedicineDto medicineCreate)
        {
            if (medicineCreate == null)
                return BadRequest(ModelState);

            var medicine = _medicineRepository.GetMedicines()
                .Where(e => e.Name == medicineCreate.Name).FirstOrDefault();

            if (medicine != null)
            {
                ModelState.AddModelError("", "Medicine with this name already exists");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var _medicineMap = _mapper.Map<Medicine>(medicineCreate);
            if (!_medicineRepository.CreateMedicine(_medicineMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{medicineId}")]
        [Authorize(Roles = "Administrator,Doctor,Patient")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateMedicine(int medicineId, [FromBody] MedicineDto medicineUpdate)
        {
            if (medicineUpdate == null || medicineUpdate.MedicineId != medicineId)
                return BadRequest(ModelState);

            if (!_medicineRepository.MedicineExists(medicineId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var _medicineMap = _mapper.Map<Medicine>(medicineUpdate);
            if (!_medicineRepository.UpdateMedicine(_medicineMap))
            {
                ModelState.AddModelError("", "Something went wrong updating medicine");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{medicineId}")]
        [Authorize(Roles = "Administrator,Doctor,Patient")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteMedicine(int medicineId)
        {
            if (!_medicineRepository.MedicineExists(medicineId))
                return NotFound();

            var medicineToDelete = _medicineRepository.GetMedicine(medicineId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_medicineRepository.DeleteMedicine(medicineToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting medicine");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
