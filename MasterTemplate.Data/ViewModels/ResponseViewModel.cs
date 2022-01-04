using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterTemplate.Data.ViewModels
{
    public class ResponseViewModel
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = "";
        public string? Details { get; set; }
        public Object? Data { get; set; }
    }
}
