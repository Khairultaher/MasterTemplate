using MasterTemplate.Common.Helpers;
using MasterTemplate.Common.Utilities;
using MasterTemplate.Data.ViewModels;
using MasterTemplate.WebMvc.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MasterTemplate.WebMvc.Controllers
{
    public class AuthController : Controller
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
        public async Task<IActionResult> Login([FromForm] Data.ViewModels.LoginViewModel vm)
        {
            var res = new ResponseViewModel();

            // My application logic to validate the user
            Authentication authentication = new Authentication();
            var user = authentication.Login(vm.UserName, vm.PassWord);
            if(user is null) return RedirectToAction("Login", "Auth");


            var claims = new List<Claim>(); 
            claims.Add(new Claim(ClaimTypes.NameIdentifier, vm.UserName ?? "")); // NameIdentifier is the ID for an object
            claims.Add(new Claim(ClaimTypes.Name, vm.UserName ?? "")); //  Name is just that a name       
            // Add roles as multiple claims
            foreach (var role in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            // Optionally add other app specific claims as needed
            claims.Add(new Claim("Depertment", user.Depertment));



            if (vm.Bearer)
            {
                // create a new token with token helper and add our claim
                var token = JwtTokenHelper.GetJwtToken(vm.UserName ?? "",
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
            else 
            {
                var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal(identity);

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal);

                return RedirectToAction("Index", "Home");
            }

        }

        //[HttpPost]
        public async Task<IActionResult> Logout()
        { 
            await HttpContext.SignOutAsync("AppCookies");
            return RedirectToAction("Login", "Auth");
        }
    }
}
