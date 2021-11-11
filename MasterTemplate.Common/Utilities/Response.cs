
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MasterTemplate.Common.Utilities.Enums;

namespace MasterTemplate.Common.Utilities
{
    public class ResponseModel
    {
        public ResponseModel()
        {
            Status = ResponseStatus.Success;
            Message = ResponseStatus.Success.ToString();
        }
        public ResponseStatus Status { get; set; }
        public string Message { get; set; }
        public int TotalRecords { get; set; } = 0;
        public object? Data { get; set; } = null;
        public object? Error { get; set; } = null;
    }
}
