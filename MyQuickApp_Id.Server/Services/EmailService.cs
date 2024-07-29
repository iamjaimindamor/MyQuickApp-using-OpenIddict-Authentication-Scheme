using Microsoft.AspNetCore.Identity;
using QuickAppUsingCookieAuthN.Server.Models;
using RestSharp;

namespace QuickAppUsingCookieAuthN.Server.Services
{
    public class EmailService : IEmailSender<ApplicationUser>
    {
        private readonly IConfiguration configuration;

        public EmailService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public Task SendConfirmationLinkAsync(ApplicationUser user, string email, string confirmationLink)
        {
            try
            {
                var TestCode = confirmationLink;
                var UserEmail = "jaimindamor123@gmail.com"; //replace it with {email}

                var client = new RestClient("https://send.api.mailtrap.io/api/send");
                var request = new RestRequest();
                request.AddHeader("Authorization", $"Bearer {configuration["email:api_key"]}");
                request.AddHeader("Content-Type", "application/json");

                string requestBody = "{\"from\":{\"email\":\"mailtrap@demomailtrap.com\",\"name\":\"Email Confirmation\"},\"to\":[{\"email\":\"" + UserEmail + "\"}],\"template_uuid\":\"1d5fadaa-8ebe-48e5-a96b-3194c889e8fe\",\"template_variables\":{\"emailT\":\"" + email + "\",\"tokenT\":\"" + TestCode + "\"}}";

                request.AddParameter("application/json", requestBody, ParameterType.RequestBody);

                client.Post(request);

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                return Task.FromException(ex);
            }
        }

        public Task SendPasswordResetCodeAsync(ApplicationUser user, string email, string resetCode)
        {
            var TestCode = resetCode;
            var UserEmail = "jaimindamor123@gmail.com"; //replace it with {email}

            var client = new RestClient("https://send.api.mailtrap.io/api/send");
            var request = new RestRequest();
            request.AddHeader("Authorization", $"Bearer {configuration["email:api_key"]}");
            request.AddHeader("Content-Type", "application/json");

            string requestBody = "{\"from\":{\"email\":\"mailtrap@demomailtrap.com\",\"name\":\"Password Reset Link\"},\"to\":[{\"email\":\"" + UserEmail + "\"}],\"template_uuid\":\"73647867-2051-44be-b5d0-8e33d3475772\",\"template_variables\":{\"emailT\":\"" + email + "\",\"tokenT\":\"" + TestCode + "\"}}";

            request.AddParameter("application/json", requestBody, ParameterType.RequestBody);

            client.Post(request);

            return Task.CompletedTask;
        }

        public Task SendPasswordResetLinkAsync(ApplicationUser user, string email, string resetLink)
        {
            throw new NotImplementedException();
        }
    }
}