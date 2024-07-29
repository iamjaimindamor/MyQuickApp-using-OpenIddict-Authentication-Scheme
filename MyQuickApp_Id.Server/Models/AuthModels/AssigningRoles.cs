using System.ComponentModel.DataAnnotations;

namespace QuickAppUsingCookieAuthN.Server.Models.AuthModels
{
    public class AssigningRoles
    {
        [Required]
        public string? Username { get; set; }

        [Required]
        public string? Rolename { get; set; }
    }
}