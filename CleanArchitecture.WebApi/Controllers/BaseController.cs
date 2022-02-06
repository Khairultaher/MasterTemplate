using MasterTemplate.Data.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MasterTemplate.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        public ResponseViewModel response { get; set; }
       
        public BaseController()
        {
            response = new ResponseViewModel();  
        }
    }
}
