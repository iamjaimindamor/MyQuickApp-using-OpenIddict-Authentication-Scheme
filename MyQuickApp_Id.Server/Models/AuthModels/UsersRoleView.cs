namespace QuickAppUsingCookieAuthN.Server.Models.AuthModels
{
    public class UsersRoleView
    {
        public string? user_id { get; set; }
        public string? UserName { get; set; }
        public IList<string>? Roles { get; set; }
    }
}