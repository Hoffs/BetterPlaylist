const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRouter = require('./routes/api');

const app = express();
require('dotenv').config(); // Support for .env files

mongoose.connect(process.env.DB_URI);

app.set('view engine', 'html');

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.options('*', (req, res) => {
  res.header('Content-Length', '0');
  res.end();
});

app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
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
