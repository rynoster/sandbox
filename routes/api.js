var express = require('express');
var router = express.Router();
var db = require("../db");
var auth = require("../auth")

var app = express();

router
  .get('/register', (req, res) => {
    res.send("Register page")
  })

  .get('/allUsers', auth.loginRequired, auth.adminRequired, (req,res, next) => {

    db("users").then((users) => {
      res.send(users);
    }, next)
  })

  .post('/user', (req,res, next) => {

    db("users")
      .insert(req.body)
      .then((users) => {
        res.send(users);
      }, next)
    })

  .get('/user/:id', auth.loginRequired, (req,res, next) => {
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

  .put('/user/:id', (req,res, next) => {
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

    .delete('/user/:id', auth.loginRequired, auth.adminRequired, (req,res, next) => {
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