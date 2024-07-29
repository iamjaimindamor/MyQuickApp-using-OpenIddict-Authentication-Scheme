using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QuickAppUsingCookieAuthN.Server.Interfaces;
using QuickAppUsingCookieAuthN.Server.Models;
using QuickAppUsingCookieAuthN.Server.Models.AuthModels;
using QuickAppUsingCookieAuthN.Server.Models.Roles;
using System.Security.Claims;

namespace QuickAppUsingCookieAuthN.Server.Services
{
    public class AuthServices : IAuthServices
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IEmailSender<ApplicationUser> _sender;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthServices(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IEmailSender<ApplicationUser> sender, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _sender = sender;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<(bool, string)> LogOut()
        {
            try
            {
                await _signInManager.SignOutAsync();
            }
            catch
            {
                return (false, "LOGOUT FAILED");
            }

            return (true, "USER LOGGED OUT");
        }

        public async Task<(bool, string)> AssignRole(string Username, string RolenamE)
        {
            string Rolename = RolenamE.ToUpper();

            var isUser = await _userManager.FindByNameAsync(Username) ?? await _userManager.FindByEmailAsync(Username) ?? await _userManager.FindByIdAsync(Username);

            if (isUser != null)
            {
                if (await _roleManager.RoleExistsAsync(Rolename))
                {
                    if (await _userManager.IsInRoleAsync(isUser, Rolename))
                    {
                        return (false, $"{isUser.UserName} Already Has {Rolename} Access");
                    }

                    await _userManager.AddToRoleAsync(isUser, Rolename);

                    return (true, $"{isUser.UserName} now has {Rolename} Access");
                }
                return (false, "Role Not Found in Organization");
            }
            return (false, "User Does Not Exist");
        }

        public async Task<(bool, string)> AddNewRole(string RoleName)
        {
            if (!await _roleManager.RoleExistsAsync(RoleName.ToUpper()))
            {
                var result = new ApplicationRole { Name = RoleName.ToUpper() };
                await _roleManager.CreateAsync(result!);
                return (true, $"{RoleName.ToUpper()} Role Added");
            }

            return (false, "Role Already Exists");
        }

        public async Task<(bool, string)> SeedRolesinDB()
        {
            if (!await _roleManager.RoleExistsAsync(Static_Roles.OWNER))
            {
                var result = new ApplicationRole { Name = Static_Roles.OWNER };
                await _roleManager.CreateAsync(result!);
            }

            if (!await _roleManager.RoleExistsAsync(Static_Roles.ADMIN))
            {
                var result2 = new ApplicationRole { Name = Static_Roles.ADMIN };
                await _roleManager.CreateAsync(result2!);
            }

            if (!await _roleManager.RoleExistsAsync(Static_Roles.USER))
            {
                var result3 = new ApplicationRole { Name = Static_Roles.USER };
                await _roleManager.CreateAsync(result3!);
            }

            return (true, "Roles Seed Successfully");
        }

        public async Task<List<ApplicationRole>> AvailableRoles()
        {
            var allroles = await _roleManager.Roles.ToListAsync();

            return allroles;
        }

        public async Task<bool> ConfirmEmail(string email, string token)
        {
            var User = await _userManager.FindByEmailAsync(email);
            if (User == null)
            {
                return false;
            }
            var result = await _userManager.ConfirmEmailAsync(User, token);

            if (result.Succeeded)
            {
                return true;
            }
            return false;
        }

        public async Task<bool> NewPassword(string email, string token, string newPass)
        {
            var User = await _userManager.FindByEmailAsync(email);
            if (User == null)
            {
                return false;
            }
            var result = await _userManager.ResetPasswordAsync(User, token, newPass);
            if (result.Succeeded)
            {
                return true;
            }
            return false;
        }

        public async Task<List<UsersRoleView>> FetchAllUsersRole()
        {
            var UserRole = _userManager.Users.ToList();

            List<UsersRoleView> result = new List<UsersRoleView>();

            foreach (var item in UserRole)
            {
                var roles = await _userManager.GetRolesAsync(item);
                var RoleView = _mapper.Map<UsersRoleView>(item);
                RoleView.Roles = roles;
                result.Add(RoleView);
            }
            return result;
        }

        public async Task<(bool, string)> DeleteUserRole(string Username, string ROLename)
        {
            string Rolename = ROLename.ToUpper();

            var isUser = await _userManager.FindByNameAsync(Username);

            var UserHasRole = await _userManager.IsInRoleAsync(isUser!, ROLename);

            if (UserHasRole)
            {
                await _userManager.RemoveFromRoleAsync(isUser!, Rolename);
                return (true, $"{Rolename} ACCESS IS REMOVED FROM USER {Username}");
            }

            return (false, $"{Username} Do Not Have {Rolename} ACCESS");
        }

        public async Task<bool> BlockUser(BlockingUser blocking, Claim CURRENT_USER)
        {
            if (blocking.Username == null)
            {
                return false;
            }

            var isUser = await _userManager.FindByNameAsync(blocking.Username);

            if (isUser == null)
            {
                return false;
            }

            if (CURRENT_USER.Value == isUser.UserName)
            {
                return false;
            }
            else
            {
                isUser.isBlocked = blocking.value;
                await _userManager.UpdateAsync(isUser);
                return true;
            }
        }
    }
}