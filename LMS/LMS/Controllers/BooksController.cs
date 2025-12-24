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
    public class BooksController : ApiController
    {
        library_management_systemEntities _context = new library_management_systemEntities();

        [HttpPost]
        public HttpResponseMessage addBook()
        {
            try
            {
                var request = HttpContext.Current.Request;

                if (string.IsNullOrEmpty(request.Form["book"]))
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest,
                        new { success = false, message = "Book data is required" });
                }

                var json = request.Form["book"];
                book bookData = JsonConvert.DeserializeObject<book>(json);

                if (string.IsNullOrEmpty(bookData.book_title))
                    return Request.CreateResponse(HttpStatusCode.BadRequest,
                        new { success = false, message = "Book title is required" });

                if (string.IsNullOrEmpty(bookData.isbn))
                    return Request.CreateResponse(HttpStatusCode.BadRequest,
                        new { success = false, message = "ISBN is required" });


                var checkBook = _context.books.Where(b => b.isbn == bookData.isbn).FirstOrDefault();
                if (checkBook != null)
                    return Request.CreateResponse(HttpStatusCode.Conflict,
                        new { success = false, message = "ISBN already exists" });

                if (request.Files.Count > 0)
                {
                    var postedFile = request.Files["image"];

                    if (postedFile != null && postedFile.ContentLength > 0)
                    {
                        string fileExtension = Path.GetExtension(postedFile.FileName).ToLower();
                        string uploadPath = HttpContext.Current.Server.MapPath("~/bookimages/");
                        if (!Directory.Exists(uploadPath))
                        {
                            Directory.CreateDirectory(uploadPath);
                        }

                        string fileName = $"{bookData.isbn}{fileExtension}";
                        string filePath = Path.Combine(uploadPath, fileName);

                        postedFile.SaveAs(filePath);

                        bookData.image = $"{fileName}";
                    }
                }

                _context.books.Add(bookData);
                _context.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    success = true,
                    message = "Book added successfully",
                });
            }
            catch (JsonException jsonEx)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest,
                    new { success = false, message = "Invalid JSON format", error = jsonEx.Message });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError,
                    new { success = false, message = "An error occurred while adding book", error = ex.Message });
            }
        }

        [HttpGet]
        public HttpResponseMessage getallbooks()
        {
            var books = _context.books.ToList();
            if (books == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, new { message = "Data Not Found" });
            }
            return Request.CreateResponse(HttpStatusCode.OK, books);
        }


        [HttpPost]
        public HttpResponseMessage issuedBook(issuebook issuebook)
        {
            if (issuebook.userid <= 0 || issuebook.bookid <= 0 || string.IsNullOrEmpty(issuebook.issuedate.ToString()) || string.IsNullOrEmpty(issuebook.returndate.ToString()))
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Invalid Data" });


            var book = _context.issuebooks.Where(i => i.userid == issuebook.userid && i.bookid == issuebook.bookid && i.status == "issued").FirstOrDefault();
            var bk = _context.books.Where(i => i.book_id == issuebook.bookid).FirstOrDefault();
            bk.quantity -= 1;
            if (book != null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Book Already Issued" });
            }

            _context.issuebooks.Add(issuebook);
            _context.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK);

        }


        [HttpPost]
        public HttpResponseMessage returnBook(issuebook issuebook)
        {
            if (issuebook.userid <= 0 || issuebook.bookid <= 0)
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Invalid Data" });
            var book = _context.issuebooks.Where(i => i.userid == issuebook.userid && i.bookid == issuebook.bookid && i.status == "issued").FirstOrDefault();
            var bk = _context.books.Where(i => i.book_id == issuebook.bookid).FirstOrDefault();
            bk.quantity += 1;
            if (book != null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Book Already Issued" });
            }

            book.status = "returned";
            _context.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK);

        }
        [HttpGet]
        public HttpResponseMessage getBooksByusingStudentID(int Studentid)
        {
            if (Studentid <= 0)
                return Request.CreateResponse(HttpStatusCode.BadRequest);

            var books = (from i in _context.issuebooks
                         join u in _context.users on i.userid equals u.user_id
                         join b in _context.books on i.bookid equals b.book_id
                         where i.userid == Studentid
                         select new
                         {
                             bookname = b.book_title,
                             bookid = b.book_id,
                             isbn = b.isbn,
                             i.issuedate,
                             i.returndate

                         });
            return Request.CreateResponse(HttpStatusCode.OK, books);

        }

        [HttpGet]
        public HttpResponseMessage getAllIssuedBooksDetails()
        {
            var books = (from i in _context.issuebooks
                         join u in _context.users on i.userid equals u.user_id
                         join b in _context.books on i.bookid equals b.book_id
                         select new
                         {
                             i.issuebook1,
                             i.Fine,
                             i.issuedate,
                             i.returndate,
                             i.userid,
                             b.book_title,
                             bookid = b.book_id,
                             isbn = b.isbn,
                             u.arid_no,
                             u.full_name,
                             u.father_name,
                             u.semester,
                             u.degree,
                             u.city,
                             u.section,
                             i.status,
                         });
            return Request.CreateResponse(HttpStatusCode.OK, books);

        }
    }
}
