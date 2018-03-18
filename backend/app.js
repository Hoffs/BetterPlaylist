var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var apiRouter = require('./routes/api');
var dbSchemas = require('./dbSchemas');
var app = express();
require('dotenv').config() // Support for .env files

mongoose.connect(process.env.DB_URI);

app.set('view engine', 'html');

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // TODO: Add case for when error handler is called from 404 page not found error.
  // render the error page
  res.status(err.status || 500);
  const message = req.app.get('env') === 'development' ? err :
    { code: 500, error: 'Unexpected server error. Please try again later.' };
  res.send(message);
});

module.exports = app;
