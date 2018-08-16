var express = require('express');
var router = express.Router();
const sequelize = require('sequelize');
// var dateFormat = require('dateformat');
const Book = require("../models").Book;


// router.get('/all-books', function(req, res, next) {
//     res.render("/books/all_books");
//   });

/* GET books listing. */
router.get('/', function(req, res, next) {
  Book.findAll().then(function(books){
    res.render("books/all_books", {books: books, title: "My Awesome Blog" });
  })
});

/* POST create article. */
router.post('/', function(req, res, next) {

    Book.create(req.body).then(function(book){
      console.log(book);

    res.redirect("/books/")
  })
});

/* Create a new article form. */
router.get('/new-book', function(req, res, next) {
  res.render("books/new_book", {book: Book.build(), title: "New Article"});
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


// /* GET individual article. */
// router.get("/:id", function(req, res, next){
//   Book.findById(req.params.id).then(function(article){
//     res.render("books/show", {article: article, title: article.title});
//   })
// });

// /* PUT update article. */
// router.put("/:id", function(req, res, next){
//   var article = find(req.params.id);
//   article.title = req.body.title;
//   article.body = req.body.body;
//   article.author = req.body.author;
  
//   res.redirect("/books/" + article.id);    
// });

// /* DELETE individual article. */
// router.delete("/:id", function(req, res, next){
//   var article = find(req.params.id);  
//   var index = books.indexOf(article);
//   books.splice(index, 1);

//   res.redirect("/books");
// });


module.exports = router;