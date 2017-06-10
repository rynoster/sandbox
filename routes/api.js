var express = require('express');
var router = express.Router();
var db = require("../db");
var auth = require("../auth")
var crypto = require('crypto');

var app = express();

router
  .get('/register', (req, res) => {
    res.send("Register page")
  })

  //Shows all users
  .get('/allUsers', auth.loginRequired, auth.adminRequired, (req,res, next) => {

    db("users").then((users) => {
      res.send(users);
    }, next)
  })

  //Main router for registering/creating new users
  .post('/user', (req, res, next) => {
    const newUser = req.body;

    newUser.token = crypto.randomBytes(64).toString('base64');

    db("users")
      .where("email", newUser.email)
      .first()
      .then((user) => {
        if (user) {
          res.status(500).send({ error: "User exists" });
        } else {

          db("users")
            .insert(newUser)
            .then((users) => {

              //Send email verification email
              var Mail = require('../email');
              var mail = new Mail({
                from : "rynoster@chirpee.io", 
                to : "ryno@coetzee.za.com", 
                subject : "subject",
                html : htmlBody,
                // html : "the <strong>verification</strong> email",
                successCallback : function(success){
                  console.log("Mail send");
                },
                errorCallback : function(err){
                  console.log("Mail not send");
                }
              });

              mail.send();

              res.send(users);

            })
            .catch((err) => {
              res.status(500).send({ error: err.message });

            })
        }
      })
      
    })

  //Get user details for specific user id
  .get('/user/:id', auth.loginRequired, (req,res, next) => {
    const { id } = req.params;

    db("users")
      .where("id", id)
      .first()
      .then((users) => {
        if (!users) {
          return res.send(400);
        }
        res.send(users);
      }, next)
    })

  //Update existing user details
  .put('/user/:id', (req,res, next) => {
  const { id } = req.params;

    db("users")
      .where("id", id)
      .update(req.body)
      .then((result) => {
        if (result === 0 ) {
          return res.send(400)
        }
        res.send(200);
      }, next)
    })

    //Delete user
    .delete('/user/:id', auth.loginRequired, auth.adminRequired, (req,res, next) => {
    const { id } = req.params;

    db("users")
      .where("id", id)
      .delete(req.body)
      .then((result) => {
        if (result === 0 ) {
          return res.send(400)
        }
        res.send(200);
      }, next)
    })

module.exports = router;