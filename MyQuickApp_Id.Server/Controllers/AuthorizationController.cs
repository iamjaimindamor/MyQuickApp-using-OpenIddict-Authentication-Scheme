using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using OpenIddict.Validation.AspNetCore;
using QuickAppUsingCookieAuthN.Server.Models;
using System.Collections.Immutable;
using System.Security.Claims;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace QuickAppUsingCookieAuthN.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorizationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender<ApplicationUser> _emailSender;

        public AuthorizationController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IEmailSender<ApplicationUser> emailSender)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
        }

        [HttpPost("~/connect/token")]
        [Produces("application/JSON")]
        public async Task<IActionResult> Exchange()
        {
            var request = HttpContext.GetOpenIddictServerRequest();

            if (request.IsPasswordGrantType())
            {
                if (request!.Username == null || request.Password == null) { return BadRequest("Username OR Password Cannot Be Empty"); }

                var isUser = await _userManager.FindByNameAsync(request.Username);

                if (isUser == null)
                {
                    return BadRequest("User Does Not Exist");
                }

                if (isUser.isBlocked == true)
                {
                    return BadRequest("User Blocked");
                }

                if (isUser.EmailConfirmed == false)
                {
                    if (!isUser.EmailConfirmed)
                    {
                        var code = await _userManager.GenerateEmailConfirmationTokenAsync(isUser);

                        await _emailSender.SendConfirmationLinkAsync(isUser, isUser.Email!, code);

                        return BadRequest("Confirm Your Email To Continue");
                    }

                    return BadRequest("User Mail Not Confirmed");
                }
                ////Clean Sign Up
                SignOut(OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme);

                var result = await _signInManager.CheckPasswordSignInAsync(isUser, request.Password, false);

                if (result.Succeeded)
                {
                    var claims = await _userManager.GetClaimsAsync(isUser);
                    var principal = await CreateUserClaimPrincipal(isUser, request.GetScopes());

                    return SignIn(principal, OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
                }
                else
                {
                    return BadRequest("Invalid Credentials");
                }
            }
            else if (request.IsRefreshTokenGrantType())
            {
                var result = await HttpContext.AuthenticateAsync(OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);

                var userEmail = result.Principal?.Claims.FirstOrDefault(x => x.Type == OpenIddictConstants.Claims.Email);
                var isUser = userEmail != null ? await _userManager.FindByEmailAsync(userEmail.Value) : null;

                if (isUser == null)
                {
                    return BadRequest("User Not Found");
                }
                else if (isUser != null)
                {
                    var claims = await _userManager.GetClaimsAsync(isUser);

                    var principal = await CreateUserClaimPrincipal(isUser, request.GetScopes());
                    return SignIn(principal, OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
                }
                return Unauthorized();
            }

            throw new InvalidOperationException($"The specified grant type \"{request.GrantType}\" is not supported.");
        }

        private async Task<ClaimsPrincipal> CreateUserClaimPrincipal(ApplicationUser user, ImmutableArray<string> scopes)
        {
            var principal = await _signInManager.CreateUserPrincipalAsync(user);
            principal.SetScopes(scopes);
            principal.SetDestinations(GetDestinations);
            return principal;
        }

        private static IEnumerable<string> GetDestinations(Claim claim)
        {
            if (claim.Subject == null)
                throw new InvalidOperationException("The Claim's Subject is null.");

            switch (claim.Type)
            {
                case Claims.Username:
                    yield return Destinations.AccessToken;
                    if (claim.Subject.HasScope(Scopes.Profile))
                        yield return Destinations.IdentityToken;

                    yield break;

                case Claims.Email:
                    yield return Destinations.AccessToken;
                    if (claim.Subject.HasScope(Scopes.Email))
                        yield return Destinations.IdentityToken;

                    yield break;

                case Claims.Role:
                    yield return Destinations.AccessToken;
                    if (claim.Subject.HasScope(Scopes.Roles))
                        yield return Destinations.IdentityToken;

                    yield break;

                // IdentityOptions.ClaimsIdentity.SecurityStampClaimType
                case "AspNet.Identity.SecurityStamp":
                    // Never include the security stamp in the access and identity tokens, as it's a secret value.
                    yield break;

                default:
                    yield return Destinations.AccessToken;
                    yield break;
            }
        }
    }
}