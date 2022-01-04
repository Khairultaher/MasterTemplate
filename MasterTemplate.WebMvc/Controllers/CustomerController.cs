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
            var customers = new List<string> { "By Admin Role","A", "B","C"};
            return Json(customers);
        }

        [Authorize(policy: "HRAdmin")]
        [HttpGet]
        [Route("GetCustomersByHRAdminPolicy")]
        public async Task<IActionResult> GetCustomersByHRAdminPolicy()
        {
            await Task.Delay(500);
            var customers = new List<string> { "By HRAdmin Policy", "A", "B", "C" };
            return Json(customers);
        }

        [Authorize(policy: "AccountsAdmin")]
        [HttpGet]
        [Route("GetCustomersByAccountsAdminPolicy")]
        public async Task<IActionResult> GetCustomersByAccountsAdminPolicy()
        {
            await Task.Delay(500);
            var customers = new List<string> { "By AccountsAdmin Policy", "A", "B", "C" };
            return Json(customers);
        }
    }
}
