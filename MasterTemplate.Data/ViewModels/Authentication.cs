using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterTemplate.Data.ViewModels
{
    public class Authentication
    {
        List<User> users = new List<User>();
        public Authentication()
        {
            users.Add(new User() { UserName = "Khairul", Pasword = "123", Depertment = "IT", Roles = new List<string>() { "Admin", "User" } });
            users.Add(new User() { UserName = "Alam", Pasword = "123", Depertment = "HR", Roles = new List<string>() { "Admin" } });
            users.Add(new User() { UserName = "Taher", Pasword = "123", Depertment = "Accounts", Roles = new List<string>() { "Admin" } });
        }

        public User Login(string username, string password)
        {
            return users.FirstOrDefault(w => w.UserName.ToLower() == username.ToLower()
                                && w.Pasword == password);
        }
        public class User
        {
            public string UserName { get; set; }
            public string Pasword { get; set; }
            public List<string> Roles { get; set; }
            public string Depertment { get; set; }
        }
    }

}
