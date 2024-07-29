using System.ComponentModel.DataAnnotations;

namespace QuickAppUsingCookieAuthN.Server.Models.DTOs
{
    public class UserView
    {
        public string? uniqueID { get; set; }
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public string? Email { get; set; }

        [Required]
        public string? UserName { get; set; }

        public string? PhoneNumber { get; set; } = null;
        public IList<string>? rolesList { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public string? LoginProvider { get; set; }
        public bool isBlocked { get; set; }
    }
}