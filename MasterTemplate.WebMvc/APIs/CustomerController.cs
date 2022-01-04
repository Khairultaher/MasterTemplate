using MasterTemplate.WebMvc.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MasterTemplate.WebMvc.APIs
{
    [Route("api")]
    [Authorize]
    public class CustomerController : BaseController
    {
        [HttpGet]
        [Route("customers")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetCustomers()
        {
            await Task.Delay(500);
            var customers = new List<string> { "By Admin Role", "A", "B", "C" };
            return Json(customers);
        }

        [HttpGet]
        [Route("GetCustomersByHRAdminPolicy")]
        [Authorize(policy: "HRAdmin")]
        public async Task<IActionResult> GetCustomersByHRAdminPolicy()
        {
            await Task.Delay(500);
            var customers = new List<string> { "By HRAdmin Policy", "A", "B", "C" };
            return Json(customers);
        }

        [HttpGet]
        [Route("GetCustomersByAccountsAdminPolicy")]
        [Authorize(policy: "AccountsAdmin")]
        public async Task<IActionResult> GetCustomersByAccountsAdminPolicy()
        {
            await Task.Delay(500);
            var customers = new List<string> { "By AccountsAdmin Policy", "A", "B", "C" };
            return Json(customers);
        }
    }
}
