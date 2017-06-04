var express = require('express');
var session = require('express-session');
var router = express.Router();
var db = require('../db');
var passport = require('passport');

require('../passport');

var app = express();

router
  .use(session({ resave: false, saveUninitialized: false, secret: "Jou ma se kwas" }))

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
    
  .get('/auth', (req, res, next) => {
    console.log(req.session);
    res.send(req.session);

  }) ;

module.exports = router;