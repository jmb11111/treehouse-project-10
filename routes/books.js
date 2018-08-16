const express = require('express');
const router = express.Router();
// const Sequelize = require('sequelize');
const Book = require("../models").Book;
var path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// router.get('/all-books', function(req, res, next) {
//     res.render("/books/all_books");
//   });

/* GET books listing. */
router.get('/', function (req, res, next) {
  Book.findAll().then(function (books) {
    res.render("books/all_books", { books: books, title: "My Awesome Blog" });
  }).catch(function (error) {
    res.send(500, error);
  });
});

/* Create a new book form. */


router.get('/new', function (req, res, next) {
  res.render("new_book", { book: Book.build(), title: "New Book" });
});

/* POST create article. */
router.post('/new', function (req, res, next) {
  Book.create(req.body).then(function () {
    res.redirect("/books/")
  }).catch(function (error) {
    if (error.name === "SequelizeValidationError") {
      console.log(error.message);
      res.render("new_book", { book: Book.build(req.body), errors: error.errors,error:error.errors[0].message, title: "New Book" })
      
    } else {
      throw error;
    }
  }).catch(function (error) {
    res.send(500, error);
  });
});

/* GET individual book. */
router.get("/book_detail/:id", function (req, res, next) {
  Book.findById(req.params.id).then(function (book) {
  if(book){
    res.render("books/book_detail", { book: book, title: book.title });
  } else {
  res.send(404);
}
  }).catch(function(error){
      res.send(500, error);
   });
  });




/* PUT update book. */
router.put("/book_detail/:id", function (req, res, next) {
  Book.findById(req.params.id).then(function (book) {
    return book.update(req.body).then(function () {
      res.redirect("/books/");
    }).catch(function (error) {
      if (error.name === "SequelizeValidationError") {
        console.log(error.errors[0].message);
        res.render("books/book_detail", { book: book, errors: error.errors, error:error.errors[0].message, title: "New Patron" })
        
      } else {
        throw error;
      }
    }).catch(function (error) {
      res.send(500, error);
    });
  })
});







// /* Edit article form. */
// router.get("/:id/edit", function(req, res, next){
//   var article = find(req.params.id);  

//   res.render("books/edit", {article: article, title: "Edit Book"});
// });


// /* Delete article form. */
// router.get("/:id/delete", function(req, res, next){
//   var article = find(req.params.id);  

//   res.render("books/delete", {article: article, title: "Delete Book"});
// });




// /* DELETE individual article. */
// router.delete("/:id", function(req, res, next){
//   var article = find(req.params.id);  
//   var index = books.indexOf(article);
//   books.splice(index, 1);

//   res.redirect("/books");
// });


module.exports = router;