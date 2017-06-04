//file no longer being used, to be deleted


var express = require('express');
var session = require('express-session');
var router = express.Router();
var passport = require('passport');

var db = require('../db');

require('../passport');

var app = express();

router
  .use(session({ resave: false, saveUninitialized: false, secret: "Singularity is the secret!!!" }))
  .use(passport.initialize())
  .use(passport.session())
    
  .get('/', (req, res, next) => {
    res.render('login');

  }) 

  .get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
      res.redirect("/login")
    })

  }) 

  .get('/auth', (req, res, next) => {
    res.send({
      session: req.session,
      user: req.user,
      authenticated: req.isAuthenticated(),
    })
  }) 
  
  .post('/', passport.authenticate("local", {
    successRedirect: "/login/auth",
    failureRedirect: "login",
  }))
;

module.exports = router;