using QuickAppUsingCookieAuthN.Server.Models;
using QuickAppUsingCookieAuthN.Server.Models.AuthModels;
using System.Security.Claims;

namespace QuickAppUsingCookieAuthN.Server.Interfaces
{
    public interface IAuthServices
    {
        Task<bool> ConfirmEmail(string email, string token);

        Task<(bool, string)> LogOut();

        Task<(bool, string)> SeedRolesinDB();

        Task<(bool, string)> AddNewRole(string RoleName);

        Task<(bool, string)> AssignRole(string Username, string Rolename);

        Task<List<UsersRoleView>> FetchAllUsersRole();

        Task<(bool, string)> DeleteUserRole(string Username, string Rolename);

        Task<bool> NewPassword(string email, string token, string newPass);

        Task<List<ApplicationRole>> AvailableRoles();

        Task<bool> BlockUser(BlockingUser block, Claim currentUser);
    }
}