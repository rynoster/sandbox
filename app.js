// const passport = require('passport');
// const session = require('express-session');
const favicon = require("serve-favicon");
// const db = require('./db');

const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

require("./passport");

const index = require("./routes/index");
const api = require("./routes/api");
const register = require("./routes/register");
const Agenda = require("./agenda");

const agenda = new Agenda();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hjs");

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', '/assets/images/favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); //Servers static content

// caching of static content below -- 86400000 is one day
app.use((req, res, next) => {
  if (req.url.match(/^\/(css|js|img|font)\/.+/)) {
    res.setHeader("Cache-Control", "public, max-age=86400000");
  }
  next();
});

app.use("/", index);
app.use("/api", api);
app.use("/register", register);
// app.use('/whyattend', whyattend);
//app.use('/login', login);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

agenda.smsRatings();

module.exports = app;
