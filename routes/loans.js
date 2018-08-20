const express = require('express');
const router = express.Router();
var Sequelize = require('sequelize');
var dateFormat = require('dateformat');
var now = new Date();
const Op = Sequelize.Op
var today  = dateFormat(now, "isoDate")
var nextWeek = now.setDate(now.getDate() + 7);
const nextWeekFormated = dateFormat(nextWeek,"isoDate" )




// const Sequelize = require('sequelize');
const Book = require("../models").Book;
const Loan = require("../models").Loan;
const Patron = require("../models").Patron;
var path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));


// router.get('/all-loans', function(req, res, next) {
//     res.render("/loans/all_books");
//   });

/* GET loans listing. */
router.get('/', function (req, res, next) {
        res.redirect("/loans/page/1")
});



router.get('/page/:page', (req, res) => {
    let limit = 10;   // number of records per page
    let offset = 0;
    Loan.findAndCountAll()
    .then((data) => {
      let page = req.params.page;      // page number
      let pages = Math.ceil(data.count / limit);
          offset = limit * (page - 1);
          Promise.all([Loan.findAll({
              limit:limit,
              offset: offset,
              $sort: { id: 1 }
          }),Patron.findAll(),Book.findAll()])
          .then( (dataSet) =>{
              console.log(pages)              
              res.render("loans/all_loans_paginated", { 
                  loans:dataSet[0], 
                  patrons:dataSet[1], 
                  books:dataSet[2], 
                  count: data.count,
                  pageMaker:Array.apply(null, {length: pages}).map(Function.call, Number),
                  title: "My Awesome Blog" });
          }).catch(function (error) {
              res.send(500, error);
          });
      });
    });

/* Create a new loan form. */


router.get('/new', function (req, res, next) {
    Promise.all([Book.findAll(), Patron.findAll()])
        .then((data) => {
            console.log(nextWeekFormated);
            res.render("loans/new_loan", { 
                loan: Loan.build(), 
                books: data[0], 
                patrons: data[1],
                today: today, 
                nextWeek:nextWeekFormated, 
                title: "New Loan" });

        });


})


/* POST new loan. */
router.post('/new', function (req, res, next) {
    Loan.create(req.body).then(function () {
        res.redirect("/loans/")
    }).catch(function (error) {
        if (error.name === "SequelizeValidationError") {
            console.log(error.message);
             Promise.all([Book.findAll(), Patron.findAll()])
        .then((data) => {
            res.render("loans/new_loan", { 
                loan: Loan.build(req.body), 
                books:data[0],patrons:data[1], 
                today: today, 
                nextWeek:nextWeekFormated,  
                errors: error.errors, 
                error: error.errors[0].message, 
                title: "New Loan" })
        })
            
        } else {
            throw error;
        }
    }).catch(function (error) {
        res.send(500, error);
    });
});

/* GET checked loan. */
router.get("/checked_loans", function (req, res, next) {
    Promise.all([Loan.findAll({
        where:{
            returned_on: null
        }
    }),Patron.findAll(),Book.findAll()])
    .then((data) =>{
        console.log(data);
        res.render("loans/checked_loans", { 
            loans:data[0], 
            patrons:data[1], 
            books:data[2], 
            title: "My Awesome Blog" });
    }).catch(function (error) {
        res.status(500).send(error)
    });
});

/* GET overdue loan. */
router.get("/overdue_loans", function (req, res, next) {
    Promise.all([Loan.findAll({
        where: {
            due_on: { 
              [Op.between]: ["1900-05-30",today]
            }
          }
    }),Patron.findAll(),Book.findAll()])
    .then((data) =>{
        console.log(today); // 9/17/2016
        res.render("loans/overdue_loans", { 
            loans:data[0], 
            patrons:data[1], 
            books:data[2], 
            title: "My Awesome Blog" });
    }).catch(function (error) {
        res.send(500, error);
    });
});


/* GET return loan. */
router.get("/loan_update/:id", function (req, res, next) {
    Promise.all([Loan.findById(req.params.id), Book.findAll(), Patron.findAll()])
    .then(function (data) {
        if (data) {
            res.render("loans/return_book", { 
                loan: data[0], 
                books:data[1], 
                patrons:data[2],
                today:today, 
                title: data[0].title });
        } else {
            res.send(404);
        }
    }).catch(function (error) {
        res.send(500, error);
    });
});

  /* PUT return loan. */
  router.put("/loan_update/:id", function (req, res, next) {
    Promise.all([Loan.findById(req.params.id), Book.findAll(), Patron.findAll()])
    .then(function (data) {
      return data[0].update(req.body).then(function () {
        res.redirect("/loans/");
      }).catch(function (error) {
        if (error.name === "SequelizeValidationError") {
          console.log(error.errors[0].message);
          res.render("loans/return_book", { 
              loan: data[0], 
              errors: error.errors, 
              books:data[1], 
              patrons:data[2],
              today:today, 
              title: data[0].title,
              error:error.errors[0].message, 
              title: "New Patron" })
        } else {
          throw error;
        }
      }).catch(function (error) {
        res.send(500, error);
      });
    })
  });
  


// /* PUT update loan. */
// router.put("/book_detail/:id", function (req, res, next) {
//     Loan.findById(req.params.id).then(function (loan) {
//         return loan.update(req.body).then(function () {
//             res.redirect("/loans/");
//         }).catch(function (error) {
//             if (error.name === "SequelizeValidationError") {
//                 console.log(error.errors[0].message);
//                 res.render("loans/book_detail", { 
//                     loan: loan, 
//                     errors: error.errors, 
//                     error: error.errors[0].message, 
//                     title: "New Patron" })

//             } else {
//                 throw error;
//             }
//         }).catch(function (error) {
//             res.send(500, error);
//         });
//     })
// });

module.exports = router;