using MasterTemplate.Common.Utilities;
using MasterTemplate.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// Add Services to the container
var builder = WebApplication.CreateBuilder(args);

#region Configuration
builder.Configuration.AddJsonFile($"appsettings.json", false, true);
var env = builder.Configuration.GetSection("Environment").Value;
builder.Configuration.AddJsonFile($"appsettings.{env}.json", false, true);
//IConfiguration configuration = new ConfigurationBuilder().AddJsonFile($"appsettings.{env}.json").Build();                           .Build();
IConfiguration configuration = builder.Configuration;
#endregion

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

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


#region Configure Token Based Authentication 

builder.Services.AddAuthentication(options=> {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
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
//builder.Services.AddSession(options =>
//{
//    options.Cookie.HttpOnly = true;
//    options.IdleTimeout = TimeSpan.FromHours(1);
//});
#endregion

#region Data Service
//builder.Services.AddScoped<ProductService>();
#endregion


// Configure the HTTP request pipeline.
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseEndpoints(endpoints =>
{
    endpoints.MapGet("/", async context => {
        await context.Response.WriteAsync("Yes, I am on...");
    });
});

app.Run();
