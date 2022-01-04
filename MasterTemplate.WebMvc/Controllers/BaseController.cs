using MasterTemplate.Common.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MasterTemplate.WebMvc.Controllers
{
    [Authorize]
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
            // our code before action executes

            //Constants.BaseUrl = $"{this.Request.Scheme}://{this.Request.Host}";

            base.OnActionExecuting(context);
        }
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            // our code after action executes

            //Constants.BaseUrl = $"{this.Request.Scheme}://{this.Request.Host}";

            base.OnActionExecuted(context);
        }
    }
}
