var express = require('express');
var router = express.Router();
var db = require("../db");
var auth = require("../auth")
var crypto = require('crypto');
var request = require('request');

var app = express();

function fullUrl(req) {
  var url=require('url');
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    // pathname: req.originalUrl
  });
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function buildHtmlBody(params, fullUrl){

  var hjs = require("hjs");
  var fs = require("fs");
  var htmlFile = fs.readFileSync(__dirname + "/../views/emailtemplate.hjs", "utf8");

  var htmlCompile = hjs.compile(htmlFile);
  var htmlRender = htmlCompile.render({
    NameofDelegate: params.first_name + " " + params.last_name,
    token: params.token,
    verifyUrl: fullUrl + "/verify/" + params.token,
  });

  console.log(htmlRender);

  return(htmlRender);

}

function buildHtmlContactUs(params){

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
  .get('/allusers', auth.loginRequired, auth.adminRequired, (req,res, next) => {

    // Use the below to test email verification email rendering
    // buildHtmlBody({
    //   first_name: "Piet",
    //   last_name: "Skiet",
    //   token: "tokentest"
    // },fullUrl(req));

    db("users").then((users) => {
      res.send(users);
    }, next)
  })

  //Main router for registering/creating new users
  .post('/user', (req, res, next) => {
    const newUser = req.body;

    //Generate the token, trim to 32 characters
    //newUser.token = crypto.randomBytes(64).toString('base64').substring(0, 32);
    newUser.token = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

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
                html : buildHtmlBody(newUser, fullUrl(req)),
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

  .get('/allsponsors', auth.loginRequired, auth.adminRequired, (req,res, next) => {

    db("sponsors").then((sponsors) => {
      res.send(sponsors);
    }, next)
  })

  //Update existing sponsor details
  .put('/sponsor/:sponsorTag', (req,res, next) => {
  const { sponsorTag } = req.params;

    db("sponsors")
      .where("sponsorTag", sponsorTag)
      .update(req.body)
      .then((result) => {
        if (result === 0 ) {
          return res.send(400)
        }
        res.send(200);
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
        // to : "ryno@coetzee.za.com",
        to : "showcase@datacentrix.co.za",
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