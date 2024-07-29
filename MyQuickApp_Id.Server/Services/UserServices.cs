using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OpenIddict.Abstractions;
using QuickAppUsingCookieAuthN.Server.Interfaces;
using QuickAppUsingCookieAuthN.Server.Models;
using QuickAppUsingCookieAuthN.Server.Models.DbContext;
using QuickAppUsingCookieAuthN.Server.Models.DTOs;
using QuickAppUsingCookieAuthN.Server.Models.Roles;
using System.Security.Claims;

namespace QuickAppUsingCookieAuthN.Server.Services
{
    public class UserServices : IUserServices
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly IEmailSender<ApplicationUser> _emailsender;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AppDbContext _appDbContext;

        public UserServices(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IMapper mapper, IEmailSender<ApplicationUser> emailsender, SignInManager<ApplicationUser> signInManager, IHttpContextAccessor httpContextAccessor, AppDbContext appDbContext)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
            _emailsender = emailsender;
            _signInManager = signInManager;
            _httpContextAccessor = httpContextAccessor;
            _appDbContext = appDbContext;
        }

        //seed

        public async Task SeedAsync()
        {
            await _appDbContext.Database.MigrateAsync();
        }

        //-----------------------------CREATE------------------------------------------------------
        public async Task<bool> CreateUserService(UserCreation user, string password)
        {
            var isUser = await _userManager.FindByEmailAsync(user.Email!);

            if (user == null || password == null && isUser != null)
            {
                return false;
            }
            else
            {
                ApplicationUser NewUser = _mapper.Map<ApplicationUser>(user);
                var result = await _userManager.CreateAsync(NewUser, password!);

                if (result.Succeeded)
                {
                    var claims = new List<Claim>
                    {
                        new Claim("FirstName",NewUser.Firstname!),
                        new Claim(ClaimTypes.Surname,NewUser.Lastname!),
                    };

                    await _userManager.AddClaimsAsync(NewUser, claims);
                    var regUser = await _userManager.FindByEmailAsync(NewUser.Email!);

                    if (regUser != null && regUser.EmailConfirmed == false)
                    {
                        //defaulted USER ROLE
                        await _userManager.AddToRoleAsync(regUser, Static_Roles.USER);

                        var confirmToken = await _userManager.GenerateEmailConfirmationTokenAsync(regUser);

                        await _emailsender.SendConfirmationLinkAsync(regUser, regUser.Email!, confirmToken);
                    }

                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        //-----------------------READ---------------------------------------------------------------

        public async Task<(bool, List<UserView>?)> GetAllUsers()
        {
            List<ApplicationUser> usersList = _userManager.Users.ToList();

            List<UserView> users = new List<UserView>();

            if (usersList != null)
            {
                foreach (ApplicationUser user in usersList)
                {
                    IList<string> roles = await _userManager.GetRolesAsync(user);
                    var appendUser = _mapper.Map<UserView>(user);
                    appendUser.rolesList = roles;
                    users.Add(appendUser);
                }
            }
            else
            {
                return (false, null);
            }

            return (true, users);
        }

        public async Task<(bool, UserView?, ApplicationUser?)> GetUserByUsername(string Username)
        {
            if (Username == null)
            {
                return (false, null, null);
            }
            else
            {
                var result = await _userManager.FindByNameAsync(Username);
                if (result != null)
                {
                    var UserData = _mapper.Map<UserView>(result);
                    UserData.rolesList = await _userManager.GetRolesAsync(result);
                    return (true, UserData, result);
                }
                else
                {
                    return (false, null, null);
                }
            }
        }

        public async Task<(bool, UserView?, ApplicationUser?)> GetUserByID(string id)
        {
            if (id == null)
            {
                return (false, null, null);
            }
            else
            {
                var result = await _userManager.FindByIdAsync(id);
                if (result != null)
                {
                    var UserData = _mapper.Map<UserView>(result);
                    UserData.rolesList = await _userManager.GetRolesAsync(result);
                    return (true, UserData, result);
                }
                else
                {
                    return (false, null, null);
                }
            }
        }

        public async Task<bool> GetUserByEmail(string email)
        {
            var isUser = await _userManager.FindByEmailAsync(email);

            if (isUser != null)
            {
                return true;//true that user exists
            }
            else
            {
                return false;
            }
        }

        //---------------------UPDATE--------------------------------------------------------
        public async Task<(bool, UserView?, string?)> UpdateUserService(string user_id, UserEdit user)
        {
            var isAdmin = _httpContextAccessor.HttpContext!.User.HasClaim(OpenIddictConstants.Claims.Role, Static_Roles.ADMIN);

            var isDataOwner = _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(x => x.Type == OpenIddictConstants.Claims.Email);

            if (user == null)
            {
                return (false, null, "Update Data Fields Are Not Provided");
            }
            else
            {
                var result = await GetUserByID(user_id);
                ApplicationUser UpdateUser = result.Item3!;

                if (UpdateUser.Email == isDataOwner!.Value)
                {
                    var isUsernameUpdated = !(UpdateUser.UserName!.Equals(user.UserName));
                    var isPasswordUpdated = !(string.IsNullOrWhiteSpace(user.NewPassword));

                    if (isUsernameUpdated)
                    {
                        var UsernameExist = await GetUserByUsername(user.UserName!);

                        if (UsernameExist.Item1)
                        {
                            return (false, null, "ERROR:Username Already Exists");
                        }
                    }

                    if (isPasswordUpdated)
                    {
                        try
                        {
                            if (result.Item3!.LoginProvider == "Goolge")
                            {
                                throw new Exception("User Logged In Using Google Account");
                            }

                            UpdatePassword credentials = new UpdatePassword();

                            credentials.NewPassword = user.NewPassword;
                            credentials.CurrentPassword = user.CurrentPassword;

                            var PassUpdateRequest = await UpdateUserPassword(user_id, credentials);

                            if (!PassUpdateRequest.Item1)
                            {
                                throw new Exception("Password Update Failed");
                            }
                        }
                        catch (Exception ex)
                        {
                            return (false, null, ex.Message);
                        }
                    }

                    ApplicationUser UpdatedUser = _mapper.Map(user, UpdateUser);

                    var outcome = await _userManager.UpdateAsync(UpdatedUser);

                    if (outcome.Succeeded)
                    {
                        var Updated_User = _mapper.Map<UserView>(UpdateUser);
                        Updated_User.rolesList = await _userManager.GetRolesAsync(result.Item3!);
                        return (true, Updated_User, null);
                    }
                    else
                    {
                        return (false, null, "ERROR:Updating Data Failed");
                    }
                }
                else
                {
                    return (false, null, "ERROR:FORBIDDEN ACTION");
                }
            }
        }

        private async Task<(bool, string)> UpdateUserPassword(string user_id, UpdatePassword newCreds)
        {
            if (user_id != null && newCreds.CurrentPassword != null && newCreds.NewPassword != null)
            {
                var isUser = await GetUserByID(user_id);

                if (isUser.Item1)
                {
                    ApplicationUser UserToUpdate = isUser.Item3!;

                    string CurrentPassword = newCreds.CurrentPassword!;

                    string NewPassword = newCreds.NewPassword!;

                    var result = await _userManager.ChangePasswordAsync(UserToUpdate, CurrentPassword, NewPassword);

                    if (result.Succeeded)
                    {
                        return (true, "Password Updated Successfully");
                    }
                    else
                    {
                        return (false, "Update Failed");
                    }
                }

                return (false, "User Not Found");
            }
            else
            {
                return (false, "NULL REFERENCE PASSED");
            }
        }

        public async Task<(bool, string?)> ForgotPassword(string username)
        {
            if (username == null)
            {
                return (false, null);
            }
            else
            {
                var User = await GetUserByUsername(username);

                if (User.Item3 != null)
                {
                    var isUser = await GetUserByID(User.Item3.Id);

                    if (isUser.Item1 && isUser.Item3!.LoginProvider != "Google")
                    {
                        var resetToken = await _userManager.GeneratePasswordResetTokenAsync(isUser.Item3!);
                        await _emailsender.SendPasswordResetCodeAsync(isUser.Item3!, isUser.Item3!.Email!, resetToken);
                        return (true, $"ResetToken :SENT TO EMAIL");
                        //return (true, "ResetToken Sent To Email");
                    }
                    else
                    {
                        return (false, "User Logged In Using Google Account . Go To Google Account Manager");
                    }
                }
                else
                {
                    return (false, null);
                }
            }
        }

        public async Task<(bool, string?)> ResetPassword(string user_id, ResetPasswordM resetCredentials)
        {
            if (user_id == null && resetCredentials == null)
            {
                return (false, null);
            }
            else
            {
                var isUser = await GetUserByID(user_id!);

                if (isUser.Item1 && resetCredentials.ResetToken != null && resetCredentials.NewPassword != null)
                {
                    try
                    {
                        var result = await _userManager.ResetPasswordAsync(isUser.Item3!, resetCredentials.ResetToken, resetCredentials.NewPassword);
                        if (result.Succeeded)
                        {
                            return (true, "Password Reset Successfully");
                        }
                        else
                        {
                            throw new Exception("Password Reset Failed");
                        }
                    }
                    catch (Exception ex)
                    {
                        return (false, ex.Message);
                    }
                }
                else
                {
                    return (false, "User do not exist or Reset Token is null");
                }
            }
        }

        //--------------------------DELETE------------------------------------------------------
        public async Task<(bool, string?)> DeleteUserByID(string user_id)
        {
            if (user_id == null)
            {
                return (false, null);
            }
            else
            {
                var isUser = await GetUserByID(user_id);

                if (!isUser.Item1) { return (false, "USER DOES NOT EXIST"); }

                var claim = _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(x => x.Type == OpenIddictConstants.Claims.Email);

                bool isAdmin = _httpContextAccessor.HttpContext.User.HasClaim(OpenIddictConstants.Claims.Role, Static_Roles.ADMIN);

                try
                {
                    if (isUser.Item1 && (isUser.Item3!.Email == claim!.Value || isAdmin))
                    {
                        var result = await _userManager.DeleteAsync(isUser.Item3!);

                        //if admin deletes someone elses account the identity cookie must be retained
                        if (isUser.Item3!.Email == claim!.Value)
                        {
                            //cleanout old cookies
                            await _signInManager.SignOutAsync();
                            return (true, $"User {isUser.Item2!.UserName} Deleted!");
                        }

                        return (true, $"User {isUser.Item2!.UserName} Deleted! By Admin");
                    }
                    else
                    {
                        throw new Exception("ERROR:FORBIDDEN ACTION");
                    }
                }
                catch (Exception ex)
                {
                    return (false, ex.Message);
                }
            }
        }

        public async Task<(bool, string?)> DeleteUserByName(string username)
        {
            if (username == null)
            {
                return (false, null);
            }
            else
            {
                var isUser = await GetUserByUsername(username);

                if (!isUser.Item1) { return (false, "USER DOES NOT EXIST"); }

                var claim = _httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(x => x.Type == OpenIddictConstants.Claims.Email);

                bool isAdmin = _httpContextAccessor.HttpContext.User.HasClaim(OpenIddictConstants.Claims.Role, Static_Roles.ADMIN);

                try
                {
                    if (isUser.Item1 && (isUser.Item3!.Email == claim!.Value || isAdmin))
                    {
                        var result = await _userManager.DeleteAsync(isUser.Item3!);

                        if (isUser.Item3!.Email == claim!.Value)
                        {
                            await _signInManager.SignOutAsync();
                        }

                        return (true, "User Deleted!");
                    }
                    else
                    {
                        throw new Exception("ERROR:FORBIDDEN ACTION");
                    }
                }
                catch (Exception ex)
                {
                    return (false, ex.Message);
                }
            }
        }

        public async Task<(bool, UserView?, string?)> userData(string email)
        {
            var user = _httpContextAccessor.HttpContext.User.Claims;

            if (email != null)
            {
                var User = await GetUser(email);

                if (User.Item2 == null)
                {
                    return (false, null, null);
                }
                else
                {
                    return (true, User.Item2, "User Found");
                }
            }
            else
            {
                return (false, null, "User Not Logged In");
            }
        }

        public async Task<(bool, UserView?, ApplicationUser?)> GetUser(string Email)
        {
            if (Email == null)
            {
                return (false, null, null);
            }
            else
            {
                var result = await _userManager.FindByEmailAsync(Email);
                if (result != null)
                {
                    var UserData = _mapper.Map<UserView>(result);
                    UserData.rolesList = await _userManager.GetRolesAsync(result);
                    return (true, UserData, result);
                }
                else
                {
                    return (false, null, null);
                }
            }
        }
    }
}