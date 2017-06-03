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

    res.render('index', {
      title: myTitle,
    });

  });

module.exports = router;
