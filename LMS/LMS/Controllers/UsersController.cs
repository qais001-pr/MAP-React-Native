using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace LMS.Controllers
{
    public class UsersController : ApiController
    {

        library_management_systemEntities _context = new library_management_systemEntities();
        [HttpPost]
        public HttpResponseMessage addUser()
        {
            try
            {
                var request = HttpContext.Current.Request;

                // 🔹 Validate FormData
                if (string.IsNullOrEmpty(request.Form["user"]))
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest,
                        new { success = false, message = "User data is required" });
                }

                // 🔹 Deserialize JSON
                var json = request.Form["user"];
                user userdata = JsonConvert.DeserializeObject<user>(json);

                // 🔹 Required field validation
                if (string.IsNullOrWhiteSpace(userdata.arid_no))
                    return Request.CreateResponse(HttpStatusCode.BadRequest,
                        new { success = false, message = "ARID No is required" });

                if (string.IsNullOrWhiteSpace(userdata.full_name))
                    return Request.CreateResponse(HttpStatusCode.BadRequest,
                        new { success = false, message = "Full name is required" });

                if (string.IsNullOrWhiteSpace(userdata.password))
                    return Request.CreateResponse(HttpStatusCode.BadRequest,
                        new { success = false, message = "Password is required" });

                // 🔹 ARID uniqueness check
                if (_context.users.Any(u => u.arid_no == userdata.arid_no))
                    return Request.CreateResponse(HttpStatusCode.Conflict,
                        new { success = false, message = "ARID No already exists" });

                // 🔹 Email uniqueness (only if provided)
                if (!string.IsNullOrWhiteSpace(userdata.email) &&
                    _context.users.Any(u => u.email == userdata.email))
                {
                    return Request.CreateResponse(HttpStatusCode.Conflict,
                        new { success = false, message = "Email already exists" });
                }

                // 🔹 Hash password (IMPORTANT)

                // 🔹 Default user type
                if (string.IsNullOrWhiteSpace(userdata.user_type))
                    userdata.user_type = "student";

                // 🔹 Image Upload
                if (request.Files.Count > 0)
                {
                    var postedFile = request.Files["image"];

                    if (postedFile != null && postedFile.ContentLength > 0)
                    {
                        string extension = Path.GetExtension(postedFile.FileName);
                        string uploadPath = HttpContext.Current.Server.MapPath("~/images/");

                        if (!Directory.Exists(uploadPath))
                            Directory.CreateDirectory(uploadPath);

                        string fileName = $"{userdata.arid_no}{extension}";
                        string fullPath = Path.Combine(uploadPath, fileName);

                        postedFile.SaveAs(fullPath);

                        userdata.profile_pic = "/images/" + fileName;
                    }
                }

                // 🔹 Save user
                _context.users.Add(userdata);
                _context.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    success = true,
                    message = "User added successfully",
                    data = new
                    {
                        userdata.user_id,
                        userdata.arid_no,
                        userdata.full_name,
                        userdata.father_name,
                        userdata.profile_pic,
                        userdata.user_type,
                        userdata.degree,
                        userdata.section,
                        userdata.semester,
                        userdata.city
                    }
                });
            }
            catch (JsonException)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest,
                    new { success = false, message = "Invalid JSON format" });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError,
                    new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public HttpResponseMessage Login()
        {
            try
            {
                var request = HttpContext.Current.Request;
                var json = request.Form["credentials"];

                if (string.IsNullOrEmpty(json))
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest,
                        new { success = false, message = "Login credentials are required" });
                }

                var credentials = JsonConvert.DeserializeObject<LoginCredentials>(json);

                if (string.IsNullOrEmpty(credentials.email) || string.IsNullOrEmpty(credentials.password))
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest,
                        new { success = false, message = "Email and password are required" });
                }

                var user = _context.users.FirstOrDefault(u =>
                    u.email == credentials.email || u.arid_no == credentials.email);

                if (user == null)
                {
                    return Request.CreateResponse(HttpStatusCode.Unauthorized,
                        new { success = false, message = "Invalid email/ARID or password" });
                }

                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    success = true,
                    message = "Login successful",
                    user = new
                    {
                        user.user_id,
                        user.arid_no,
                        user.email,
                        user.full_name,
                        user.father_name,
                        user.profile_pic,
                        user.user_type,
                        user.degree,
                        user.section,
                        user.semester,
                        user.city
                    }
                });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError,
                    new { success = false, message = "An error occurred during login", error = ex.Message });
            }
        }
        private class LoginCredentials
        {
            public string email { get; set; }
            public string password { get; set; }
        }
    }

}
