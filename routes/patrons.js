const express = require('express');
const router = express.Router();
// const Sequelize = require('sequelize');
const Patron = require("../models").Patron;
var path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));


router.get('/', (req, res)=>{
    Patron.findAll().then(function (patrons) {
        res.render("patrons/all_patrons", { patrons: patrons, title: "Patrons" });
      }).catch(function (error) {
        res.send(500, error);
      });
    });

router.get('/patron-detail', (req, res)=>{
    res.render('patrons/patron_detail');
})


router.get('/new', function (req, res, next) {
    res.render("patrons/new_patron", { patron: Patron.build(), title: "New Patron" });
  });
  
  /* POST create article. */
  router.post('/new', function (req, res, next) {
    Patron.create(req.body).then(function () {
      res.redirect("/patrons/")
    }).catch(function (error) {
      if (error.name === "SequelizeValidationError") {
        console.log(error.message);
        res.render("patrons/new_patron", { patron: Patron.build(req.body), errors: error.errors,error:error.message, title: "New Patron" })
        
      } else {
        throw error;
      }
    }).catch(function (error) {
      res.send(500, error);
    });
  });
  

/* GET individual patron. */
router.get("/patron-detail/:id", function (req, res, next) {
    Patron.findById(req.params.id).then(function (patron) {
    if(patron){
      res.render("patrons/patron_detail", { patron: patron, name: patron.first_name});
    } else {
    res.send(404);
  }
    }).catch(function(error){
        res.send(500, error);
     });
    });
  /* PUT update book. */
router.put("/patron_detail/:id", function (req, res, next) {
    Patron.findById(req.params.id).then(function (patron) {
      return patron.update(req.body).then(function () {
        res.redirect("/patrons/");
      })
    })
  });
  
/* Delete article form. */
router.get("/patron-detail/:id/delete", function(req, res, next){
    Patron.findById(req.params.id).then(function(patron){  
      if(patron) {
        res.render("delete", { patron: patron, name: patron.first_name})
      } else {
        res.sendStatus(404);
      }
    }).catch(function(error){
        res.sendStatus(500, error);
     });
  });

  /* DELETE individual article. */
router.delete("/patron-detail/:id", function(req, res, next){
  Patron.findById(req.params.id).then(function(patron){  
    if(patron) {
      return patron.destroy();
    } else {
      res.sendStatus(404);
    }
  }).then(function(){
    res.redirect("/patrons");    
  }).catch(function(error){
      res.sendStatus(500, error);
   });
});

  

module.exports = router;