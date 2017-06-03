var express = require('express');
var router = express.Router();

var app = express();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router
  .get('/home', (req,res) => {
    var myTitle = "Datacentrix Showcase 2017";

    res.render('skeleton', {
      title: myTitle,
      partials: {
        header: "partials/header", 
        content: "partials/home",
        footer: "partials/footer", 
        }
      
    });

  });

module.exports = router;
