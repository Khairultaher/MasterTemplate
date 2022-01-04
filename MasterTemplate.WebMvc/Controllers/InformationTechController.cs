using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MasterTemplate.WebMvc.Controllers
{
    public class InformationTechController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
