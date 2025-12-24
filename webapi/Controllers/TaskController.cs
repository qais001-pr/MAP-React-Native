using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace webapi.Controllers
{
    public class TaskController : ApiController
    {

        TaskEntities2 _context = new TaskEntities2();

        [HttpPost]
        public HttpResponseMessage addUser(Userlocation user)
        {

            if (string.IsNullOrWhiteSpace(user.uname) || string.IsNullOrEmpty(user.locName) || user.lat.ToString() != null || user.lon.ToString() != null)
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Invalid Data" });
            _context.Userlocations.Add(user);
            _context.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK, new { message = "Data Saved" });
        }






        [HttpGet]
        public HttpResponseMessage getUser(string unmae)
        {
            var users = _context.Userlocations.Where(u => u.uname == unmae).ToList();
            if (users == null)
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Invalid Data" });
            return Request.CreateResponse(HttpStatusCode.OK, users);
        }
    }
}

