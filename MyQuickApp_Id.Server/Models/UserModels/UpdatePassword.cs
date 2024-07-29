using System.ComponentModel.DataAnnotations;

namespace QuickAppUsingCookieAuthN.Server.Models.DTOs
{
    public class UpdatePassword
    {
        [Required]
        public string? CurrentPassword { get; set; }

        [Required]
        public string? NewPassword { get; set; }
    }
}