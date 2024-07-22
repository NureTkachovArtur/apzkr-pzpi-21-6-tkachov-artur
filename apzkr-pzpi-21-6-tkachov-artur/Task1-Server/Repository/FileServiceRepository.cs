using medireminder.Interfaces;

namespace medireminder.Repository
{
    public class FileServiceRepository : IFileServiceRepository
    {
        private readonly string _uploadFolder;

        public FileServiceRepository(IConfiguration configuration)
        {
            _uploadFolder = configuration["UploadFolder"];
        }

        public async Task<string> Upload(IFormFile file)
        {
            var filePath = Path.Combine(_uploadFolder, Guid.NewGuid().ToString() + Path.GetExtension(file.FileName));

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileName = filePath.Split('\\')[1];
            return fileName;
        }

        public async Task Delete(string fileName)
        {
            var filePath = Path.Combine(_uploadFolder, fileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}
