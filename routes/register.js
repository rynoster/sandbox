var express = require('express');
var router = express.Router();

var app = express();

router

  .get('/delegate', (req,res) => {

    res.render('skeleton', {
      partials: {
        header: "header", 
        content: "register",
        footer: "footer", 
        jscript: "jscript",
        }
      
    });
  })

  .get('/', (req,res) => {

    res.render('skeleton', {
      partials: {
        header: "header", 
        content: "register",
        footer: "footer", 
        jscript: "jscript",
        }
      
    });
  })

  ;
  
module.exports = router;