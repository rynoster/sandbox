var express = require('express');
var router = express.Router();

var app = express();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router
  .get('/', (req,res) => {
    var myTitle = "Datacentrix Showcase 2017";

    //res.render()

    res.render('register', {
      title: myTitle,
      //partials: {header: "header"},
    });

  });

module.exports = router;
