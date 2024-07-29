using System.ComponentModel.DataAnnotations;

namespace QuickAppUsingCookieAuthN.Server.Models.DTOs
{
    public class ResetPasswordM
    {
        [Required]
        public string? ResetToken { get; set; }

        [Required]
        public string? NewPassword { get; set; }
    }
}