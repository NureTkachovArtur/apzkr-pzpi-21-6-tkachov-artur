namespace medireminder.Interfaces
{
    public interface IFileServiceRepository
    {
        Task<string> Upload(IFormFile file);
        Task Delete(string fileName);
    }
}
