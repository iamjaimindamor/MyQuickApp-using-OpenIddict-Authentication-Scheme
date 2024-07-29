using QuickAppUsingCookieAuthN.Server.Models;
using QuickAppUsingCookieAuthN.Server.Models.DTOs;

namespace QuickAppUsingCookieAuthN.Server.Interfaces
{
    public interface IUserServices
    {
        Task SeedAsync();
        Task<(bool, List<UserView>?)> GetAllUsers();

        Task<(bool, UserView?, ApplicationUser?)> GetUserByID(string id);

        Task<(bool, UserView?, ApplicationUser?)> GetUserByUsername(string Username);

        Task<(bool, UserView?, ApplicationUser?)> GetUser(string Email);

        Task<bool> GetUserByEmail(string Email);

        Task<bool> CreateUserService(UserCreation user, string password);

        Task<(bool, UserView?, string? error)> UpdateUserService(string user_id, UserEdit user);

        //Task<(bool, string StatusMessage)> UpdateUserPassword(string userID, UpdatePassword newCreds);
        Task<(bool, string?)> ForgotPassword(string userID);

        Task<(bool, string?)> ResetPassword(string userID, ResetPasswordM resetCredentials);

        Task<(bool, string?)> DeleteUserByID(string user_id);

        Task<(bool, string?)> DeleteUserByName(string username);

        Task<(bool, UserView?, string?)> userData(string username);
    }
}