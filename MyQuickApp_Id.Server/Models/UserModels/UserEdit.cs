using System.ComponentModel.DataAnnotations;

namespace QuickAppUsingCookieAuthN.Server.Models.DTOs
{
    public class UserEdit
    {
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public string? Email { get; set; }

        [Required]
        public string? UserName { get; set; }

        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? ModifiedAt { get; set; } = DateTime.Now;
    }
}