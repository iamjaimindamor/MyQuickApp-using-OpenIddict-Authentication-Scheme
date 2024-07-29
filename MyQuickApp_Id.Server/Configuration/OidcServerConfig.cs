using OpenIddict.Abstractions;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace QuickAppUsingCookieAuthN.Server.Configuration
{
    public class OidcServerConfig
    {
        public const string ServerName = "MyQuickApp_OIDC_Auth_Server";
        public const string client_id = "MyQuickApp_ReactClient";

        public static async Task RegisterClient(IServiceProvider serviceProvider)
        {
            var manager = serviceProvider.GetRequiredService<IOpenIddictApplicationManager>();

            if (await manager.FindByClientIdAsync(client_id) == null)
            {
                await manager.CreateAsync(new OpenIddictApplicationDescriptor
                {
                    ClientId = client_id,
                    ClientType = ClientTypes.Public,
                    DisplayName = "MyQuickApp React-Client",
                    Permissions =
                    {
                        Permissions.Endpoints.Token,
                        Permissions.GrantTypes.Password,
                        Permissions.GrantTypes.RefreshToken,
                        Permissions.Scopes.Profile,
                        Permissions.Scopes.Email,
                        Permissions.Scopes.Phone,
                        Permissions.Scopes.Address,
                        Permissions.Scopes.Roles
                    }
                });
            }
        }
    }
}