using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Abstractions;
using QuickAppUsingCookieAuthN.Server.Interfaces;
using QuickAppUsingCookieAuthN.Server.Models.AuthModels;
using QuickAppUsingCookieAuthN.Server.Models.DTOs;

namespace QuickAppUsingCookieAuthN.Server.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserServices _userServices;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserController(IUserServices userServices, IHttpContextAccessor httpContextAccessor)
        {
            _userServices = userServices;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateUser(UserCreation userData)
        {
            string Password = userData.CurrentPassword!;

            if (await _userServices.CreateUserService(userData, Password))
            {
                return Ok(userData.UserName + " User Created Successfully");
            }
            else
            {
                return BadRequest("User Creation Failed :\n >>Try Entering Unique Username & Strong Password.\n >>User May Already Exist.");
            }
        }

        [HttpGet("All")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> FetchAll()
        {
            var result = await _userServices.GetAllUsers();
            if (result.Item1)
            {
                return Ok(result.Item2);
            }
            else
            {
                return BadRequest("No Data Found");
            }
        }

        [HttpGet("ReadByName")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> FetchUser(string username)
        {
            var User = await _userServices.GetUserByUsername(username);

            if (User.Item1)
            {
                return Ok(User.Item2);
            }
            else
            {
                return BadRequest("ERROR : User Data Not Found");
            }
        }

        [HttpGet("isUserByName")]
        public async Task<IActionResult> AlreadyAUser(string username)
        {
            var User = await _userServices.GetUserByUsername(username);

            if (User.Item1)
            {
                return Ok(User.Item1);
            }
            else
            {
                return Ok(User.Item1);
            }
        }

        [HttpGet("isUserByEmail")]
        public async Task<IActionResult> EmailInUse(string email)
        {
            var isUser = await _userServices.GetUserByEmail(email);

            return Ok(isUser);
        }

        [HttpGet("Current")]
        [Authorize(Roles = "USER")]
        public async Task<IActionResult> UserData()
        {
            var Email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == OpenIddictConstants.Claims.Email);

            var CurrentUser = await _userServices.userData(Email!.Value);

            if (!CurrentUser.Item1)
            {
                return BadRequest(CurrentUser.Item3);
            }
            else
            {
                return Ok(CurrentUser.Item2);
            }
        }

        [Authorize(Roles = "USER")]
        [HttpGet("ReadByID")]
        public async Task<IActionResult> FetchUserByID(string id)
        {
            var User = await _userServices.GetUserByID(id);
            if (User.Item1)
            {
                return Ok(User.Item2);
            }
            else
            {
                return BadRequest("ERROR : User Data Not Found");
            }
        }

        [HttpPut("Update")]
        [Authorize(Roles = "ADMIN,USER")]
        public async Task<IActionResult> UpdateUser(string UserID, UserEdit UpdateData)
        {
            var result = await _userServices.UpdateUserService(UserID, UpdateData);
            if (result.Item1)
            {
                return Ok(result.Item2);
            }
            else if (result.Item3!.Contains("FORBIDDEN"))
            {
                return StatusCode(403, result.Item3);
            }
            else
            {
                return BadRequest(result.Item3);
            }
        }

        [HttpPost("FetchReset")]
        public async Task<IActionResult> FetchResetToken(ResetRequest resetReq)
        {
            var result = await _userServices.ForgotPassword(resetReq.Username!);
            if (result.Item1)
            {
                return Ok(result.Item2);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetSignInCredential(string userID, ResetPasswordM resetModel)
        {
            var result = await _userServices.ResetPassword(userID, resetModel);

            if (result.Item1)
            {
                return Ok(result.Item2);
            }
            else
            {
                return BadRequest(result.Item2);
            }
        }

        [HttpDelete("ID")]
        [Authorize(Roles = "ADMIN,USER")]
        public async Task<IActionResult> DeleteByID(string user_id)
        {
            var result = await _userServices.DeleteUserByID(user_id);
            if (result.Item1)
            {
                return Ok(result.Item2);
            }
            else if (result.Item2!.Contains("FORBIDDEN"))
            {
                return StatusCode(403, result.Item2!);
            }
            else
            {
                return BadRequest(result.Item2);
            }
        }

        [HttpDelete("Username")]
        [Authorize(Roles = "ADMIN,USER")]
        public async Task<IActionResult> DeleteByName(string Username)
        {
            var result = await _userServices.DeleteUserByName(Username);
            if (result.Item1)
            {
                return Ok(result.Item2);
            }
            else if (result.Item2!.Contains("FORBIDDEN"))
            {
                return StatusCode(403, result.Item2!);
            }
            else
            {
                return BadRequest(result.Item2);
            }
        }
    }
}