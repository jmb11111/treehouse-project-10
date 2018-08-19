const express = require('express');
const router = express.Router();
var Sequelize = require('sequelize');
var dateFormat = require('dateformat');
var now = new Date();
 
var today  = dateFormat(now, "isoDate")



// const Sequelize = require('sequelize');
const Book = require("../models").Book;
const Loan = require("../models").Loan;
const Patron = require("../models").Patron;
var path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const Op = Sequelize.Op

// router.get('/all-loans', function(req, res, next) {
//     res.render("/loans/all_books");
//   });

/* GET loans listing. */
router.get('/', function (req, res, next) {
    Promise.all([Loan.findAll(),Patron.findAll(),Book.findAll()])
    .then( (data) =>{
        console.log(data);
        res.render("loans/all_loans", { loans:data[0], patrons:data[1], books:data[2], title: "My Awesome Blog" });
    }).catch(function (error) {
        res.send(500, error);
    });
});


/* Create a new loan form. */


router.get('/new', function (req, res, next) {
    Promise.all([Book.findAll(), Patron.findAll()])
        .then((data) => {
            // console.log(data[1]);
            res.render("loans/new_loan", { loan: Loan.build(), books: data[0], patrons: data[1], title: "New Loan" });

        });


})


/* POST create article. */
router.post('/new', function (req, res, next) {
    Loan.create(req.body).then(function () {
        res.redirect("/loans/")
    }).catch(function (error) {
        if (error.name === "SequelizeValidationError") {
            console.log(error.message);
             Promise.all([Book.findAll(), Patron.findAll()])
        .then((data) => {
            res.render("loans/new_loan", { loan: Loan.build(), books: data[0], patrons: data[1], title: "New Loan" });

        });
            res.render("loans/new_loan", { loan: Loan.build(req.body), errors: error.errors, error: error.errors[0].message, title: "New Loan" })
        } else {
            throw error;
        }
    }).catch(function (error) {
        res.send(500, error);
    });
});

/* GET individual loan. */
router.get("/checked_loans", function (req, res, next) {
    Promise.all([Loan.findAll({
        where:{
            returned_on: null
        }
    }),Patron.findAll(),Book.findAll()])
    .then( (data) =>{
        console.log(date);
        res.render("loans/checked_loans", { loans:data[0], patrons:data[1], books:data[2], title: "My Awesome Blog" });
    }).catch(function (error) {
        res.send(500, error);
    });
});

/* GET individual loan. */
router.get("/overdue_loans", function (req, res, next) {
    Promise.all([Loan.findAll({
        where: {
            due_on: { 
              [Op.between]: ["2014-05-30",today]
            }
          }
    }),Patron.findAll(),Book.findAll()])
    .then((data) =>{
        console.log(today); // 9/17/2016
        res.render("loans/overdue_loans", { loans:data[0], patrons:data[1], books:data[2], title: "My Awesome Blog" });
    }).catch(function (error) {
        res.send(500, error);
    });
});


/* GET individual loan. */
router.get("/loan_update/:id", function (req, res, next) {
    Promise.all([Loan.findById(req.params.id), Book.findAll(), Patron.findAll()])
    .then(function (data) {
        if (data) {
            res.render("loans/return_book", { loan: data[0], books:data[1], patrons:data[2], title: data[0].title });
        } else {
            res.send(404);
        }
    }).catch(function (error) {
        res.send(500, error);
    });
});

  /* PUT update loan. */
  router.put("/loan_update/:id", function (req, res, next) {
    Loan.findById(req.params.id).then(function (loan) {
      return loan.update(req.body).then(function () {
          console.log(loan)
        res.redirect("/loans/");
      }).catch(function (error) {
        if (error.name === "SequelizeValidationError") {
          console.log(error.errors[0].message);
          res.render("loans/return_book", { loans: loan, errors: error.errors, error:error.errors[0].message, title: "New Patron" })
        } else {
          throw error;
        }
      }).catch(function (error) {
        res.send(500, error);
      });
    })
  });
  


/* PUT update loan. */
router.put("/book_detail/:id", function (req, res, next) {
    Loan.findById(req.params.id).then(function (loan) {
        return loan.update(req.body).then(function () {
            res.redirect("/loans/");
        }).catch(function (error) {
            if (error.name === "SequelizeValidationError") {
                console.log(error.errors[0].message);
                res.render("loans/book_detail", { loan: loan, errors: error.errors, error: error.errors[0].message, title: "New Patron" })

            } else {
                throw error;
            }
        }).catch(function (error) {
            res.send(500, error);
        });
    })
});

module.exports = router;