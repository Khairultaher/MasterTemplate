using MasterTemplate.Common.Utilities;
using MasterTemplate.Data;
using MasterTemplate.Service.Database;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

#region Constants

#endregion

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<ApplicationDbContext>(options => {
    //options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
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
else {
    app.UseExceptionHandler("/Home/Error");
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
