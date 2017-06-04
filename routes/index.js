var express = require('express');
var session = require('express-session');
var router = express.Router();
var db = require('../db');
var passport = require('passport');

require('../passport');

var app = express();

router
  //Session initialise
  .use(session({ resave: false, saveUninitialized: false, secret: "Singularity is the secret!!!" }))
  .use(passport.initialize())
  .use(passport.session())

  //Website main entrance
  .get('/', (req,res) => {

    res.render('skeleton', {
      partials: {
        header: "header", 
        content: "index",
        footer: "footer", 
        jscript: "jscript"
        }
    });
  })

  // ===========================================================================
  //  Login ====================================================================
  // ===========================================================================

  .get('/login', (req, res, next) => {
    res.render('login');
  }) 

  .get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
      res.redirect("/login")
    })

  }) 

  //This is just to check if authentication has succeeded, no function
  .get('/auth', (req, res, next) => {
    res.send({
      session: req.session,
      user: req.user,
      authenticated: req.isAuthenticated(),
    })
  }) 
  
  //Catches on pushing the Log In button and redirects based on authentication
  .post('/login', passport.authenticate("local", {
    successRedirect: "auth",
    failureRedirect: "login",
  }))

  // ===========================================================================
  //  Login : END ==============================================================
  // ===========================================================================

  // ===========================================================================
  //  Sign up ==================================================================
  // ===========================================================================
  // This should be moved to register.js at a later stage
  .get('/signup', (req, res, next) => {
    res.render('signup');

  }) 

  .post('/signup', passport.authenticate("local-register", {
    successRedirect: "auth",
    failureRedirect: "signup",
  }))

  // ===========================================================================
  //  Sign up : END ============================================================
  // ===========================================================================

  // ===========================================================================
  //  Sponsors Page  ===========================================================
  // ===========================================================================

  .get('/sponsors', (req,res) => {

    res.render('skeleton', {
      partials: {
        header: "header", 
        content: "sponsors",
        footer: "footer", 
        jscript: "jscript"
        }
    });
  })


  // ===========================================================================
  //  Sponsors : END ===========================================================
  // ===========================================================================

 ;

module.exports = router;