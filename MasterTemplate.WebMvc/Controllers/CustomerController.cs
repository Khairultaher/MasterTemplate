using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MasterTemplate.WebMvc.Controllers
{
    public class CustomerController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("customers")]
        public async Task<IActionResult> GetCustomers() 
        {
            await Task.Delay(500);
            var customers = new List<string> { "A","B","C"};
            return Json(customers);
        }
    }
}
