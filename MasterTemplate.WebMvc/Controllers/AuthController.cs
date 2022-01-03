using MasterTemplate.Common.Helpers;
using MasterTemplate.Common.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MasterTemplate.WebMvc.Controllers
{
    [AllowAnonymous]
    [Route("auth")]
    public class AuthController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login([FromForm] LoginViewModel vm)
        {
            var res = new ResponseVuewModel();

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

    public class LoginViewModel
    {
        public string? UserId { get; set; }
        public string? PassWord { get; set; }
    }

    public class ResponseVuewModel
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = "";
        public string? Details { get; set; }
        public Object? Data { get; set; }
    }
}
