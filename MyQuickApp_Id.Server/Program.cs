using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using OpenIddict.Abstractions;
using OpenIddict.Validation.AspNetCore;
using QuickAppUsingCookieAuthN.Server.Configuration;
using QuickAppUsingCookieAuthN.Server.Interfaces;
using QuickAppUsingCookieAuthN.Server.Models;
using QuickAppUsingCookieAuthN.Server.Models.DbContext;
using QuickAppUsingCookieAuthN.Server.Services;
using Swashbuckle.AspNetCore.Filters;
using static OpenIddict.Abstractions.OpenIddictConstants;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;

var builder = WebApplication.CreateBuilder(args);

var migrationsAssembly = typeof(Program).GetTypeInfo().Assembly.GetName().Name;

var corsname = "_cors";

// Add DB.
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("ConnectionStrings1"), b => b.MigrationsAssembly(migrationsAssembly));
    options.UseOpenIddict();
});

builder.Services.AddOpenIddict().AddCore(options =>
{
    options.UseEntityFrameworkCore().UseDbContext<AppDbContext>();
}
).AddServer(options =>
{
    options.SetTokenEndpointUris("connect/token");

    options.AllowPasswordFlow();

    options.AllowRefreshTokenFlow();

    options.RegisterScopes(Scopes.Profile, Scopes.Email, Scopes.Address, Scopes.Roles, Scopes.OfflineAccess, Scopes.OpenId);

    options.UseAspNetCore().EnableTokenEndpointPassthrough();

    if (builder.Environment.IsDevelopment())
    {
        options.AddDevelopmentEncryptionCertificate()
               .AddDevelopmentSigningCertificate();
    }
    else
    {
        var oidcCertFileName = builder.Configuration["OIDC:Certificates:Path"];
        var oidcCertFilePassword = builder.Configuration["OIDC:Certificates:Password"];

        if (string.IsNullOrWhiteSpace(oidcCertFileName))
        {
            // You must configure persisted keys for Encryption and Signing.
            // See https://documentation.openiddict.com/configuration/encryption-and-signing-credentials.html
            options.AddEphemeralEncryptionKey()
                   .AddEphemeralSigningKey();
        }
        else
        {
            var oidcCertificate = new X509Certificate2(oidcCertFileName, oidcCertFilePassword);

            options.AddEncryptionCertificate(oidcCertificate)
                   .AddSigningCertificate(oidcCertificate);
        }
    }
}).AddValidation(
    options =>
    {
        options.UseLocalServer();
        options.UseAspNetCore();
    }
    );

//Add Identity and Configure Identity
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options => options.SignIn.RequireConfirmedEmail = true).AddEntityFrameworkStores<AppDbContext>().AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.ClaimsIdentity.UserNameClaimType = OpenIddictConstants.Claims.Username;
    options.ClaimsIdentity.UserIdClaimType = OpenIddictConstants.Claims.Subject;
    options.ClaimsIdentity.RoleClaimType = OpenIddictConstants.Claims.Role;
    options.ClaimsIdentity.EmailClaimType = OpenIddictConstants.Claims.Email;
});

//Add Authentication Scheme
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
    options.RequireAuthenticatedSignIn = false;
    options.DefaultAuthenticateScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
});

//DI For UserServices
builder.Services.AddScoped<IEmailSender<ApplicationUser>, EmailService>();

builder.Services.AddTransient<IUserServices, UserServices>();
builder.Services.AddTransient<IAuthServices, AuthServices>();

builder.Services.AddCors(o =>
{
    o.AddPolicy(name: "_cors", policy =>
    {
        policy.AllowAnyOrigin();
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
    });
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

//config AutoMapper For DTOs
builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme()
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        BearerFormat = "Bearer"
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
    app.UseSwagger();
    app.UseSwaggerUI();


//app.UseHttpsRedirection();
app.UseCors(corsname);
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

//Registering Client For Authorization And Authentication in IdentityProvider Database

using var scope = app.Services.CreateScope();

try
{
    var dbseeder = scope.ServiceProvider.GetRequiredService<IUserServices>();
    await dbseeder.SeedAsync();
    await OidcServerConfig.RegisterClient(scope.ServiceProvider);
    Console.WriteLine("OIDC Server Started..");
}
catch
{
    Console.WriteLine("Error Occured in OIDC Server Startup....");
}

app.Run();