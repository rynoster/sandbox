var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var router = express.Router();
var db = require('../db');
var passport = require('passport');
var auth = require('../auth');

require('../passport');

var app = express();

router
  //Session initialise
  .use(session({ 
    store: new RedisStore(),
    resave: false, 
    saveUninitialized: false, 
    secret: "Singularity is the secret!!!"
  }))
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

   //Verify email links
    .get('/verify/:token', (req,res, next) => {
      const { token } = req.params;

      db("users")
      .where("token", token)
      .first()
      .then((users) => {
        if(users) {
          var fullName = users.first_name + " " + users.last_name;
          var updateUser = users;

          updateUser.verified = 1;

          db("users")
          .where("id", updateUser.id)
          .update(updateUser)
          .then((result) => {
            if (result === 0 ) {
              return res.send(400)
            }
            res.send(200);
          }, next)

          res.render('skeleton', {
            fullName : fullName,
            partials : {
              header: "header", 
              content: "verify",
              footer: "footer", 
              jscript: "jscript"
            }
          })
        } else {
          return res.send(400);
        }

      }, next)
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
  // .post('/login', passport.authenticate("local", {
  //   successRedirect: "auth",
  //   failureRedirect: "login",
  // }))

  .post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {

      if (!req.session.sourceURL) {
        res.redirect('/auth');
      }
      else {
        res.redirect(req.session.sourceURL);
        req.session.sourceURL = "";
      }
      
  })

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

  // ===========================================================================
  //  Why Attend Page  =========================================================
  // ===========================================================================

  .get('/whyattend', (req,res) => {

    res.render('skeleton', {
      partials: {
        header: "header", 
        content: "why_attend",
        footer: "footer", 
        jscript: "jscript"
        }
    });
  })


  // ===========================================================================
  //  Why Attend : END =========================================================
  // ===========================================================================

  // ===========================================================================
  //  Event Info Page  =========================================================
  // ===========================================================================

  .get('/eventinfo', (req,res) => {

    res.render('skeleton', {
      partials: {
        header: "header", 
        content: "eventinfo",
        footer: "footer", 
        jscript: "jscript"
        }
    });
  })


  // ===========================================================================
  //  Event Info : END =========================================================
  // ===========================================================================

  // ===========================================================================
  //  Logistics ================================================================
  // ===========================================================================

  .get('/logistics', (req,res) => {

    res.render('skeleton', {
      partials: {
        header: "header", 
        content: "logistics",
        footer: "footer", 
        jscript: "jscript"
        }
    });
  })


  // ===========================================================================
  //  Logistics : END ==========================================================
  // ===========================================================================

  // ===========================================================================
  //  Contact Us Page  =========================================================
  // ===========================================================================

  .get('/contactus', (req,res) => {

    res.render('skeleton', {
      partials: {
        header: "header", 
        content: "contactus",
        footer: "footer", 
        jscript: "jscript"
        }
    });
  })


  // ===========================================================================
  //  Contacts Us : END ========================================================
  // ===========================================================================

  // ===========================================================================
  //  Admin Page ===== =========================================================
  // ===========================================================================

  .get('/admin', auth.loginRequired, (req,res) => {

    res.render('admin', {
      partials: {jscript: "jscript"}
    })
  })

  // ===========================================================================
  //  Admin Page : END  ========================================================
  // ===========================================================================
  
  .get('/sponsoredit', auth.loginRequired, auth.adminRequired, (req,res) => {

    res.render('sponsoredit', {
      partials: {jscript: "jscript"}
    })
  })
 ;

module.exports = router;