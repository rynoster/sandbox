var express = require('express');
var router = express.Router();

var app = express();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router
  .get('/home', (req,res) => {

    res.render('skeleton', {
      partials: {
        header: "header", 
        content: "home",
        footer: "footer", 
        jscript: "jscript"
        }
      
    });

  });

module.exports = router;
