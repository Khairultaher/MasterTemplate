using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterTemplate.Common.Utilities
{
    public class Enums
    {
        public enum ResponseStatus
        {
            Success = 200,
            Created = 201,
            NoDataAvailable = 204,
            BadRequest = 400,
            Unauthorized = 401,
            NotFound = 404,
            InternalServerError = 500
        }
    }
    
}
