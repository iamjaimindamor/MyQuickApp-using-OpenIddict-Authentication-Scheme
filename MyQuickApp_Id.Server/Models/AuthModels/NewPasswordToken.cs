namespace QuickAppUsingCookieAuthN.Server.Models.AuthModels
{
    public class NewPasswordToken
    {
        public string? email { get; set; }
        public string? token { get; set; }
        public string? newPass { get; set; }
    }
}