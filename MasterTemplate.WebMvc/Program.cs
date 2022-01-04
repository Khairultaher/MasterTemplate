using MasterTemplate.Common.Utilities;
using MasterTemplate.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
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

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    //options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    //options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddControllersWithViews();

#region Configure Token & Cookie Based Authentication Together

//builder.Services.AddAuthentication(config =>
//{
//    config.DefaultScheme = "AppCookies";

//}).AddPolicyScheme("AppCookies", "Cookies or JWT", options =>
//{
//    options.ForwardDefaultSelector = context =>
//    {
//        var bearerAuth = context.Request.Headers["Authorization"].FirstOrDefault()?.StartsWith("Bearer ") ?? false;
//        if (bearerAuth)
//            return JwtBearerDefaults.AuthenticationScheme;
//        else
//            return CookieAuthenticationDefaults.AuthenticationScheme;
//    };
//}).AddCookie(options =>
//{
//    options.Cookie.Name = "AppCookies";
//    options.LoginPath = new PathString("/auth/login");
//    options.AccessDeniedPath = "/Auth/Login"; ;
//    options.LogoutPath = new PathString("/auth/logout");
//    options.SlidingExpiration = true;
//    options.ExpireTimeSpan = TimeSpan.FromHours(1);

//}).AddJwtBearer(options =>
//{
//    options.SaveToken = true;
//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuer = true,
//        ValidIssuer = Constants.JwtToken.Issuer,
//        ValidateAudience = true,
//        ValidAudience = Constants.JwtToken.Audience,
//        ValidateIssuerSigningKey = true,
//        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Constants.JwtToken.SigningKey))
//    };
//});
#endregion

#region Configure Cookie Based Authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
    {
        options.Cookie.Name = CookieAuthenticationDefaults.AuthenticationScheme;
        options.LoginPath = new PathString("/auth/login");
        options.AccessDeniedPath = new PathString("/auth/login");
        options.LogoutPath = new PathString("/auth/logout");
        options.SlidingExpiration = true;
        options.ExpireTimeSpan = TimeSpan.FromHours(1);
    });
#endregion

#region Configure Authorization with Policy
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("HRAdmin", policy => policy.RequireClaim("Depertment", "HR")
                                              .RequireRole("Admin"));

    options.AddPolicy("AccountsAdmin", policy => policy.RequireClaim("Depertment", "Accounts")
                                             .RequireRole("Admin"));
});
#endregion

#region Configure Session
builder.Services.AddSession(options =>
{
    options.Cookie.HttpOnly = true; 
    options.IdleTimeout = TimeSpan.FromHours(1);
});
#endregion

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
