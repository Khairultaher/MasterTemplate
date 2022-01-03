namespace MasterTemplate.WebMvc.Models
{
    public class ResponseViewModel
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = "";
        public string? Details { get; set; }
        public Object? Data { get; set; }
    }
}
