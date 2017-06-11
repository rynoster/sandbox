var express = require('express');
var router = express.Router();
var db = require("../db");
var auth = require("../auth")
var crypto = require('crypto');
var request = require('request');

var app = express();

function buildHtmlBody(params){

  htmlBody = "Dear " + params.first_name + " " + params.last_name + ",<br><br>"
  htmlBody += "<strong>Thank you for registering to the Datacentrix 2017 Showcase event</strong><br><br>"
  htmlBody += "To verify your email address, please follow the link below:<br><br>"
  htmlBody += "https://datacentrix.chirpee.io/verify/" + params.token + "<br><br>"
  htmlBody += "If you didn't register for this event, just ignore this email and nothing will happen.<br><br>"
  htmlBody += "Have a nice day,<br>"
  htmlBody += "Datacentrix Showcase team.<br><br>"
  htmlBody += "This email was sent by a user triggered event and thus can't really be unsubscribed from.<br><br>"

  return(htmlBody);

}

function buildHtmlContactUs(params){
  console.log(params);

  htmlBody = "<strong>Contact us request received:</strong><br><br>";
  htmlBody += "Name: " + params.name + "<br>"
  htmlBody += "Email address: " + params.email + "<br>"
  htmlBody += "Subject: " + params.subject + "<br>"
  htmlBody += "Message: " + params.message + "<br>"

  return(htmlBody);
}

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

    //Generate the token, trim to 24 characters
    newUser.token = crypto.randomBytes(64).toString('base64').substring(0, 24);

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
                from : "noreply@chirpee.io", 
                to : newUser.email,
                subject : "Datacentrix Showcase 2017 - Email Address Verification Request",
                html : buildHtmlBody(newUser),
                // html : "the <strong>verification</strong> email",
                successCallback : function(success){
                  console.log("Mail sent");
                },
                errorCallback : function(err){
                  console.log("Mail not sent");
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

  .get('/sponsor/:sponsorTag', (req,res, next) => {
    const { sponsorTag } = req.params;

    db("sponsors")
      .where("sponsorTag", sponsorTag)
      .first()
      .then((sponsors) => {
        if (!sponsors) {
          return res.send(400);
        }
        res.send(sponsors);
      }, next)
    })

  .get('/sponsors', auth.loginRequired, auth.adminRequired, (req,res, next) => {

    db("sponsors").then((sponsors) => {
      res.send(sponsors);
    }, next)
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

  //Google reCAPTCHA API
  .post('/captcha', (req, res, next) => {
    
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
      return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
    }

    // Put your secret key here.
    var secretKey = "6LfYcCQUAAAAAKf55V5s0ol_9tK1HKEVqNfi0ynJ";

    // req.connection.remoteAddress will provide IP address of connected user.
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    
    // Hitting GET request to the URL, Google will respond with success or error scenario.
    request(verificationUrl,function(error,response,body) {
      body = JSON.parse(body);
      // Success will be true or false depending upon captcha validation.
      if(body.success !== undefined && !body.success) {
        return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
      }
      

      //Send mail on successful verification
      var Mail = require('../email');
      var mail = new Mail({
        from : "noreply@chirpee.io", 
        to : "ryno@coetzee.za.com",
        // to : "showcase@datacentrix.co.za",
        subject : "Datacentrix Showcase 2017 - Contact Us Request",
        html : buildHtmlContactUs(req.body),
        
        successCallback : function(success){
          console.log("Mail sent");
        },
        
        errorCallback : function(err){
          console.log("Mail not sent");
        }
      });

      mail.send();

      res.json({"responseCode" : 0,"responseDesc" : "Sucess"});

    });

  })

module.exports = router;