using MasterTemplate.Common.Helpers;
using MasterTemplate.Common.Utilities;
using MasterTemplate.WebMvc.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MasterTemplate.WebMvc.Controllers
{
    [AllowAnonymous]
    public class AuthController : BaseController
    {

        public IActionResult Index()
        {
            return View();
        }


        public IActionResult Login() 
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromForm] LoginViewModel vm)
        {
            var res = new ResponseViewModel();

            // My application logic to validate the user


            var claims = new List<Claim>();
            claims.Add(new Claim("UserId", vm.UserId ?? ""));
            // Add roles as multiple claims
            var roles = new List<string>() { "Admin", "User" }; // 
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            // Optionally add other app specific claims as needed
            claims.Add(new Claim("Depertment", "Accounts"));



            if (vm.From == "")
            {
                var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal(identity);

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal); 

                return RedirectToAction("Index", "Home");
            }
            else {
                // create a new token with token helper and add our claim
                var token = JwtTokenHelper.GetJwtToken(vm.UserId ?? "",
                    Constants.JwtToken.SigningKey,
                    Constants.JwtToken.Issuer,
                    Constants.JwtToken.Audience,
                    TimeSpan.FromMinutes(Constants.JwtToken.TokenTimeoutMinutes),
                    claims.ToArray());
                return Json(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expires = token.ValidTo
                });
            }

        }

    }
}
