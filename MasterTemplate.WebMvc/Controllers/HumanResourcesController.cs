using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MasterTemplate.WebMvc.Controllers
{
    public class HumanResourcesController : BaseController
    {
        [Authorize(policy: "HRAdmin")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
