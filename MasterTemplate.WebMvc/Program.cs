using MasterTemplate.Common.Utilities;
using MasterTemplate.Data;
using MasterTemplate.Service.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


var env = builder.Configuration.GetSection("Environment").Value;
//builder.Configuration.AddJsonFile($"appsettings.{env}.json", false, true);
IConfiguration configuration = new ConfigurationBuilder()
                            .AddJsonFile($"appsettings.{env}.json")
                            .Build();

#region Constants & Variables
Constants.JwtToken.Issuer = configuration["JwtToken:Issuer"];
Constants.JwtToken.Audience = configuration["JwtToken:Audience"];
Constants.JwtToken.SigningKey = configuration["JwtToken:SigningKey"];
#endregion
// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    //options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Configure Authentication
builder.Services.AddAuthentication(auth =>
{
    auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = Constants.JwtToken.Issuer,
        ValidateAudience = true,
        ValidAudience = Constants.JwtToken.Audience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Constants.JwtToken.SigningKey))
    };
});

#region Data Service
//builder.Services.AddScoped<ProductService>();
#endregion

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
else
{
    app.UseExceptionHandler("/Home/Error");
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
