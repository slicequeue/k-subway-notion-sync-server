var config = require('./src/config');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apiRouter = require('./src/routes');

const cLogger = require('./src/common/utils/logger');

var app = express();

// ajax cross domain issue open
const cors = require('cors')();
app.use(cors);


// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.secrets.secretKey));

// rest api 서버 경로 설정
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

// Handle uncaughtException
process.on('uncaughtException', function (err) {
  // debug('Caught exception: %j', err);
  // cLogger.logNormal('error', err);
  console.log('uncaughtException:', err);
  process.exit(1);
});

module.exports = app;
