const express = require('express');
const router = express.Router();
// const Sequelize = require('sequelize');
const Book = require("../models").Book;
const Loan = require("../models").Loan;
const Patron = require("../models").Patron;
const Sequelize = require('sequelize');
const dateFormat = require('dateformat');
const now = new Date();
const Op = Sequelize.Op
const today = dateFormat(now, "isoDate")

const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));


/* GET books listing. */

router.get('/', function (req, res, next) {
  res.redirect("/books/page/1")
});

router.get('/page/:page', function (req, res, next) {
  let limit = 5;   // number of records per page
  let offset = 0;
  Book.findAndCountAll()
    .then((data) => {
      let page = req.params.page;      // page number
      let pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);
      Book.findAll({
        limit: limit,
        offset: offset,
        $sort: { id: 1 }
      }).then(function (books) {
        res.render("books/all_books", {
          books: books,
          count: data.count,
          pageMaker: Array.apply(null, { length: pages }).map(Function.call, Number),
          title: "My Awesome Blog"
        });
      }).catch(function (error) {
        res.send(500, error);
      });
    });
});


// search function
router.get("/search", function (req, res, next) {
 let  query =(req.query.query)
  Book.findAll({
    attributes: ['id','title', 'author', 'genre', 'first_published'],
    where: {
      [Op.or]: {
        title:{
            [Op.like]: `%${query}%`
          },
        author:{
          [Op.like]: `%${query}%`
        },
        genre:{
          [Op.like]: `%${query}%`
        },
        }
    }
  }).then(function (books) {
    res.render("books/book_results", {
      books: books,
      title: "My Awesome Blog"
    });
  }).catch(function (error) {
    res.send(500, error);
  });
});





/* Create a new book form. */


router.get('/new', function (req, res, next) {
  res.render("books/new_book", {
    book: Book.build(),
    title: "New Book"
  });
});

/* POST create article. */
router.post('/new', function (req, res, next) {
  Book.create(req.body).then(function () {
    res.redirect("/books/")
  }).catch(function (error) {
    if (error.name === "SequelizeValidationError") {
      console.log(error.message);
      res.render("books/new_book", {
        book: Book.build(req.body),
        errors: error.errors,
        error: error.errors[0].message,
        title: "New Book"
      })

    } else {
      throw error;
    }
  }).catch(function (error) {
    res.send(500, error);
  });
});



/* GET individual book. */
router.get("/book_detail/:id", function (req, res, next) {
  Promise.all([Book.findById(req.params.id), Loan.findAll({
    where: {
      book_id: req.params.id
    }
  }), Patron.findAll()])
    .then(function (data) {
      if (data) {
        console.log(data[1])
        res.render("books/book_detail", {
          book: data[0],
          loans: data[1],
          patrons: data[2],
          title: data[0].title
        });
      } else {
        res.send(404);
      }
    }).catch(function (error) {
      res.send(500, error);
    });
});



/* PUT update book. */
router.put("/book_detail/:id", function (req, res, next) {
  Promise.all([Book.findById(req.params.id), Loan.findAll({
    where: {
      book_id: req.params.id
    }
  }), Patron.findAll()])
  .then(function (data) {
    return data[0].update(req.body).then(function () {
      res.redirect("/books/");
    }).catch(function (error) {
      if (error.name === "SequelizeValidationError") {
        console.log(error.errors[0].message);
        res.render("books/book_detail", {
          book: data[0],
          loans: data[1],
          patrons: data[2],
          errors: error.errors,
          error: error.errors[0].message,
          title: "New Patron"
        })

      } else {
        throw error;
      }
    }).catch(function (error) {
      res.send(500, error);
    });
  })
});




/* GET checked books. */
router.get("/checked_books", function (req, res, next) {
  Promise.all([Loan.findAll({
    where: {
      returned_on: null
    }
  }), Patron.findAll(), Book.findAll()])
    .then((data) => {
      console.log(data);
      res.render("books/checked_books", {
        loans: data[0],
        patrons: data[1],
        books: data[2],
        title: "My Awesome Blog"
      });
    }).catch(function (error) {
      res.status(500).send(error)
    });
});

/* GET overdue books. */
router.get("/overdue_books", function (req, res, next) {
  Promise.all([Loan.findAll({
    where: {
      due_on: {
        [Op.between]: ["1900-05-30", today]
      }
    }
  }), Patron.findAll(), Book.findAll()])
    .then((data) => {
      console.log(today);
      res.render("books/overdue_books", {
        loans: data[0],
        patrons: data[1],
        books: data[2],
        title: "My Awesome Blog"
      });
    }).catch(function (error) {
      res.send(500, error);
    });
});


module.exports = router;