using System.ComponentModel.DataAnnotations;

namespace QuickAppUsingCookieAuthN.Server.Models.DTOs
{
    public class UserCreation
    {
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public string? Email { get; set; }

        [Required]
        public string? UserName { get; set; }

        [Required]
        public string? CurrentPassword { get; set; } = null;

        public string? PhoneNumber { get; set; } = null;
        public string? LoginProvider { get; set; } = null;
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
    }
}