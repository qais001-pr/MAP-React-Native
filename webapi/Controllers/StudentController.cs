//using Newtonsoft.Json;
//using System;
//using System.IO;
//using System.Linq;
//using System.Net;
//using System.Net.Http;
//using System.Web;
//using System.Web.Http;

//namespace webapi.Controllers
//{
//    public class StudentController : ApiController
//    {
//        fypEntities _context = new fypEntities();

//        public HttpResponseMessage getStudents()
//        {
//            var Students = _context.Students.ToList();
//            return Request.CreateResponse(
//                HttpStatusCode.OK, new
//                {
//                    studentList = _context.Students.ToList(),
//                });
//        }
//        [HttpPost]
//        public HttpResponseMessage AddStudent()
//        {
//            var request = HttpContext.Current.Request;

//            var json = request.Form["student"];

//            if (string.IsNullOrEmpty(json))
//                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Student JSON missing");

//            Student student = JsonConvert.DeserializeObject<Student>(json);

//            if (request.Files.Count > 0)
//            {
//                var postedFile = request.Files["image"];

//                if (postedFile != null && postedFile.ContentLength > 0)
//                {
//                    var extension = Path.GetExtension(postedFile.FileName);
//                    string fileName = student.aridno + extension;

//                    string serverPath = HttpContext.Current.Server.MapPath("~/images/");
//                    string fullPath = Path.Combine(serverPath, fileName);

//                    if (!Directory.Exists(serverPath))
//                        Directory.CreateDirectory(serverPath);

//                    postedFile.SaveAs(fullPath);

//                    student.Profileimage = fileName;
//                }
//            }

//            _context.Students.Add(student);
//            _context.SaveChanges();

//            return Request.CreateResponse(HttpStatusCode.OK, "Data Saved Successfully");
//        }


//    }
//}
