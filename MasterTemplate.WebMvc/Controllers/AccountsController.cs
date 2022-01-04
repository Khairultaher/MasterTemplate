using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MasterTemplate.WebMvc.Controllers
{
    public class AccountsController : BaseController
    {
        [Authorize(policy: "AccountsAdmin")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
