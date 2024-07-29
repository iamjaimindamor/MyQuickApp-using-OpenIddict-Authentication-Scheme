using AutoMapper;
using QuickAppUsingCookieAuthN.Server.Models;
using QuickAppUsingCookieAuthN.Server.Models.AuthModels;
using QuickAppUsingCookieAuthN.Server.Models.DTOs;

namespace QuickAppUsingCookieAuthN.Server.MapperProfiles
{
    public class UsersProfile : Profile
    {
        public UsersProfile()
        {
            CreateMap<UserCreation, ApplicationUser>();

            //CreateMap<ApplicationUser,UserCreation>();

            //CreateMap<ApplicationUser,UserView>();

            CreateMap<UserView, ApplicationUser>().ReverseMap().ForMember(src => src.uniqueID, opt => opt.MapFrom(des => des.Id));

            CreateMap<UserEdit, ApplicationUser>().ForAllMembers(opt => opt.Condition((src, dest, member) => member != null));

            CreateMap<ApplicationUser, UsersRoleView>().ForMember(des => des.user_id, con => con.MapFrom(src => src.Id));
        }
    }
}