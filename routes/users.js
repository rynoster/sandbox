var express = require('express');
var router = express.Router();

var app = express();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(users);
});

router
  .get('/register', (req, res) => {
    res.send("Register page")
  })

  .get('/dbtest', (req,res, next) => {

    db("users").then((users) => {
      res.send(users);
    }, next)
  })

  .post('/dbtest', (req,res, next) => {

    db("users")
      .insert(req.body)
      .then((users) => {
        res.send(users);
      }, next)
    })


  .get('/dbtest/:id', (req,res, next) => {
    const { id } = req.params;

    db("users")
      .where("id", id)
      .first()
      .then((users) => {
        if (!users) {
          return res.send(400);
        }
        res.send(users);
      }, next)
    })

    .put('/dbtest/:id', (req,res, next) => {
    const { id } = req.params;

    db("users")
      .where("id", id)
      .update(req.body)
      .then((result) => {
        if (result === 0 ) {
          return res.send(400)
        }
        res.send(200);
      }, next)
    })

    .delete('/dbtest/:id', (req,res, next) => {
    const { id } = req.params;

    db("users")
      .where("id", id)
      .delete(req.body)
      .then((result) => {
        if (result === 0 ) {
          return res.send(400)
        }
        res.send(200);
      }, next)
    })

module.exports = router;