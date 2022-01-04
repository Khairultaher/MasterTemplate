using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterTemplate.Data.ViewModels
{
    public class LoginViewModel
    {
        public string UserName { get; set; } = "";
        public string PassWord { get; set; } = "";

        public bool Bearer { get; set; }
    }
}
