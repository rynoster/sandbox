var express = require('express');
var router = express.Router();

var app = express();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// Depending on user entry from the dropdown, registration page will be dynamically created.

router
  // .get('/', (req,res) => {

  //   res.render('skeleton', {
  //     partials: {
  //       header: "header", 
  //       content: "register",
  //       footer: "footer", 
  //       jscript: "jscript",
  //       }
      
  //   });

  // })

  .get('/delegate', (req,res) => {

    res.render('skeleton', {
      partials: {
        header: "header", 
        content: "register",
        footer: "footer", 
        jscript: "jscript",
        // usertpe: "delegate",
        }
      
    });
  })

  .get('/sponsor', (req,res) => {

    res.render('skeleton', {
      partials: {
        header: "header", 
        content: "register",
        footer: "footer", 
        jscript: "jscript",
        // usertpe: "sponsor",
        }
      
    });
  })

  .get('/organiser', (req,res) => {

    res.render('skeleton', {
      partials: {
        header: "header", 
        content: "register",
        footer: "footer", 
        jscript: "jscript",
        // usertpe: "organiser",
        }
      
    });
  })
  
  ;
  

module.exports = router;
