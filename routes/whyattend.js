var express = require('express');
var router = express.Router();

var app = express();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router
  .get('/', (req,res) => {

    res.render('skeleton', {
      partials: {
        header: "header", 
        content: "why_attend",
        footer: "footer", 
        jscript: "jscript"
        }
      
    });

  });

module.exports = router;
