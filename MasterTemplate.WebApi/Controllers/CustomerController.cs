﻿
using MasterTemplate.Data.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MasterTemplate.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : BaseController
    {
        [HttpGet]
        [Route("customers")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetCustomers()
        {
            await Task.Delay(500);
            var customers = new List<string> { "By Admin Role", "A", "B", "C" };
            response.Data = customers;
            return Ok(response);
        }

        [HttpGet]
        [Route("GetCustomersByHRAdminPolicy")]
        [Authorize(policy: "HRAdmin")]
        public async Task<IActionResult> GetCustomersByHRAdminPolicy()
        {
            await Task.Delay(500);
            var customers = new List<string> { "By HRAdmin Policy", "A", "B", "C" };
            response.Data = customers;
            return Ok(response);
        }

        [HttpGet]
        [Route("GetCustomersByAccountsAdminPolicy")]
        [Authorize(policy: "AccountsAdmin")]
        public async Task<IActionResult> GetCustomersByAccountsAdminPolicy()
        {
            await Task.Delay(500);
            var customers = new List<string> { "By AccountsAdmin Policy", "A", "B", "C" };
            response.Data = customers;
            return Ok(response);
        }
    }
}