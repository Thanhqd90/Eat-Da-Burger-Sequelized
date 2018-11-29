
var express = require("express");

var router = express.Router();
// grabbing our models
var db = require("../models");

// Redirect to /burgers
router.get("/", function(req, res) {
  res.redirect("/burgers");
});

// Home page
router.get("/burgers", function(req, res) {
  db.Burger.findAll({
    include: [db.Customer],
    order: [
      ["burger_name", "ASC"]
    ]
  })
    .then(function(dbBurger) {

      var hbsObject = {
        burger: dbBurger
      };
      return res.render("index", hbsObject);
    });
});

// Create new burger
router.post("/burgers/create", function(req, res) {
  if(!req.body.burger_name){ // empty name
    return res.redirect("/");
  }

  db.Burger.create({
    burger_name: req.body.burger_name
  })
    .then(function(dbBurger) {
      console.log(dbBurger);
      res.redirect("/");
    });
});

// put route to devour a burger
router.put("/burgers/update", function(req, res) {
  if (req.body.customer) {
    db.Customer.create({
      customer: req.body.customer,
      BurgerId: req.body.burger_id
    })
      .then(function(dbCustomer) {
        console.log(dbCustomer);
        return db.Burger.update({
          devoured: true
        }, {
          where: {
            id: req.body.burger_id
          }
        });
      })
      .then(function(dbBurger) {
        console.log(dbBurger);
        res.json("/");
      });
  }
});

module.exports = router;
