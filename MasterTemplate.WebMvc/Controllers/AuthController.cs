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
            Authentication authentication = new Authentication();
            var user = authentication.Login(vm.UserName, vm.PassWord);
            if(user is null) return RedirectToAction("Login", "Auth");


            var claims = new List<Claim>(); 
            claims.Add(new Claim(ClaimTypes.NameIdentifier, vm.UserName ?? "")); // NameIdentifier is the ID for an object
            claims.Add(new Claim(ClaimTypes.Name, vm.UserName ?? "")); //  Name is just that a name       
            // Add roles as multiple claims
            var roles = new List<string>() { "Admin", "User" }; 
            foreach (var role in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            // Optionally add other app specific claims as needed
            claims.Add(new Claim("Depertment", user.Depertment));



            if (vm.From == "")
            {
                var identity = new ClaimsIdentity(claims, "AppCookies");
                ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal(identity);

                await HttpContext.SignInAsync("AppCookies", claimsPrincipal); 

                return RedirectToAction("Index", "Home");
            }
            else {
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

        }

        //[HttpPost]
        public async Task<IActionResult> Logout()
        { 
            await HttpContext.SignOutAsync("AppCookies");
            return RedirectToAction("Login", "Auth");
        }
    }


    public class Authentication
    {
        List<User> users = new List<User>();
        public Authentication()
        {
            users.Add(new User() { UserName = "Khairul", Pasword= "123", Depertment ="IT", Roles = new List<string>() { "Admin", "User"} });
            users.Add(new User() { UserName = "Alam", Pasword = "123", Depertment = "HR", Roles = new List<string>() { "Admin"} });
            users.Add(new User() { UserName = "Taher", Pasword = "123", Depertment = "Accounts", Roles = new List<string>() { "Admin" } });
        }

        public User Login(string username, string password)
        { 
            return users.FirstOrDefault(w => w.UserName.ToLower() == username.ToLower() 
                                && w.Pasword == password);
        }
    }

    public class User
    {
        public string UserName { get; set; }
        public string Pasword { get; set; }
        public List<string> Roles { get; set; }
        public string Depertment { get; set; }
    }
}
