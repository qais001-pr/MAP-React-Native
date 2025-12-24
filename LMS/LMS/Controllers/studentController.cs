using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LMS.Controllers
{
    public class studentController : ApiController
    {
        library_management_systemEntities _context = new library_management_systemEntities();
        [HttpGet]
        public HttpResponseMessage getallStudents()
        {
            var students = _context.users.Where(u => u.user_type == "student").ToList();
            if (students == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            return Request.CreateResponse(HttpStatusCode.OK, students);
        }

    }
}
