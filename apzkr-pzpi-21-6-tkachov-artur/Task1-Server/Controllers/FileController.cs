using Microsoft.AspNetCore.Mvc;

namespace medireminder.Controllers
{
    [Route("api/Files")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly string _uploadFolder;

        public FileController(IConfiguration configuration)
        {
            _uploadFolder = configuration["UploadFolder"];
        }

        [HttpGet("{fileName}")]
        public IActionResult GetFile(string fileName)
        {
            var filePath = Path.Combine(_uploadFolder, fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound();

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var contentType = GetContentType(filePath);

            return File(fileBytes, contentType, fileName);
        }

        private string GetContentType(string path)
        {
            var types = new Dictionary<string, string>
        {
            {".jpg", "image/jpeg"},
            {".jpeg", "image/jpeg"},
            {".png", "image/png"},
            {".gif", "image/gif"},
            {".bmp", "image/bmp"}
        };

            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types.ContainsKey(ext) ? types[ext] : "application/octet-stream";
        }
    }
}
