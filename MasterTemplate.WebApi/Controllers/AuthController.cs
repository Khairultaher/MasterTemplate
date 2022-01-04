using MasterTemplate.Common.Helpers;
using MasterTemplate.Common.Utilities;
using MasterTemplate.Data.ViewModels;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MasterTemplate.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : BaseController
    {
        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromForm] LoginViewModel vm)
        {
            await Task.Delay(500);
            // My application logic to validate the user
            Authentication authentication = new Authentication();
            var user = authentication.Login(vm.UserName, vm.PassWord);
            if (user is null) {
                response.Success = false;
                response.Message = "User not found";
                return NotFound(response);
            }

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

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal(identity);

            // create a new token with token helper and add our claim
            var token = JwtTokenHelper.GetJwtToken(vm.UserName ?? "",
                Constants.JwtToken.SigningKey,
                Constants.JwtToken.Issuer,
                Constants.JwtToken.Audience,
                TimeSpan.FromMinutes(Constants.JwtToken.TokenTimeoutMinutes),
                claims.ToArray());

            response.Data = new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expires = token.ValidTo
            };
            return Ok(response);
        }



        [HttpPost]
        [Route("Logout")]
        public async Task<IActionResult> Logout()
        {
            //await Task.Delay(500);
            await HttpContext.SignOutAsync("Cookies");
            return Ok(response);
        }
    }
}
