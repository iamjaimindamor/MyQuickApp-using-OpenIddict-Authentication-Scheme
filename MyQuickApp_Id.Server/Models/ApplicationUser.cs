using Microsoft.AspNetCore.Identity;

namespace QuickAppUsingCookieAuthN.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool isBlocked { get; set; } = false;
        public string? LoginProvider { get; set; }
    }
}