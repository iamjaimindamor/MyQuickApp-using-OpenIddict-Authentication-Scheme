using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Abstractions;
using QuickAppUsingCookieAuthN.Server.Interfaces;
using QuickAppUsingCookieAuthN.Server.Models.AuthModels;

namespace QuickAppUsingCookieAuthN.Server.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthServices _authServices;
        private readonly IAuthorizationService _authorizationService;

        public AuthController(IAuthServices authServices, IAuthorizationService authorizationService)
        {
            _authServices = authServices;
            _authorizationService = authorizationService;
        }

        [Authorize]
        [HttpGet("Sign-Out")]
        public async Task<IActionResult> UserLogOut()
        {
            var result = await _authServices.LogOut();

            if (result.Item1)
            {
                return Ok(result.Item2);
            }
            else
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost("AssignRole")]
        public async Task<IActionResult> AssignRole(AssigningRoles assigningRoles)
        {
            var result = await _authServices.AssignRole(assigningRoles.Username!, assigningRoles.Rolename!);

            if (result.Item1)
            {
                return Ok(result.Item2);
            }
            else
            {
                return BadRequest(result.Item2);
            }
        }

        [HttpGet("Roles")]
        public async Task<IActionResult> AllRoles()
        {
            var result = await _authServices.AvailableRoles();

            return Ok(result);
        }

        //[Authorize(Roles = "ADMIN")]
        [HttpGet("FetchAllRoles")]
        public async Task<List<UsersRoleView>> FetchAllRoles()
        {
            return await _authServices.FetchAllUsersRole();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("RemoveAccess")]
        public async Task<IActionResult> RemoveAccess(string username, string rolename)
        {
            var result = await _authServices.DeleteUserRole(username, rolename);
            if (result.Item1)
            {
                return Ok(result.Item2);
            }
            return Ok(result.Item2);
        }

        [Authorize(Roles = "OWNER,ADMIN")]
        [HttpPost("Add_New_Role")]
        public async Task<IActionResult> AddNewRole(string RoleName)
        {
            var result = await _authServices.AddNewRole(RoleName);

            if (result.Item1)
            {
                return Ok(result.Item2);
            }
            else
            {
                return BadRequest(result.Item2);
            }
        }

        [HttpPost("SeedRoles")]
        public async Task<IActionResult> SeedRoles()
        {
            var result = await _authServices.SeedRolesinDB();
            if (result.Item1)
            {
                return Ok(result.Item2);
            }
            else
            {
                return BadRequest(result.Item2);
            }
        }

        [HttpPost("Confirm-Email")]
        public async Task<IActionResult> ConfirmEmail([FromForm] EmailToken tkn)
        {
            var result = await _authServices.ConfirmEmail(tkn.email!, tkn.token!);
            if (result)
            {
                return Redirect("https://myquickappapi.azurewebsites.net/Mail-Verified");
            }
            return Redirect("https://myquickappapi.azurewebsites.net/Mail-Verification-Failed");
        }

        [HttpPost("NewUserPassword")]
        public async Task<IActionResult> NewPasswordRequest(NewPasswordToken passModel)
        {
            var RequestStatus = await _authServices.NewPassword(passModel.email!, passModel.token!, passModel.newPass!);

            if (RequestStatus)
            {
                return Redirect("https://localhost:5173/Reset-Password/Success");
            }
            else
            {
                return Redirect("https://localhost:5173/Reset-Password/Failed");
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost("Block-User")]
        public async Task<IActionResult> BlockUser(BlockingUser blockData)
        {
            var USER = HttpContext.User.Claims.FirstOrDefault(x => x.Type == OpenIddictConstants.Claims.Username);

            var result = await _authServices.BlockUser(blockData, USER);

            if (result)
            {
                return Ok("User Blocked");
            }

            return BadRequest("Blocking Failed Try Again!");
        }

        [HttpGet("signin-google")]
        [Authorize(AuthenticationSchemes = GoogleDefaults.AuthenticationScheme)]
        public IActionResult GoogleSignIn()
        {
            return RedirectToActionPreserveMethod("SignedIn", "ExternalLogin");
        }
    }
}