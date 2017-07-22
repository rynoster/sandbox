const express = require("express");

const router = express.Router();
const request = require("request");
const _ = require("lodash");
const url = require("url");
const bcrypt = require("bcrypt-nodejs");
// const async = require("async") eslint never used
// const crypto = require("crypto"); eslint never used
// const app = express(); eslint never used

//My own modules
const db = require("../db");
const auth = require("../auth");
const Speaker = require("../speakers");
const Agenda = require("../agenda");
const User = require("../user");

const agenda = new Agenda();
const user = new User();

//file uploads
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

function getFullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get("host"),
    // pathname: req.originalUrl
  });
}

function randomString(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function buildHtmlBody(params, fullUrl) {

  const hjs = require("hjs");
  const fs = require("fs");
  const htmlFile = fs.readFileSync(__dirname + "/../views/emailtemplate.hjs", "utf8");

  const htmlCompile = hjs.compile(htmlFile);
  const htmlRender = htmlCompile.render({
    NameofDelegate: params.first_name + " " + params.last_name,
    token: params.token,
    verifyUrl: fullUrl + "/verify/" + params.token,
  });

  // console.log(htmlRender);

  return (htmlRender);

}

function buildHtmlContactUs(params) {

  var htmlBody = "";

  htmlBody = "<strong>Contact us request received:</strong><br><br>";
  htmlBody += "Name: " + params.name + "<br>"
  htmlBody += "Email address: " + params.email + "<br>"
  htmlBody += "Subject: " + params.subject + "<br>"
  htmlBody += "Message: " + params.message + "<br>"

  return (htmlBody);
}

router
  .get("/register", (req, res) => {
    res.send("Register page");
  })

  //Shows all users, with more options to filter records
  .get("/allusers", auth.loginRequired, auth.adminRequired, (req, res, next) => {

    var ajaxData = req.query;

    db("users")
      .where(ajaxData.where || {})
      .then((users) => {
        res.send(users);
      }, next);

  })

  //Main router for registering/creating new users
  .post("/user", (req, res, next) => {
    const newUser = req.body;
    var sendEmail = newUser.sendEmail || "true"; //Retrieve the sendEmail from req.body to determine whether email should be sent to delegate for verification

    delete newUser.sendEmail; //Removes the sendEmail property from the newUser object, to ensure the insert record into the database does not fail

    //Generate the token, trim to 32 characters
    //newUser.token = crypto.randomBytes(64).toString("base64").substring(0, 32);
    newUser.token = randomString(32, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

    //First check if email address already exists before trying to add
    db("users")
      // .where("email", newUser.email)
      .whereRaw("LOWER(email) = ?", [_.toLower(newUser.email)]) //Compare lowercase to lowercase, to ensure users do not register with two different case email addresses that are the same
      .first()
      .then((resultUser) => {
        if (resultUser) {
          res.status(500).send({
            error: "User exists"
          });
        } else { //If user/delegate does not already exist, create new

          db("users")
            .insert(newUser)
            .then((users) => {

              //Only email when req.body requested
              if (sendEmail === "true") {
                //Send email verification email
                var Mail = require('../email');
                var mail = new Mail({
                  from: "noreply@chirpee.io",
                  to: newUser.email,
                  subject: "Datacentrix Showcase 2017 - Email Address Verification Request",
                  html: buildHtmlBody(newUser, getFullUrl(req)),
                  // html : "the <strong>verification</strong> email",
                  successCallback: function (success) {
                    console.log("Mail sent");
                  },
                  errorCallback: function (err) {
                    console.log("Mail not sent");
                  }
                });

                mail.send();
              }

              res.send(users);

            })
            .catch((err) => {
              res.status(500).send({
                error: err.message
              });

            });
        }
      });

  })

  .get("/sponsor/:sponsorTag", (req, res, next) => {
    const {
      sponsorTag
    } = req.params;

    db("sponsors")
      .where("sponsorTag", sponsorTag)
      .first()
      .then((sponsors) => {
        if (!sponsors) {
          return res.send(400);
        }
        res.send(sponsors);
      }, next);
  })

  .get("/allsponsors", auth.loginRequired, auth.adminRequired, (req, res, next) => {

    db("sponsors").then((sponsors) => {
      res.send(sponsors);
    }, next);
  })

  //Update existing sponsor details
  .put("/sponsor/:sponsorTag", auth.loginRequired, auth.adminRequired, (req, res, next) => {
    const {
      sponsorTag
    } = req.params;

    db("sponsors")
      .where("sponsorTag", sponsorTag)
      .update(req.body)
      .then((result) => {
        if (result === 0) {
          return res.send(400);
        }
        res.send(200);
      }, next);
  })
   
  //Get user details for specific user id
  .get('/user/:id', auth.loginRequired, (req, res, next) => {
    const {
      id
    } = req.params;

    db("users")
      .where("id", id)
      .first()
      .then((users) => {
        if (!users) {
          return res.send(400);
        }
        res.send(users);
      }, next);
  })

  //Get user details based on email address
  .get("/userEmail/:userEmail", auth.loginRequired, (req, res, next) => {
    const {
      userEmail
    } = req.params;

    console.log(userEmail);

    db("users")
      .where("email", userEmail)
      .first()
      .then((users) => {
        if (!users) {
          return res.send(400);
        }
        res.send(users);
      }, next);
  })

  //Get user details for specific user email address
  .get('/userCxo/:email', (req, res, next) => {
    const {
      email
    } = req.params;

    db("users")
      .where("email", email)
      .select("company", "first_name", "last_name", "email", "allowCxoInvite")
      .first()
      .then((users) => {
        if (!users) {
          return res.send(400);
        }
        res.send(users);
      }, next);
  })

   //Update existing user details for CXO breakbast
  .put('/userCxo/:email', (req, res, next) => {
    const {
      email
    } = req.params;

    db("users")
      .where("email", email)
      .update(req.body)
      .then((result) => {
        if (result === 0) {
          return res.send(400)
        }
        res.send(200);
      }, next);
  })


  //Update existing user details
  .put("/user/:id", (req, res, next) => {
    const {
      id
    } = req.params;

    const userData = req.body;

    if (userData.password) {
      userData.password = bcrypt.hashSync(userData.password);
    }

    db("users")
      .where("id", id)
      .update(req.body)
      .then((result) => {
        if (result === 0) {
          return res.send(400);
        }
        res.send(200);
      }, next);
  })

    //Delete user
    .delete('/user/:id', auth.loginRequired, auth.adminRequired, (req, res, next) => {
      const {
        id
      } = req.params;

      db("users")
        .where("id", id)
        .delete(req.body)
        .then((result) => {
          if (result === 0) {
            return res.send(400)
          }
          res.send(200);
        }, next);
    })

  // All speakers GET
  .get('/allSpeakers', (req, res, next) => {

    const mySpeaker = new Speaker();

    mySpeaker.allSpeakers((rows) => {
        res.send(rows);
    }, next);

  })

  .get('/speaker/:id', auth.loginRequired, (req, res, next) => {
    const { id } = req.params;
    const mySpeaker = new Speaker(id);

    mySpeaker.getSpeaker((speaker) => {
      if (speaker.errno) {
        return res.send(400);
      } else if (_.isEmpty(speaker)) {
        res.send(404);
      } else {
        res.send(speaker);
      }
    }, next);
  })

  //POST/Add Speaker
  .post('/speaker', auth.loginRequired, auth.adminRequired, (req, res, next) => {
    var newSpeaker = req.body;

    db("speakers")
      .insert(newSpeaker)
      .then((speakers) => {

        res.send(speakers);

      })
      .catch((err) => {
        res.status(500).send({
          error: err.message
        });

      })
  })

  //Update existing speaker details
  .put('/speaker/:id', auth.loginRequired, auth.adminRequired, (req, res, next) => {
    const {
      id
    } = req.params;

    db("speakers")
      .where("id", id)
      .update(req.body)
      .then((result) => {
        if (result === 0) {
          return res.send(400)
        }
        res.send(200);
      }, next)
  })

  //form uploads for images
  .post('/upload', auth.loginRequired, auth.adminRequired, (req, res) => {

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = false;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/../public/images/speakers');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
      fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', () => {
      res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);

  })

  // GET full Sessions dataset
  .get("/sessionsFull", (req, res) => {

    const sessionsFull = new Agenda();

    sessionsFull.fullDataset((result) => {
      res.send(result);
    });

  })

  .get("/sessionsParent", (req, res, next) => {

    const sessionsParent = new Agenda();

    sessionsParent.getParents((result) => {
      res.send(result);
    }, next);

  })

  .get("/session/:sessionId", (req, res, next) => {

    const { sessionId } = req.params;
    const sessionsParent = new Agenda();

    sessionsParent.getSession(sessionId, (result) => {
      res.send(result);
    }, next);

  })

  .get("/sessionsChildren/:parentId", (req, res, next) => {

    const { parentId } = req.params;
    const sessionsChildren = new Agenda();

    sessionsChildren.getChildren(parentId, (result) => {
      res.send(result);
    }, next);

  })

  // Update/PUT existing session
  .put("/session/:sessionId", (req, res, next) => {

    const { sessionId } = req.params;
    // const sessionPut = new Agenda();

    agenda.updateSession(sessionId, req.body, (result) => {
      res.send(result);
    }, next);

  })

  //POST/Add new session
  .post("/session", auth.loginRequired, auth.adminRequired, (req, res, next) => {

    const newSession = req.body;

    db("agenda")
      .insert(newSession)
      .then((session) => {

        res.send(session);

      })
      .catch((err) => {
        res.status(500).send({
          error: err.message
        });

      });

  })

  .get("/report/:query", (req, res, next) => {
    // This API accepts the following queries
      // - totalRegistrations - Counts all the registrations
      // - customerSplit - Customer registration split
      // - regPerDay - Registrations per day
      // - totalBreakfast - Counts all the positive rsvp's for the CXO breakfast

    const { query } = req.params;

    switch (query) {
        case "totalRegistrations":
            db("users")
              .count("id as count")
              .select("event_profile")
              .groupBy("event_profile")
              .then((result) => {

                res.send(result);

              });
          break;

        case "customerSplit":
          db("users")
            .count("id as count")
            .select("orgRole")
            .groupBy("orgRole")
            .where("event_profile", "Delegate")
            .whereNot("orgRole", "")
            .then((result) => {

              res.send(result);

            });
        break;

        case "regPerDay":
          db.raw("SELECT CAST(date_created as DATE) AS dateAdded, COUNT(id) as count FROM users GROUP BY dateAdded")
            .then((result) => {

              res.send(result[0]);
              
            });
        break;

        case "totalBreakfast":
          db("users")
            .count("id as count")
            .select("cxoRSVP")
            .where("cxoRSVP", 1)
            .then((result) => {

              res.send(result);

            });
        break;

        default:
          res.status(500);
          res.send("Not a valid report query");

    }

  })

  .put("/mySessions", (req, res, next) => {

    const userId = req.user.id;
    let sessionData = req.body;

    //Expects 6 values in the object. If not, insert nulls to overwrite previous values
    if (_.size(sessionData) !== 6) {
      sessionData = {
        block1: sessionData.block1 || null,
        block2: sessionData.block2 || null,
        block3: sessionData.block3 || null,
        block4: sessionData.block4 || null,
        block5: sessionData.block5 || null,
        block6: sessionData.block6 || null,
      };
    }

    sessionData.block1 = (sessionData.block1) === "" ? null : sessionData.block1 || null;
    sessionData.block2 = (sessionData.block2) === "" ? null : sessionData.block2 || null;
    sessionData.block3 = (sessionData.block3) === "" ? null : sessionData.block3 || null;
    sessionData.block4 = (sessionData.block4) === "" ? null : sessionData.block4 || null;
    sessionData.block5 = (sessionData.block5) === "" ? null : sessionData.block5 || null;
    sessionData.block6 = (sessionData.block6) === "" ? null : sessionData.block6 || null;

    console.log(sessionData);

    user.updateMySessions(userId, sessionData, (result) => {
      res.sendStatus(result);
    }, next);

  })

  .post("/delegatePasswords", (req, res, next) => {

    user.delegatePasswordsAll((result) => {

      res.send(result);

    }, req, next);

  })


  //***********************************************
  //Below needs to be moved to helper functions app
  //***********************************************

  //Google reCAPTCHA API
  .post('/captcha', (req, res, next) => {
    
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
      return res.json({
        responseCode: 1,
        responseDesc: "Please select captcha"
      });
    }

    // Put your secret key here.
    var secretKey = "6LfYcCQUAAAAAKf55V5s0ol_9tK1HKEVqNfi0ynJ";

    // req.connection.remoteAddress will provide IP address of connected user.
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    
    // Hitting GET request to the URL, Google will respond with success or error scenario.
    request(verificationUrl, function (error, response, body) {
      body = JSON.parse(body);
      // Success will be true or false depending upon captcha validation.
      if (body.success !== undefined && !body.success) {
        return res.json({
          "responseCode": 1,
          "responseDesc": "Failed captcha verification"
        });
      }

      //Send mail on successful verification
      var Mail = require('../email');
      var mail = new Mail({
        from: "noreply@chirpee.io",
        // to : "ryno@coetzee.za.com",
        to: "showcase@datacentrix.co.za",
        subject: "Datacentrix Showcase 2017 - Contact Us Request",
        html: buildHtmlContactUs(req.body),

        successCallback: function (success) {
          console.log("Mail sent");
        },

        errorCallback: function (err) {
          console.log("Mail not sent");
        }
      });

      mail.send();

      res.json({
        "responseCode": 0,
        "responseDesc": "Sucess"
      });

    });

  })

module.exports = router;
