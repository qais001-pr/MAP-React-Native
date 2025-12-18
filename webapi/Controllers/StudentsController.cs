using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace webapi.Controllers
{
    public class StudentsController : ApiController
    {
        fypEntities _context = new fypEntities();
        [HttpPost]
        public HttpResponseMessage addStudent(StudentsDTO data)
        {
            if (data.cgpa < 0 || string.IsNullOrWhiteSpace(data.name) || string.IsNullOrEmpty(data.regno))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = " Invalid Data" });
            }
            _context.Students1.Add(new Student1()
            {
                name = data.name,
                regno = data.regno,
                cgpa = data.cgpa,
            });
            _context.SaveChanges();
            return Request.CreateResponse();
        }
        [HttpGet]
        public HttpResponseMessage getAllStudents()
        {
            var stlist = _context.Students1.ToList();
            if (stlist == null)
            {
                return Request.CreateResponse(new { message = "Data not Found" });
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { data = stlist, message = "Data Collected Successfully" });
        }
    }

    public class StudentsDTO
    {
        public string name { get; set; }
        public string regno { get; set; }
        public double cgpa { get; set; }
    }
}
