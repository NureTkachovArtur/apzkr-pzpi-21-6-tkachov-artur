using System.ComponentModel.DataAnnotations;

namespace medireminder.Dto
{
    public class PatientUserDto : ApplicationUserDto
    {
        public string Address { get; set; }
        
        [Required]
        public int Age { get; set; }
        
        [Required]
        public char Gender { get; set; }
    }
}
