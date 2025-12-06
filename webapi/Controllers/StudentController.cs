using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace webapi.Controllers
{
    public class StudentController : ApiController
    {
        fypEntities _context = new fypEntities();

        public HttpResponseMessage getStudents()
        {
            var Students = _context.Students.ToList();
            return Request.CreateResponse(new
            {
                statusCode = HttpStatusCode.OK,
                totalStdents = _context.Students.Count(),
                studentList = _context.Students.ToList()
            });
        }
        [HttpPost]
        public HttpResponseMessage addStudent(Student s)
        {
            _context.Students.Add(s);
            _context.SaveChanges();
            return Request.CreateResponse("Data Saved");
        }
    }
}
