using MasterTemplate.Common.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MasterTemplate.WebMvc.Controllers
{
    public class BaseController : Controller
    {
        public string LogedInUser { get; set; }
        public ResponseModel _response { get; set; }

        
        public BaseController()
        {
            _response = new ResponseModel();
            LogedInUser = "";
        }
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            Constants.BaseUrl = $"{this.Request.Scheme}://{this.Request.Host}";

            if (User.Identity.IsAuthenticated)
            {
                LogedInUser = GetLogedInUser();
            }

            base.OnActionExecuting(context);
        }

        public string GetLogedInUser()
        {
            return User.Identity.Name;
        }
    }
}
